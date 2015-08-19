import $ from 'jquery'
import metaApis from '../apis/meta'

const $document = $(document)

export default function updateMeta() {
  return metaApis.fetchRunningEventTypes()
    .then((RunningEventTypes)=> {
      $document.trigger('meta:updated:RunningEventTypes', RunningEventTypes)
      return RunningEventTypes
    })
}