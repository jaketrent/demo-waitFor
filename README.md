# demo-waitFor

Demo for how Dispatcher.waitFor can be useful

Shows a simple user form, list of users, and a stats display for the number of users.  

## To run

```
npm install
npm start
open localhost:3000
```

## The built-in bug

When users are added, they are shown correctly in the list.  However, the stats component is not in sync with the actual users in the list.  This is because the store that backs stats (`user-stats-store.js`) is a derivative or summary store of the `users-store.js`.  In other words, the stats store updates its data based on the users store's data.  

But the dispatcher gives no guarantees that the stores will receive the messages in any particular order.  So, there is a purposefully-bad bit of code (in `users-store.js#constructor`) that will help create the problem and illustrate real-world conditions.  

## To fix the bug

```
open lib/user-states-store.js
```

And uncomment the line that reads:

```
appDispatcher.waitFor([ usersStore.dispatchToken ])
```

By adding the `waitFor` call, we are specifying that before we calculate the data for our summary store, we need the source store to resolve the message currently being sent across the dispatcher.

Refresh your browser, and see the stats stay in sync with the list.
