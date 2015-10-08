#!/bin/bash
curl -k -u Administrator -X GET https://reporting
.internal.couchbase.com:18092/s3logs/_design/dev_analytics -o devanalytics.json
