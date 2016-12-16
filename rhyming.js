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

  fetch("https://api.wordnik.com/v4/word.json/" + word + "/relatedWords?&useCanonical=false&relationshipTypes=rhyme&limitPerRelationshipType=10&api_key=7c91c9072060dec2af00a04a7ab0fa6d0530cf8a943cafa90")
    .then(function(response){
      return response.json();
    })
    .then(function(jsonResponse){
      if (jsonResponse.length === 0) {
        $('#error').fadeIn().fadeOut(2000);
        return ;
      }

      var rhymingWords = jsonResponse[0].words.join(' ');
      $('#wordList').prepend('<p>' + output + ': ' + rhymingWords + '</p>');
    });
}
