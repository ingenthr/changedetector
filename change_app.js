'use strict';
var fs = require('fs');
var express = require('express');
var jade = require('jade');
var couchbase = require('couchbase');
var _ = require('underscore');
var Q = require('q');
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
var ViewQuery = couchbase.ViewQuery;

var ENTRIES_PER_PAGE = 30;

function is_server_download(filepath) {
var re = /\.deb$|\.rpm$|\.zip$|\.exe$|\.tar\.gz$/;
  if (filepath.indexOf("couchbase-server") !== -1) {
    if (re.exec(filepath))
      return true;
  //  if (filepath.indexOf(".md5") !==-1 || filepath.indexOf(".staging") !== -1 || filepath.indexOf(".xml") !== -1 || filepath.indexOf(".html") !== -1)
  //    return false;
    else
      return false;
  }

};
exports.is_server_download = is_server_download;


    exports.start = function(logbucket_config, cachebucket_config) {
        // Connect with couchbase server.  All subsequent API calls
        // to `couchbase` library is made via this Connection
        var cb_db = new couchbase.Cluster(logbucket_config.connstr);
        var cb_ca = new couchbase.Cluster(cachebucket_config.connstr);
        var db = cb_db.openBucket(logbucket_config.bucket, logbucket_config.password);
        db.on('connect', function (err) {
          if (err) {
            console.error("Failed to connect to cluster: " + err);
            process.exit(1);
          }
          console.log('Couchbase connected to ' + logbucket_config.bucket);
        });
        var cache = cb_ca.openBucket(cachebucket_config.bucket, cachebucket_config.password);
        cache.on('connect', function (err) {
          if (err) {
            console.error("Failed to connect to cluster: " + err);
            process.exit(1);
         }
         console.log('Couchbase connected to ' + cachebucket_config.bucket);
        });


  var s3 = new AWS.S3();

  var app = express();
  app.use(express.bodyParser());
  app.use(express.static('static'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.locals.pretty = true;

  // Index page redirect
  app.get('/', function (req, res) {
    res.redirect('/welcome');
  });

  // Welcome page.
  function welcome(req, res) {
    res.render('welcome');
  }
  app.get('/welcome', welcome);

  // List of beers.
  function list_beers(req, res) {
    var q = ViewQuery.from('beer', 'by_name')
        .limit(ENTRIES_PER_PAGE)
        .stale(ViewQuery.Update.BEFORE);
    db.query(q, function (err, values) {
      // 'by_name' view's map function emits beer-name as key and value as
      // null. So values will be a list of
      //      [ {id: <beer-id>, key: <beer-name>, value: <null>}, ... ]

      // we will fetch all the beer documents based on its id.
      var keys = _.pluck(values, 'id');

      db.getMulti( keys, function(err, results) {

        // Add the id to the document before sending to template
        var beers = _.map(results, function(v, k) {
          v.value.id = k;
          return v.value;
        });

        res.render('beer/index', {'beers':beers});
      })
    });
  }
  app.get('/beers', list_beers);

  // List of brewery. Logic is same as above except that we will be gathering
  // brewery documents and rendering them.
  function list_breweries(req, res) {
    var q = ViewQuery.from('brewery', 'by_name')
        .limit(ENTRIES_PER_PAGE);
    db.query(q, function(err, results) {
      var breweries = _.map(results, function(v, k) {
        return {
          'id': v.id,
          'name': v.key
        };
      });

      res.render('brewery/index', {'breweries':breweries});
    });
  }
  app.get('/breweries', list_breweries);

  // Delete a beer document or brewery document. Document `id` is supplied as
  // part of the URL.
  function delete_object( req, res ) {
    db.remove( req.params.object_id, function(err, meta) {
      if( err ) {
        console.log( 'Unable to delete document `' + req.params.object_id + '`' );
      }

      res.redirect('/welcome');
    });
  }
  app.get('/beers/delete/:object_id', delete_object);
  app.get('/breweries/delete/:object_id', delete_object);



  // Show individual beer document, with all its details. Document `id` is
  // supplied as part of the URL.
  function show_beer(req, res) {
    db.get( req.params.beer_id, function(err, result) {
      var doc = result.value;
      if( doc === undefined ) {
        res.send(404);
      } else {
        doc.id = req.params.beer_id;

        var view = {
          'beer': doc,
          'beerfields': _.map(doc, function(v,k){return {'key':k,'value':v};})
        };
        res.render('beer/show', view);
      }
    });
  }
  app.get('/beers/show/:beer_id', show_beer);

  // Show individual brewery document, with all its details. Document `id` is
  // supplied as part of the URL.
  function show_brewery(req, res) {
    db.get( req.params.brewery_id, function(err, result) {
      var doc = result.value;

      if( doc === undefined ) {
        res.send(404);
      } else {
        doc.id = req.params.brewery_id;

        var view = {
          'brewery': doc,
          'breweryfields': _.map(doc, function(v,k){return {'key':k,'value':v};})
        };
        res.render('brewery/show', view);
      }
    });
  }
  app.get('/breweries/show/:brewery_id', show_brewery);

  // Edit beer document. This action handles both GET and POST method. In case
  // of GET method, it renders a form. And in case of POST it updates the
  // document in couchbase and redirects the client.
  function begin_edit_beer(req, res) {
    db.get(req.params.beer_id, function(err, result) {
      var doc = result.value;
      if( doc === undefined ) { // Trying to edit non-existing doc ?
        res.send(404);
      } else { // render form.
        doc.id = req.params.beer_id;
        var view = { is_create: false, beer: doc };
        res.render('beer/edit', view);
      }
    });
  }
  function done_edit_beer(req, res) {
    var doc = normalize_beer_fields(req.body);

    db.get( rc.doc.brewery_id, function(err, result) {
      if (result.value === undefined) { // Trying to edit non-existing doc ?
        res.send(404);
      } else {    // Set and redirect.
        db.upsert( req.params.beer_id, doc, function(err, doc, meta) {
          res.redirect('/beers/show/'+req.params.beer_id);
        })
      }
    });
  }
  app.get('/beers/edit/:beer_id', begin_edit_beer);
  app.post('/beers/edit/:beer_id', done_edit_beer);


  // Create a new beer document. Same as edit, only that we use add() API
  // instead of set() API.
  function begin_create_beer(req, res) {
    var view = { is_create : true, beer:{
      type: '',
      name: '',
      description: '',
      style: '',
      category: '',
      abv: '',
      ibu: '',
      srm: '',
      upc: '',
      brewery_id: ''
    } };
    res.render('beer/edit', view);
  }
  function done_create_beer(req, res) {
    var doc = normalize_beer_fields(req.body);
    var beer_id = doc.brewery_id.toLowerCase() + '-' +
                  doc.name.replace(' ', '-').toLowerCase();
    db.insert( beer_id, doc, function(err, result) {
      if (err) throw err;
      res.redirect('/beers/show/'+beer_id);
    });
  }
  app.get('/beers/create', begin_create_beer);
  app.post('/beers/create', done_create_beer);


  function search_beer(req, res) {
    var value = req.query.value;
    var q = ViewQuery.from('beer', 'by_name')
        .range(value, value + JSON.parse('"\u0FFF"'))
        .stale(ViewQuery.Update.BEFORE)
        .limit(ENTRIES_PER_PAGE);
    db.query(q, function(err, values) {
      var keys = _.pluck(values, 'id');
      if (keys.length <= 0) {
        return res.send([]);
      }
      db.getMulti(keys, function(err, results) {
        var beers = [];
        for(var k in results) {
          beers.push({
            'id': k,
            'name': results[k].value.name,
            'brewery_id': results[k].value.brewery_id
          });
        }

        res.send(beers);
      });
    });
  }

  app.get('/beers/search', search_beer);

  /*
   * What I think I want here is
   *
   *  /downloads/server  => serves up JSON that has all server versions of couchbase counted up by bytes with TODO 206s
   *  /downloads/mobile
   *  /downloads/sdk
   *
   */

  function downloads_server(req, res) {
    // query our view of s3 counts


    var level = req.query.level;
    var start_range, end_range;
    if (req.query.start_range) {
      start_range = JSON.parse(req.query.start_range);
    } else {
      start_range = [1900, 1, 1];
    }
    if (req.query.end_range) {
      end_range = JSON.parse(req.query.end_range);
    } else {
      end_range = [2020, 12, 31];
    }

    if (start_range === null) {
      start_range = [1900, 1, 1];
    }

    get_all_releases()
        .then(function (product_sizes) {

          // here I'll total things up
          if (product_sizes) {

            var searches = [];

            for(var i in product_sizes) {
              try {
                if (product_sizes.hasOwnProperty(i)) {
                  if (is_server_download(i)) {
                    var view_search_promise = get_range_downloads(i, start_range, end_range)
                    searches.push(view_search_promise);
                  }
                }
              } catch (err) {
                console.log("Could not process sizes " + err);
              }
            }

            Q.all(searches).then(function(searchresults) {

              // searchresults will be an array of nulls or arrays which are the direct results from the view
              // ideally, we wouldn't have the nulls, but experimenting with Q indicates I have to resolve it
              // with something.

              var array_num_downloads = [];
              // remove the empty entries and divide the others by the object size
              try {
                searchresults.map(function (entry) {
                  if (entry != null) {
                    for (var ii = 0; ii< entry.length; ii++) {
                      var entry_element = entry[ii];
                      var date_path = entry_element.key.slice(1);
                      date_path.push(entry_element.key[0]);
                      var new_dl = {
                        path: date_path,
                        num_downloads: entry_element.value / product_sizes[entry_element.key[0]]
                      };
                      array_num_downloads.push(new_dl);
                    }
                  }
                });
              } catch (err) {
                console.log("failed to process entry in array_num_downloads");
              }

              res.send(array_num_downloads);
            });

            //res.send(product_sizes);
          } else {
            res.send("Failed to get product sizes.");  // TODO: replace with a proper error
          }

      }, function (rejection) {
        console.log("ERROR: " + rejection);
        res.send(500, rejection);
    });


//    var q = ViewQuery.from('dev_analytics', 's3counts')
//        .stale(ViewQuery.Update.NONE)
//      //.group(3)  buggy owing to CB Server 3.0.1 change, though JSCBC shouldn't have done that
//        .custom({group_level: level})
//        .custom({full_set: true})
//        .range(start_range, ["releasez", 2016,01,01], true)
////        .range(istart_range, iend_range, true);
//    var values = null;
//    db.query(q, function(err, values) {
//      if (err) {
//        console.log('ERROR: ', err);
//        res.send(500);
//      }
//      //console.log("query executed " + q.stringify());
//      res.send(values);
//    });
  }
  app.get('/downloads/server', downloads_server);


  function list_product_releases(release_sizes) {

    //var deferred = Q.defer();
    //
    //var q = ViewQuery.from('dev_analytics', 's3counts')
    //    .stale(ViewQuery.Update.NONE)
    //  //.group(3)  buggy owing to CB Server 3.0.1 change, though JSCBC shouldn't have done that
    //    .custom({group_level: 1})
    //    .custom({full_set: true})
    //    .range(["releases"], ["releasez"], true);
    //db.query(q, function (err, values) {
    //  if (err) {
    //    console.log('ERROR getting releases: ', err);
    //    return deferred.reject(err);
    //  }
    //  //console.log(values);
    //
    //  var product_path = values.map(function (entry) {
    //    return entry.key[0]
    //  });
    //  deferred.resolve(product_path);
    //});
    ////db.query(q, function(err, values) {
    ////  if (err) {
    ////    console.log('ERROR: ', err);
    ////    res.send(500);
    ////  }
    ////  console.log(values);
    ////  deferred.makeNodeResolver();
    ////});
    //////db.query(q, deferred.makeNodeResolver());
    //return deferred.promise;

    var product_path = release_sizes.map(function (entry) {
      return entry.key[0]
    });

    return product_path;
  }

  function get_release_sizes() {

    var dict_release_sizes = {};

    get_all_releases().then(
        function (all_releases) {
          all_releases.Contents.map(function (entry) {
                dict_release_sizes[entry.Key] = parseInt(entry.Size) || 1;
          });
          deferred.resolve(dict_release_sizes);
        }, function (reject) {
          console.log("ERROR: did not complete listing all releases " + reject);
        },
        function (got_progress) {
          console.log("TEST all releases: made progress " + got_progress)
        });

    var deferred = Q.defer();

    //var dict_release_sizes = {};
    //
    //var params = {
    //  Bucket: 'packages.couchbase.com', /* required */
    //  MaxKeys: 1000,
    //  Prefix: "releases"
    //};
    //s3.listObjects(params, function (err, data) {
    //  if (err) {
    //    console.log('ERROR getting releases: ', err);
    //    return deferred.reject(err);
    //  }
    //
    //  data.Contents.map(function (entry) {
    //    dict_release_sizes[entry.Key] = parseInt(entry.Size) || 1;
    //  });
    //
    //  //console.log(dict_release_sizes);           // successful response
    //  deferred.resolve(dict_release_sizes);
    //});

    return deferred.promise;

  }

  function get_all_releases() {

    var all_releases = [];
    var deferred = Q.defer();
    var dict_release_sizes = {};

      try {
          cache.get("server_releases_on_s3", {}, function (err, results) {
              if (/*typeof results !== "CouchbaseError" || */results !== null) {
                  deferred.resolve(results.value);
              } else {
                  if (err) {
                      console.log("WARNING: could not fetch server_releases_on_s3 from cache: " + err);
                  }
                  inner_all_releases();
              }
          });
      } finally {
          inner_all_releases();
      }

    function inner_all_releases(marker) {
      var params = {
        Bucket: 'packages.couchbase.com', /* required */
        MaxKeys: 1000,
        Prefix: "releases",
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
          inner_all_releases(next_marker);
        } else {

          all_releases.map(function (entry) {
            dict_release_sizes[entry.Key] = parseInt(entry.Size) || 1;
          });
            try {
                cache.upsert("server_releases_on_s3", dict_release_sizes, {expiry: 86400}, function (err, doc, meta) {
                    //console.log("set it");
                });
            } catch (e) {
                // don't care
            }
          deferred.resolve(dict_release_sizes);
        }
      });

    }
  return deferred.promise;

}

      /**
       * Get a section of the btree in the view based on the product.
       *
       * The promise returned will either null (if not found) or the array of values returned.
       *
       * @param product the product key, first element of the view
       * @param range_start the range to start from
       * @param range_end the range to end at
       * @returns {defer.promise|*|r.promise|promise|Q.promise|v.ready.promise}
       */
  function get_range_downloads(product, range_start, range_end) {

    var deferred = Q.defer();

    if (range_start.length !== range_end.length) {
      throw("range arguments inconsistent, ensure both are same length");
    }

    var query = ViewQuery.from('analytics', 's3counts')
        .stale(ViewQuery.Update.NONE)
      //.group(3)  buggy owing to CB Server 3.0.1 change, though JSCBC shouldn't have done that
        .custom({group_level: range_start.length +1 }) // +1 because of the product
        .custom({full_set: true})
        .range([product].concat(range_start), [product].concat(range_end), true);
    var values = null;
    db.query(query, function(err, values) {
      if (err) {
          console.log('ERROR: ', err);
          deferred.reject(err);
          return;
      }
      if (values.length == 0) {
        deferred.resolve(); //add merely a null
      } else {
        deferred.resolve(values);
      }
    });

    return deferred.promise;

  }


  function search_brewery(req, res) {
    var value = req.query.value;
    var q = ViewQuery.from('beer', 'by_name')
        .range(value, value + JSON.parse('"\u0FFF"'))
        .limit(ENTRIES_PER_PAGE);
    db.query(q, function(err, results) {
      var breweries = [];
      for(var k in results) {
        breweries.push({
          'id': results[k].id,
          'name': results[k].key
        });
      }

      res.send(breweries);
    });
  };
  app.get('/breweries/search', search_brewery);

  // Start Express
  app.listen(3000);
  console.log('Server running at http://127.0.0.1:3000/');
}

// utility function to validate form submissions - creating / editing beer
// documents.
function normalize_beer_fields(data) {
  var doc = {};
  _.each(data, function(value, key) {
    if(key.substr(0,4) == 'beer') {
      doc[key.substr(5)] = value;
    }
  });

  if (!doc['name']) {
    throw new Error('Must have name');
  }
  if (!doc['brewery_id']) {
    throw new Error('Must have brewery ID');
  }

  return doc;
}
