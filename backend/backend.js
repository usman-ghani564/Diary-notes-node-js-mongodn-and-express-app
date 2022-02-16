const express = require("express");
const app = express();

const PORT = 3000;

const database = require("../db/conn.js");

database.connectToMongoDb();

app.get("/api/notes", (request, response) => {
  
  //This was used to add the initial data to the database
  //database
  //.insertNotes();
    
  database
    .fetchNotes()
    .then((data) => {
      response.send(data);
    })
    .catch(() => {
      console.log("Error occured in get request!");
    });
    //response.send('Inserted!');
});


app.put("/api/notes", (request, response) => {
    database
    .fetchNotes()
    .then((data) => {
      response.send(data);
    })
    .catch(() => {
      console.log("Error occured in get request!");
    });
});


app.get("/api/notes/important", (request, response) => {
  database
    .getImportantNotes().then((data)=>{
        response.send(data);
    });
});


app.get("/api/notes/recent", (request, response) => {
  database
    .getTopThreeRecentNotes().then((data)=>{
        response.send(data);
    });
});


app.get("/api/notes/note/:id", (request, response) => {
  database
    .getNoteByTitle(request.body.title).then((data)=>{
        response.send(data);
    });
});

app.put("/api/notes/note/:id", (request, response) => {
  database
    .updateNoteByTitle(request.body.title, request.body.body, request.body.important).then((data)=>{
        response.send(data);
    });
});

app.delete("/api/notes/note/:id", (request, response) => {
  database
    .deleteNoteByTitle(request.body.title).then((data)=>{
        response.send(data);
    });
});


app.listen(PORT, () => {
  console.log("Successfully started server at: " + PORT);
});
