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
      __dirname,
      mode: 'collect'
    })
  })

cli
  .command('test <collectionPath> [...itemsNames?]', 'Test collected screenshots')
  .action((collectionPath, itemsNames) => {
    new Collector({
      collectionPath,
      itemsNames,
      __dirname,
      mode: 'test'
    })
  })

cli.help()

cli.parse()
