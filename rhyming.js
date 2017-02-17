var form = document.getElementById('form');
var slackForm = document.getElementById('slackForm');
var latestWord = '';
var lastestRhymes = [];

form.addEventListener('submit', function(event) {
  event.preventDefault(); //prevents page from e.g. refreshing

  var word = this.word.value;
  this.word.value = '';
  getRhymingWords(word);
});

function getRhymingWords(input) {
  var words = input.split(' ');
  var word = words[words.length - 1];
  var output = input.replace(word, '<span class="picked-word">' + word + '</span>')

  fetch("https://api.wordnik.com/v4/word.json/" + word.toLowerCase() + "/relatedWords?&useCanonical=false&relationshipTypes=rhyme&limitPerRelationshipType=1000&api_key=7c91c9072060dec2af00a04a7ab0fa6d0530cf8a943cafa90")
    .then(function(response){
      return response.json();
    })
    .then(function(jsonResponse){
      if (jsonResponse.length === 0) {
        $('#error').fadeIn().fadeOut(2000);
        return ;
      }

      var uniqueWords = pickUniqueWords(jsonResponse[0].words);
      var randomWords = pickTenRandomWords(uniqueWords);

      // Cache for Slack
      lastestRhymes = randomWords;
      latestWord = word;
      speakALine(word, randomWords.join(' '))
      $('#wordList').prepend('<p>' + output + ': ' + randomWords.join(' ') + '</p>');
    });
}

function pickUniqueWords(list) {
  var uniqueWords = [];
  for (var index=0; index < list.length; index+=1) {
    if (uniqueWords.indexOf(list[index].toLowerCase()) === -1) {
      uniqueWords.push(list[index].toLowerCase());
    }
  }
  return uniqueWords;
};

function pickTenRandomWords(list) {
  var randomWords = [];

  for (var counter = 0; counter<10; counter++) {
    var randomWord = list[Math.floor(Math.random() * list.length)];
    if (randomWords.indexOf(randomWord) === -1) {
      randomWords.push(randomWord);
    } else {
      counter-=1;
    }
  }
  return randomWords;
}

function postToSlack(word, rhymingWords) {
  var token = slackForm.token.value;

  // Error Handling
  if (word.length === 0 || rhymingWords.length === 0 || token.length === 0) {
    alert('You needs to rhyme first');
    return;
  }
  var rhymingText = "Word: " + word + " \nRhymes: " + rhymingWords.join(", ");
  var slackURL = 'https://slack.com/api/chat.postMessage?token=' +token+ '&channel=honeybars&text=' +rhymingText+ '&as_user=true&pretty=1'

  storeSlackToken(token);

  // Posts to slack using Slack's API
  fetch(slackURL, {
    method: 'POST'
  });
}


var slackButton = document.querySelector('#slackForm input[type="submit"]');

slackButton.addEventListener('click', function(e) {
  e.preventDefault();
  postToSlack(latestWord, lastestRhymes);
});


var slackInputToken = document.getElementById('token');

// Set the token value if it exists in our localStorage
if (localStorage.getItem('slackToken')) {
  slackInputToken.value = localStorage.getItem('slackToken');
}

// store a slack token in our localStorage
function storeSlackToken(token) {
  localStorage.setItem('slackToken', token);
}

// Speaks a line
function speakALine(word, rhymes) {
  var message = new SpeechSynthesisUtterance();
  var allVoices = speechSynthesis.getVoices();
  var fred = allVoices.filter(function(voice){return voice.name === "Fred"})[0];

  message.text = word + " rhymes with: " + rhymes + " keep on keeping on brotha!";
  message.voice = fred;
  message.rate = 0.6

  speechSynthesis.speak(message);
}
