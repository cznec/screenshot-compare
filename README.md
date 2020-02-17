# @cznec/screenshot-compare

Website **screenshot compare / collect.**
  
This package is wraps:  
https://www.npmjs.com/package/puppeteer 
https://www.npmjs.com/package/pixelmatch  
for easy collect and compare website screenshots.
  
Package is under construction 🚧 but it works! 😉

## Features
- **collect:** collect screenshots collection for late compare 
- **compare:** compare new screenshots with collected screenshots 

## Install
```
npm install --save-dev @cznec/screenshot-compare

or

yarn add -D @cznec/screenshot-compare
```

## Usage

Create collection file collection.js
```javascript
const Screenshot = require('@cznec/screenshot-compare').Screenshot

module.exports = [
  new Screenshot()
    .name('github')
    .url("https://github.com/cznec/screenshot-compare")
    .delay(1000)
    .get(),
]

```

Run screenshots collection **collect**
```bash
npx screenshot-compare collect ./collection.js
```

Run screenshot collection **compare**
```bash
npx screenshot-compare compare ./collection.js
```

Run screenshot compare / collect on **specific Screenshot() names**
```bash
npx screenshot-compare compare ./collection.js name1 name1 ...
```

## Advanced usage

Collection file
```javascript
const Screenshot = require('@cznec/screenshot-compare').Screenshot

const viewport = {
  width: 1920,
  height: 1080,
  deviceScaleFactor: 1,
}

module.exports = [
  new Screenshot()
    .name('github')
    .url("https://github.com/cznec/screenshot-compare")
    .viewport(viewport)
    .delay(500)
    .saveTo('./screenshots')
    .pageLog(true)
    .get(),

  new Screenshot()
    .name('github_2')
    .before(async (page, screenshot, collector) => {
      console.log(screenshot)
      await page.setViewport(viewport)
      await page.goto("https://github.com/cznec/screenshot-compare")
      await collector.delay(1000)
    })
    .saveTo('./screenshots')
    .get(),
]

```

## API
- #### Screenshot() methods:
    - url( String ) - final url for take screenshot
    - name( String ) - **collection unique!** screenshot name 
    - saveTo( String ) - relative path from collection file to store screenshots
    - pageLog( Boolean ) - print console log of page
    - delay( Number ) - delay after url redirect and before take screenshot
    - viewport( Object ) - ```{ width: Number, height: Number, deviceScaleFactor: Number }``` [docs](https://github.com/puppeteer/puppeteer/blob/v2.1.1/docs/api.md#pagesetviewportviewport)
    - before( async Function(page, screenshot, collector) )
        - page: puppeteer Page class - [docs](https://github.com/puppeteer/puppeteer/blob/v2.1.1/docs/api.md#class-page)
        - screenshot: current screenshot Object ( Screenshot.get() )
        - collector: Collector class reference ( for exaple useful for Collector.delay( Number ) )

## Collect command
Capture PNG screenshot and save them with name defined in collection file.  
Also create screenshot definition stamp. This stamp is compared in compare command. 

## Compare command
Compare captured screenshots and save ..._test.png file and ..._diff.png file.  
Print pixel and percentage diff.  
Also check screenshot definition stamp and alert if is not equal.
        
More later? 🙃
