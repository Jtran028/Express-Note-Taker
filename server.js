// Import Dependencies
const express = require('express');
const path = require("path");
const fs = require("fs");
const uuidv1 = require('uuid/v1');

// Initiate Express and Setup Port
const app = express();
const PORT = process.env.PORT || 3001;

// middleware
// parse JSON data
app.use(express.json());
// parse URLENCONDED data
app.use(express.urlencoded({ extended: true }));
// serves files from static public folder
app.use(express.static('public'));

// mounts route to retrieve all notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});


app.get("/api/notes", (req, res) => {
    // Read the existing notes from the "db.json" file
    fs.readFile("./db/db.json", (err, data) => {
      if (err) throw err;
      // Return the list of notes as a JSON object
      res.json(JSON.parse(data));
    });
  });


app.post("/api/notes", (req, res) => {
    // Get the new note from the request body
    const newNote = req.body;
    // Assign the new note an id
    newNote.id = uuidv1();
    // Read the existing notes from the "db.json" file
    fs.readFile("./db/db.json", (err, data) => {
      if (err) throw err;
      let notes = JSON.parse(data);
      // Add the new note to the list of existing notes
      notes.push(newNote);
      // Write the updated list of notes to the "db.json" file
      fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
        if (err) throw err;
        res.status(200).end();
      });
    });
  });
  

  app.delete("/api/notes/:id", (req, res) => {
    // Read the existing notes from the "db.json" file
    fs.readFile("./db/db.json", (err, data) => {
      if (err) throw err;
      // Parse the list of notes from the file
      let notes = JSON.parse(data);
      // Find the index of the note with the specified id
      const index = notes.findIndex(note => note.id === req.params.id);
      // Remove the note with the specified id from the list of notes
      notes.splice(index, 1);
      // Write the updated list of notes to the "db.json" file
      fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
        if (err) throw err;
        res.status(200).end();
      });
    });
  });

// WILDCARD ROUTE BRINGS USER BACK TO HOME PAGE
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));