process.env.MONGO_URL = "mongodb://localhost:27017/addressDb1"
let db = require("./src/db");
let app = require("./src/app");
let port = process.env.PORT || 3000;


let server = app.listen(port, function () {
  console.log("Express server listening on port " + port);
});
