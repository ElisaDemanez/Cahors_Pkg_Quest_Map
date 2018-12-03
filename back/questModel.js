var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var QuestSchema = new Schema({
  name: String,
  pokestop: String
});

var Quest = mongoose.model("Quest", QuestSchema);
module.exports = Quest;
