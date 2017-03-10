function pickUniqueWords(list) {
  var uniqueWords = [];
  for (var index=0; index < list.length; index+=1) {
    if (uniqueWords.indexOf(list[index].toLowerCase()) === -1) {
      uniqueWords.push(list[index].toLowerCase());
    }
  }
  return uniqueWords;
};

function pickRandomWords(list, amount) {
  if (list.length < amount) {
    return list;
  }

  var randomWords = [];

  for (var counter = 0; counter<amount; counter++) {
    var randomWord = list[Math.floor(Math.random() * list.length)];
    if (randomWords.indexOf(randomWord) === -1) {
      randomWords.push(randomWord);
    } else {
      counter-=1;
    }
  }
  return randomWords;
}
