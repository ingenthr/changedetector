An S3 Log Change Detector
-------------------------------------------

This app will graph the number of requests for a full object (in this case,
to determine the number of full downloads) based on S3 log files imported
into a Couchbase bucket and looking at S3 to find the object size itself.

Dependencies
------------

A Couchbase cluster with two buckets, one cache and one for the data.

A connection to an S3 bucket with log data.

Credentials required to make this app run
-----------------------------------------

AWS creds for S3 in ~/.aws/config

Bucket connection info in `config/default.yaml`, see the example.

