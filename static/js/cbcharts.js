//var _ = require(["underscore"]);

// globals
var CHART_WIDTH = 750;
var CHART_HEIGHT = 400;

var tail_re = /.*\/(.*)$/;


var olddata = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [
        {
            label: "Server 3.x",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40, 50,60,70,80,90]
        },
        {
            label: "Server 2.x",
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90, 50,60,70,80,90]
        }
    ]
};

// what I think I want is each interval extracted, then laid out as the "label" with the products there as a bar

var mock_color1 = genColor("couchbase-server-enterprise_x86_64_2.0.1.deb");
var mock_color2 = genColor("couchbase-server-community_x86_64_2.0.1.deb");
var mock_data = {
    labels: ["10-6-2014", "10-7-2014"],
    datasets: [
        {
            label: "couchbase-server-enterprise_x86_64_2.0.1.deb",
            data: [0.6927932454485232, 0.3424],
            fillColor: mock_color1
        },
        {
            label: "couchbase-server-community_x86_64_2.0.1.deb",
            data: [2, 5],
            fillColor: mock_color2
        }
    ]
};

var input_data = [
    {
        "path": [
            2014,
            10,
            6,
            "releases/2.0.0/couchbase-server-enterprise_x86_64_2.0.0.setup.exe"
        ],
        "num_downloads": 0.03143576906164676
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/2.0.1/couchbase-server-community_x86_64_2.0.1.deb"
        ],
        "num_downloads": 2
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/2.0.1/couchbase-server-enterprise_x86_64_2.0.1.deb"
        ],
        "num_downloads": 0.6927932454485232
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/2.1.1/couchbase-server-community_x86_64_2.1.1.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86.deb"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.deb"
        ],
        "num_downloads": 4.733196305302305
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.rpm"
        ],
        "num_downloads": 1.033813519671069
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.zip"
        ],
        "num_downloads": 1.996789616154441
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64.rpm"
        ],
        "num_downloads": 2
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/2.2.0/couchbase-server_src-2.2.0.tar.gz"
        ],
        "num_downloads": 1.6613635832310023
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/2.5.0/couchbase-server-enterprise_2.5.0_x86_64.setup.exe"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.deb"
        ],
        "num_downloads": 2
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.rpm"
        ],
        "num_downloads": 1.6789954217578915
    },
    {
        "path": [
            2014,
            10,
            5,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.setup.exe"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.setup.exe"
        ],
        "num_downloads": 3.1143516759125323
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.zip"
        ],
        "num_downloads": 2
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64_openssl098.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/3.0.0-beta/couchbase-server_3.0.0-beta-windows_amd64.exe"
        ],
        "num_downloads": 5.041299058553822
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/3.0.0-beta/couchbase-server_3.0.0-beta-windows_x86.exe"
        ],
        "num_downloads": 0.6008137814152757
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/3.0.0-beta2/couchbase-server_3.0.0-beta2_x86_64_ubuntu_1204.deb"
        ],
        "num_downloads": 2.664271842145724
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/3.0.0/couchbase-server-community_3.0.0-ubuntu12.04_amd64.deb"
        ],
        "num_downloads": 1.3105695126739885
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/3.0.0/couchbase-server-enterprise-3.0.0-centos6.x86_64.rpm"
        ],
        "num_downloads": 2
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/3.0.0/couchbase-server-enterprise_3.0.0-debian7_amd64.deb"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/3.0.0/couchbase-server-enterprise_3.0.0-macos_x86_64.zip"
        ],
        "num_downloads": 2
    },
    {
        "path": [
            2014,
            10,
            6,
            "releases/3.0.0/couchbase-server-enterprise_3.0.0-ubuntu12.04_amd64.deb"
        ],
        "num_downloads": 2.06622743495742
    }
];

var more_input_data = [
    {
        "path": [
            2014,
            9,
            "releases/1.8.0/couchbase-server-community_x86_1.8.0.deb"
        ],
        "num_downloads": 0.002934960428679905
    },
    {
        "path": [
            2014,
            9,
            "releases/1.8.0/couchbase-server-community_x86_1.8.0.rpm"
        ],
        "num_downloads": 0.01209907799718725
    },
    {
        "path": [
            2014,
            12,
            "releases/1.8.0/couchbase-server-community_x86_1.8.0.setup.exe"
        ],
        "num_downloads": 0.4403376607566907
    },
    {
        "path": [
            2014,
            11,
            "releases/1.8.0/couchbase-server-community_x86_64_1.8.0.rpm"
        ],
        "num_downloads": 0.0004168453375872381
    },
    {
        "path": [
            2014,
            9,
            "releases/1.8.0/couchbase-server-community_x86_64_1.8.0.setup.exe"
        ],
        "num_downloads": 0
    },
    {
        "path": [
            2014,
            11,
            "releases/1.8.0/couchbase-server-community_x86_64_1.8.0.setup.exe"
        ],
        "num_downloads": 0
    },
    {
        "path": [
            2014,
            12,
            "releases/1.8.0/couchbase-server-enterprise_x86_1.8.0.setup.exe"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            11,
            "releases/1.8.0/couchbase-server-enterprise_x86_64_1.8.0.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            9,
            "releases/1.8.0/couchbase-server-enterprise_x86_64_1.8.0.setup.exe"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            11,
            "releases/1.8.0/couchbase-server_src-1.8.0.tar.gz"
        ],
        "num_downloads": 0.8406185124213185
    },
    {
        "path": [
            2014,
            12,
            "releases/1.8.1/couchbase-server-community_x86_1.8.1.deb"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            11,
            "releases/1.8.1/couchbase-server-community_x86_1.8.1.rpm"
        ],
        "num_downloads": 0.05580934258535765
    },
    {
        "path": [
            2014,
            9,
            "releases/1.8.1/couchbase-server-community_x86_1.8.1.setup.exe"
        ],
        "num_downloads": 0.02096412060610237
    },
    {
        "path": [
            2014,
            9,
            "releases/1.8.1/couchbase-server-community_x86_64_1.8.1.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            "releases/1.8.1/couchbase-server-community_x86_64_1.8.1.rpm"
        ],
        "num_downloads": 0.2462991137677116
    },
    {
        "path": [
            2015,
            1,
            "releases/1.8.1/couchbase-server-community_x86_64_1.8.1.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            9,
            "releases/1.8.1/couchbase-server-community_x86_64_1.8.1.zip"
        ],
        "num_downloads": 0.0022075123380375845
    },
    {
        "path": [
            2014,
            12,
            "releases/1.8.1/couchbase-server-enterprise_x86_1.8.1.deb"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            9,
            "releases/1.8.1/couchbase-server-enterprise_x86_64_1.8.1.deb"
        ],
        "num_downloads": 2
    },
    {
        "path": [
            2014,
            10,
            "releases/1.8.1/couchbase-server-enterprise_x86_64_1.8.1.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            11,
            "releases/1.8.1/couchbase-server-enterprise_x86_64_1.8.1.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            12,
            "releases/1.8.1/couchbase-server-enterprise_x86_64_1.8.1.rpm"
        ],
        "num_downloads": 0.00001686054960574415
    },
    {
        "path": [
            2015,
            1,
            "releases/1.8.1/couchbase-server-enterprise_x86_64_1.8.1.rpm"
        ],
        "num_downloads": 3.0010510300145437
    },
    {
        "path": [
            2014,
            9,
            "releases/1.8.1/couchbase-server-enterprise_x86_64_1.8.1.setup.exe"
        ],
        "num_downloads": 3.13171613574674
    },
    {
        "path": [
            2014,
            10,
            "releases/1.8.1/couchbase-server-enterprise_x86_64_1.8.1.setup.exe"
        ],
        "num_downloads": 1.2050416035887765
    },
    {
        "path": [
            2014,
            12,
            "releases/1.8.1/couchbase-server-enterprise_x86_64_1.8.1.setup.exe"
        ],
        "num_downloads": 0.32385503215699213
    },
    {
        "path": [
            2015,
            1,
            "releases/1.8.1/couchbase-server-enterprise_x86_64_1.8.1.setup.exe"
        ],
        "num_downloads": 1.030576173805132
    },
    {
        "path": [
            2014,
            9,
            "releases/1.8.1/couchbase-server_src-1.8.1.tar.gz"
        ],
        "num_downloads": 0.0017947781499890398
    },
    {
        "path": [
            2014,
            10,
            "releases/2.0.0-beta/couchbase-server-community_x86_64_2.0.0-beta.deb"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            "releases/2.0.0-beta/couchbase-server-community_x86_64_2.0.0-beta.rpm"
        ],
        "num_downloads": 0.10127815426036675
    },
    {
        "path": [
            2014,
            9,
            "releases/2.0.0/couchbase-server-community_x86_2.0.0.deb"
        ],
        "num_downloads": 0.0008628824504575075
    },
    {
        "path": [
            2014,
            9,
            "releases/2.0.0/couchbase-server-community_x86_2.0.0.rpm"
        ],
        "num_downloads": 0.023223350300600167
    },
    {
        "path": [
            2014,
            9,
            "releases/2.0.0/couchbase-server-community_x86_64_2.0.0.rpm"
        ],
        "num_downloads": 2
    },
    {
        "path": [
            2014,
            10,
            "releases/2.0.0/couchbase-server-community_x86_64_2.0.0.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            11,
            "releases/2.0.0/couchbase-server-community_x86_64_2.0.0.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            9,
            "releases/2.0.0/couchbase-server-community_x86_64_2.0.0.setup.exe"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2015,
            1,
            "releases/2.0.0/couchbase-server-community_x86_64_2.0.0.setup.exe"
        ],
        "num_downloads": 0.20355516807181948
    },
    {
        "path": [
            2014,
            9,
            "releases/2.0.0/couchbase-server-enterprise_x86_64_2.0.0.deb"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            "releases/2.0.0/couchbase-server-enterprise_x86_64_2.0.0.deb"
        ],
        "num_downloads": 3
    },
    {
        "path": [
            2014,
            11,
            "releases/2.0.0/couchbase-server-enterprise_x86_64_2.0.0.deb"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            12,
            "releases/2.0.0/couchbase-server-enterprise_x86_64_2.0.0.deb"
        ],
        "num_downloads": 6
    },
    {
        "path": [
            2015,
            1,
            "releases/2.0.0/couchbase-server-enterprise_x86_64_2.0.0.deb"
        ],
        "num_downloads": 9
    },
    {
        "path": [
            2014,
            9,
            "releases/2.0.0/couchbase-server-enterprise_x86_64_2.0.0.rpm"
        ],
        "num_downloads": 0.1261710366539137
    },
    {
        "path": [
            2014,
            10,
            "releases/2.0.0/couchbase-server-enterprise_x86_64_2.0.0.rpm"
        ],
        "num_downloads": 6.3427365398939495
    },
    {
        "path": [
            2014,
            11,
            "releases/2.0.0/couchbase-server-enterprise_x86_64_2.0.0.rpm"
        ],
        "num_downloads": 5.134105952243418
    },
    {
        "path": [
            2014,
            12,
            "releases/2.0.0/couchbase-server-enterprise_x86_64_2.0.0.rpm"
        ],
        "num_downloads": 3.568317775495906
    },
    {
        "path": [
            2015,
            1,
            "releases/2.0.0/couchbase-server-enterprise_x86_64_2.0.0.rpm"
        ],
        "num_downloads": 4.091414883193455
    },
    {
        "path": [
            2014,
            9,
            "releases/2.0.0/couchbase-server-enterprise_x86_64_2.0.0.setup.exe"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            "releases/2.0.0/couchbase-server-enterprise_x86_64_2.0.0.setup.exe"
        ],
        "num_downloads": 0.03143576906164676
    },
    {
        "path": [
            2014,
            11,
            "releases/2.0.0/couchbase-server-enterprise_x86_64_2.0.0.setup.exe"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            "releases/2.0.1/couchbase-server-community_x86_2.0.1.deb"
        ],
        "num_downloads": 0.5229162396744794
    },
    {
        "path": [
            2015,
            1,
            "releases/2.0.1/couchbase-server-community_x86_2.0.1.deb"
        ],
        "num_downloads": 0.000255108868011447
    },
    {
        "path": [
            2014,
            10,
            "releases/2.0.1/couchbase-server-community_x86_2.0.1.rpm"
        ],
        "num_downloads": 0.024187348114851768
    },
    {
        "path": [
            2014,
            12,
            "releases/2.0.1/couchbase-server-community_x86_2.0.1.rpm"
        ],
        "num_downloads": 0.00023191460667142566
    },
    {
        "path": [
            2014,
            9,
            "releases/2.0.1/couchbase-server-community_x86_2.0.1.setup.exe"
        ],
        "num_downloads": 1.6189111977903634
    },
    {
        "path": [
            2014,
            10,
            "releases/2.0.1/couchbase-server-community_x86_2.0.1.setup.exe"
        ],
        "num_downloads": 2.1302428461804586
    },
    {
        "path": [
            2014,
            12,
            "releases/2.0.1/couchbase-server-community_x86_2.0.1.setup.exe"
        ],
        "num_downloads": 2.3852931314675954
    },
    {
        "path": [
            2014,
            9,
            "releases/2.0.1/couchbase-server-community_x86_64_2.0.1.deb"
        ],
        "num_downloads": 14.055610010344735
    },
    {
        "path": [
            2014,
            10,
            "releases/2.0.1/couchbase-server-community_x86_64_2.0.1.deb"
        ],
        "num_downloads": 22.00776188225058
    },
    {
        "path": [
            2014,
            11,
            "releases/2.0.1/couchbase-server-community_x86_64_2.0.1.deb"
        ],
        "num_downloads": 2
    },
    {
        "path": [
            2014,
            12,
            "releases/2.0.1/couchbase-server-community_x86_64_2.0.1.deb"
        ],
        "num_downloads": 13.823983135134826
    },
    {
        "path": [
            2015,
            1,
            "releases/2.0.1/couchbase-server-community_x86_64_2.0.1.deb"
        ],
        "num_downloads": 8.089327872103304
    },
    {
        "path": [
            2014,
            9,
            "releases/2.0.1/couchbase-server-community_x86_64_2.0.1.rpm"
        ],
        "num_downloads": 1.6503192965596654
    },
    {
        "path": [
            2014,
            10,
            "releases/2.0.1/couchbase-server-community_x86_64_2.0.1.rpm"
        ],
        "num_downloads": 0.023271878472616903
    },
    {
        "path": [
            2014,
            11,
            "releases/2.0.1/couchbase-server-community_x86_64_2.0.1.rpm"
        ],
        "num_downloads": 0.18374570919410246
    },
    {
        "path": [
            2014,
            12,
            "releases/2.0.1/couchbase-server-community_x86_64_2.0.1.rpm"
        ],
        "num_downloads": 0.3208481208899445
    },
    {
        "path": [
            2015,
            1,
            "releases/2.0.1/couchbase-server-community_x86_64_2.0.1.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            9,
            "releases/2.0.1/couchbase-server-community_x86_64_2.0.1.setup.exe"
        ],
        "num_downloads": 3.034246806740283
    },
    {
        "path": [
            2014,
            11,
            "releases/2.0.1/couchbase-server-community_x86_64_2.0.1.setup.exe"
        ],
        "num_downloads": 0.058228576663606216
    },
    {
        "path": [
            2014,
            12,
            "releases/2.0.1/couchbase-server-community_x86_64_2.0.1.setup.exe"
        ],
        "num_downloads": 1.7367110199619187
    },
    {
        "path": [
            2015,
            1,
            "releases/2.0.1/couchbase-server-community_x86_64_2.0.1.zip"
        ],
        "num_downloads": 0.0003776515678138766
    },
    {
        "path": [
            2014,
            10,
            "releases/2.0.1/couchbase-server-enterprise_x86_2.0.1.rpm"
        ],
        "num_downloads": 0.7892932290438802
    },
    {
        "path": [
            2014,
            10,
            "releases/2.0.1/couchbase-server-enterprise_x86_2.0.1.setup.exe"
        ],
        "num_downloads": 0.5806798814728938
    },
    {
        "path": [
            2014,
            9,
            "releases/2.0.1/couchbase-server-enterprise_x86_64_2.0.1.deb"
        ],
        "num_downloads": 2.019045878480516
    },
    {
        "path": [
            2014,
            10,
            "releases/2.0.1/couchbase-server-enterprise_x86_64_2.0.1.deb"
        ],
        "num_downloads": 4.692793245448523
    },
    {
        "path": [
            2014,
            11,
            "releases/2.0.1/couchbase-server-enterprise_x86_64_2.0.1.deb"
        ],
        "num_downloads": 2
    },
    {
        "path": [
            2014,
            12,
            "releases/2.0.1/couchbase-server-enterprise_x86_64_2.0.1.deb"
        ],
        "num_downloads": 3.020204808707642
    },
    {
        "path": [
            2015,
            1,
            "releases/2.0.1/couchbase-server-enterprise_x86_64_2.0.1.deb"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            9,
            "releases/2.0.1/couchbase-server-enterprise_x86_64_2.0.1.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            "releases/2.0.1/couchbase-server-enterprise_x86_64_2.0.1.rpm"
        ],
        "num_downloads": 4.62653133159373
    },
    {
        "path": [
            2014,
            11,
            "releases/2.0.1/couchbase-server-enterprise_x86_64_2.0.1.rpm"
        ],
        "num_downloads": 2.8493150073783
    },
    {
        "path": [
            2014,
            12,
            "releases/2.0.1/couchbase-server-enterprise_x86_64_2.0.1.rpm"
        ],
        "num_downloads": 3.0395378043987558
    },
    {
        "path": [
            2015,
            1,
            "releases/2.0.1/couchbase-server-enterprise_x86_64_2.0.1.rpm"
        ],
        "num_downloads": 1.454557948574423
    },
    {
        "path": [
            2014,
            10,
            "releases/2.0.1/couchbase-server-enterprise_x86_64_2.0.1.setup.exe"
        ],
        "num_downloads": 11
    },
    {
        "path": [
            2014,
            11,
            "releases/2.0.1/couchbase-server-enterprise_x86_64_2.0.1.setup.exe"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            9,
            "releases/2.0.1/couchbase-server_src-2.0.1.tar.gz"
        ],
        "num_downloads": 0.09756796133084929
    },
    {
        "path": [
            2014,
            9,
            "releases/2.1.0/couchbase-server-community_x86_2.1.0.deb"
        ],
        "num_downloads": 0.002667696325598019
    },
    {
        "path": [
            2014,
            11,
            "releases/2.1.0/couchbase-server-community_x86_2.1.0.deb"
        ],
        "num_downloads": 0.00017717860303089942
    },
    {
        "path": [
            2014,
            10,
            "releases/2.1.0/couchbase-server-community_x86_64_2.1.0.deb"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            9,
            "releases/2.1.0/couchbase-server-community_x86_64_2.1.0.setup.exe"
        ],
        "num_downloads": 2.0466767970634963
    },
    {
        "path": [
            2014,
            10,
            "releases/2.1.0/couchbase-server-enterprise_x86_2.1.0.setup.exe"
        ],
        "num_downloads": 0.006419031398262111
    },
    {
        "path": [
            2014,
            10,
            "releases/2.1.0/couchbase-server-enterprise_x86_64_2.1.0.deb"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            11,
            "releases/2.1.0/couchbase-server-enterprise_x86_64_2.1.0.deb"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            9,
            "releases/2.1.0/couchbase-server-enterprise_x86_64_2.1.0.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            11,
            "releases/2.1.0/couchbase-server-enterprise_x86_64_2.1.0.rpm"
        ],
        "num_downloads": 2.0834212618542307
    },
    {
        "path": [
            2014,
            9,
            "releases/2.1.1/couchbase-server-community_x86_2.1.1.deb"
        ],
        "num_downloads": 0.006208122826504827
    },
    {
        "path": [
            2014,
            10,
            "releases/2.1.1/couchbase-server-community_x86_2.1.1.deb"
        ],
        "num_downloads": 0.02438257874342686
    },
    {
        "path": [
            2014,
            11,
            "releases/2.1.1/couchbase-server-community_x86_2.1.1.deb"
        ],
        "num_downloads": 0.02416901017539493
    },
    {
        "path": [
            2014,
            9,
            "releases/2.1.1/couchbase-server-community_x86_2.1.1.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            "releases/2.1.1/couchbase-server-community_x86_2.1.1.rpm"
        ],
        "num_downloads": 0.022947275914023374
    },
    {
        "path": [
            2014,
            9,
            "releases/2.1.1/couchbase-server-community_x86_2.1.1.setup.exe"
        ],
        "num_downloads": 1.1677547413052092
    },
    {
        "path": [
            2014,
            10,
            "releases/2.1.1/couchbase-server-community_x86_2.1.1.setup.exe"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            11,
            "releases/2.1.1/couchbase-server-community_x86_2.1.1.setup.exe"
        ],
        "num_downloads": 0.024802777712227244
    },
    {
        "path": [
            2014,
            12,
            "releases/2.1.1/couchbase-server-community_x86_2.1.1.setup.exe"
        ],
        "num_downloads": 3.3410351211355485
    },
    {
        "path": [
            2014,
            9,
            "releases/2.1.1/couchbase-server-community_x86_64_2.1.1.deb"
        ],
        "num_downloads": 3.0018780289739957
    },
    {
        "path": [
            2014,
            10,
            "releases/2.1.1/couchbase-server-community_x86_64_2.1.1.deb"
        ],
        "num_downloads": 3.023535101849111
    },
    {
        "path": [
            2014,
            11,
            "releases/2.1.1/couchbase-server-community_x86_64_2.1.1.deb"
        ],
        "num_downloads": 5
    },
    {
        "path": [
            2014,
            12,
            "releases/2.1.1/couchbase-server-community_x86_64_2.1.1.deb"
        ],
        "num_downloads": 9
    },
    {
        "path": [
            2015,
            1,
            "releases/2.1.1/couchbase-server-community_x86_64_2.1.1.deb"
        ],
        "num_downloads": 10.13814041668328
    },
    {
        "path": [
            2014,
            9,
            "releases/2.1.1/couchbase-server-community_x86_64_2.1.1.rpm"
        ],
        "num_downloads": 8.021607880521131
    },
    {
        "path": [
            2014,
            10,
            "releases/2.1.1/couchbase-server-community_x86_64_2.1.1.rpm"
        ],
        "num_downloads": 6.606583455860572
    },
    {
        "path": [
            2014,
            11,
            "releases/2.1.1/couchbase-server-community_x86_64_2.1.1.rpm"
        ],
        "num_downloads": 1.1353233757350674
    },
    {
        "path": [
            2014,
            12,
            "releases/2.1.1/couchbase-server-community_x86_64_2.1.1.rpm"
        ],
        "num_downloads": 0.00016711407382102636
    },
    {
        "path": [
            2015,
            1,
            "releases/2.1.1/couchbase-server-community_x86_64_2.1.1.rpm"
        ],
        "num_downloads": 2.2473428785322276
    },
    {
        "path": [
            2014,
            9,
            "releases/2.1.1/couchbase-server-community_x86_64_2.1.1.setup.exe"
        ],
        "num_downloads": 2.9253798558600446
    },
    {
        "path": [
            2014,
            10,
            "releases/2.1.1/couchbase-server-community_x86_64_2.1.1.setup.exe"
        ],
        "num_downloads": 1.1573534561031473
    },
    {
        "path": [
            2014,
            11,
            "releases/2.1.1/couchbase-server-community_x86_64_2.1.1.setup.exe"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            12,
            "releases/2.1.1/couchbase-server-community_x86_64_2.1.1.setup.exe"
        ],
        "num_downloads": 1.5131980933929963
    },
    {
        "path": [
            2015,
            1,
            "releases/2.1.1/couchbase-server-community_x86_64_2.1.1.setup.exe"
        ],
        "num_downloads": 4.283281575361301
    },
    {
        "path": [
            2014,
            10,
            "releases/2.1.1/couchbase-server-community_x86_64_2.1.1.zip"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            12,
            "releases/2.1.1/couchbase-server-enterprise_x86_2.1.1.deb"
        ],
        "num_downloads": 0.6367164324518487
    },
    {
        "path": [
            2014,
            9,
            "releases/2.1.1/couchbase-server-enterprise_x86_2.1.1.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            9,
            "releases/2.1.1/couchbase-server-enterprise_x86_64_2.1.1.deb"
        ],
        "num_downloads": 0.03268094533223673
    },
    {
        "path": [
            2014,
            12,
            "releases/2.1.1/couchbase-server-enterprise_x86_64_2.1.1.deb"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2015,
            1,
            "releases/2.1.1/couchbase-server-enterprise_x86_64_2.1.1.deb"
        ],
        "num_downloads": 0.5903102492973867
    },
    {
        "path": [
            2014,
            9,
            "releases/2.1.1/couchbase-server-enterprise_x86_64_2.1.1.rpm"
        ],
        "num_downloads": 3
    },
    {
        "path": [
            2014,
            10,
            "releases/2.1.1/couchbase-server-enterprise_x86_64_2.1.1.rpm"
        ],
        "num_downloads": 3.135557502410069
    },
    {
        "path": [
            2014,
            12,
            "releases/2.1.1/couchbase-server-enterprise_x86_64_2.1.1.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2015,
            1,
            "releases/2.1.1/couchbase-server-enterprise_x86_64_2.1.1.rpm"
        ],
        "num_downloads": 0.6430377901234154
    },
    {
        "path": [
            2014,
            9,
            "releases/2.1.1/couchbase-server-enterprise_x86_64_2.1.1.setup.exe"
        ],
        "num_downloads": 0.07013896380868967
    },
    {
        "path": [
            2014,
            11,
            "releases/2.1.1/couchbase-server-enterprise_x86_64_2.1.1.setup.exe"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2015,
            1,
            "releases/2.1.1/couchbase-server-enterprise_x86_64_2.1.1.setup.exe"
        ],
        "num_downloads": 2
    },
    {
        "path": [
            2014,
            11,
            "releases/2.1.1/couchbase-server-enterprise_x86_64_2.1.1.zip"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2015,
            1,
            "releases/2.1.1/couchbase-server_src-2.1.1.tar.gz"
        ],
        "num_downloads": 0.2776226408548432
    },
    {
        "path": [
            2014,
            9,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86.deb"
        ],
        "num_downloads": 12.186589781139167
    },
    {
        "path": [
            2014,
            10,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86.deb"
        ],
        "num_downloads": 5.043787032276394
    },
    {
        "path": [
            2014,
            11,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86.deb"
        ],
        "num_downloads": 2.697726424269486
    },
    {
        "path": [
            2014,
            12,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86.deb"
        ],
        "num_downloads": 1.223978500616485
    },
    {
        "path": [
            2015,
            1,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86.deb"
        ],
        "num_downloads": 1.9043283930375805
    },
    {
        "path": [
            2014,
            9,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86.rpm"
        ],
        "num_downloads": 1.5403709105151877
    },
    {
        "path": [
            2014,
            10,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            11,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            12,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            9,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86.setup.exe"
        ],
        "num_downloads": 24.597485079351443
    },
    {
        "path": [
            2014,
            10,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86.setup.exe"
        ],
        "num_downloads": 4.212216573658288
    },
    {
        "path": [
            2014,
            11,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86.setup.exe"
        ],
        "num_downloads": 2.0452434785342866
    },
    {
        "path": [
            2014,
            12,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86.setup.exe"
        ],
        "num_downloads": 2.666663444147026
    },
    {
        "path": [
            2015,
            1,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86.setup.exe"
        ],
        "num_downloads": 1.0001723665386688
    },
    {
        "path": [
            2014,
            9,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.deb"
        ],
        "num_downloads": 101.31752175788142
    },
    {
        "path": [
            2014,
            10,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.deb"
        ],
        "num_downloads": 67.93929301477954
    },
    {
        "path": [
            2014,
            11,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.deb"
        ],
        "num_downloads": 29.56760307853406
    },
    {
        "path": [
            2014,
            12,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.deb"
        ],
        "num_downloads": 53.54691976596317
    },
    {
        "path": [
            2015,
            1,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.deb"
        ],
        "num_downloads": 37.98929136287412
    },
    {
        "path": [
            2014,
            9,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.rpm"
        ],
        "num_downloads": 39.4495951742754
    },
    {
        "path": [
            2014,
            10,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.rpm"
        ],
        "num_downloads": 25.16785643645271
    },
    {
        "path": [
            2014,
            11,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.rpm"
        ],
        "num_downloads": 8.856346201061907
    },
    {
        "path": [
            2014,
            12,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.rpm"
        ],
        "num_downloads": 10.75451508579393
    },
    {
        "path": [
            2015,
            1,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.rpm"
        ],
        "num_downloads": 14.118820979148138
    },
    {
        "path": [
            2014,
            9,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.setup.exe"
        ],
        "num_downloads": 93.25971856112574
    },
    {
        "path": [
            2014,
            10,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.setup.exe"
        ],
        "num_downloads": 24.9759469915506
    },
    {
        "path": [
            2014,
            11,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.setup.exe"
        ],
        "num_downloads": 6.297497952885235
    },
    {
        "path": [
            2014,
            12,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.setup.exe"
        ],
        "num_downloads": 5.448609883108325
    },
    {
        "path": [
            2015,
            1,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.setup.exe"
        ],
        "num_downloads": 4.164205413535906
    },
    {
        "path": [
            2014,
            9,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.zip"
        ],
        "num_downloads": 109.71761741168494
    },
    {
        "path": [
            2014,
            10,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.zip"
        ],
        "num_downloads": 21.16585727598265
    },
    {
        "path": [
            2014,
            11,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.zip"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            12,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.zip"
        ],
        "num_downloads": 1.4869342927963756
    },
    {
        "path": [
            2015,
            1,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64.zip"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            9,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64_openssl098.deb"
        ],
        "num_downloads": 7.999935458705271
    },
    {
        "path": [
            2014,
            10,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64_openssl098.deb"
        ],
        "num_downloads": 1.063628798054685
    },
    {
        "path": [
            2014,
            11,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64_openssl098.deb"
        ],
        "num_downloads": 1.874830754399653
    },
    {
        "path": [
            2014,
            12,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64_openssl098.deb"
        ],
        "num_downloads": 0.00022816356144410833
    },
    {
        "path": [
            2014,
            9,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64_openssl098.rpm"
        ],
        "num_downloads": 11.234909497647795
    },
    {
        "path": [
            2014,
            10,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64_openssl098.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2015,
            1,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_64_openssl098.rpm"
        ],
        "num_downloads": 1.1056400565845315
    },
    {
        "path": [
            2014,
            9,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_openssl098.deb"
        ],
        "num_downloads": 9.01333872948385
    },
    {
        "path": [
            2014,
            12,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_openssl098.deb"
        ],
        "num_downloads": 0.0002539840195130143
    },
    {
        "path": [
            2014,
            9,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_openssl098.rpm"
        ],
        "num_downloads": 0.7884259554414567
    },
    {
        "path": [
            2014,
            10,
            "releases/2.2.0/couchbase-server-community_2.2.0_x86_openssl098.rpm"
        ],
        "num_downloads": 0.02198647814732804
    },
    {
        "path": [
            2014,
            10,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86.deb"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            11,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86.deb"
        ],
        "num_downloads": 1.5654030007869313
    },
    {
        "path": [
            2014,
            9,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86.rpm"
        ],
        "num_downloads": 1.1140680539140655
    },
    {
        "path": [
            2014,
            9,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86.setup.exe"
        ],
        "num_downloads": 3.058885232609274
    },
    {
        "path": [
            2014,
            10,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86.setup.exe"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            11,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86.setup.exe"
        ],
        "num_downloads": 2.0006150889807897
    },
    {
        "path": [
            2014,
            12,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86.setup.exe"
        ],
        "num_downloads": 2.086437290949348
    },
    {
        "path": [
            2015,
            1,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86.setup.exe"
        ],
        "num_downloads": 0.27181265409054495
    },
    {
        "path": [
            2014,
            9,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64.deb"
        ],
        "num_downloads": 17.039730120617133
    },
    {
        "path": [
            2014,
            10,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64.deb"
        ],
        "num_downloads": 10.868227068765147
    },
    {
        "path": [
            2014,
            11,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64.deb"
        ],
        "num_downloads": 9
    },
    {
        "path": [
            2014,
            12,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64.deb"
        ],
        "num_downloads": 6.666838726728738
    },
    {
        "path": [
            2015,
            1,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64.deb"
        ],
        "num_downloads": 7.333987582542435
    },
    {
        "path": [
            2014,
            9,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64.rpm"
        ],
        "num_downloads": 49.57749168058324
    },
    {
        "path": [
            2014,
            10,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64.rpm"
        ],
        "num_downloads": 44.73128957662391
    },
    {
        "path": [
            2014,
            11,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64.rpm"
        ],
        "num_downloads": 40.2478326656604
    },
    {
        "path": [
            2014,
            12,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64.rpm"
        ],
        "num_downloads": 54.34872275119337
    },
    {
        "path": [
            2015,
            1,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64.rpm"
        ],
        "num_downloads": 58.552648557637895
    },
    {
        "path": [
            2014,
            9,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64.setup.exe"
        ],
        "num_downloads": 3.856656259717747
    },
    {
        "path": [
            2014,
            10,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64.setup.exe"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            11,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64.setup.exe"
        ],
        "num_downloads": 2.3217098530790694
    },
    {
        "path": [
            2014,
            12,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64.setup.exe"
        ],
        "num_downloads": 2.482709749843518
    },
    {
        "path": [
            2015,
            1,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64.setup.exe"
        ],
        "num_downloads": 1.880244533755409
    },
    {
        "path": [
            2014,
            9,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64.zip"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64.zip"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            11,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64.zip"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64_openssl098.deb"
        ],
        "num_downloads": 6
    },
    {
        "path": [
            2015,
            1,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64_openssl098.deb"
        ],
        "num_downloads": 0.3972840181740264
    },
    {
        "path": [
            2015,
            1,
            "releases/2.2.0/couchbase-server-enterprise_2.2.0_x86_64_openssl098.rpm"
        ],
        "num_downloads": 2.4517966735914243
    },
    {
        "path": [
            2014,
            9,
            "releases/2.2.0/couchbase-server_src-2.2.0.tar.gz"
        ],
        "num_downloads": 18.645970152594206
    },
    {
        "path": [
            2014,
            10,
            "releases/2.2.0/couchbase-server_src-2.2.0.tar.gz"
        ],
        "num_downloads": 7.571449860455572
    },
    {
        "path": [
            2015,
            1,
            "releases/2.2.0/couchbase-server_src-2.2.0.tar.gz"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            "releases/2.5.0/couchbase-server-enterprise_2.5.0_x86.setup.exe"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            12,
            "releases/2.5.0/couchbase-server-enterprise_2.5.0_x86.setup.exe"
        ],
        "num_downloads": 0.4382682592323414
    },
    {
        "path": [
            2015,
            1,
            "releases/2.5.0/couchbase-server-enterprise_2.5.0_x86.setup.exe"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            9,
            "releases/2.5.0/couchbase-server-enterprise_2.5.0_x86_64.deb"
        ],
        "num_downloads": 0.02252703654029926
    },
    {
        "path": [
            2014,
            10,
            "releases/2.5.0/couchbase-server-enterprise_2.5.0_x86_64.deb"
        ],
        "num_downloads": 1.8856541106002676
    },
    {
        "path": [
            2014,
            12,
            "releases/2.5.0/couchbase-server-enterprise_2.5.0_x86_64.deb"
        ],
        "num_downloads": 0.409181526686082
    },
    {
        "path": [
            2015,
            1,
            "releases/2.5.0/couchbase-server-enterprise_2.5.0_x86_64.deb"
        ],
        "num_downloads": 5.002908765308454
    },
    {
        "path": [
            2014,
            9,
            "releases/2.5.0/couchbase-server-enterprise_2.5.0_x86_64.rpm"
        ],
        "num_downloads": 9.21046310784735
    },
    {
        "path": [
            2014,
            10,
            "releases/2.5.0/couchbase-server-enterprise_2.5.0_x86_64.rpm"
        ],
        "num_downloads": 6.2748469100869295
    },
    {
        "path": [
            2014,
            11,
            "releases/2.5.0/couchbase-server-enterprise_2.5.0_x86_64.rpm"
        ],
        "num_downloads": 6
    },
    {
        "path": [
            2014,
            12,
            "releases/2.5.0/couchbase-server-enterprise_2.5.0_x86_64.rpm"
        ],
        "num_downloads": 2.0324333819951295
    },
    {
        "path": [
            2015,
            1,
            "releases/2.5.0/couchbase-server-enterprise_2.5.0_x86_64.rpm"
        ],
        "num_downloads": 2
    },
    {
        "path": [
            2014,
            9,
            "releases/2.5.0/couchbase-server-enterprise_2.5.0_x86_64.setup.exe"
        ],
        "num_downloads": 3.1761643035200455
    },
    {
        "path": [
            2014,
            10,
            "releases/2.5.0/couchbase-server-enterprise_2.5.0_x86_64.setup.exe"
        ],
        "num_downloads": 2.069783069349561
    },
    {
        "path": [
            2014,
            11,
            "releases/2.5.0/couchbase-server-enterprise_2.5.0_x86_64.setup.exe"
        ],
        "num_downloads": 2.0285940229664616
    },
    {
        "path": [
            2014,
            12,
            "releases/2.5.0/couchbase-server-enterprise_2.5.0_x86_64.setup.exe"
        ],
        "num_downloads": 1.0279591486190625
    },
    {
        "path": [
            2015,
            1,
            "releases/2.5.0/couchbase-server-enterprise_2.5.0_x86_64.setup.exe"
        ],
        "num_downloads": 1.5147251395745929
    },
    {
        "path": [
            2014,
            11,
            "releases/2.5.0/couchbase-server-enterprise_2.5.0_x86_64.zip"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            9,
            "releases/2.5.1-HOTFIX-CBSE-1321/couchbase-server-2.5.1-HOTFIX-CBSE-1321.zip"
        ],
        "num_downloads": 0.9999864933672239
    },
    {
        "path": [
            2014,
            10,
            "releases/2.5.1-HOTFIX-CBSE-1321/couchbase-server-2.5.1-HOTFIX-CBSE-1321.zip"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            "releases/2.5.1-HOTFIX-MB-12201/couchbase-server-2.5.1-HOTFIX-MB-12201.zip"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            11,
            "releases/2.5.1-HOTFIX-MB-12201/couchbase-server-2.5.1-HOTFIX-MB-12201.zip"
        ],
        "num_downloads": 3.6449724641707384
    },
    {
        "path": [
            2015,
            1,
            "releases/2.5.1-HOTFIX-MB-12201/couchbase-server-2.5.1-HOTFIX-MB-12201.zip"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            9,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86.deb"
        ],
        "num_downloads": 8.74288758552829
    },
    {
        "path": [
            2014,
            10,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86.deb"
        ],
        "num_downloads": 1.2434944213517114
    },
    {
        "path": [
            2014,
            11,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86.deb"
        ],
        "num_downloads": 3.8580640799009975
    },
    {
        "path": [
            2015,
            1,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86.deb"
        ],
        "num_downloads": 1.7320785433239663
    },
    {
        "path": [
            2014,
            9,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86.rpm"
        ],
        "num_downloads": 4.590605945535934
    },
    {
        "path": [
            2014,
            10,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86.rpm"
        ],
        "num_downloads": 1.5769725558453873
    },
    {
        "path": [
            2014,
            11,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2015,
            1,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            9,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86.setup.exe"
        ],
        "num_downloads": 21.735391095818724
    },
    {
        "path": [
            2014,
            10,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86.setup.exe"
        ],
        "num_downloads": 5.537650623992746
    },
    {
        "path": [
            2014,
            11,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86.setup.exe"
        ],
        "num_downloads": 1.0073608665094378
    },
    {
        "path": [
            2014,
            12,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86.setup.exe"
        ],
        "num_downloads": 1.0236474294417222
    },
    {
        "path": [
            2014,
            9,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.deb"
        ],
        "num_downloads": 70.08254061639795
    },
    {
        "path": [
            2014,
            10,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.deb"
        ],
        "num_downloads": 23.3287780131129
    },
    {
        "path": [
            2014,
            11,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.deb"
        ],
        "num_downloads": 19.916450649304668
    },
    {
        "path": [
            2014,
            12,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.deb"
        ],
        "num_downloads": 6.596052808968451
    },
    {
        "path": [
            2015,
            1,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.deb"
        ],
        "num_downloads": 9.373626459694462
    },
    {
        "path": [
            2014,
            9,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.rpm"
        ],
        "num_downloads": 36.379355734221825
    },
    {
        "path": [
            2014,
            10,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.rpm"
        ],
        "num_downloads": 64.5117318592759
    },
    {
        "path": [
            2014,
            11,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.rpm"
        ],
        "num_downloads": 22.10652051504495
    },
    {
        "path": [
            2014,
            12,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.rpm"
        ],
        "num_downloads": 16.433407864745085
    },
    {
        "path": [
            2015,
            1,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.rpm"
        ],
        "num_downloads": 6.4046220513377845
    },
    {
        "path": [
            2014,
            9,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.setup.exe"
        ],
        "num_downloads": 108.21866585433786
    },
    {
        "path": [
            2014,
            10,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.setup.exe"
        ],
        "num_downloads": 39.16392725366679
    },
    {
        "path": [
            2014,
            11,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.setup.exe"
        ],
        "num_downloads": 11.338578847338463
    },
    {
        "path": [
            2014,
            12,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.setup.exe"
        ],
        "num_downloads": 3.546813338832139
    },
    {
        "path": [
            2015,
            1,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.setup.exe"
        ],
        "num_downloads": 3.0444823737919635
    },
    {
        "path": [
            2014,
            9,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.zip"
        ],
        "num_downloads": 35.161175404732944
    },
    {
        "path": [
            2014,
            10,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.zip"
        ],
        "num_downloads": 12
    },
    {
        "path": [
            2014,
            11,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.zip"
        ],
        "num_downloads": 2
    },
    {
        "path": [
            2014,
            12,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.zip"
        ],
        "num_downloads": 3
    },
    {
        "path": [
            2015,
            1,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64.zip"
        ],
        "num_downloads": 4
    },
    {
        "path": [
            2014,
            9,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64_openssl098.rpm"
        ],
        "num_downloads": 52.60582433906839
    },
    {
        "path": [
            2014,
            10,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64_openssl098.rpm"
        ],
        "num_downloads": 31
    },
    {
        "path": [
            2014,
            11,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64_openssl098.rpm"
        ],
        "num_downloads": 9.62551592492308
    },
    {
        "path": [
            2014,
            12,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64_openssl098.rpm"
        ],
        "num_downloads": 12
    },
    {
        "path": [
            2015,
            1,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_64_openssl098.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            9,
            "releases/2.5.1/couchbase-server-enterprise_2.5.1_x86_openssl098.rpm"
        ],
        "num_downloads": 0.12424152036578519
    },
    {
        "path": [
            2014,
            12,
            "releases/2.5.2/couchbase-server-enterprise_2.5.2_x86.deb"
        ],
        "num_downloads": 3.967920432943294
    },
    {
        "path": [
            2015,
            1,
            "releases/2.5.2/couchbase-server-enterprise_2.5.2_x86.deb"
        ],
        "num_downloads": 3.801599165167135
    },
    {
        "path": [
            2014,
            12,
            "releases/2.5.2/couchbase-server-enterprise_2.5.2_x86.rpm"
        ],
        "num_downloads": 1.590919153976006
    },
    {
        "path": [
            2015,
            1,
            "releases/2.5.2/couchbase-server-enterprise_2.5.2_x86.rpm"
        ],
        "num_downloads": 2
    },
    {
        "path": [
            2014,
            12,
            "releases/2.5.2/couchbase-server-enterprise_2.5.2_x86_64.deb"
        ],
        "num_downloads": 3
    },
    {
        "path": [
            2015,
            1,
            "releases/2.5.2/couchbase-server-enterprise_2.5.2_x86_64.deb"
        ],
        "num_downloads": 5.379237658536045
    },
    {
        "path": [
            2014,
            12,
            "releases/2.5.2/couchbase-server-enterprise_2.5.2_x86_64.rpm"
        ],
        "num_downloads": 2.9139704821993018
    },
    {
        "path": [
            2015,
            1,
            "releases/2.5.2/couchbase-server-enterprise_2.5.2_x86_64.rpm"
        ],
        "num_downloads": 5.491541031772004
    },
    {
        "path": [
            2014,
            12,
            "releases/2.5.2/couchbase-server-enterprise_2.5.2_x86_64.setup.exe"
        ],
        "num_downloads": 1.7280490792883558
    },
    {
        "path": [
            2015,
            1,
            "releases/2.5.2/couchbase-server-enterprise_2.5.2_x86_64.setup.exe"
        ],
        "num_downloads": 4.997083740026405
    },
    {
        "path": [
            2014,
            12,
            "releases/2.5.2/couchbase-server-enterprise_2.5.2_x86_64_openssl098.deb"
        ],
        "num_downloads": 0.1849381667380579
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.0-beta/couchbase-server_3.0.0-beta-windows_amd64.exe"
        ],
        "num_downloads": 153.16633565978807
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.0-beta/couchbase-server_3.0.0-beta-windows_x86.exe"
        ],
        "num_downloads": 31.787718703527304
    },
    {
        "path": [
            2014,
            9,
            "releases/3.0.0-beta2/couchbase-server_3.0.0-beta2_x86_64.zip"
        ],
        "num_downloads": 5.9706520386241655
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.0-beta2/couchbase-server_3.0.0-beta2_x86_64.zip"
        ],
        "num_downloads": 0.9199787476776407
    },
    {
        "path": [
            2014,
            9,
            "releases/3.0.0-beta2/couchbase-server_3.0.0-beta2_x86_64_centos5.rpm"
        ],
        "num_downloads": 1.1122789795402355
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.0-beta2/couchbase-server_3.0.0-beta2_x86_64_centos5.rpm"
        ],
        "num_downloads": 2.4354188290798966
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.0-beta2/couchbase-server_3.0.0-beta2_x86_64_centos5.rpm"
        ],
        "num_downloads": 2
    },
    {
        "path": [
            2014,
            9,
            "releases/3.0.0-beta2/couchbase-server_3.0.0-beta2_x86_64_centos6.rpm"
        ],
        "num_downloads": 11.52471343417894
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.0-beta2/couchbase-server_3.0.0-beta2_x86_64_centos6.rpm"
        ],
        "num_downloads": 0.040648164445602326
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.0-beta2/couchbase-server_3.0.0-beta2_x86_64_centos6.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            9,
            "releases/3.0.0-beta2/couchbase-server_3.0.0-beta2_x86_64_ubuntu_1004.deb"
        ],
        "num_downloads": 2.8707047112717787
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.0-beta2/couchbase-server_3.0.0-beta2_x86_64_ubuntu_1004.deb"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            9,
            "releases/3.0.0-beta2/couchbase-server_3.0.0-beta2_x86_64_ubuntu_1204.deb"
        ],
        "num_downloads": 23.264543950976496
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.0-beta2/couchbase-server_3.0.0-beta2_x86_64_ubuntu_1204.deb"
        ],
        "num_downloads": 7.948925942866999
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.0-beta2/couchbase-server_3.0.0-beta2_x86_64_ubuntu_1204.deb"
        ],
        "num_downloads": 4.75823234076043
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.0-beta2/couchbase-server_3.0.0-beta2_x86_64_ubuntu_1204.deb"
        ],
        "num_downloads": 1.0188302773482254
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.0/couchbase-server-community-3.0.0-centos5.x86_64.rpm"
        ],
        "num_downloads": 0.3287369595536352
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.0/couchbase-server-community-3.0.0-centos6.x86_64.rpm"
        ],
        "num_downloads": 30.928183343458514
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.0/couchbase-server-community-3.0.0-centos6.x86_64.rpm"
        ],
        "num_downloads": 5.833628865143751
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.0/couchbase-server-community-3.0.0-centos6.x86_64.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.0/couchbase-server-community-3.0.0-centos6.x86_64.rpm"
        ],
        "num_downloads": 4.723515432914094
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.0/couchbase-server-community_3.0.0-debian7_amd64.deb"
        ],
        "num_downloads": 11.018175107332217
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.0/couchbase-server-community_3.0.0-debian7_amd64.deb"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.0/couchbase-server-community_3.0.0-debian7_amd64.deb"
        ],
        "num_downloads": 2
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.0/couchbase-server-community_3.0.0-debian7_amd64.deb"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.0/couchbase-server-community_3.0.0-macos_x86_64.zip"
        ],
        "num_downloads": 26.078097724759086
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.0/couchbase-server-community_3.0.0-macos_x86_64.zip"
        ],
        "num_downloads": 0.05873792185314763
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.0/couchbase-server-community_3.0.0-macos_x86_64.zip"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.0/couchbase-server-community_3.0.0-ubuntu10.04_amd64.deb"
        ],
        "num_downloads": 0.5540236515917578
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.0/couchbase-server-community_3.0.0-ubuntu12.04_amd64.deb"
        ],
        "num_downloads": 73.36802549551105
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.0/couchbase-server-community_3.0.0-ubuntu12.04_amd64.deb"
        ],
        "num_downloads": 6
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.0/couchbase-server-community_3.0.0-ubuntu12.04_amd64.deb"
        ],
        "num_downloads": 18
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.0/couchbase-server-community_3.0.0-ubuntu12.04_amd64.deb"
        ],
        "num_downloads": 8
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.0/couchbase-server-enterprise-3.0.0-centos5.x86_64.rpm"
        ],
        "num_downloads": 3.4380600570521342
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.0/couchbase-server-enterprise-3.0.0-centos6.x86_64.rpm"
        ],
        "num_downloads": 54.264502839111856
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.0/couchbase-server-enterprise-3.0.0-centos6.x86_64.rpm"
        ],
        "num_downloads": 4
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.0/couchbase-server-enterprise-3.0.0-centos6.x86_64.rpm"
        ],
        "num_downloads": 6
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.0/couchbase-server-enterprise_3.0.0-debian7_amd64.deb"
        ],
        "num_downloads": 7.210838182391034
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.0/couchbase-server-enterprise_3.0.0-debian7_amd64.deb"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.0/couchbase-server-enterprise_3.0.0-macos_x86_64.zip"
        ],
        "num_downloads": 176.69256545951757
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.0/couchbase-server-enterprise_3.0.0-macos_x86_64.zip"
        ],
        "num_downloads": 77.57575204025663
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.0/couchbase-server-enterprise_3.0.0-macos_x86_64.zip"
        ],
        "num_downloads": 54.31292402854305
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.0/couchbase-server-enterprise_3.0.0-macos_x86_64.zip"
        ],
        "num_downloads": 32.725798750085936
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.0/couchbase-server-enterprise_3.0.0-ubuntu10.04_amd64.deb"
        ],
        "num_downloads": 0.000007676677713332492
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.0/couchbase-server-enterprise_3.0.0-ubuntu12.04_amd64.deb"
        ],
        "num_downloads": 91.36130744458843
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.0/couchbase-server-enterprise_3.0.0-ubuntu12.04_amd64.deb"
        ],
        "num_downloads": 25.05971253343986
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.0/couchbase-server-enterprise_3.0.0-ubuntu12.04_amd64.deb"
        ],
        "num_downloads": 4.487159905049956
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.0/couchbase-server-enterprise_3.0.0-ubuntu12.04_amd64.deb"
        ],
        "num_downloads": 6.557078415975692
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.1/couchbase-server-community-3.0.1-centos5.x86_64.rpm"
        ],
        "num_downloads": 2.3181508921508858
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.1/couchbase-server-community-3.0.1-centos5.x86_64.rpm"
        ],
        "num_downloads": 5.567065305663761
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.1/couchbase-server-community-3.0.1-centos5.x86_64.rpm"
        ],
        "num_downloads": 1.7930348919569352
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.1/couchbase-server-community-3.0.1-centos6.x86_64.rpm"
        ],
        "num_downloads": 10.016159921064204
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.1/couchbase-server-community-3.0.1-centos6.x86_64.rpm"
        ],
        "num_downloads": 52.46541277281584
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.1/couchbase-server-community-3.0.1-centos6.x86_64.rpm"
        ],
        "num_downloads": 46.3247886662057
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.1/couchbase-server-community-3.0.1-centos6.x86_64.rpm"
        ],
        "num_downloads": 40.172996848635094
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.1/couchbase-server-community_3.0.1-debian7_amd64.deb"
        ],
        "num_downloads": 0.9604843276848687
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.1/couchbase-server-community_3.0.1-debian7_amd64.deb"
        ],
        "num_downloads": 19.63697156712971
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.1/couchbase-server-community_3.0.1-debian7_amd64.deb"
        ],
        "num_downloads": 11.464486714057735
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.1/couchbase-server-community_3.0.1-debian7_amd64.deb"
        ],
        "num_downloads": 21.36946741814285
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.1/couchbase-server-community_3.0.1-macos_x86_64.zip"
        ],
        "num_downloads": 1.1496504612755296
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.1/couchbase-server-community_3.0.1-macos_x86_64.zip"
        ],
        "num_downloads": 34.00081029109855
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.1/couchbase-server-community_3.0.1-macos_x86_64.zip"
        ],
        "num_downloads": 19.198926657030757
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.1/couchbase-server-community_3.0.1-macos_x86_64.zip"
        ],
        "num_downloads": 16.322791517074936
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.1/couchbase-server-community_3.0.1-ubuntu10.04_amd64.deb"
        ],
        "num_downloads": 0.15806110462532394
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.1/couchbase-server-community_3.0.1-ubuntu10.04_amd64.deb"
        ],
        "num_downloads": 1.0615683832576797
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.1/couchbase-server-community_3.0.1-ubuntu12.04_amd64.deb"
        ],
        "num_downloads": 6.265067838168098
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.1/couchbase-server-community_3.0.1-ubuntu12.04_amd64.deb"
        ],
        "num_downloads": 101.07140265306876
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.1/couchbase-server-community_3.0.1-ubuntu12.04_amd64.deb"
        ],
        "num_downloads": 70.21567956387226
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.1/couchbase-server-community_3.0.1-ubuntu12.04_amd64.deb"
        ],
        "num_downloads": 67.7182015248379
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.1/couchbase-server-community_3.0.1-windows_amd64.exe"
        ],
        "num_downloads": 17.917908404869074
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.1/couchbase-server-community_3.0.1-windows_amd64.exe"
        ],
        "num_downloads": 88.57839786212406
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.1/couchbase-server-community_3.0.1-windows_amd64.exe"
        ],
        "num_downloads": 61.86783417473579
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.1/couchbase-server-community_3.0.1-windows_amd64.exe"
        ],
        "num_downloads": 47.62618181374074
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.1/couchbase-server-community_3.0.1-windows_x86.exe"
        ],
        "num_downloads": 3.1835253373345407
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.1/couchbase-server-community_3.0.1-windows_x86.exe"
        ],
        "num_downloads": 16.744265468615307
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.1/couchbase-server-community_3.0.1-windows_x86.exe"
        ],
        "num_downloads": 16.797436171912313
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.1/couchbase-server-community_3.0.1-windows_x86.exe"
        ],
        "num_downloads": 6.2224226428126945
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.1/couchbase-server-enterprise-3.0.1-centos5.x86_64.rpm"
        ],
        "num_downloads": 0.26897641661507804
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.1/couchbase-server-enterprise-3.0.1-centos5.x86_64.rpm"
        ],
        "num_downloads": 2.123289137098813
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.1/couchbase-server-enterprise-3.0.1-centos6.x86_64.rpm"
        ],
        "num_downloads": 12.570922714460242
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.1/couchbase-server-enterprise-3.0.1-centos6.x86_64.rpm"
        ],
        "num_downloads": 76.26846748142214
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.1/couchbase-server-enterprise-3.0.1-centos6.x86_64.rpm"
        ],
        "num_downloads": 43.525210687886215
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.1/couchbase-server-enterprise-3.0.1-centos6.x86_64.rpm"
        ],
        "num_downloads": 4.164463542888961
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.1/couchbase-server-enterprise_3.0.1-debian7_amd64.deb"
        ],
        "num_downloads": 1.0807381861624115
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.1/couchbase-server-enterprise_3.0.1-debian7_amd64.deb"
        ],
        "num_downloads": 9.862243373236696
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.1/couchbase-server-enterprise_3.0.1-debian7_amd64.deb"
        ],
        "num_downloads": 4.151134872473969
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.1/couchbase-server-enterprise_3.0.1-macos_x86_64.zip"
        ],
        "num_downloads": 4.984726338407998
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.1/couchbase-server-enterprise_3.0.1-macos_x86_64.zip"
        ],
        "num_downloads": 29.47145233682548
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.1/couchbase-server-enterprise_3.0.1-macos_x86_64.zip"
        ],
        "num_downloads": 15.266713097365308
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.1/couchbase-server-enterprise_3.0.1-macos_x86_64.zip"
        ],
        "num_downloads": 2
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.1/couchbase-server-enterprise_3.0.1-ubuntu10.04_amd64.deb"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.1/couchbase-server-enterprise_3.0.1-ubuntu12.04_amd64.deb"
        ],
        "num_downloads": 9
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.1/couchbase-server-enterprise_3.0.1-ubuntu12.04_amd64.deb"
        ],
        "num_downloads": 40.593083507111366
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.1/couchbase-server-enterprise_3.0.1-ubuntu12.04_amd64.deb"
        ],
        "num_downloads": 48.672785518031496
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.1/couchbase-server-enterprise_3.0.1-ubuntu12.04_amd64.deb"
        ],
        "num_downloads": 4.732588239280193
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.1/couchbase-server-enterprise_3.0.1-windows_amd64.exe"
        ],
        "num_downloads": 17.431232955021073
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.1/couchbase-server-enterprise_3.0.1-windows_amd64.exe"
        ],
        "num_downloads": 107.30184852326569
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.1/couchbase-server-enterprise_3.0.1-windows_amd64.exe"
        ],
        "num_downloads": 72.46273948000366
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.1/couchbase-server-enterprise_3.0.1-windows_amd64.exe"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2014,
            10,
            "releases/3.0.1/couchbase-server-enterprise_3.0.1-windows_x86.exe"
        ],
        "num_downloads": 3.6789205082025154
    },
    {
        "path": [
            2014,
            11,
            "releases/3.0.1/couchbase-server-enterprise_3.0.1-windows_x86.exe"
        ],
        "num_downloads": 13.690975590638638
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.1/couchbase-server-enterprise_3.0.1-windows_x86.exe"
        ],
        "num_downloads": 7.293613336474004
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.2/couchbase-server-enterprise-3.0.2-centos5.x86_64.rpm"
        ],
        "num_downloads": 1
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.2/couchbase-server-enterprise-3.0.2-centos5.x86_64.rpm"
        ],
        "num_downloads": 3.505024935735135
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.2/couchbase-server-enterprise-3.0.2-centos6.x86_64.rpm"
        ],
        "num_downloads": 32.12061954771213
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.2/couchbase-server-enterprise-3.0.2-centos6.x86_64.rpm"
        ],
        "num_downloads": 83.177661409486
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.2/couchbase-server-enterprise_3.0.2-debian7_amd64.deb"
        ],
        "num_downloads": 9.150505329033992
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.2/couchbase-server-enterprise_3.0.2-debian7_amd64.deb"
        ],
        "num_downloads": 17.693833300309567
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.2/couchbase-server-enterprise_3.0.2-macos_x86_64.zip"
        ],
        "num_downloads": 20.080995632555982
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.2/couchbase-server-enterprise_3.0.2-macos_x86_64.zip"
        ],
        "num_downloads": 35.66994682160304
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.2/couchbase-server-enterprise_3.0.2-ubuntu10.04_amd64.deb"
        ],
        "num_downloads": 0.10973056894369458
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.2/couchbase-server-enterprise_3.0.2-ubuntu10.04_amd64.deb"
        ],
        "num_downloads": 1.445501557084303
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.2/couchbase-server-enterprise_3.0.2-ubuntu12.04_amd64.deb"
        ],
        "num_downloads": 36.66186438562044
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.2/couchbase-server-enterprise_3.0.2-ubuntu12.04_amd64.deb"
        ],
        "num_downloads": 105.58801821534098
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.2/couchbase-server-enterprise_3.0.2-windows_amd64.exe"
        ],
        "num_downloads": 89.66092160488925
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.2/couchbase-server-enterprise_3.0.2-windows_amd64.exe"
        ],
        "num_downloads": 187.40931001711948
    },
    {
        "path": [
            2014,
            12,
            "releases/3.0.2/couchbase-server-enterprise_3.0.2-windows_x86.exe"
        ],
        "num_downloads": 19.774695584029747
    },
    {
        "path": [
            2015,
            1,
            "releases/3.0.2/couchbase-server-enterprise_3.0.2-windows_x86.exe"
        ],
        "num_downloads": 28.868535354624374
    }
];


function displayError(error_message, entry) {
    $('#errors').prepend(error_message + "<br/>");
    console.log(error_message + JSON.stringify(entry));
}


/**
 * Convert an array of responses from the app on the server into
 * something graphable.
 *
 * @param input an array in the format from the view on the server
 */
function get_chart_data(input) {
    if (!Array.isArray(input)) {
        console.log("ERROR: chart data malformed");
        return {};
    }

    var labels = [];
    var datasets = [];
    var dict_product_dataarr = {};
    var offset;

    input.map(function(entry) {

        offset = entry.path.length - 1;

        if (entry.path.length == 4){
            labels.push(entry.path[0]+"-"+entry.path[1]+"-"+entry.path[2]);
        } else if (entry.path.length == 3) {
            labels.push(entry.path[0]+"-"+entry.path[1]);
        } else {
            displayError("ERROR: chart data input did not have the correct format\r\n", entry);
        }

    });

    labels = _.sortBy(_.uniq(labels), function(item) {return item;});

    input.map(function(entry) {
        if (typeof dict_product_dataarr[entry.path[offset]] === "undefined") {
            dict_product_dataarr[entry.path[offset]] = {
                label: entry.path[offset],
                data: [entry.num_downloads]
            };
            //console.log("which becomes this entry: " + JSON.stringify(dict_product_dataarr[entry.path[3]]));
        } else { // was created earlier, so just push on more stuff
            dict_product_dataarr[entry.path[offset]].data.push(entry.num_downloads);
        }
    });


    for(var oneprop in dict_product_dataarr) {
        if (dict_product_dataarr.hasOwnProperty(oneprop)) {
            var entryColor = genColor(oneprop);
            //var new_entry =
            var new_entry = {
                label: oneprop,
                fillColor: entryColor,
                strokeColor: entryColor,
                data: dict_product_dataarr[oneprop].data
            };
            datasets.push(new_entry);
        }
    }

    return {
        labels: labels,
        datasets: datasets
    };
}


/**
 * Convert an array of responses from the app on the server into
 * something graphable.
 *
 * @param input an array in the format from the view on the server
 */
function get_chart_data2(input) {
    if (!Array.isArray(input)) {
        console.log("ERROR: chart data malformed");
        return {};
    }

    // Idea is to first create a var that has the labels and what we'd put in them unformatted, then
    // later format the labels and add the data.

    var labels = [];
    var datasets = [];
    var dict_product_dataarr = {};
    var offset;
    var dict_chart_datapoints = {};
    var dict_prod_download_by_concat = {};


    //console.log("working with input " + JSON.stringify(input) + "\r\n\r\n");
    input.map(function(entry) {

        // later we'll need this for extracting the data for the array
        // TODO: add to support day
        var zero_padded_month = "0" + entry.path[1];
        zero_padded_month = zero_padded_month.substr(zero_padded_month.length-2);
        dict_prod_download_by_concat[entry.path[0]+"-"+zero_padded_month+":"+entry.path[2]] = entry.num_downloads;

        offset = entry.path.length - 1;

        if (entry.path.length == 4) { /* month year day */
            //ent_to_populate = dict_chart_datapoints[[entry.path[0],entry.path[1], entry.path[2]]];
            var new_item_dl = {
                item: entry.path[offset],
                dl_num: entry.num_downloads };

            if (typeof dict_chart_datapoints[[entry.path[0],entry.path[1], entry.path[2]]] === "undefined") {
                // add new entry
                dict_chart_datapoints[[entry.path[0],entry.path[1], entry.path[2]]] = [new_item_dl];
            } else {
                // created earlier, so just add on
                dict_chart_datapoints[[entry.path[0],entry.path[1], entry.path[2]]].push(new_item_dl);
            }

        } else if (entry.path.length == 3) { /* month year */
            //ent_to_populate = dict_chart_datapoints[[entry.path[0],entry.path[1], entry.path[2]]];

            var new_item_dl = {
                item: entry.path[offset],
                dl_num: entry.num_downloads };

            var key = entry.path[0] + "-" + zero_padded_month;
            if (typeof dict_chart_datapoints[key] === "undefined") {
                // add new entry
                dict_chart_datapoints[key] = [new_item_dl];
            } else {
                // created earlier, so just add on
                dict_chart_datapoints[key].push(new_item_dl);
            }

        } else {
            displayError("ERROR: chart data input did not have the correct format\r\n", entry);
        }

        //console.log("Currently the dict is: \r\n" + JSON.stringify(dict_chart_datapoints));
    });

    //console.log("new thingie: " + JSON.stringify (dict_chart_datapoints));

    // now, iterate over dict_chart_datapoints and create labels
    for(var date_period in dict_chart_datapoints) {
        if (dict_chart_datapoints.hasOwnProperty(date_period)) {

            labels.push(date_period);

            //var entryColor = genColor(oneprop);
            ////var new_entry =
            //var new_entry = {
            //    label: oneprop,
            //    fillColor: entryColor,
            //    strokeColor: entryColor,
            //    data: dict_product_dataarr[oneprop].data
            //};
            //datasets.push(new_entry);
        }
    }
    // sort the labels
    labels = _.sortBy(labels, function(item) {return item;});

    ////second iteration, populate with data
    //for (var i = 0; i< labels.length; i++) {
    //    var entries = dict_chart_datapoints[labels[i]];
    //    entries = _.sortBy(entries, function(itervar) {return itervar.item;});
    //    entries.map(function (one_entry) {
    //        var entryColor = genColor(one_entry.item);
    //        // fill with empty data arrays first
    //        var new_entry = {
    //            label: one_entry.item,
    //            data: [],
    //            fillColor: entryColor,
    //            strokeColor: entryColor
    //        };
    //
    //
    //        if (typeof dict_product_dataarr[labels[i]] === "undefined") {
    //            dict_product_dataarr[labels[i]] = [new_entry];
    //        } else {
    //            dict_product_dataarr[labels[i]].push(new_entry);
    //        }
    //    });
    //    datasets.push(dict_product_dataarr[labels[i]]);
    //}

    // create a dict with all of our products
    for (var i = 0; i< labels.length; i++) {
        var entries = dict_chart_datapoints[labels[i]];
        entries = _.sortBy(entries, function(itervar) {return itervar.item;});
        entries.map(function (one_entry) {
            var entryColor = genColor(one_entry.item);
            dict_product_dataarr[one_entry.item] = {
                label: one_entry.item,
                data: [],
                fillColor: entryColor,
                strokeColor: entryColor
            }
        });
    }

    //console.log("thing I'll populate is " + JSON.stringify(dict_product_dataarr));


    // and then populate the data arrays by iterating again with the labels
    for (var i = 0; i< labels.length; i++) {

        // split on the dash, then iterate for something like this:
        // {"path":[2014,12,"releases/3.0.2/couchbase-server-enterprise_3.0.2-windows_amd64.exe"],"num_downloads":89.66092160488925}
        // to populate the data fields

        // TODO: day support

        _.map(dict_product_dataarr, function (item, key) {
            var concat_key = labels[i] + ":" + key; // 2nd label here is the one for the chart data
            var new_element = dict_prod_download_by_concat[concat_key];
            if (typeof new_element === "undefined") {
                item.data.push(0);
            } else {
                item.data.push(Math.round(new_element));
            }
        })

    }

    var dl_threshold = $("#dl_filter").val();
    _.map(dict_product_dataarr, function (item, key) {
        var total_dl = 0;
        for (i=0;i<item.data.length;i++) {
            total_dl += item.data[i];
        }
        if (total_dl > dl_threshold) {
            datasets.push(item);
        }
    });

    var graph_data = {
        labels: labels,
        datasets: datasets
    };

    //console.log("Final graph data: " + JSON.stringify(graph_data));

    return graph_data;
}



function genColor(str) {
    /* courtesy http://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript */
    // str to hash
    for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));

    // int/hash to hex
    for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));

    return colour;
}

var ctx = $("#overview").get(0).getContext("2d");
ctx.translate(0.5, 0.5);



//console.log("After formatting with get_chart_data: \r\n" + JSON.stringify(get_chart_data(input_data)));
var serverData;


/**
 * Function to aggregate server data along CE and EE lines.
 *
 * Input is serverData, output is an aggregated format similar enough to serverData that the chart can render it.
 *
 * @param serverData
 * @returns {*}
 */
var aggr_ce_ee = function (serverData) {
    var aggrRes = serverData;
    //var tail_re = /.*\/(.*)$/;
    // releases/3.0.2/couchbase-server-enterprise_3.0.2-windows_x86.exe
    //var ce_ee_re = /(.*)\/(.*)\/(.*)_(.*)_(.*)/;
    //var test_re = /(.*)_(.*)_(.*)/;
    var ce_ee_re = /.*couchbase-server-(.*)_(.*)_(.*)/;

    var num_ce = 0;
    var num_ee = 0;
    var num_other = 0;

    var dict_res_to_fmt;

    // if CE and EE are grouped
    _.map(serverData, function (item) {
        console.log("aggregating item is: " + JSON.stringify(item));
        var re_results = ce_ee_re.exec(item.path[2]);
        //console.log(JSON.stringify(re_results));
        if (re_results != null &&
            re_results.constructor === Array) {
            switch (re_results[1]) {
                case "community" :
                    num_ce = num_ce + item.num_downloads;
                case "enterprise" :
                    num_ee = num_ee + item.num_downloads;
                default:
                    num_other = num_other + item.num_downloads;
            }
        }
    });

    // get output in this format:
    // [{"path":[2015,2,"releases/1.8.0/couchbase-server-community_x86_1.8.0.deb"],"num_downloads":0.000939510141758716},{"path":[2014,12,"releases/1.8.0/couchbase-server-community_x86_1.8.0.setup.exe"],"num_downloads":0.4403376607566907}

    return aggrRes;
};

function n_u_to_zero(varToCheck) {
    if (typeof varToCheck == 'undefined' || varToCheck == null)
      return 0;
    else
      return varToCheck;
}

/**
 * Function to aggregate server data along versions.
 *
 * Input is serverData, output is an aggregated format similar enough to serverData that the chart can render it.
 *
 * @param serverData
 * @returns {*}
 */
var aggr_version = function (dataToAggregate) {
    var dlobj_re = /.*couchbase-server-.*(\d\.)(\d\.)(\d).*/;

    var dict_res_to_fmt = {};
    var arr_res_fmtd = [];

    // aggregate by the version RE outlined above
    _.map(dataToAggregate, function (item) {
        var re_results = dlobj_re.exec(item.path[2]);
        if (re_results == null) {
            console.log("Error, could not re match version string in " + item.path[2]);
            return;
        }
        var date_ver_key = new Array([item.path[0],item.path[1],re_results[1]]);
        dict_res_to_fmt[date_ver_key] = n_u_to_zero(dict_res_to_fmt[date_ver_key]) + item.num_downloads;
    });

    for (var prop in dict_res_to_fmt) {
        var elements = prop.split(",");
        var path_to_insert = { path: new Array(parseInt(elements[0]), parseInt(elements[1]), elements[2] + "x.x"),
            num_downloads: dict_res_to_fmt[prop]};
        arr_res_fmtd.push(path_to_insert);

    }

    // get output in this format:
    // [{"path":[2015,2,"releases/1.8.0/couchbase-server-community_x86_1.8.0.deb"],"num_downloads":0.000939510141758716},{"path":[2014,12,"releases/1.8.0/couchbase-server-community_x86_1.8.0.setup.exe"],"num_downloads":0.4403376607566907}

    return arr_res_fmtd;
};

/**
 * Function to aggregate server data for windows platforms.
 *
 * Input is serverData, output is an aggregated format similar enough to serverData that the chart can render it.
 *
 * @param serverData
 * @returns {*}
 */
var aggr_win_plat = function (dataToAggregate) {
    var dlobj_re = /.*couchbase-server-.*(\d\.)(\d\.)(\d).*\_.*.exe/;

    var dict_res_to_fmt = {};
    var arr_res_fmtd = [];

    //releases/3.0.1/couchbase-server-community_3.0.1-windows_amd64.exe
    //releases/3.0.1/couchbase-server-community_3.0.1-windows_x86.exe
    //releases/2.0.1/couchbase-server-community_x86_64_2.0.1.setup.exe   <<< AARRRGHHH!  works with this: /.*couchbase-server-.*(\d\.)(\d\.)(\d).*[\.|_](?:setup)?.exe/
    //releases/2.2.0/couchbase-server-community_2.2.0_x86_64.setup.exe
    //releases/2.2.0/couchbase-server-community_2.2.0_x86.setup.exe
    //releases/2.5.1/couchbase-server-enterprise_2.5.1_x86.setup.exe
    //releases/2.5.0/couchbase-server-enterprise_2.5.0_x86_64.setup.exe
    // https://regex101.com/r/gD5zT1/1

    // aggregate by the version RE outlined above
    _.map(dataToAggregate, function (item) {
        var re_results = dlobj_re.exec(item.path[2]);
        if (re_results == null) {
            console.log("Error, could not re match version string in " + item.path[2]);
            return;
        }

        var arch = "x86";
        if (item.path[2].includes("64")) {
            arch = "x86_64";
        }

        var date_ver_key = new Array([item.path[0],item.path[1],arch]);
        dict_res_to_fmt[date_ver_key] = n_u_to_zero(dict_res_to_fmt[date_ver_key]) + item.num_downloads;
    });

    for (var prop in dict_res_to_fmt) {
        var elements = prop.split(",");
        var path_to_insert = { path: new Array(parseInt(elements[0]), parseInt(elements[1]), elements[2]),
            num_downloads: dict_res_to_fmt[prop]};
        arr_res_fmtd.push(path_to_insert);

    }

    // get output in this format:
    // [{"path":[2015,2,"releases/1.8.0/couchbase-server-community_x86_1.8.0.deb"],"num_downloads":0.000939510141758716},{"path":[2014,12,"releases/1.8.0/couchbase-server-community_x86_1.8.0.setup.exe"],"num_downloads":0.4403376607566907}

    console.log("win-plat aggr results" + JSON.stringify(arr_res_fmtd));
    return arr_res_fmtd;
};


var overviewChartOptions = {
    legendTemplate : '<ol id=\"overview-legend\">'
    +'<% for (var i=0; i<datasets.length; i++) { %>'
    +'<li>'
    +'<span style=\"background-color:<%=datasets[i].fillColor%>\">'
    +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
    +'</span> '
    +'<% if (datasets[i].label) { %><%= datasets[i].label %><% } %>'
    +'</li>'
    +'<% } %>'
    +'</ol>'
};

var overviewBarChart = null;
function post_fetch_render() {

    // regular overview
    $('#overview').attr({width:CHART_WIDTH,height:CHART_HEIGHT}).css({width:'750px',height:'400px'});
    //var chartData = get_chart_data(serverData);
    var newChartData = get_chart_data2(serverData);
    var canvas = $('overview');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //console.log("old chart data\r\n" + JSON.stringify(chartData) + "\r\n\r\n new chart data\r\n" + JSON.stringify(newChartData) + "\r\n");
    //console.log("new chart data\r\n" + JSON.stringify(newChartData) + "\r\n");
    ctx.translate(0.5, 0.5);
    if (overviewBarChart) {
        overviewBarChart.destroy();
    }
    overviewBarChart = new Chart(ctx).Bar(newChartData, overviewChartOptions);
    var legend = overviewBarChart.generateLegend();
    $('#overview-legend').replaceWith(legend);
}


var fourOhChartOptions = {
    legendTemplate : '<ol id=\"40-overview-legend\">'
    +'<% for (var i=0; i<datasets.length; i++) { %>'
    +'<li>'
    +'<span style=\"background-color:<%=datasets[i].fillColor%>\">'
    +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
    +'</span> '
    +'<% if (datasets[i].label) { %><%= datasets[i].label %><% } %>'
    +'</li>'
    +'<% } %>'
    +'</ol>'
};

var fourOhOverviewBarChart = null;
var fourOhCtx = $("#40-overview").get(0).getContext("2d");
fourOhCtx.translate(0.5, 0.5);
function render_40_downloads(data) {
    //4.0 current
    $('#40-overview').attr({width:CHART_WIDTH,height:CHART_HEIGHT}).css({width:'750px',height:'400px'});
    //var chartData = get_chart_data(serverData);
    var fourOhCanvas = $('40-overview');
    fourOhCtx.clearRect(0, 0, fourOhCanvas.width, fourOhCanvas.height);
    fourOhCtx.translate(0.5, 0.5);
    if (fourOhOverviewBarChart) {
        fourOhOverviewBarChart.destroy();
    }
    fourOhOverviewBarChart = new Chart(fourOhCtx).Bar(data, fourOhChartOptions);
    var fourOhLegend = fourOhOverviewBarChart.generateLegend();
    $('#40-overview-legend').replaceWith(fourOhLegend);
}


var byversionChartOptions = {
    legendTemplate : '<ol id=\"byversion-legend\">'
    +'<% for (var i=0; i<datasets.length; i++) { %>'
    +'<li>'
    +'<% if (datasets[i].label) { %><%= datasets[i].label %><% } %>'
    +' <span style=\"background-color:<%=datasets[i].fillColor%>\">'
    +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
    +'</span>'
    +'</li>'
    +'<% } %>'
    +'</ol>'
};

var versionBarChart = null;
var verctx = $("#byversion").get(0).getContext("2d");
verctx.translate(0.5, 0.5);
function render_version_chart(data) {
    $('#byversion').attr({width:CHART_WIDTH,height:CHART_HEIGHT}).css({width:'750px',height:'400px'});
    var newChartData = get_chart_data2(data);
    var canvas = $('byversion');
    verctx.clearRect(0, 0, canvas.width, canvas.height);
    verctx.translate(0.5, 0.5);
    if (versionBarChart) {
        versionBarChart.destroy();
    }
    versionBarChart = new Chart(verctx).Bar(newChartData, byversionChartOptions);
    var legend = versionBarChart.generateLegend();
    $('#byversion-legend').replaceWith(legend);
}


var winPlatChartOptions = {
    legendTemplate : '<ol id=\"win-plat-legend\">'
    +'<% for (var i=0; i<datasets.length; i++) { %>'
    +'<li>'
    +'<% if (datasets[i].label) { %><%= datasets[i].label %><% } %>'
    +' <span style=\"background-color:<%=datasets[i].fillColor%>\">'
    +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
    +'</span>'
    +'</li>'
    +'<% } %>'
    +'</ol>'
};

var winPlatBarChart = null;
var winplatctx = $("#win-plat").get(0).getContext("2d");
winplatctx.translate(0.5, 0.5);
function render_win_plat_chart(data) {
    $('#win-plat').attr({width:CHART_WIDTH,height:CHART_HEIGHT}).css({width:'750px',height:'400px'});
    var newChartData = get_chart_data2(data);
    var canvas = $('win-plat');
    winplatctx.clearRect(0, 0, canvas.width, canvas.height);
    winplatctx.translate(0.5, 0.5);
    if (winPlatBarChart) {
        winPlatBarChart.destroy();
    }
    winPlatBarChart = new Chart(winplatctx).Bar(newChartData, winPlatChartOptions);
    var legend = winPlatBarChart.generateLegend();
    $('#win-plat-legend').replaceWith(legend);
}


//when really running, use this
$.getJSON(get_query_string(), {}, function(data){
    serverData = data;
    post_fetch_render();
});

// rerender from here
function get_query_string() {
    return "/downloads/server?start_range=" +
        encodeURIComponent("[" + ($("#start_date").val() + "]")) + "&end_range=" +
        encodeURIComponent("[" + ($("#end_date").val()) + "]");
}
$("#update").bind( "click", function() {
    var request_string = get_query_string();
    $.getJSON(request_string, {}, function(data){
        serverData = data;
        var versionAggregatedData = aggr_version(serverData);
        console.log("results from aggregation: " + JSON.stringify(versionAggregatedData));
        render_version_chart(versionAggregatedData);
        post_fetch_render();

        //console.log("unaggregated: " + JSON.stringify(serverData) + "\r\n\r\naggregated: " + JSON.stringify(versionAggregatedData));

    });
    //console.log("request_string is: " + request_string);
});

$("#aggr_ce_ee li").children().bind("click", function(jq_event) {
    alert(JSON.stringify(jq_event.target.id));
    //jq_event.target.addClass("active");
});

//when really running, use this
$.getJSON(get_query_string(), {}, function(data){
    serverData = data;
    post_fetch_render();
    render_version_chart(aggr_version(serverData));
    render_win_plat_chart(aggr_win_plat(serverData));
});

// use this if offline
//serverData = more_input_data;
//post_fetch_render();


