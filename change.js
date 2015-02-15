var s3counts_designs = require('./beer_designs');
var change_app = require('./change_app');
var config = require('config');

// connection configuration to pass on to couchbase.connect(). Note that
// while connecting with the server we are also opening the beer-sample
// bucket.
var logdata_config = {
    connstr : config.get('logdata-connstr'),
    bucket : config.get('logdata-bucket'),
    password : config.get('logdata-password')
}

var logcache_config = {
    connstr : config.get('cache-connstr'),
    bucket : config.get('cache-bucket'),
    password : config.get('cache-password')
}

if( require.main == module ) {
    argv = process.argv.splice(2);
    if( argv[0] === '--setup' ) { // Create the design documents
        s3counts_designs.setup( logdata_config );
    } else if( argv[0] === '--reset' ) {  // Reset what was done by -d option
        s3counts_designs.reset( logdata_config );
    } else {
        change_app.start( logdata_config, logcache_config );
    }
}
