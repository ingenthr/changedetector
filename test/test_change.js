'use strict';

var change = require('../change_app');
var assert = require('assert');

describe("is_server_download without md5", function() {
   it("should match without an md5", function() {
       assert(change.is_server_download("releases/3.0.2/couchbase-server-enterprise-3.0.2-centos6.x86_64.rpm"));
   });
});

describe("is_server_download with md5", function() {
    it("should not match with an md5", function() {
        assert(!change.is_server_download("releases/3.0.2/couchbase-server-enterprise-3.0.2-centos6.x86_64.rpm.md5"));
        assert(!change.is_server_download("releases/1.8.0/couchbase-server-enterprise_x86_1.8.0.setup.exe.md5"));
    });
});