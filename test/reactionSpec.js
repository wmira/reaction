

const should = require('should');
const { createStoreActions, createStore } = require('../index');

describe('createStoreActions', () => {

    it('contains proper shape', () => {
        const storeActions = createStoreActions( 'store1', {}, [((x) => x)] );
        should(storeActions).have.property('name');
        should(storeActions).have.property('state');
        should(storeActions).have.property('actions');
    });


    it('can create from array only args', () => {
        const actionDummy = function() {};
        const storeActions = createStoreActions( [actionDummy] );
        should(storeActions).have.property('name');
        should(storeActions).have.property('state');
        should(storeActions).have.property('actions');
    });
    it('can create with name and action only arg' , () => {
        const actionDummy = function() {};
        const storeActions = createStoreActions( 'mystore', [actionDummy] );
        should(storeActions).have.property('name', 'mystore');
        should(storeActions).have.property('state',{});
        should(storeActions).have.property('actions');
    });
});


describe('createStore', () => {

    it('createStore properly registers storeActions ', () => {

        const increment = ( {count = 0} ) => ({count: count+1}) ;
        const store = createStore([
            createStoreActions([increment]),
            createStoreActions('counter2', [increment]),
        ]);
        should(store).be.ok();
        store.should.have.property('actions');
        should(store.actions).have.property('increment');
        should(store.actions).have.property('counter2');

    });

    it('createStore actions are able to modify mutate state ', () => {
        const increment = ( {}, {count = 0} ) => ({count: count+1}) ;
        const store = createStore([
            createStoreActions([increment]),
            createStoreActions('counter2', [increment]),
        ]);
        should(store).be.ok();
        store.should.have.property('actions');

        const { increment: incrementCount, counter2: { increment: incrementCounter2 } } = store.actions;

        incrementCount();
        incrementCounter2();

        should(store.state).have.property('count', 1);
        should(store.state).have.property('counter2');
        should(store.state.counter2).have.property('count',1);

        incrementCount();
        incrementCounter2();

        should(store.state).have.property('count', 2);
        should(store.state.counter2).have.property('count', 2);

        incrementCount();
        incrementCounter2();

        should(store.state).have.property('count', 3);
        should(store.state.counter2).have.property('count', 3);

    });

    it('store dispatches to listeners', () => {
        const increment = ( {}, {count = 0} ) => ({count: count+1}) ;

        const store = createStore([
            createStoreActions([increment]),
            createStoreActions('counter2', [increment]),
        ]);
        let called = false;
        store.subscribe( () => {
            called = true;
        });

        store.actions.increment();

        should(called).be.exactly(true);
    });
    it.only('store passes a setState', () => {
        const increment = function() {
            return function(setState) {
                setState({ok: 1});
            };
        };

        const store = createStore([
            createStoreActions([increment]),
        ]);
        store.actions.increment();
    });
});
