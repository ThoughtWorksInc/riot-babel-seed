import classNames from 'classnames'

export default function (opts = {}) {
  this.root.className = classNames('icon', {
    [`icon--${opts.type}`]: opts.type
  })
};