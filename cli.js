#!/usr/bin/env node

const program = require('commander');
const { run } = require('./aggregateDecklists');

program
  .version('0.0.1')
  .description('MTG Decklist Decklist Aggregate Algorithm');

program
  .command('print <directory>')
  .description('Runs algorithm and prints it.')
  .action( (directory) => run('print', directory) );

program
  .command('save <directory> <filename>')
  .description('Run algorithm and saves into ./decklist')
  .action( (directory, filename) => run('save', directory, filename) );

  program.parse(process.argv);

