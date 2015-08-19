import classNames from 'classnames'

export default function (opts = {}) {
  this.root.className = classNames('glyphicon', {
    [`glyphicon-${opts.type}`]: opts.type
  })
}