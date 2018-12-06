const Quest = require('./questModel');

module.exports = {
 
  // Create and Save a new Quest
  create: function(req, res) {
    
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
      console.log('add success')
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
    Quest.findById(req.params.id, 'questID pokestopID', function (error, quest) {
      if (error) { console.error(error); }
      res.send(quest)
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
        res.send({
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
      res.send({
        success: true,
        message: "Quest deleted",
        data: quest
      })
    })
  },
  
}
