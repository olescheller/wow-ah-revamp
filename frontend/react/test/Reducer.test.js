import {
    BUY_ITEMS_SUCCEEDED,
    BUY_QUANTITY_CHANGED,
    CHANGE_DETAIL_ITEM,
    CREATE_SELL_ORDER_SUCCEEDED,
    DELETE_SELLORDER_SUCCEEDED,
    FETCH_AVERAGE_ITEM_PRICE_SUCCEEDED,
    FETCH_ITEM_SUPPLY_SUCCEEDED,
    FETCH_RANDOM_ITEMS_SUCCEEDED,
    FETCH_USER_MONEY_SUCCEEDED,
    FETCH_USER_SELLORDERS_SUCCEEDED, ITEM_BOUGHT_SUBSCRIPTION,
    ITEM_SOLD_ALERT,
    ITEM_SUPPLY_CHANGED,
    SEARCH_VALUE_CHANGED,
    SET_SELLING_DETAILS
} from "../src/redux/actions/itemActions";
import reducer, {initState} from "../src/redux/reducer";
import expect from 'expect'
import {QUANTITY_EXCEEDED, REMOVE_ALERT, SET_INFO_BOX, SET_LOADING} from "../src/redux/actions/actions";

const state = initState;

describe('reducer', () => {
    it('should handle SET_SELLING_DETAILS', () => {
        const currentState = {...state};
        const action = {
            type: SET_SELLING_DETAILS,
            payload: "Foo"
        };
        const newState = {...currentState, detailItem: action.payload};
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle CHANGE_DETAIL_ITEM', () => {
        const currentState = {...state};
        currentState.detailItem = {Foo: "Bar", Baz: 1};

        const action = {
            type: CHANGE_DETAIL_ITEM,
            payload: {Foo: "Baz"}
        };
        const newState = {...currentState, detailItem: {...currentState.detailItem, ...{...action.payload}}};
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle SEARCH_VALUE_CHANGED', () => {
        const currentState = {...state};
        const action = {
            type: SEARCH_VALUE_CHANGED,
            payload: {term: "Baz"}
        };
        const newState = {...currentState, searchTerm: action.payload.term};
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle BUY_QUANTITY_CHANGED no amount', () => {
        const currentState = {...state, buyQuantity: {1: 0}, quantityExceeded: []};
        const action = {
            type: BUY_QUANTITY_CHANGED,
            payload: {amount: '', itemId: 1}
        };
        const newState = {...currentState, buyQuantity: {1: NaN}, price: {1: {perUnit: 0, total: 0}}};
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle BUY_QUANTITY_CHANGED with amount', () => {
        const currentState = {...state, buyQuantity: {2: 0}, quantityExceeded: []};
        const action = {
            type: BUY_QUANTITY_CHANGED,
            payload: {amount: 4, itemId: 2}
        };
        const newState = {...currentState, buyQuantity: {2: 4}, quantityExceeded: []};
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle BUY_QUANTITY_CHANGED with amount/quantity exceeded removed', () => {
        const currentState = {...state, buyQuantity: {2: 0}, quantityExceeded: [1, 2]};
        const action = {
            type: BUY_QUANTITY_CHANGED,
            payload: {amount: 4, itemId: 2}
        };
        const newState = {...currentState, buyQuantity: {2: 4}, quantityExceeded: [1]};
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle QUANTITY_EXCEEDED', () => {
        const currentState = {...state};
        const action = {
            type: QUANTITY_EXCEEDED,
            payload: {amount: 4, itemId: 2}
        };
        const newState = {
            ...currentState,
            price: {2: {perUnit: 0, total: 0}},
            buyQuantity: {2: 4},
            quantityExceeded: [2]
        };
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle FETCH_AVERAGE_ITEM_PRICE_SUCCEEDED', () => {
        const currentState = {...state};
        const action = {
            type: FETCH_AVERAGE_ITEM_PRICE_SUCCEEDED,
            payload: {perUnit: 4, itemId: 2, total: 12}
        };
        const newState = {...currentState, price: {2: {perUnit: 4, total: 12}}};
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle FETCH_ITEM_SUPPLY_SUCCEEDED over 25', () => {
        const currentState = {...state};
        const action = {
            type: FETCH_ITEM_SUPPLY_SUCCEEDED,
            payload: {amount: 26, itemSupplies: [{item: {id: 1}}, {item: {id: 2}}, {item: {id: 3}}]}
        };
        const newState = {
            ...currentState,
            itemSupplies: action.payload.itemSupplies,
            amountOfItemSupplies: 26,
            showInfoBox: true,
            price: {1: {perUnit: 0, total: 0}, 2: {perUnit: 0, total: 0}, 3: {perUnit: 0, total: 0}},
            buyQuantity: {}
        };
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle FETCH_ITEM_SUPPLY_SUCCEEDED under 25', () => {
        const currentState = {...state};
        const action = {
            type: FETCH_ITEM_SUPPLY_SUCCEEDED,
            payload: {amount: 2, itemSupplies: [{item: {id: 1}}, {item: {id: 2}}, {item: {id: 3}}]}
        };
        const newState = {
            ...currentState,
            itemSupplies: action.payload.itemSupplies,
            amountOfItemSupplies: 0,
            showInfoBox: false,
            price: {1: {perUnit: 0, total: 0}, 2: {perUnit: 0, total: 0}, 3: {perUnit: 0, total: 0}},
            buyQuantity: {}
        };
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle FETCH_RANDOM_ITEMS_SUCCEEDED', () => {
        const currentState = {...state};
        const action = {
            type: FETCH_RANDOM_ITEMS_SUCCEEDED,
            payload: "Foo"
        };
        const newState = {...currentState, inventoryItems: action.payload};
        expect(reducer(currentState, action)).toEqual(newState)
    });
});

describe('reducer', () => {
    it('should handle CREATE_SELL_ORDER_SUCCEEDED', () => {
        const currentState = {...state, inventoryItems: [{item: {id: 1}, quantity: 2}, {item: {id: 42}, quantity: 3}]};
        const action = {
            type: CREATE_SELL_ORDER_SUCCEEDED,
            payload: {item: {id: 1}, quantity: 2}
        };
        const newState = {
            ...currentState, activeSellOrders: [...state.activeSellOrders, action.payload],
            inventoryItems: [{item: {id: 42}, quantity: 3}]
        };
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle FETCH_USER_SELLORDERS_SUCCEEDED', () => {
        const currentState = {...state};
        const action = {
            type: FETCH_USER_SELLORDERS_SUCCEEDED,
            payload: {sellOrders: [1, 2, 3]}
        };
        const newState = {...currentState, activeSellOrders: [1, 2, 3]};
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle DELETE_SELLORDER_SUCCEEDED item does not exist in inventory', () => {
        const currentState = {...state, activeSellOrders: [{item: {id: 1}, quantity: 1}, {item: {id: 2}, quantity: 2}]};
        const action = {
            type: DELETE_SELLORDER_SUCCEEDED,
            payload: {item: {id: 2}}
        };
        const newState = {
            ...currentState,
            activeSellOrders: [{item: {id: 1}, quantity: 1}],
            inventoryItems: [{item: {id: 2}, quantity: 2}]
        };
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle DELETE_SELLORDER_SUCCEEDED item does exist in inventory', () => {
        const currentState = {
            ...state,
            inventoryItems: [{item: {id: 2}, quantity: 1}],
            activeSellOrders: [{item: {id: 1}, quantity: 1}, {item: {id: 2}, quantity: 2}]
        };
        const action = {
            type: DELETE_SELLORDER_SUCCEEDED,
            payload: {item: {id: 2}}
        };
        const newState = {
            ...currentState,
            activeSellOrders: [{item: {id: 1}, quantity: 1}],
            inventoryItems: [{item: {id: 2}, quantity: 3}]
        };
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle SET_LOADING', () => {
        const currentState = {...state}
        const action = {
            type: SET_LOADING,
            payload: true
        };
        const newState = {...currentState, isLoading: true};
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle SET_LOADING', () => {
        const currentState = {...state};
        const action = {
            type: SET_LOADING,
            payload: true
        };
        const newState = {...currentState, isLoading: true};
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle SET_INFO_BOX', () => {
        const currentState = {...state};
        const action = {
            type: SET_INFO_BOX,
            payload: true
        };

        const newState = {...currentState, showInfoBox: true};
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle FETCH_USER_MONEY_SUCCEEDED', () => {
        const currentState = {...state};
        const action = {
            type: FETCH_USER_MONEY_SUCCEEDED,
            payload: {money: 1337, name: "John"}
        };

        const newState = {...currentState, money: action.payload.money, user: action.payload.name};
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle ITEM_SUPPLY_CHANGED', () => {
        const currentState = {...state, itemSupplies: [{item: {id: 1}, quantity: 66}]};
        const action = {
            type: ITEM_SUPPLY_CHANGED,
            payload: {itemId: 1, quantity: 2}
        };

        const newState = {...currentState, itemSupplies: [{item: {id: 1}, quantity: 2}]};
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle ITEM_SOLD_ALERT items left over', () => {
        const currentState = {...state, activeSellOrders: [{item: {id: 1, name: "Foo"}, quantity: 2}]};
        const action = {
            type: ITEM_SOLD_ALERT,
            payload: {alert: {money: 1337, itemName: "Foo", amount: 1}}
        };

        const newState = {
            ...currentState, money: 1337, activeSellOrders: [{item: {id: 1, name: "Foo"}, quantity: 1}],
            soldAlert: {money: 1337, itemName: "Foo", amount: 1}, alert: true
        };
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle ITEM_SOLD_ALERT no items left over', () => {
        const currentState = {...state, activeSellOrders: [{item: {id: 1, name: "Foo"}, quantity: 2}]};
        const action = {
            type: ITEM_SOLD_ALERT,
            payload: {alert: {money: 1337, itemName: "Foo", amount: 2}}
        };

        const newState = {
            ...currentState, money: 1337, activeSellOrders: [],
            soldAlert: {money: 1337, itemName: "Foo", amount: 2}, alert: true
        };
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle REMOVE_ALERT', () => {
        const currentState = {...state};
        const action = {
            type: REMOVE_ALERT,
            payload: 0
        };
        const newState = {...currentState, alert: false};
        expect(reducer(currentState, action)).toEqual(newState)
    })
});

describe('reducer', () => {
    it('should handle ITEM_BOUGHT_SUBSCRIPTION', () => {
        const currentState = {
            ...state, itemSupplies: [
                {item: {id: 1}, quantity: 1, min_price: 1},
                {item: {id: 2}, quantity: 2, min_price: 2},
                {item: {id: 3}, quantity: 3, min_price: 3}
            ]
        };
        const action = {
            type: ITEM_BOUGHT_SUBSCRIPTION,
            payload: {receipt: {amount: 6, min_price: 33, item: {id: 1}}}
        };
        const newState = {
            ...currentState, itemSupplies: [
                {item: {id: 1}, quantity: 6, min_price: 33},
                {item: {id: 2}, quantity: 2, min_price: 2},
                {item: {id: 3}, quantity: 3, min_price: 3}
            ]
        };
        expect(reducer(currentState, action)).toEqual(newState)
    })
});
