const express = require("express");
const app = express();
const notes = require("./db/db.json");
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 3030;

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

app.use(express.static("public"));

function addNewNote(reqData, currDb) {
  currDb.push(reqData);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify( currDb , null, 2)
  );
}

app.get("/api/notes", (req, res) => res.json(notes));

app.post("/api/notes", (req, res) => {
  req.body.id = (notes.length+1).toString();
  addNewNote(req.body, notes);
  res.json(notes);
});

app.delete("/api/notes/:id", (req, res) => {
    const noteId = req.params.id;
    for (var i = 0; i < notes.length; i++) {
        if (noteId == notes[i].id) {
            notes.splice(i, 1);
        }
    };

    fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify( notes , null, 2)
        );
        res.json(notes);
}); 

app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "./public/notes.html")));

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "./public/index.html")));

app.listen(PORT, () => console.log(`Server is live on port ${PORT}`));