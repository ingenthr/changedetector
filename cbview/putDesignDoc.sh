#!/bin/bash
curl -i -H "Content-Type: application/json" -u Administrator -X PUT http://localhost:8092/s3logs/_design/analytics -d \@analytics.json
#curl -i -k -u Administrator -T analytics.json http://localhost:8092/s3logs/_design/analytics
