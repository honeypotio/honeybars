var world = prompt('What do you wanna rhyme, big fella?');

fetch("http://api.wordnik.com/v4/word.json/" + word + "/relatedWords?&useCanonical=false&relationshipTypes=rhyme&limitPerRelationshipType=10&api_key=7c91c9072060dec2af00a04a7ab0fa6d0530cf8a943cafa90")
  .then(function(response){
    return response.json();
  })
  .then(function(jsonResponse){
    var rhymingWords = jsonResponse[0].words.join(' ');
    document.getElementById('wordList').textContent = rhymingWords;
  });
