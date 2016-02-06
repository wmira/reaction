reaction
========

reaction is a simple state management library that can be used with a React
application. This is simply [WIP] or an expriment if you will. You probably should be using [redux](https://www.google.com) or a flux implementation like [altjs](https://github.com/goatslacker/alt)

# Installation

```console
    npm install --save reaction-js
```

# storeActions
a store represent a state group within the state tree. These states are modified
by actions. Actions are simple functions. Note that action functions needs to have
the a specific signature.

```javascript
    const incrementCount function({}, storeState ) {
        const {count: currentCount} = storeState;
        const count = currentCount + 1;

        return { count }; //new state
    }
```

stores can be created using the createStore function.

```javascript


import { createStoreActions } from 'reaction-js';

const add = ( {todo} , {todos = []} ) => {
    //...
};
const delete = ( {id} , {todos = []} ) => {
    //...
};

const update = ( {todo} , {todos = []} ) => {
    //...
};

const storeActions =  createStoreActions( 'todos', add, delete, update );

```

# store

To create the store, you need to pass storeActions.

```javascript
const store = createStore( [storeActions] );

store.actions.increment();

console.log(store.state);

```

a store has the following signature

1. store.state

Attribute representing the current state. There is a function named store.getState()
that returns the same e.g. store.state and store.getState() points to the same object.
Choose your poison.

2. store.actions

Attribute representing all store actions. E.g. if you register increment on the root
store, the store.actions.increment is available that can be used by clients to change the state.

3. store.subscribe

Function that can be used to subscribe which is called whenever the state changes.

# Testing

```console

npm run Testing

```

# License

MIT
