import * as actions from '../src/redux/actions/actions'
import * as itemActions from '../src/redux/actions/itemActions'

describe('actions', () => {
    it('should create an action to notify of exceeded quantity of an item', () => {
        const expectedAction = {
            type: actions.QUANTITY_EXCEEDED,
            payload: {itemId: 1337}
        };
        expect(actions.quantityExceededAction(1337)).toEqual(expectedAction)
    })
});

describe('actions', () => {
    it('should create an action to set loading', () => {
        const expectedAction = {
            type: actions.SET_LOADING,
            payload: true
        };
        expect(actions.setLoading(true)).toEqual(expectedAction)
    })
});

describe('actions', () => {
    it('should create an action to set the visibility of an info box', () => {
        const expectedAction = {
            type: actions.SET_INFO_BOX,
            payload: true
        };
        expect(actions.setInfoBox(true)).toEqual(expectedAction)
    })
});

describe('itemActions', () => {
    it('should create an action to set the current search value', () => {
        const expectedAction = {
            type: itemActions.SEARCH_VALUE_CHANGED,
            payload: {term: "Foo"}
        };
        expect(itemActions.searchValueChangedAction("Foo")).toEqual(expectedAction)
    })
});

describe('itemActions', () => {
    it('should create an action to fetch item supply', () => {
        const expectedAction = {
            type: itemActions.FETCH_ITEM_SUPPLY_REQUESTED,
            payload: {term: "Foo", category: 1}
        };
        expect(itemActions.itemSupplyRequestAction("Foo", 1)).toEqual(expectedAction)
    })
});

describe('itemActions', () => {
    it('should create an action to fetch the correct amount of item supplies', () => {
        const expectedAction = {
            type: itemActions.FETCH_ITEM_SUPPLY_SUCCEEDED,
            payload: {itemSupplies: [1, 2, 3], amount: 3}
        };
        expect(itemActions.itemSupplySucceededAction([1,2,3], 3)).toEqual(expectedAction)
    })
});


describe('itemActions', () => {
    it('should create an action to change the buy quantity of an item', () => {
        const expectedAction = {
            type: itemActions.BUY_QUANTITY_CHANGED,
            payload: {amount: 42, itemId: 1337}
        };
        expect(itemActions.buyQuantityChangedAction(1337, 42)).toEqual(expectedAction)
    })
});

describe('itemActions', () => {
    it('should create an action to request to buy an item', () => {
        const expectedAction = {
            type: itemActions.BUY_ITEMS_REQUESTED,
            payload: {userName: "John-Doe", itemId: 42, amount: 2, total: 11, perItem: 22}
        };
        expect(itemActions.buyItemsRequestedAction("John-Doe", 42, 2, 11,22 )).toEqual(expectedAction)
    })
});

describe('itemActions', () => {
    it('should create an action to fetch random items ', () => {
        const expectedAction = {
            type: itemActions.FETCH_RANDOM_ITEMS_REQUESTED,
            payload: {}
        };
        expect(itemActions.fetchRandomItemsRequestedAction()).toEqual(expectedAction)
    })
});
