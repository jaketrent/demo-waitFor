import assign from 'lodash/object/assign'
import clone from 'lodash/lang/clone'
import autobind from 'autobind-decorator'
import React from 'react'
import keyMirror from 'react/lib/keyMirror'
import EventEmitter from 'events'

import { Dispatcher } from 'flux'

var appDispatcher = new Dispatcher()

var actions = {
  addUser(user) {
    appDispatcher.dispatch({
      actionType: 'ADD_USER',
      user
    })
  }
}

// ------------ ORDER MATTERS
// ------------ Summary store is registered *first* to create a potential problem
var userStatsStore = assign({}, EventEmitter.prototype, {
  getNum() {
    return this._num
  },
  listen(listener) {
    this.addListener('change', listener)
  },
  unlisten(listener) {
    this.removeListener('change', listener)
  },
  emitChange() {
    this.emit('change')
  }
})
userStatsStore.dispatchToken = appDispatcher.register(function (payload) {
  switch (payload.actionType) {
    case 'ADD_USER':
      // -------- UNCOMMENT THIS
      // -------- To see the stats stay in sync with user updates
      //appDispatcher.waitFor([ usersStore.dispatchToken ])
      var users = usersStore.getUsers()
      if (users)
        this._num = users.length
      this.emitChange()
      break
  }
}.bind(userStatsStore))


var usersStore = assign({}, EventEmitter.prototype, {
  _addUser(user) {
    if (!Array.isArray(this._users))
      this._users = []

    this._users.push(user)
  },
  getUsers() {
    return this._users
  },
  listen(listener) {
    this.addListener('change', listener)
  },
  unlisten(listener) {
    this.removeListener('change', listener)
  },
  emitChange() {
    this.emit('change')
  }
})
usersStore.dispatchToken = appDispatcher.register(function (payload) {
  switch (payload.actionType) {
    case 'ADD_USER':
      this._addUser(payload.user)
      this.emitChange()
      break
  }
}.bind(usersStore))

@autobind
class UserForm extends React.Component {
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

class UsersList extends React.Component {
  static defaultProps = {
    users: []
  }
  renderUser(user, i) {
    return (
      <li key={i}>
        {user}
      </li>
    )
  }
  renderUsers(users) {
    return users.map(this.renderUser)
  }
  render() {
    return (
      <div>
        <h2>Users List</h2>
        <ul>
          {this.renderUsers(this.props.users)}
        </ul>
      </div>
    )
  }
}

class UserStats extends React.Component {
  static defaultProps = {
    num: 0
  }
  render() {
    return (
      <div>
        <h2>User Stats</h2>
        Num users: {this.props.num}
      </div>
    )
  }
}

@autobind
class App extends React.Component {
  constructor() {
    super()
    this.state = this.getStateFromStores()
  }
  componentDidMount() {
    usersStore.listen(this.onChange)
    userStatsStore.listen(this.onChange)
  }
  componentWillUnmount() {
    usersStore.unlisten(this.onChange)
    userStatsStore.unlisten(this.onChange)
  }
  onChange() {
    this.setState(this.getStateFromStores())
  }
  getStateFromStores() {
    return {
      users: usersStore.getUsers(),
      num: userStatsStore.getNum()
    }
  }
  render() {
    return (
      <div>
        <UserForm />
        <UsersList users={this.state.users} />
        <UserStats num={this.state.num} />
      </div>
    )
  }
}

React.render(<App />, document.getElementById('app'))