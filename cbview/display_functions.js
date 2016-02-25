// Define JSON File
var fs = require("fs");
// Get content from file
var contents = fs.readFileSync("analytics.json");
// Define to JSON type
var jsonContent = JSON.parse(contents);
// Get Value from JSON
console.log("httpopcounts:", jsonContent.views.httpopcounts.map);
