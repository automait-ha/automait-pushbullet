module.exports = init

var PushBulletApi = require('pushbullet')
  , findWhere = require('lodash.findWhere')

function init(callback) {
  callback(null, 'pushbullet', PushBullet)
}

function PushBullet(automait, logger, config) {
  this.automait = automait
  this.logger = logger
  this.config = config
  this.pushers = {}
  Object.keys(config.people).forEach(function (name) {
    var person = config.people[name]
    this.pushers[name] = new PushBulletApi(person.apiKey)
  }.bind(this))
}

PushBullet.prototype.notify = function (name, device, title, body, from, callback) {
  var pusher = this.pushers[name]

  if (!pusher) return callback(new Error('No person with name:' + name))

  var personDevices = this.config.people[name].devices
    , toDeviceId = findWhere(personDevices, { name: device }).id
    , fromDeviceId = findWhere(personDevices, { name: from }).id
    , noteData = { 'device_iden': toDeviceId, 'source_device_iden': fromDeviceId }

  pusher.note(noteData, title, body, callback)
}
