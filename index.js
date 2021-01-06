const express = require('express');
const app = express();
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
require('./models/player')
const playerModel = mongoose.model('Player')
mongoose.connect(process.env.MONGOURL,{ useUnifiedTopology: true },{useNewUrlParser: true});

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.text());
app.use(bodyparser.json());
app.use(bodyparser.raw());

const listener = app.listen(process.env.PORT||3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('Connection To MongoDB Atlas Successful!');
});

app.get('/', (req, res) => {
    console.log("wake up")
  res.end();
})


app.get('/productdata/:id', async (request, response) => {
  console.log('GET')
  async function playerDataCheck() {
    const playerData = await playerModel.findOne({ PlaceID: `${request.params.id}` })
    // We use the mongoose findOne method to check if a record exists
   // with the given ID
    if (playerData) {
      console.log("data exists")
      return playerData
    } else {
      const newPlayerDataInstance = new playerModel({
        PlaceID: `${request.params.id}`,
        Whitelisted: ["0"],
        Banned: false,
      })
      const newPlayerData = await newPlayerDataInstance.save()
      // If not exists, we save a new record and return that
      return newPlayerData
    }
  }

  response.json(await playerDataCheck());
// Finally we return the response from the async function!
});

app.post('/productdata/update-info/:id', async (request, response) => {
  // We use a mongoose method to find A record and update
  var WhiteListedPlaces = [];
  //for(var i=0;request.body.Whitelisted.length;i++){WhiteListedPlaces.push(request.body.Whitelisted[i])}
  await playerModel.findOneAndUpdate(
    { PlaceID: `${request.params.id}` },
    { $set: { Whitelisted:request.body.Whitelisted,Banned:request.body.Banned} }
    //{ $set: { Whitelisted:WhiteListedPlaces,Banned:request.body.Banned} }
  );
  response.send('Updated Database.');
});