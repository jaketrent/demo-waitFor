import autobind from 'autobind-decorator'
import React from 'react'

import usersStore from './users-store'
import userStatsStore from './user-stats-store'
import UserForm from './user-form'
import UsersList from './users-list'
import UserStats from './user-stats'

@autobind
class App extends React.Component {
  constructor() {
    super()
    this.state = this.getStateFromStores()
  }
  componentDidMount() {
    userStatsStore.listen(this.onChange)
    usersStore.listen(this.onChange)
  }
  componentWillUnmount() {
    userStatsStore.unlisten(this.onChange)
    usersStore.unlisten(this.onChange)
  }
  onChange() {
    this.setState(this.getStateFromStores())
  }
  getStateFromStores() {
    return {
      num: userStatsStore.getNum(),
      users: usersStore.getUsers()
    }
  }
  render() {
    return (
      <div>
        <h1>Dispatcher.waitFor Demo</h1>
        <p style={{ maxWidth: 400 }}>
          Note that this demo is broken in order to show the need for
          `Dispatcher.waitFor`.  Open `lib/user-stats-store.js` and
          uncomment the specified line to use the method and fix the
          user stats on this page.
        </p>
        <UserForm />
        <UsersList users={this.state.users} />
        <UserStats num={this.state.num} />
      </div>
    )
  }
}

export function start() {
  React.render(<App />, document.getElementById('app'))
}