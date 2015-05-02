function uagent_bykey(doc, meta) {

    // Create Base64 Object
    var Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) {
            var t = "";
            var n, r, i, s, o, u, a;
            var f = 0;
            e = Base64._utf8_encode(e);
            while (f < e.length) {
                n = e.charCodeAt(f++);
                r = e.charCodeAt(f++);
                i = e.charCodeAt(f++);
                s = n >> 2;
                o = (n & 3) << 4 | r >> 4;
                u = (r & 15) << 2 | i >> 6;
                a = i & 63;
                if (isNaN(r)) {
                    u = a = 64
                } else if (isNaN(i)) {
                    a = 64
                }
                t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
            }
            return t
        }, decode: function (e) {
            var t = "";
            var n, r, i;
            var s, o, u, a;
            var f = 0;
            e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (f < e.length) {
                s = this._keyStr.indexOf(e.charAt(f++));
                o = this._keyStr.indexOf(e.charAt(f++));
                u = this._keyStr.indexOf(e.charAt(f++));
                a = this._keyStr.indexOf(e.charAt(f++));
                n = s << 2 | o >> 4;
                r = (o & 15) << 4 | u >> 2;
                i = (u & 3) << 6 | a;
                t = t + String.fromCharCode(n);
                if (u != 64) {
                    t = t + String.fromCharCode(r)
                }
                if (a != 64) {
                    t = t + String.fromCharCode(i)
                }
            }
            t = Base64._utf8_decode(t);
            return t
        }, _utf8_encode: function (e) {
            e = e.replace(/\r\n/g, "\n");
            var t = "";
            for (var n = 0; n < e.length; n++) {
                var r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r)
                } else if (r > 127 && r < 2048) {
                    t += String.fromCharCode(r >> 6 | 192);
                    t += String.fromCharCode(r & 63 | 128)
                } else {
                    t += String.fromCharCode(r >> 12 | 224);
                    t += String.fromCharCode(r >> 6 & 63 | 128);
                    t += String.fromCharCode(r & 63 | 128)
                }
            }
            return t
        }, _utf8_decode: function (e) {
            var t = "";
            var n = 0;
            var r = c1 = c2 = 0;
            while (n < e.length) {
                r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r);
                    n++
                } else if (r > 191 && r < 224) {
                    c2 = e.charCodeAt(n + 1);
                    t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                    n += 2
                } else {
                    c2 = e.charCodeAt(n + 1);
                    c3 = e.charCodeAt(n + 2);
                    t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                    n += 3
                }
            }
            return t
        }
    }

    // logline parsing
    // See more at http://regex101.com/r/cB1qM6/7
    var s3re = /^(\S+) (\S+) \[([\w:\/]+\s[+\-]\d{4})\] ([\d.]+) (\S+) (\S+) (\S+) (\S+) \\?"(.+?)\\?" (\d{3}) (\S+) (\S+) (\S+) (\d+) (\S+) \\?"(.+?)\\?" \\?"(.+?)\\?" (\S+)/
    /**
     * per the docs: http://docs.aws.amazon.com/AmazonS3/latest/dev/LogFormat.html
     * 1: bucket owner
     * 2: bucket name
     * 3: time
     * 4: remote IP
     * 5: requester
     * 6: request ID
     * 7: Operation
     * 8: Key, a.k.a. the item
     * 9: request-URI
     * 10: HTTP status
     * 11: Error code
     * 12: Bytes sent
     * 13: Object size
     * 14: total time
     * 15: turnaround time
     * 16: Referrer
     * 17: User-Agent
     * 18: Version ID
     *
     */

    if (meta.type == "base64") {
        var cmp = function (ref, val) {
            for (var i = 0, l = ref.length; i < l; ++i) {
                if (ref[i] != val[i]) {
                    return false;
                }
            }
            return true;
        };

        var database = [
            {type: "image/png", magic: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]},
            {type: "image/jpeg", magic: [0xff, 0xd8]},
            {type: "image/gif", magic: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61]},
            {type: "image/gif", magic: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]},
        ]


        var loglines = Base64.decode(doc);
        lines = loglines.split(/\r\n|\r|\n/g);
// var header = binary.slice(0, 8);
//for (var i = 0, l = database.length; i < l; ++i) {
//  if (cmp(database[i].magic, header)) {
//    emit(meta.id, database[i].type);
//    return;
//  }
        //}
        //emit(meta.id, "application/octect-stream");

        //emit(meta.id, lines.length);
        //emit(meta.id + "log", loglines);
        //emit(meta.id + "lines", lines);

        //var myArray = logEntryPattern.exec(lines[0]);

        //emit(null,"ipAddy: ", myArray.length);
        // http://regex101.com/r/cB1qM6/3

        for (var i = 0; i < lines.length; i++) {
            var tokens = s3re.exec(lines[i]);
            if (tokens) {

                switch (tokens[10]) {
                    case "403": /* permission denied */
                        return;
                        break;
                    case "304": /* not modified */
                        return;
                        break;
                    default:
                        break;
                    //emit("Xception-httpcode", [tokens[10], lines[i]]);
                }

                emit([tokens[8], tokens[17]]);  //TODO: logical grouping

            } else {
                if (lines[i] == "") {
                    return;
                }
                //emit("Xception-regexmatch", lines[i]);  // not needed here
            }

        }
    }
}