import React from 'react'

export default class UsersList extends React.Component {
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
