# @cznec/screenshot-compare

Website testing tool for screenshot capture and compare.

### Installing

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

Run screenshot collector
```bash
npx screenshot-compare collect ./collection.js
```

Run screenshot compare
```bash
npx screenshot-compare compare ./collection.js
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
Run screenshot collector for specific screenshots names
```bash
npx screenshot-compare collect ./collection.js google_2
```

## Collect method
Capture PNG screenshot and save them with name defined in collection file.  
Also create screenshot definition stamp. This stamp is compared in 

## Compare method
Compare captured screenshots and save ..._test.png file and ..._diff.png file.  
Print pixel and percentage diff.  
Also check screenshot definition stamp and alert if is not equal.


More documentation under construction 🚧
