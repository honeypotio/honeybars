var speechButton = document.querySelector('#preach');
var cancel = document.querySelector('#cancel');

speechButton.addEventListener('click', function() {
  speakALine(latestWord, latestRhymes);
});

cancel.addEventListener('click', function() {
  speechSynthesis.cancel();
});

// Speaks a line
function speakALine(word, rhymes) {
  var message = new SpeechSynthesisUtterance();
  var allVoices = speechSynthesis.getVoices();
  var fred = allVoices.filter(function(voice){return voice.name === "Fred"})[0];

  if (word.length === 0 || rhymes.length === 0) {
    message.text = 'Get your words straight motherfucker';
  } else {
    message.text = word + " rhymes with: " + rhymes.join(' ') + " keep on keeping on brotha!";
  }

  message.voice = fred;
  message.rate = 0.6

  speechSynthesis.speak(message);
}
