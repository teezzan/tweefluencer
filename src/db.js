var mongoose = require("mongoose");
let MONGO_URL = "mongodb://localhost:27017/isolate"
mongoose.connect(
  MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log("Failed to Connect");
    }
    else {
      console.log("Connection Successful ");
    }
  }
);
