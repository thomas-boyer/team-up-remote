const express = require('express');
const app = express();
const PORT = process.env.PORT || 8081;
const cors = require('cors');
const fileUpload = require('express-fileupload');
const mkdirp = require('mkdirp');

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb://localhost:27017/test';
const dbName = 'test';

const SocketServer = require('ws').Server;
const wss = new SocketServer({ server: app.listen(
  PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`)
) });

MongoClient.connect(MONGODB_URI, (err, db) =>
  {
    if (err)
    {
      console.error(`Failed to connect: ${MONGODB_URI}`);
      throw err;
    }
    const teamUp = db.db(dbName).collection('example');

    wss.on('connection', (ws) =>
      {
        console.log("User connected");
        ws.files = [];

        ws.on('message', (data) =>
        {
          const dataObj = JSON.parse(data);

          if (dataObj.setFile)
          {
            ws.files.push(dataObj.setFile);
          }
          else if (dataObj.uploaded)
          {
            teamUp.findOne({ id: dataObj.id }, (err, file) =>
              {
                const chunk = file.chunks.find( chunk =>
                  { return chunk.email === dataObj.email })

                const uploaded = dataObj.uploaded;
                const chunkIndex = file.chunks.indexOf(chunk);
                const newValue = { $set: { [`chunks.${chunkIndex}.amount_uploaded`] : uploaded } };

                teamUp.updateOne({ id: dataObj.id }, newValue);
              });

            wss.clients.forEach( (client) =>
              {
                if (client.files.includes(dataObj.id))
                {
                  const progress =
                  {
                    email: dataObj.email,
                    uploaded: dataObj.uploaded
                  };

                  client.send(JSON.stringify(progress));
                }
              });
          }
        });
      });

      app.get('/:fileID/download/:fileName', (req, res) =>
        {
          res.sendFile(`${req.params.fileID}/${req.params.fileName}`, { root: 'files' });
        });

      app.post('/:fileID', (req, res) =>
        {
          const path = Object.keys(req.files)[0];
          const email = req.body.email;
          const chunk = req.files[path];

          chunk.mv(`./client/public/files/${path}/${chunk.name}`, function(err) {

              if (err) res.send(err);

              teamUp.findOne({ id: path }, (err, file) =>
                {
                  const chunkIndex = file.chunks.findIndex( (chunk) => { return chunk.email === email });
                  const newValue = { $set: { [`chunks.${chunkIndex}.done`] : true } };

                  teamUp.updateOne({ id: path }, newValue);
                });

              res.send(JSON.stringify({ "done": true }));
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
          mkdirp(`./files/${req.body.id}`, function (err)
            {
              if (err) console.error(err);
            });

          teamUp.insertOne(req.body);
        });

      app.get('/', (req, res) =>
        {
          res.send({ path: null });
        });
  });