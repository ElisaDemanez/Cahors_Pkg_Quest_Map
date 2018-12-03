var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var QuestSchema = new Schema({
  id_work: String,
  id_temp: String
});

var Quest = mongoose.model("Quest", QuestSchema);
module.exports = Quest;
