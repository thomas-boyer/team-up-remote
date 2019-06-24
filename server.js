const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb://localhost:27017/test';
const dbName = 'test';

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

/////TODO: UTILIZE SOCKETS AND TEST DYNAMIC PROGRESS BARS!

MongoClient.connect(MONGODB_URI, (err, db) =>
  {
    if (err)
    {
      console.error(`Failed to connect: ${MONGODB_URI}`);
      throw err;
    }

    const teamUp = db.db(dbName).collection('example');

    app.post('/:fileID', (req, res) =>
      {
        const path = Object.keys(req.files)[0];
        const chunk = req.files[path];

        chunk.mv(`./files/${path}/${chunk.name}`, function(err) {

            if (err) console.log(err);
            res.send('File uploaded!');
          });
      });

    app.get('/:fileID', (req, res) =>
      {
        teamUp.findOne({ id: req.params.fileID }, (err, file) =>
          {
            if (err) throw new Error("File selection from database failed")

            if (!file) res.status(404).send();
            else
            {
              res.send(JSON.stringify(file));
            }
          })
      });

    app.post('/', (req, res) =>
      {
        //TODO: Create directory in ./files for new file
        //TODO: Insert relevant information into database
      });

    app.get('/', (req, res) =>
      {
        res.send({ path: null });
      });

    app.listen(PORT, () =>
      {
        console.log(`Now listening on port ${PORT}!`)
      });
  }
);