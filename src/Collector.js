const prompts = require('prompts')
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const delay = require('delay')
const md5 = require('md5')
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
require('colors')

class Collector {

  /**
   *
   * @param opt
   */
  constructor(opt) {
    this.opt = opt;

    this.required()

    this.collectionPath = path.join(this.opt.pwd, this.opt.collectionPath)

    this.mode = this.opt.mode ? this.opt.mode : 'test'
    this.modeTest = this.mode === 'test'
    this.modeCollect = this.mode === 'collect'

    this.itemsNames = this.opt.itemsNames ? this.opt.itemsNames : []

    console.log(`Collector Init`.green)
    console.log(`Collection: ${this.opt.collectionPath}`.gray)
    console.log(`Mode: ${this.mode}`.gray)

    this.items = []
    this.itemsMeta = {}
    this.browser = null

    this.loadCollection()

    ;(async () => {
      await this.collector()
    })()
  }

  required() {
    if (!this.opt.collectionPath) this.error('collectionPath parameter is required')
    if (!this.opt.pwd) this.error('pwd parameter is required')
  }

  async initBrowser() {
    this.browser = await puppeteer.launch();
  }

  async compareMeta(item, meta) {
    if (this.modeTest && this.itemsMeta[item.name] !== meta) {

      const response = await prompts([{
        type: 'confirm',
        name: 'value',
        message: 'Stamp of testing collection item doesnt match collected stamp. Continue?',
        initial: true
      }]);

      if (!response.value) this.error('Exit()')
    }
  }

  async delay(itemDelay) {
    let delayAlt = itemDelay
    let delayAltInterval = null;
    delayAltInterval = setInterval(() => {
      delayAlt -= 100
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(`Delay: ${delayAlt}`.gray);

      if (delayAlt <= 0) {
        clearInterval(delayAltInterval)
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
      }
    }, 100)

    await delay(itemDelay)
  }

  async collector() {

    await this.loadMeta()
    await this.initBrowser()

    let items = this.items
    if (this.itemsNames.length) {
      console.log(`Items: ${this.itemsNames.join(', ')}`.gray)
      items = items.filter(i => this.itemsNames.includes(i.name))
    }

    for (let i = 0; i < items.length; i++) {

      const item = items[i]
      const page = await this.browser.newPage();
      const meta = this.getItemMeta(item)

      const saveTo = path.join(this.collectionPath.replace(path.basename(this.collectionPath), ''), item.saveTo)

      const now = new Date().getTime()
      const mineType = '.png'
      const fileName = `${item.name}${mineType}`
      const fileNameTest = `${item.name}_test${item.testTimeStamp ? '_'+now : ''}${mineType}`
      const fileNameDiff = `${item.name}_diff${item.testTimeStamp ? '_'+now : ''}${mineType}`

      console.log(`=====================`.gray)
      console.log(`Item: ${item.name}`.green)

      /**
       * Compare meta data for screenshot option
       */
      await this.compareMeta(item, meta)

      /**
       * Store meta
       */
      if (this.modeCollect)
        this.itemsMeta[item.name] = meta

      /**
       * Before action
       */
      if (item.before)
        await item.before(page, item, this)

      /**
       * Set viewport
       */
      if (item.viewport)
        await page.setViewport(item.viewport)

      /**
       * Set page console.log
       */
      if (item.pageLog)
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));

      /**
       * Capture screenshot
       */
      if (fs.existsSync(saveTo)) {

        /**
         * Move to url
         */
        if (item.url)
          await page.goto(item.url)

        /**
         * Delay before screenshot
         */
        if (item.delay)
          await this.delay(item.delay)

        /**
         * Capture and save screenshot
         */
        await page.screenshot({
          path: `${saveTo}/${this.modeTest ? fileNameTest : fileName}`,
          fullPage: true
        })

        console.log(`Screenshot captured: ${this.modeTest ? fileNameTest : fileName}`.green)

        if (this.modeTest) {
          this.compare(
            `${saveTo}/${fileName}`,
            `${saveTo}/${fileNameTest}`,
            `${saveTo}/${fileNameDiff}`,
          )
        }

      } else {
        this.error('Target dir doesnt exist', saveTo)
      }

    }

    console.log(`=====================`.gray)

    await this.browser.close()

    if (this.modeCollect) this.storeMeta()
  }

  compare(img1Path, img2Path, diffPath) {
    const img1 = PNG.sync.read(fs.readFileSync(img1Path));
    const img2 = PNG.sync.read(fs.readFileSync(img2Path));
    const {width, height} = img1;
    const diff = new PNG({width, height});

    const pxCount = width * height

    const px = pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0});

    console.log(`Diff: ${(px/pxCount) *100}% (pixel diff: ${px})`.blue)

    fs.writeFileSync(diffPath, PNG.sync.write(diff));
  }

  getItemMeta(item) {
    let source = md5(JSON.stringify(item))
    if (item.before) source += item.before.toString()
    return md5(JSON.stringify(source))
  }

  async loadMeta() {
    const filePath = `${path.join(this.collectionPath.replace(path.basename(this.collectionPath), ''))}.meta`
    this.itemsMeta = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : {}
  }

  storeMeta() {
    fs.writeFileSync(`${path.join(this.collectionPath.replace(path.basename(this.collectionPath), ''))}.meta`, JSON.stringify(this.itemsMeta))
  }

  error(msg, exit = true) {
    console.error(msg.red)
    if (exit) process.exit(0)
  }

  loadCollection() {
    this.items = require(this.collectionPath)
    if (!Array.isArray(this.items)) {
      this.error('Collection must be Array')
    }
  }
}



module.exports = Collector






















