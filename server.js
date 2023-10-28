// import required modules
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const uuid = require('uuid'); 
// PORT
const PORT = process.env.PORT || 3000;
// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// API routes
// route to home page
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// route to notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// route to get notes from api
app.get('/api/notes', (req, res) =>
  fs.readFile("db/db.json", 'UTF-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred.');
    } else {
      const dbData = JSON.parse(data);
      res.json(dbData);
    }
  })
);

// route to add new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuid.v4(); // Generate a unique ID for the new note

  fs.readFile('db/db.json', 'UTF-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred.');
    }
    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('An error occurred.');
      } else {
        res.json(newNote);
      }
    });
  });
});

// delete route
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile('db/db.json', 'UTF-8', (err, data) => {
      if (err) {
          console.error(err);
          res.status(500).send('An error occurred.');
      } else {
          let notes = JSON.parse(data);
          notes = notes.filter(note => note.id !== noteId);

          fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
              if (err) {
                  console.error(err);
                  res.status(500).send('An error occurred.');
              } else {
                  res.json({ message: `This note has been deleted.` });
              }
          });
      }
  });
});

// start server
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
});
