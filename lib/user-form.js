import autobind from 'autobind-decorator'
import React from 'react'

import actions from './actions'

@autobind
export default class UserForm extends React.Component {
  handleClick(evt) {
    evt.preventDefault()
    actions.addUser(React.findDOMNode(this.refs.user).value)
  }
  render() {
    return (
      <div>
        <h2>User Form</h2>
        <label htmlFor="add">
          User
          <input ref="user" type="text" id="add" />
          <button onClick={this.handleClick}>Add</button>
        </label>
      </div>
    )
  }
}