
const { freeze, keys, assign } = Object;

/**
 * Create a store with a given name and the given initial state
 * with the given actions
 *
 * Actions takes in {arguments} and {currentState} and returns a newState
 */
const createStoreActions = function( arg1, arg2, arg3 ) {
    let name;
    let state = {};
    let actions;

    if ( Array.isArray(arg1) && !arg2 && !arg3 ) {
        actions = arg1;

    } else if ( typeof arg1 === 'object' && Array.isArray(arg2) ) {
        state = arg1;
        actions = arg2;
    } else if ( typeof arg1 === 'string' && Array.isArray(arg2) ) {
        name = arg1;
        actions = arg2;

    } else {
        name = arg1;
        state = arg2;
        actions = arg3;
    }

    return { name, state, actions };
};
const __ROOT__ = '__ROOT__';


const dispatchStateChange = function(listeners, store, state ) {
    //FIXME, some listeners are different
    keys(listeners)
        .filter( key => key === __ROOT__ || key === store )
        .forEach( key => {
            listeners[key].forEach( listener => {
                try {
                    listener(state, store);
                } catch ( e ) {
                    //err
                    console.warn('Error calling listener', e);
                }
            });
        });

};

/**
 * contains the top level state for a given app
 */
const createStore = function( stores , remote ) {

    let state = {}; //top level
    let actions = {};
    let listeners = {
        [__ROOT__]: []
    };
     //initialize the state per store
    stores.forEach( store => {
        if ( state[store.name] ) {
            throw new Error(store.name  + ' duplicate store name');
        }
        if ( store.name ) {
            state[store.name] = freeze(store.state || {});
        } else {
            state = assign({}, store.state);
        }
        listeners[store.name] = [];
    });
    state = freeze(state);

     //now create action handlers
    stores.forEach( store => {
        var actionMountPoint = store.name ? actions[store.name] = {} : actions;
        const {actions: storeActions} = store;
        storeActions.forEach( storeAction => { //storeAction is a function here

            actionMountPoint[storeAction.name] = function()  { //this is actuall a function
                const stateArg = store.name ? state[store.name] : state;
                const args = Array.from(arguments);
                const actionParam = args.length === 0 ? {} : args[0]; //if first arg is empty or no args, we will create an empty one
                const newState = storeAction.call(null, actionParam, stateArg, state );
                if ( newState ) {
                    if ( typeof newState === 'function' ) {
                        const setState = (theNewState) => {
                            if ( theNewState ) {
                                state = freeze({...state, ...(store.name ? { [store.name]: newState } : newState) });
                                dispatchStateChange(listeners, store.name, state[store.name]);
                            }
                        };
                        newState(setState, remote);
                    } else {
                        state = freeze({ ...state, ...(store.name ? { [store.name]: newState } : newState) });
                        dispatchStateChange(listeners, store.name, state[store.name]);
                    }
                }
            };
        });
    });

    return {
        get actions() {
            return actions;
        },
        subscribe(nameOrListener, listener) {
            if ( typeof nameOrListener === 'function' ) {
                listeners[__ROOT__].push(nameOrListener);
            } else if ( typeof nameOrListener === 'string' && typeof listener === 'function' ) {
                listeners[nameOrListener].push(listener);
            }
        },
        get state() {
            return state;
        },
        getState() {
            return state;
        }
    };
};



module.exports = { createStore, createStoreActions };
