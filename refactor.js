const firstBy = require('thenby');
const fs = require('fs');

// input: '4 Delver of Secrets', output: { quantity: 4, card: 'Delver of Secrets' }
const parseCard = (cardStr) => {
  const space = cardStr.indexOf(' ');
  return {
    quantity: Number(cardStr.substr(0, space)),
    card: cardStr.substr(space + 1)
  };
};

// input: FILENAME, output: {md: [{}], sb: []}
const parse = (filename) => {
  const decklist = fs.readFileSync(filename, 'utf8');
  const list = decklist.split('\n').map( card => card.replace('\r', ''));
  const space = list.indexOf('');
  return {
    md: list.slice(0, space).map( elem => parseCard(elem) ),
    sb: list.slice(space + 1).map( elem => parseCard(elem) )
  };
};

console.log(parse('./decklist1.txt'));