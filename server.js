const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require('cors');

const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb://localhost:27017/test';
const dbName = 'test2';

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

MongoClient.connect(MONGODB_URI, (err, db) =>
  {
    if (err)
    {
      console.error(`Failed to connect: ${MONGODB_URI}`);
      throw err;
    }

    const teamUp = db.db(dbName).collection('example');

    app.get('/:filepath', (req, res) =>
    {
      console.log("REQUEST RECEIVED");
      res.send({ path: "test" });
    });

    app.get('/', (req, res) =>
    {
      console.log("REQUEST RECEIVED");
      res.send({ path: null });
    });

    app.listen(PORT, () =>
      {
        console.log(`Now listening on port ${PORT}!`)
      });
  }
);