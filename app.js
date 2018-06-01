const express = require("express");
const bodyParser = require("body-parser");
const url = require("url");
const ip = require("ip");
const fs = require("fs");
const runrun = require("./js/runrun.js")

const script_args = process.argv.slice(2);

const HOST = ip.address();
const PORT = 8080;

let player_data = {
  current_song: null,
  current_time: 0,
  current_song_name: ""
};

let app = express();
 
// create application/json parser
let jsonParser = bodyParser.json();
 
// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get("/server", function(req, res) {
  let params = url.parse(req.url, true).query;
  console.log(params);
  if (params.getqueue) {
    let resObj = getTracks();
    res.send(resObj);
    console.log(params);
  }
});

app.post("/server", jsonParser, function(req, res) {
  if (req.body.current_song) {
    player_data = {
      current_song: req.body.current_song,
      current_time: req.body.current_time,
      current_song_name: req.body.current_song_name
    };
  }
  res.send();
});

app.get("/radio", function(req, res) {
  console.log("GOT A GET", player_data);
  res.send(player_data);
});

app.use(express.static("./public"));
app.use("/player", express.static("./player"));

app.listen(PORT, function () {
  if (script_args[0] == "o") {
    runrun(`google-chrome http://${HOST}:${PORT}`);
    runrun(`google-chrome http://${HOST}:${PORT}/player/index.html`);
  }
  else {
    console.log("(run `node app o` to open up the chrome tabs)")
  }
  console.log(`Listening http://${HOST}:${PORT}`);
});

function getTracks() {
  let songs = fs.readdirSync("./public/music");
  for (let i=0; i<songs.length; i++) {
    songs[i] = `http://${HOST}:${PORT}/music/${encodeURI(songs[i])}`;
  }
  return songs;
}