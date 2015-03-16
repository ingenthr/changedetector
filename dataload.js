#!/usr/bin/env node
'use strict';
var fs = require('fs');
var couchbase = require('couchbase');
var _ = require('underscore');
var Q = require('q');
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
var argv = require('yargs').argv;
var BUCKET = 's3-logs.couchbase.com';
var config = require('config');
var db, cache;
var LOAD_CONCUR = 128;

// connection configuration to pass on to couchbase.connect(). Note that
// while connecting with the server we are also opening the beer-sample
// bucket.
var logdata_config = {
    connstr : config.get('logdata-connstr'),
    bucket : config.get('logdata-bucket'),
    password : config.get('logdata-password'),
    operationTimeout : 65536
};

var logcache_config = {
    connstr : config.get('cache-connstr'),
    bucket : config.get('cache-bucket'),
    password : config.get('cache-password')
};

function start_connections(logbucket_config, cachebucket_config) {
    // Connect with couchbase server.  All subsequent API calls
    // to `couchbase` library is made via this Connection
    var cb_db = new couchbase.Cluster(logbucket_config.connstr);
    var cb_ca = new couchbase.Cluster(cachebucket_config.connstr);
    db = cb_db.openBucket(logbucket_config.bucket, logbucket_config.password);
    db.on('connect', function (err) {
        if (err) {
            console.error("Failed to connect to cluster: " + err);
            process.exit(1);
        }
        console.log('Couchbase connected to ' + logbucket_config.bucket);
    });
    cache = cb_ca.openBucket(cachebucket_config.bucket, cachebucket_config.password);
    cache.on('connect', function (err) {
        if (err) {
            console.error("Failed to connect to cluster: " + err);
            process.exit(1);
        }
        console.log('Couchbase connected to ' + cachebucket_config.bucket);
    });}


var s3 = new AWS.S3();

var d = new Date();
var yearToProcess = d.getFullYear();
var monthToProcess = d.getMonth() +1;
var dayToProcess = d.getDate();

function zero_pad_num(num) {
    var zero_padded_res = "0" + num;
    zero_padded_res = zero_padded_res.substr(zero_padded_res.length - 2);
    return zero_padded_res;
}
function get_all_files() {
    var prefix = "packages.couchbase.com-access-log-" + yearToProcess + "-" + zero_pad_num(monthToProcess) + "-" + zero_pad_num(dayToProcess);
    var all_releases = [];
    var deferred = Q.defer();
    var all_files = [];

    function inner_all_files(marker) {
        //             cbc cp -a packages.couchbase.com-access-log-2015-$i-$j-$k* >> /mnt/ephemeral/tmp/$i-$j.out
        var params = {
            Bucket: BUCKET, /* required */
            MaxKeys: 1000,
            Prefix: prefix,
            Marker: marker
        };
        s3.listObjects(params, function (err, data) {
            if (err) {
                console.log('ERROR getting releases: ', err);
                return deferred.reject(err);
            }

            all_releases = all_releases.concat(data.Contents);

            if (data.IsTruncated) {
                var next_marker = data.Contents.slice(-1)[0].Key;
                deferred.notify(all_releases.length);
                inner_all_files(next_marker);
            } else {

                all_releases.map(function (entry) {
                    all_files.push(entry.Key);
                });
                deferred.resolve(all_files);
            }
        });

    }

    inner_all_files();

    return deferred.promise;

}

function load_a_file(the_file, curr_num, when_done) {
    //console.log("loading " + the_file + "...");
    //console.log("loading number " + curr_num);
    var params = {
        Bucket: BUCKET, /* required */
        Key: the_file /* required */
    };
    s3.getObject(params, function(err, data) {
        //console.log("From S3, loading " + params.Key);
        if (err) {
            console.log(err, err.stack);
        } // an error occurred
        else{
            db.insert(the_file, data.Body.toString(), {}, function(error, result) {
                if (error) {
                    console.log('finished ' + curr_num + ' WITH ERROR', error, error.stack);
                } else {
                    //console.log('finished ' + curr_num);
                }
                when_done();
            });
        }
    });

}

function concurrencyLimitedForEach(list, concur, fn, done) {
    if (list.length <= 0) {
        return done();
    }
    var i = 0;
    var proced = 0;
    function doneOne() {
        proced++;
        if (proced >= list.length) {
            done();
        } else {
            processOne();
        }
    }
    function processOne() {
        if (i >= list.length) return;
        var curI = i++;
        fn(list[curI], curI, doneOne);
    }
    for (var j = 0; j < concur; ++j) {
        processOne();
    }
}


if (typeof argv.y != 'undefined') {
    yearToProcess = argv.y;
}

if (typeof argv.m != 'undefined') {
    monthToProcess = argv.m;
}

if (typeof argv.d != 'undefined') {
    dayToProcess = argv.d;
}

start_connections(logdata_config, logcache_config);
console.log("Will process for: " + yearToProcess, monthToProcess, dayToProcess);

get_all_files().then(
    function(all_today) {
        //console.log(JSON.stringify(all_today));
        console.log("Processing this many records: " + all_today.length);
        //for (var i=0; i<all_today.length; i++) {
        //    load_a_file(all_today[i]);
        //}
        concurrencyLimitedForEach(all_today, LOAD_CONCUR, load_a_file, function() {
            console.log("finished data load");
            process.exit(0);
        });

    },
    function (rejection) {
        console.log("ERROR: " + rejection);
    });