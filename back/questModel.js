var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var QuestSchema = new Schema({
  questID: Number,
  pokestopID: Number
});

var Quest = mongoose.model("Quest", QuestSchema);
module.exports = Quest;
