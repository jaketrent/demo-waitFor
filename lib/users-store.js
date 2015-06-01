import autobind from 'autobind-decorator'
import clone from 'lodash/lang/clone'
import EventEmitter from 'events'

import appDispatcher from './app-dispatcher'

@autobind
class UsersStore extends EventEmitter {
  constructor() {
    super()
    this._users = []
    // -- Demo: ORDER MATTERS
    // -- Summary store is registered *before* this store to illustrate
    // -- the potential problem of listeners being registered in an
    // -- indeterminate order.
    setTimeout(()  => {
      this.dispatchToken = appDispatcher.register(this.messageCallback)
    }, 1)
  }
  _addUser(user) {
    this._users.push(user)
  }
  getUsers() {
    return clone(this._users)
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
        this._users.push(payload.user)
        this.emitChange()
        break
    }
  }
}
var usersStore = new UsersStore()

export default usersStore