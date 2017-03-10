var form = document.getElementById('form');

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
      var randomWords = pickRandomWords(uniqueWords, 10);

      // Cache for Slack
      latestRhymes = randomWords;
      latestWord = word;
      $('#wordList').prepend('<p>' + output + ': ' + randomWords.join(' ') + '</p>');
    }).catch(function(error) {
      console.error(error);
    });
}
