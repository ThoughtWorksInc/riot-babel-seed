import _ from 'lodash'
import moment from 'moment'
import $ from 'jquery'
import 'eonasdan-bootstrap-datetimepicker'

import RunningEventTypes from '../constants/RunningEventTypes'

const DATE_FORMAT = 'YYYY-MM-DD HH:mm'

export default function (opts) {

  this.runningEventOptions = _.keys(RunningEventTypes).map((eventType)=> {
    return {
      label: RunningEventTypes[eventType],
      value: eventType
    }
  })

  this.form = {
    'type': 'SPEED_RUN',
    'tagline': '',
    'location': '',
    'netReferenceId': '',
    'when': moment().toISOString()
  }

  this.handleSubmit = (evt)=> {
    evt.preventDefault()
    this.form = _.merge(this.form, this.pickFormData())
    opts.on_form_submit && opts.on_form_submit(this.form)
  }

  this.pickFormData = ()=> {

    const data = {}
    const self = this

    $(this.root).find('[name]').each(function () {
      const $self = $(this)
      if ($self.attr('name') === 'when') {
        data[$self.attr('name')] = self.picker.date().toISOString()
      } else {
        data[$self.attr('name')] = $self.val()
      }
    })

    return data

  }

  this.on('update', ()=> {

    if (!_.isEmpty(opts.detail)) {

      this.form = _.merge({}, this.form, _.pick(opts.detail, [
        'type',
        'tagline',
        'location',
        'netReferenceId',
        'when'
      ]))

      setTimeout(()=> {
        this.picker && this.picker.date(moment(this.form.when).format(DATE_FORMAT))
      })
    }

  })

  this.on('mount', ()=> {
    this.initialDatePicker()
  })

  this.on('unmount', ()=> {
    this.picker && this.picker.destroy()
  })

  this.initialDatePicker = ()=> {
    this.picker = $(this.root)
      .find('.date-picker')
      .datetimepicker({
        format: DATE_FORMAT,
        sideBySide: true,
        ignoreReadonly: true
      })
      .data('DateTimePicker')
  }
}