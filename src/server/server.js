const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config(); // Make sure to require dotenv if you're using a .env file
const {initDb} = require('../db/setup');
const {initAttestation} = require("../attestation/attestation");
const {findMetadatasWithTxHashes, createOrUpdateMetadata} = require("../db/repositories/metadataRepository");



const addRoutes = () => {
  app.post('/metadata', async (req, res) => {
    console.log(req.body);
    const result = await createOrUpdateMetadata(req.body)
    res.send(result);
  });


  app.get('/metadata', async (req, res) => {
    // get list of txHashes from request querey params and extract it from comma separated array
    console.log('request.params, request.query', {
      requestParams: req.params,
      requestQuery: req.query
    })
    const txHashes = req.query.tx_hashes.split(',');
    const metadatas = await findMetadatasWithTxHashes(txHashes)
    res.send(metadatas);
  })


  app.post('/login',(req, res)=>{
    return res.send('Success')
  } )




}

const initServer = async () => {

  // await initAttestation()

  // Initialize the database connection
  initDb();

  // initialize app to set middlewares and lisren to port
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  addRoutes();
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}






module.exports = {
  initServer
}