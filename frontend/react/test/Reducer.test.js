import {
    BUY_QUANTITY_CHANGED,
    CHANGE_DETAIL_ITEM, FETCH_AVERAGE_ITEM_PRICE_SUCCEEDED, FETCH_ITEM_SUPPLY_SUCCEEDED, FETCH_RANDOM_ITEMS_SUCCEEDED,
    SEARCH_VALUE_CHANGED,
    SET_SELLING_DETAILS
} from "../src/redux/actions/itemActions";
import reducer, {initState} from "../src/redux/reducer";
import expect from 'expect'
import {QUANTITY_EXCEEDED} from "../src/redux/actions/actions";

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
    })þ
});
