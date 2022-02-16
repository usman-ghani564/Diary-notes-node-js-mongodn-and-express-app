const connection_string = "mongodb+srv://mansi:Abc12345@diary.xca4z.mongodb.net/diary?retryWrites=true&w=majorityv.mongodb.net/diary?retryWrites=true&w=majority;"
const mongoose = require("mongoose");


//This is the initial data which is to be pushed to the database
var data = [
  {
    "dateCreated":Date(2021, 12, 28, 20, 44, 21, 0),
    "important":false,
    "title":"First note",
    "body":"First note entered after switching back to Date type",
  },
  {
    "dateCreated":Date(2019, 01, 14, 20, 44, 21, 0),
    "important": true,
    "title": "First Note",
    "body": "This is the first note created",
  },
  {
    "dateCreated":Date(2019, 02, 06, 20, 44, 21, 0),
    "important": false,
    "title": "Second Note",
    "body": "This is the second note created",
  },
  {
    "dateCreated":Date(2019, 05, 15, 20, 44, 21, 0),
    "important": false,
    "title": "Third Note",
    "body": "This is the third note created",
  },
  {
    "dateCreated":Date(2020, 08, 31, 20, 44, 21, 0),
    "important": true,
    "title": "Welcome Note",
    "body": "Welcome, in this website you can add notes and prioritize them based on your needs. You can add a title, date created and how important the note is to you. You can also edit and delete old note, and add now notes",
  },
  {
    "dateCreated":Date(2021, 12, 29, 20, 44, 21, 0),
    "important": false,
    "title": "Future Note",
    "body": "This is the first note entered through mongoose",
  },
]

//Create a mongodb schema
var Schema = mongoose.Schema;

//Schema will hold title, body, date created and important
var ModelSchema = new Schema({
  title: {
    type: String, 
    unique: true, 
    required:true,
  },
  body: {
    type: String, 
    required: true
  },
  dateCreated: {
    type: Date, 
    default: Date()
  },
  important: {
    type: Boolean, 
    default: false
  }
},{collection: "notes"});

// Compile model from schema
var noteModel = mongoose.model('SchemaModel', ModelSchema );

//This function will contect to the database
const connectToMongoDb = () => {
  mongoose.connect(
    connection_string,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (!err) {
        console.log("Connection to the database is successful");
      } else {
        console.log("An error occured while connecting to the database");
      }
    }
  );
};

//This function will insert the initial data using insertMany function
const insertNotes = () => {
  var notes = data.map((note) => {
    return noteModel({
      title: note.title,
      important: note.important,
      dateCreated: note.dateCreated,
      body: note.body,
    });
  });

  noteModel.insertMany(notes).then(function(){
    console.log("Data inserted")  // Success
}).catch(function(error){
    console.log(error)      // Failure
});;
};


//This function will fetch all the notes in the database
const fetchNotes = () => {
  return new Promise((resolve, reject) => {
    noteModel
    .find()
    .then((data) => {
      resolve(data);
    })
    .catch((err) => {
      console.log("An error occured while fetching data from database!");
    });
  });
};


//This function will post a note to the database given the title, body and important
const posthNote = (title, important, body) => {
  return new Promise((resolve, reject) => {
    noteModel
    .insertOne({
      title: title,
      important: important,
      dateCreated: Date(),
      body: body,
    })
    .then((data) => {
      resolve(data);
    })
    .catch((err) => {
      console.log("An error occured while fetching data from database!");
    });
  });
};

//This function will get all the important notes
const getImportantNotes = () => {  
  return new Promise((resolve, reject) => {
    noteModel
    .find( { important: true } )
    .then((data) => {
      resolve(data);
    })
    .catch((err) => {
      console.log("An error occured while fetching data from database!");
    });
  });
};


//This function will get all the recent notes
const getTopThreeRecentNotes = () => {  
  return new Promise((resolve, reject) => {
    noteModel
    .find()
    .then((a) => {
      sorted = a.sort(function(a,b){
        return new Date(a.plantingDate) - new Date(b.plantingDate)
      });
      topThreeList = [];
      for(i = 0; i < 3; i++){
        topThreeList.push(sorted[i]);
      }
      resolve(topThreeList);
    })
    .catch((err) => {
      console.log("An error occured while fetching data from database!");
    });
  });
};


//This function will get the note by title. Basicaly it will be used when id get method is called
const getNoteByTitle = (title) => {  
  return new Promise((resolve, reject) => {
    noteModel
    .find({title: title})
    .then((data) => {
      resolve(data);
    })
    .catch((err) => {
      console.log("An error occured while fetching data from database!");
    });
  });
};

//This function will update the note by title. Basicaly it will be used when id get method is called
const updateNoteByTitle = (title = "", body = "", important = false) => {  
  return new Promise((resolve, reject) => {
    noteModel
    .updateOne({title: title},
      {
        $set: {
          title: title,
          body: body,
          important: important
        }
    })
    .then((data) => {
      resolve(data);
    })
    .catch((err) => {
      console.log("An error occured while fetching data from database!");
    });
  });
};


//This function will delete the note by title. Basicaly it will be used when id get method is called
const deleteNoteByTitle = (title = "") => {  
  return new Promise((resolve, reject) => {
    noteModel
    .deleteOne({title: title})
    .then((data) => {
      resolve(data);
    })
    .catch((err) => {
      console.log("An error occured while fetching data from database!");
    });
  });
};

module.exports.connectToMongoDb = connectToMongoDb;
module.exports.fetchNotes = fetchNotes;
module.exports.posthNote = posthNote;
module.exports.insertNotes = insertNotes;
module.exports.getImportantNotes = getImportantNotes;
module.exports.getTopThreeRecentNotes = getTopThreeRecentNotes;
module.exports.getNoteByTitle = getNoteByTitle;
module.exports.updateNoteByTitle = updateNoteByTitle;
module.exports.deleteNoteByTitle = deleteNoteByTitle;

