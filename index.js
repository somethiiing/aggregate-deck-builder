const _ = require('./aggregateDecklists');
const fs = require('fs');
const home = `${process.env['HOME']}/Downloads`;

// parse, aggregate, print, save(filename, deck), aggregateFrom, run

// let decklist1 = _.parse('./decklist1.txt');
// let decklist2 = _.parse('./decklist2.txt');
// let decklist3 = _.parse('./decklist3.txt');
// let decklist4 = _.parse('./decklist4.txt');
// let decklist5 = _.parse('./decklist5.txt');

// let average = _.aggregate([decklist1, decklist2, decklist3, decklist4, decklist5]);

// _.print(average);
// _.save('test.txt', average);

let wizards = _.aggregateFrom(`${home}/wiz`);
// _.print(wizards);

// _.run('print', `${home}/wiz`);
_.run('save', `${home}/wiz`, 'Modern UR Wizards.txt');

