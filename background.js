var audio = document.createElement("audio");
document.body.appendChild(audio);

var urlChanged = function(url) {
  chrome.notifications.clear(audio.src, function() {});
  audio.pause();
  var request = new XMLHttpRequest();
  request.open("GET", "http://cryptic-anchorage-3829.herokuapp.com/" + url, true);
  request.onload = function() {
    if (this.status == 200) {
      var song = JSON.parse(this.response);
      audio.src = song.audio_url;
      audio.play();
      chrome.notifications.create(audio.src, {
        type: "basic",
        title: song.title,
        message: song.artist,
        iconUrl: song.artwork_url
      }, function() {});
    }
  };
  request.send();
};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.hasOwnProperty("url")) {
    urlChanged(changeInfo.url);
  }
});

chrome.tabs.onActivated.addListener(function(tabInfo) {
  chrome.tabs.get(tabInfo.tabId, function(tab) {
    urlChanged(tab.url);  
  });
});
