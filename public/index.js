const UPDATE_MS = 1500;

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
  xmlhttp.onload = function() {
    callback(xmlhttp.responseText);
  };
  xmlhttp.send(x);
}

let player;

function init() {
  player = new Audio();
  setInterval(update, UPDATE_MS);
}

function play() {
  xmlGet("/radio", function(res) {
    let resObj = JSON.parse(res);
    console.log(resObj);
    player.src = resObj.current_song;
    player.currentTime = resObj.current_time;
    player.play();
  });
}

function update() {
  xmlGet("/radio", function(res) {
    let resObj = JSON.parse(res);
    if (resObj.current_song !== player.src) {
      player.src = resObj.current_song;
      player.currentTime = resObj.current_time;
      player.play();
    }
  });
}