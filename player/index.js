let songs = [];
let player;
const UPDATE_INTERVAL_MS = 1000;

function xmlPostJSON(url, x, callback) {
  xmlRequest(url, x, "POST", "application/json", callback);
}
function xmlGet(url, callback) {
  xmlRequest(url, null, "GET", null, callback);
}

function xmlRequest(url, x, method, contentType, callback) {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.open(method, url, true);
  xmlhttp.setRequestHeader("Content-type", contentType);
  if (callback) {
    xmlhttp.onload = function() {
      callback(xmlhttp.responseText);
    };
  }
  xmlhttp.send(x);
}

function init() {
  player = document.createElement("audio");
  document.getElementById("main").appendChild(player);
  player.controls = "true";
  player.onended = nextSong();
  xmlGet("http://172.16.36.171:8080/server?getqueue=yes", (res) => {
    songs = JSON.parse(res);
    nextSong();
  });
  setInterval(update, UPDATE_INTERVAL_MS);
}

function nextSong() {
  if (songs.length !== 0) {
    player.src = songs.pop();
    player.play();
    player.volume = 0;
  }
}

function update() {
  let data = {
    current_song: player.src,
    current_time: player.currentTime,
    current_song_name: "UNKNOWN"
  };
  xmlPostJSON("../server", JSON.stringify(data));
}