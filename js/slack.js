var slackForm = document.getElementById('slackForm');
var slackButton = document.querySelector('#slackForm input[type="submit"]');
var slackInputToken = document.getElementById('token');

slackButton.addEventListener('click', function(e) {
  e.preventDefault();
  postToSlack(latestWord, latestRhymes);
});

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
  }).then(res => res.json())
  .then(function(data) {
    if (data.ok) {
      $('#slack-confirm').fadeIn().fadeOut(2000);
    }
  });
}

// Set the token value if it exists in our localStorage
if (localStorage.getItem('slackToken')) {
  slackInputToken.value = localStorage.getItem('slackToken');
}

// store a slack token in our localStorage
function storeSlackToken(token) {
  localStorage.setItem('slackToken', token);
}
