const firstBy = require('thenby');
const fs = require('fs');

const parseCard = (cardStr) => {
  const space = cardStr.indexOf(' ');
  return {
    quantity: Number(cardStr.substr(0, space)),
    card: cardStr.substr(space + 1)
  };
};

const parse = (filename) => {
  const decklist = fs.readFileSync(filename, 'utf8');
  const list = decklist.split('\n').map( card => card.replace('\r', ''));
  const space = list.indexOf('');
  return {
    md: list.slice(0, space).map( elem => parseCard(elem) ),
    sb: list.slice(space + 1).map( elem => parseCard(elem) )
  };
};

const cardSplitter = card => {
  let result = [];
  for(let i = 1; i <= card.quantity; i++) {
    result.push(`${i}-${card.card}`);
  }
  return result;
}

const consolidateCards = (arr) => {
  let result = {};
  arr.forEach( elem => {
    result[elem.card] = result[elem.card] + 1 || 1;
  });
  return result;
}

const findBest = (arr, amount) => {
  let data = {};
  let keep;
  let extra;

  arr.forEach( elem => {
    data[elem] = data[elem] + 1 || 1;
  });

  data = Object.keys(data)
    .map( elem => {
      let ind = elem.indexOf('-');
      return { card: elem.substr(ind + 1), place: elem.substr(0, ind), amount: data[elem] }
    })
    .sort(
      firstBy( (a, b) => b.amount - a.amount)
      .thenBy( (a, b) => a.card < b.card ? -1 : 1)
    )
  keep = data
    .slice(0, amount)
    .sort( (a, b) => a.card < b.card ? -1 : 1);
  extra = data.slice(amount + 1);

  return { keep: consolidateCards(keep), extra: consolidateCards(extra) };
}

const aggregate = (decklistsArr) => {
  let combinedMD = [];
  let combinedSB = [];

  decklistsArr.forEach( deck => {
    deck.md.forEach( (card, ind) => {
      combinedMD = combinedMD.concat( cardSplitter(card) );
    });
    deck.sb.forEach( (card, ind) => {
      combinedSB = combinedSB.concat( cardSplitter(card) );
    });
  });

  let temp = findBest(combinedMD, 60);
  let md = temp.keep;
  let mbb = temp.extra;
  temp = findBest(combinedSB, 15);
  let sb = temp.keep;
  mbb = Object.assign(temp.extra, mbb);

  return {
    md: md,
    sb: sb,
    mbb: mbb
  };
}

const countCards = cards => {
  let counter = 0;
  Object.keys(cards).forEach( elem => {
    counter = counter + cards[elem];
  });
  return counter;
}

const print = deck => {
  console.log('Main Deck: ', `(${countCards(deck.md)})`);
  Object.keys(deck.md).forEach( card => console.log(`${deck.md[card]} ${card}`));
  console.log('\nSideboard: ', `(${countCards(deck.sb)})`);
  Object.keys(deck.sb).forEach( card => console.log(`${deck.sb[card]} ${card}`));
  console.log('\nMaybe: ', `(${countCards(deck.mbb)})`);
  Object.keys(deck.mbb).forEach( card => console.log(`${deck.mbb[card]} ${card}`));
}

const save = (filename, deck) => {
  let str = '';
  str = str + `Main Deck: (${countCards(deck.md)})`;
  Object.keys(deck.md).forEach( card => str = str + '\n' + `${deck.md[card]} ${card}`);
  str = str + `\n\nSideboard: (${countCards(deck.sb)})`;
  Object.keys(deck.sb).forEach( card => str = str + '\n' + `${deck.sb[card]} ${card}`);
  str = str + `\n\nMaybe: (${countCards(deck.mbb)})`;
  Object.keys(deck.mbb).forEach( card => str = str + '\n' + `${deck.mbb[card]} ${card}`);

  fs.writeFileSync(filename, str);
  console.log(filename, ' successfully saved');
}

const aggregateFrom = (directory) => {
  let decklists = fs.readdirSync(directory)
    .map(file => {
      return parse(`${directory}/${file}`)
    });

  return aggregate(decklists);
}

const run = (printOrSave, directory, saveFileName) => {
  if (printOrSave === 'print') {
    print(aggregateFrom(directory));
  } else if (printOrSave === 'save') {
    if (saveFileName === undefined) throw new Error('saveFileName undefined');
    save(saveFileName, aggregateFrom(directory));
  }
}

module.exports = {
  parse: parse,
  print: print,
  aggregate: aggregate,
  save: save,
  aggregateFrom: aggregateFrom,
  run: run
};
