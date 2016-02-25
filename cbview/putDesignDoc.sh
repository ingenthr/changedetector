#!/bin/bash
curl -i -u Administrator -X PUT http://localhost:8092/s3logs/_design/dev_analytics -d \@analytics.json
#curl -i -k -u Administrator -T analytics.json http://localhost:8092/s3logs/_design/analytics
