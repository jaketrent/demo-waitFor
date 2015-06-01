import autobind from 'autobind-decorator'
import EventEmitter from 'events'

import appDispatcher from './app-dispatcher'
import usersStore from './users-store'

@autobind
class UserStatsStore extends EventEmitter {
  constructor() {
    super()
    this._num = 0
    this.dispatchToken = appDispatcher.register(this.messageCallback)
  }
  getNum() {
    return this._num
  }
  listen(listener) {
    this.addListener('change', listener)
  }
  unlisten(listener) {
    this.removeListener('change', listener)
  }
  emitChange() {
    this.emit('change')
  }
  messageCallback(payload) {
    switch (payload.actionType) {
      case 'ADD_USER':
        // -- Demo: UNCOMMENT THIS
        // -- To see the stats stay in sync with user updates
        //appDispatcher.waitFor([ usersStore.dispatchToken ])
        var users = usersStore.getUsers()
        if (users)
          this._num = users.length
        this.emitChange()
        break
    }
  }
}
var userStatsStore = new UserStatsStore()

export default userStatsStore