const Quest = require('./questModel');

module.exports = {
  test: function(req,res){
    console.log("test")
  },
  // Create and Save a new Quest
  create: function(req, res) {
    
    var db = req.db;
    console.log("controler",req)
    var questID = req.questID;
    var pokestopID = req.pokestopID;
    
    var new_quest = new Quest({
      questID: questID,
      pokestopID: pokestopID
    })
    
    new_quest.save(function (error) {
      if (error) {
        console.log("ERRORE",error)
      }
      console.log({
        success: true,
        message: 'Quest saved successfully!',
        data: new_quest
      })
    })
  },
  
  // Retrieve and return all quests from the database.
  findAll: function(req, res) {
    Quest.find({}, 'questID pokestopID', function (error, quests) {
      if (error) { console.error(error); }
      console.log({
        quests: quests
      })
    }).sort({_id:-1})
  },
  
  // Find a single Quest with a QuestId
  findOne: function(req, res) {
    var db = req.db;
    Quest.findById(req.params.id, 'questID pokestopID', function (error, quest) {
      if (error) { console.error(error); }
      console.log(quest)
    })
  },
  
  // Update a quest identified by the questId in the request
  update: function(req, res) {
    var db = req.db;
    Quest.findById(req.params.id, 'questID pokestopID ', function (error, quest) {
      if (error) { console.error(error); }
      
      quest.name = req.body.name;
      quest.pokestop = req.body.pokestop;
      quest.save(function (error) {
        if (error) {
          console.log(error)
        }
        console.log({
          success: true,
          message: 'Quest updated',
          data: quest
        })
      })
    })
  },
  
  // Delete a quest with the specified questId in the request
  delete: function(req, res) {
    var db = req.db;
    Quest.remove({
      _id: req.params.id
    }, function(err, quest){
      if (err)
      console.log(err)
      console.log({
        success: true,
        message: "Quest deleted",
        data: quest
      })
    })
  },
  
}
