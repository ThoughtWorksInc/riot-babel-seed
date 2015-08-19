import riot from 'riot'
import RunningEventActions from './actions/RunningEventActions'

export default function (opts) {

  this.handleSubmit = (data, env)=> {
    RunningEventActions.createEvent(data)
      .then(()=> {
        riot.route('/category/upcoming')
        RunningEventActions.listEvents()
      })
  }

}