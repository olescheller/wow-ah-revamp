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
        expect(itemActions.itemSupplySucceededAction([1, 2, 3], 3)).toEqual(expectedAction)
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
        expect(itemActions.buyItemsRequestedAction("John-Doe", 42, 2, 11, 22)).toEqual(expectedAction)
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

describe('itemActions', () => {
    it('should create an action to notify of succeeded random item fetch', () => {
        const expectedAction = {
            type: itemActions.FETCH_RANDOM_ITEMS_SUCCEEDED,
            payload: [1, 2, 3]
        };
        expect(itemActions.fetchRandomItemsSucceededAction([1, 2, 3])).toEqual(expectedAction)
    })
});

describe('itemActions', () => {
    it('should create an action to notify of succeeded buying of items', () => {
        const expectedAction = {
            type: itemActions.BUY_ITEMS_SUCCEEDED,
            payload: {Foo: "Bar"}
        };
        expect(itemActions.buyItemsSucceededAction({Foo: "Bar"})).toEqual(expectedAction)
    })
});

describe('itemActions', () => {
    it('should create an action to request the creation of sell order', () => {
        const expectedAction = {
            type: itemActions.CREATE_SELL_ORDER_REQUESTED,
            payload: {Foo: "Bar"}
        };
        expect(itemActions.createSellOrderRequestedAction({Foo: "Bar"})).toEqual(expectedAction)
    })
});

describe('itemActions', () => {
    it('should create an action to create sell order', () => {
        const expectedAction = {
            type: itemActions.CREATE_SELL_ORDER_SUCCEEDED,
            payload: {Foo: "Bar"}
        };
        expect(itemActions.createSellOrderSucceededAction({Foo: "Bar"})).toEqual(expectedAction)
    })
});



describe('itemActions', () => {
    it('should create an action to request the average item price of an item for a certain amount', () => {
        const expectedAction = {
            type: itemActions.FETCH_AVERAGE_ITEM_PRICE_REQUESTED,
            payload: {amount: 42, itemId: 1337}
        };
        expect(itemActions.fetchAverageItemPriceRequestedAction(42,1337)).toEqual(expectedAction)
    })
});

describe('itemActions', () => {
    it('should create an action to notify of succeeded fetching of average item price', () => {
        const expectedAction = {
            type: itemActions.FETCH_AVERAGE_ITEM_PRICE_SUCCEEDED,
            payload: {itemId: 1337, perUnit: 22, total: 66}
        };
        expect(itemActions.fetchAverageItemPriceSucceededAction(1337, 22, 66)).toEqual(expectedAction)
    })
});

describe('itemActions', () => {
    it('should create an action to request to delete an sell order', () => {
        const expectedAction = {
            type: itemActions.DELETE_SELLORDER_REQUESTED,
            payload: {Foo:"Bar"}
        };
        expect(itemActions.deleteSellOrderRequestedAction( {Foo:"Bar"})).toEqual(expectedAction)
    })
});

describe('itemActions', () => {
    it('should create an action to delete an sell order', () => {
        const expectedAction = {
            type: itemActions.DELETE_SELLORDER_SUCCEEDED,
            payload: {Foo:"Bar"}
        };
        expect(itemActions.deleteSellOrderSucceededAction( {Foo:"Bar"})).toEqual(expectedAction)
    })
});

describe('itemActions', () => {
    it('should create an action to request to fetch user money', () => {
        const expectedAction = {
            type: itemActions.FETCH_USER_MONEY_REQUESTED,
            payload: {userName:"John", realmName:"Doe"}
        };
        expect(itemActions.fetchUserMoneyRequestedAction( "John", "Doe")).toEqual(expectedAction)
    })
});

describe('itemActions', () => {
    it('should create an action to fetch user money', () => {
        const expectedAction = {
            type: itemActions.FETCH_USER_MONEY_SUCCEEDED,
            payload: {name:"John-Doe", money: 1337}
        };
        expect(itemActions.fetchUserMoneySucceededAction( {name:"John-Doe", money:1337})).toEqual(expectedAction)
    })
});

describe('itemActions', () => {
    it('should create an action to request to fetch user sell orders', () => {
        const expectedAction = {
            type: itemActions.FETCH_USER_SELLORDERS_REQUESTED,
            payload: {userName:"Foo", realmName:"Bar"}
        };
        expect(itemActions.fetchUserSellOrdersRequestedAction( "Foo", "Bar")).toEqual(expectedAction)
    })
});


describe('itemActions', () => {
    it('should create an action to fetch user sell orders', () => {
        const expectedAction = {
            type: itemActions.FETCH_USER_SELLORDERS_SUCCEEDED,
            payload: {sellOrders:[1,2,3]}
        };
        expect(itemActions.fetchUserSellOrdersSucceededAction( [1,2,3])).toEqual(expectedAction)
    })
});

describe('itemActions', () => {
    it('should create an action to notify of a sold item', () => {
        const expectedAction = {
            type: itemActions.ITEM_SOLD_ALERT,
            payload: {alert: {Foo:42}}
        };
        expect(itemActions.itemSoldAlertAction( {Foo:42})).toEqual(expectedAction)
    })
});

describe('itemActions', () => {
    it('should create an action to notify of a bought item', () => {
        const expectedAction = {
            type: itemActions.ITEM_BOUGHT_SUBSCRIPTION,
            payload: {receipt: {Foo:42}}
        };
        expect(itemActions.itemBoughtSubscriptionAction( {Foo:42})).toEqual(expectedAction)
    })
});


