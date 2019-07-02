const PORT = process.env.PORT || 8088;
//Import dependencies
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const mkdirp = require('mkdirp');
const path = require('path');
const splitFile = require('split-file');

//Use middleware
const app = express();
app.use(cors());
app.options('*', cors());
app.use(express.json({ limit: '100gb' }));
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

//Configure database
const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb://localhost:27017/test';
const dbName = 'test';

//Configure sockets
const SocketServer = require('ws').Server;
const wss = new SocketServer({ server: app.listen(
  PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`)
) });

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.options('*', cors());

//Connect to database before doing anything else
MongoClient.connect(MONGODB_URI, (err, db) =>
  {
    if (err)
    {
      console.error(`Failed to connect: ${MONGODB_URI}`);
      throw err;
    }
    //Use in a consistent collection in database
    const teamUp = db.db(dbName).collection('example');

    //Socket operations are handled separately from requests
    wss.on('connection', (ws) =>
      {
        console.log("User connected");
        ws.files = [];
        ws.on('message', (data) =>
        {
          const dataObj = JSON.parse(data);

          //Assigns a file to a socket when user validates their email
          if (dataObj.setFile)
          {
            ws.files.push(dataObj.setFile);
          }
          //Updates database and sends back information on uploads for progress bars
          else if (dataObj.uploaded)
          {
            //Find appropriate file in database and find chunk corresponding to user
            teamUp.findOne({ id: dataObj.id }, (err, file) =>
              {
                const chunk = file.chunks.find( chunk =>
                  { return chunk.email === dataObj.email })

                //Update database with current amount uploaded by user
                const uploaded = dataObj.uploaded;
                const chunkIndex = file.chunks.indexOf(chunk);
                const newValue = { $set: { [`chunks.${chunkIndex}.amount_uploaded`] : uploaded } };

                teamUp.updateOne({ id: dataObj.id }, newValue);
              });

            //Broadcast new upload amounts to users assigned to the file
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

      //Sends file to user after it is completed
      app.get('/:fileID/download/:fileName', (req, res) =>
        {
          res.download(`files/${req.params.fileID}/${req.params.fileName}`);
        });

      //Handles chunk uploads
      app.post('/:fileID', (req, res) =>
        {
          //Get path from key representing file
          const userPath = Object.keys(req.files)[0];

          const email = req.body.email;
          const userChunk = req.files[userPath];
          //Move chunk to appropriate directory (which is created in '/' post handler)
          userChunk.mv(`./files/${userPath}/${userChunk.name}`, (err) =>
            {
              if (err) console.log(err);
              else
              {
                let response = {};

                //After moving, tell database and user that chunk is finished
                teamUp.findOne({ id: userPath }, (err, file) =>
                  {
                    const chunkIndex = file.chunks.findIndex( (chunk) => { return chunk.email === email });
                    let newValue = { $set: { [`chunks.${chunkIndex}.done`] : true } };

                    teamUp.updateOne({ id: userPath }, newValue, () =>
                      {
                        response.chunkDone = true;
                        file.chunks[chunkIndex].done = true;

                        //After marking chunk as done, check if every chunk is done
                        if (file.chunks.every( (chunk) => { return chunk.done }))
                        {
                          const paths = file.chunks.map( (chunk) => { return `${__dirname}/files/${file.id}/${path.parse(chunk.path).base}`});

                          splitFile.mergeFiles(paths, __dirname + `/files/${file.id}/${file.file_name}`)
                            .then(() => {
                              console.log('Done!');
                            })
                            .catch((err) => {
                              console.log('Error: ', err);
                            });

                          //If so, mark file as done
                          newValue = { $set: { ["done"] : true } };
                          teamUp.updateOne({ id: userPath }, newValue);

                          response.fileDone = true;
                        }

                        //Send response indicating if chunk and/or file are finished
                        res.send(JSON.stringify(response));
                      });
                  });
              }
          });
        });

      //Send file information to client
      app.get('/:fileID/details', (req, res) =>
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

      //Create new file entry in database
      app.post('/', (req, res) =>
        {
          const chunkArray = JSON.parse(req.body.chunks);
          const file = req.body;
          file.chunks = chunkArray;
    file.done = false;

          //Make corresponding directory in ./files folder
          mkdirp(`./files/${req.body.id}`, function (err)
            {
              if (err) console.error(err);
            });

          teamUp.insertOne(file);
    res.sendStatus(200);
        });

      app.get('*', (req, res) =>
        {
          res.sendFile('build/index.html', { root: 'client' });
        })

  app.options('*', (req, res) =>
      {
        res.set({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
        });

        res.send();
      })
  });
