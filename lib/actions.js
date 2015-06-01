import appDispatcher from './app-dispatcher'

export default {
  addUser(user) {
    appDispatcher.dispatch({
      actionType: 'ADD_USER',
      user
    })
  }
}