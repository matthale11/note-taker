const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const uniqid = require("uniqid");

// Create port with option for Heroku
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve css file to client
app.use(express.static(path.join(__dirname, "public")));

// HTML routing
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

// API route for retrieving notes from db.json
app.get("/api/notes", (req, res) => {
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

// API route for saving notes to db.json
app.post("/api/notes", (req, res) => {
  // get an array back from the db
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    const oldNotes = JSON.parse(data);
    const newNote = req.body;
    newNote.id = uniqid();
    // add new note to the existing array
    oldNotes.push(newNote);
    fs.writeFile("db/db.json", JSON.stringify(oldNotes), (err) => {
      if (err) throw err;
      res.sendStatus(200);
    });
  });
});

// API route deleting notes from db.json
app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    const noteArray = JSON.parse(data);
    const idNumber = req.params.id;
    const filterArray = noteArray.filter((note) => note.id !== idNumber);

    fs.writeFile("db/db.json", JSON.stringify(filterArray), (err) => {
      if (err) throw err;
      res.sendStatus(200);
    });
  });
});

// Create listener for the port
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
