var beer_designs = require('./beer_designs');
var change_app = require('./change_app');

// connection configuration to pass on to couchbase.connect(). Note that
// while connecting with the server we are also opening the beer-sample
// bucket.
var config = {
    connstr : "http://localhost:8091",
    bucket : 's3logs',
    password : 'b0ec2Ise!'
}

if( require.main == module ) {
    argv = process.argv.splice(2);
    if( argv[0] === '--setup' ) { // Create the design documents for beer-samples
        beer_designs.setup( config );
    } else if( argv[0] === '--reset' ) {  // Reset what was done by -d option
        beer_designs.reset( config );
    } else {
        change_app.start( config );
    }
}
