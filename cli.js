#!/usr/bin/env node

const cac = require('cac')
const path = require('path')
const Collector = require('./src/Collector')

const cli = cac()

cli
  .command('collect <collectionPath> [...itemsNames?]', 'Collect screenshot')
  .option('--filter <...itemsNames>', 'Filter by item names')
  .action((collectionPath, itemsNames) => {
    new Collector({
      collectionPath,
      itemsNames,
      pwd: process.env.PWD,
      mode: 'collect'
    })
  })

cli
  .command('compare <collectionPath> [...itemsNames?]', 'Test collected screenshots')
  .action((collectionPath, itemsNames) => {
    new Collector({
      collectionPath,
      itemsNames,
      pwd: process.env.PWD,
      mode: 'test'
    })
  })

cli.help()

cli.parse()
