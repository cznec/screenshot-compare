const sanitize = require("sanitize-filename")
require('colors')

class Screenshot {

  constructor() {

    this.fields = {
      name: "",
      url: "",
      saveTo: ".",
      before: null,
      pageLog: false,
      delay: 0,
      viewport: null,
    }

    return this
  }

  _setField(key, val) {
    this.fields[key] = val
    return this
  }

  url(val) {
    return this._setField('url', val)
  }

  name(val) {
    return this._setField('name', val)
  }

  saveTo(val) {
    return this._setField('saveTo', val)
  }

  before(val) {
    return this._setField('before', val)
  }

  pageLog(val) {
    return this._setField('pageLog', val)
  }

  delay(val) {
    return this._setField('delay', val)
  }

  viewport(val) {
    return this._setField('viewport', val)
  }

  get() {
    this.required()
    return this.fields
  }

  required() {
    if (!this.fields.name) this.error('field .name(<itemName>) is required')
    if (sanitize(this.fields.name) !== this.fields.name) this.error(`field name ${this.fields.name} contains unsafe characters (https://www.npmjs.com/package/sanitize-filename)`)
    if (!this.fields.url && !this.fields.before) this.error('field .url(<url>) or .before(<beforeFn>) is required')
  }

  error(msg, exit = true) {
    console.error(msg.red)
    if (exit) process.exit(0)
  }

}

module.exports = Screenshot
