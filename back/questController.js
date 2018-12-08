const Quest = require('./questModel');

module.exports = {
 
  // Create and Save a new Quest
  create: function(req, res) {
    var questID = req.body.questID;
    var pokestopID = req.body.pokestopID;
    
    var new_quest = new Quest({
      questID: questID,
      pokestopID: pokestopID
    })
    
    new_quest.save(function (error) {
      if (error) {
        console.log("ERRORE",error)
      }
      res.send({
        success: true,
        message: "Quest added",
        data: new_quest
      })
    })
  },
  
  // Retrieve and return all quests from the database.
  findAll: function(req, res) {
    Quest.find({}, 'questID pokestopID', function (error, quests) {
      if (error) { console.error(error); }
      res.send({quests})
    }).sort({_id:-1})
  },
  
  // Find a single Quest with a QuestId
  findOne: function(req, res) {
    var db = req.db;
    Quest.find({"questID" : req.params.id }, 'questID pokestopID', function (error, quest) {
      if (error) { console.error(error); }
      res.send(quest)
    })
  },
  
  // Update a quest identified by the questId in the request
  update: function(req, res) {
    var questID = req.body.questID;
    var pokestopID = req.body.pokestopID;
    Quest.findOneAndUpdate({"pokestopID" : pokestopID }, { "questID" : questID }, function (error, quest) {
      if (error) { console.error(error); }
      else{
        res.send({
          success: true,
          message: 'Quest updated',
          data: quest
        })
      }
    })
  },
  
  // Delete a quest with the specified questId in the request
  delete: function(req, res) {
    var db = req.db;
    Quest.remove({
      pokestopID: req.params.id
    }, function(err, quest){
      if (err)
      console.log(err)
      res.send({
        success: true,
        message: "Quest deleted",
        data: quest
      })
    })
  },

  deleteAll: function(req,res) {
    Quest.remove({}, function(err, quest){
      if (err)
      console.log(err)
      res.send({
        success: true,
        message: "Quests deleted",
        data: quest
      })
    })
  }
  
}
