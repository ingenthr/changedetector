var couchbase = require('couchbase');

// Setup design documents for beers and breweries to index beer-documents
// based on beer-names and index brewery-documents based on brewery-names.

// The following functions acts synchronously so that we can know when to safely
//   exit.  This is a workaround for a current bug in the client that stops node
//   from gracefully exiting while a Couchbase connection is active.

exports.setup = function( config ) {
    var beer_by_name = {
        map : [ 'function(doc, meta) {',
                    'if (doc.type && doc.type == "beer") { ',
                        'emit(doc.name, null); }',
                '}'
              ].join('\n')
    }
    var breweries_by_name = {
        map : [ 'function(doc, meta) {',
                    'if (doc.type && doc.type == "brewery") { ',
                        'emit(doc.name, null); }',
                '}'
              ].join('\n')
    }

    var bscluster = new couchbase.Cluster(config.connstr);
    var bsbucket = bscluster.openBucket(config.bucket, function( err ) {
        if(err) {
            console.log("Unable to connect to server");
            console.log(config);
            process.exit(1);
        }
       
        var bmanager = bsbucket.manager();
        // Update the beer view, to index beers `by_name`.
        bmanager.getDesignDocument( "beer", function( err, ddoc, meta ) {
            if(! ('by_name' in ddoc['views']) ) {
                ddoc.views.by_name = beer_by_name;
                bmanager.upsertDesignDocument( "beer", ddoc, function( err, res ) {
                    if(err) {
                        console.log( 'ERROR' + err );
                    } else if (res.ok) {
                        console.log( 'Updated ' + res.id );
                    }

                    // Update or create the brewery view, to index brewery or `by_name`.
                    bmanager.getDesignDocument( "brewery", function( err, ddoc, meta ) {
                      if (err) {
                        console.log( "Creating the brewery view" );
                        breweries_design = { views : {by_name : breweries_by_name} };
                        bmanager.upsertDesignDocument( "brewery", breweries_design, function(err) {
                          if(err) {
                              console.log( 'ERROR' + err );
                          } else if (res.ok) {
                              console.log( 'Updated ' + res.id );
                          }

                          process.exit(0);
                        });
                      } else {
                        if(! ('by_name' in ddoc['views']) ) {
                          console.log("Updating the brewery view");
                          ddoc['views']['by_name'] = breweries_by_name;
                          bmanager.upsertDesignDocument( "brewery", ddoc, function( err, res ) {
                            if(err) {
                              console.log( 'ERROR' + err );
                            } else if (res.ok) {
                              console.log( 'Updated ' + res.id );
                            }

                            process.exit(0);
                          });
                        }
                      }
                    });

                });
            } else {
              console.log('already setup');
              process.exit(0);
            }
        })
    })
}

exports.reset = function( config ) {
  var bscluster = new couchbase.Cluster(config.connstr);
  var bsbucket = bscluster.openBucket(config.bucket, function( err ) {
    if(err) {
      console.error("Failed to connect to cluster: " + err);
      process.exit(1);
    }
    var bmanager = bsbucket.manager();

    // Update the beer view, to index beers `by_name`.
    bmanager.getDesignDocument( "beer", function( err, ddoc, meta ) {
      console.log(err);
      console.log('get done');

      delete ddoc['views']['by_name'];
      bmanager.upsertDesignDocument( "beer", ddoc, function( err, res ) {
        console.log('set done');

        if(err) {
            console.log( 'ERROR' + err );
        } else if (res.ok) {
            console.log( 'Updated ' + res.id );
        }

        // Update or create the brewery view, to index brewery or `by_name`.
        bmanager.deleteDesignDocument( "brewery", function(err, res) {
          console.log('delete done');
            console.log(err);

            process.exit(0);
        });

      });
    })
  })
}

