import $ from 'jquery'

$(document).on('meta:updated:RunningEventTypes', (evt, RunningEventTypes)=> {
  Object.keys(RunningEventTypes).forEach((key)=> {
    module.exports[key] = RunningEventTypes[key]
  })
})

module.exports = {};