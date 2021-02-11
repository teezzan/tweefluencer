var mongoose = require("mongoose");
let MONGO_URL = process.env.MONGO_URL
mongoose.connect(
  MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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
