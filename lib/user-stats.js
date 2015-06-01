import React from 'react'

export default class UserStats extends React.Component {
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
