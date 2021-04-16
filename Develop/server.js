const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

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
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

// API routing for get, post, and delete
app.get("/api/notes", (req, res) => {
    fs.readFile("db/db.json", (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data))
        });
});
app.post("/api/notes", (req, res) => {
    fs.writeFile("db/db.json", (err, data) => {
        if (err) throw err;
        res.json(JSON.stringify(data))
        });
});

// Create listener for the port
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));