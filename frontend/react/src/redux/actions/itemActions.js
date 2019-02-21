export const SEARCH_VALUE_CHANGED = "SEARCH_VALUE_CHANGED";
export const searchValueChangedAction = (itemNameTerm) => ({
    type: SEARCH_VALUE_CHANGED,
    payload: {term: itemNameTerm}
});

export const FETCH_ITEM_SUPPLY_REQUESTED = "FETCH_ITEM_SUPPLY_REQUESTED";
export const itemSupplyRequestAction = (itemNameTerm, itemCategory) => ({
    type: FETCH_ITEM_SUPPLY_REQUESTED,
    payload: {term: itemNameTerm, category: itemCategory}
});
export const FETCH_ITEM_SUPPLY_SUCCEEDED = "FETCH_ITEM_SUPPLY_SUCCEEDED";
export const itemSupplySucceededAction = (itemSupplies, amount) => ({
    type: FETCH_ITEM_SUPPLY_SUCCEEDED,
    payload: {itemSupplies, amount}
});

export const BUY_QUANTITY_CHANGED = "BUY_QUANTITY_CHANGED";
export const buyQuantityChangedAction = (itemId, amount) => ({
    type: BUY_QUANTITY_CHANGED,
    payload: {amount, itemId}
});

export const BUY_ITEMS_REQUESTED = "BUY_ITEMS_REQUESTED";
export const buyItemsRequestedAction = (userName, itemId, amount, total, perItem) => ({
    type: BUY_ITEMS_REQUESTED,
    payload: {userName, itemId, amount, total, perItem},
});


export const FETCH_RANDOM_ITEMS_REQUESTED = "FETCH_RANDOM_ITEMS_REQUESTED";
export const fetchRandomItemsRequestedAction = () => ({
    type: FETCH_RANDOM_ITEMS_REQUESTED,
    payload: {}
});

export const FETCH_RANDOM_ITEMS_SUCCEEDED = "FETCH_RANDOM_ITEMS_SUCCEEDED";
export const fetchRandomItemsSucceededAction = (items) => {
    return {
        type: FETCH_RANDOM_ITEMS_SUCCEEDED,
        payload: items,
    }
};

export const BUY_ITEMS_SUCCEEDED = "BUY_ITEMS_SUCCEEDED";
export const buyItemsSucceededAction = (buyItems) => {
    return {
        type: BUY_ITEMS_SUCCEEDED,
        payload: buyItems,
    };
};

export const CREATE_SELL_ORDER_REQUESTED = "CREATE_SELL_ORDER_REQUESTED";
export const createSellOrderRequestedAction = (sellOrder) => {
    return {
        type: CREATE_SELL_ORDER_REQUESTED,
        payload: sellOrder,
    }
};

export const CREATE_SELL_ORDER_SUCCEEDED = "CREATE_SELL_ORDER_SUCCEEDED";
export const createSellOrderSucceededAction = (sellOrder) => {
    return {
        type: CREATE_SELL_ORDER_SUCCEEDED,
        payload: sellOrder
    };
};


export const ADD_ITEM_TO_SELLORDER_REQUESTED = 'ADD_ITEM_TO_SELLORDER_REQUESTED';
export const addItemToSellOrderRequestedAction = (sellOrder) => {
    return {
        type: ADD_ITEM_TO_SELLORDER_REQUESTED,
        payload: sellOrder,
    }
};

export const ADD_ITEM_TO_SELLORDER_SUCCEEDED = 'ADD_ITEM_TO_SELLORDER_SUCCEEDED';
export const addItemToSellOrderSucceeded = (sellOrder) => {
    return {
        type: ADD_ITEM_TO_SELLORDER_SUCCEEDED,
        payload: sellOrder,
    }
};

export const FETCH_AVERAGE_ITEM_PRICE_REQUESTED = "FETCH_AVERAGE_ITEM_PRICE_REQUESTED";
export const fetchAverageItemPriceRequestedAction = (amount, itemId) => ({
    type: FETCH_AVERAGE_ITEM_PRICE_REQUESTED,
    payload: {amount, itemId}
});

export const FETCH_AVERAGE_ITEM_PRICE_SUCCEEDED = "FETCH_AVERAGE_ITEM_PRICE_SUCCEEDED";
export const fetchAverageItemPriceSucceededAction = (itemId, perUnit, total) => ({
    type: FETCH_AVERAGE_ITEM_PRICE_SUCCEEDED,
    payload: {itemId, perUnit, total}
});

export const DELETE_SELLORDER_REQUESTED = "DELETE_SELLORDER_REQUESTED";
export const deleteSellOrderRequestedAction = (sellOrder) => {
    return {
        type: DELETE_SELLORDER_REQUESTED,
        payload: sellOrder,
    }
};

export const DELETE_SELLORDER_SUCCEEDED = "DELETE_SELLORDER_SUCCEEDED";
export const deleteSellOrderSucceededAction = (sellOrder) => {
    return {
        type: DELETE_SELLORDER_SUCCEEDED,
        payload: sellOrder,
    }
};

export const ITEM_SUPPLY_CHANGED = "ITEM_SUPPLY_CHANGED";
export const itemSupplyChangedAction = (itemId, quantity) => {
    return {
        type: ITEM_SUPPLY_CHANGED,
        payload: {itemId, quantity}
    }
}

export const USER_MONEY_REQUESTED = "USER_MONEY_REQUESTED";
export const userMoneyRequestedAction = (userName, realmName) => {
    return {
        type: USER_MONEY_REQUESTED,
        payload: {userName, realmName}
    }
};

export const USER_MONEY_REQUEST_SUCCEEDED = "USER_MONEY_REQUEST_SUCCEEDED";
export const userMoneyRequestSucceededAction = ({name, money}) => {
    return {
        type: USER_MONEY_REQUEST_SUCCEEDED,
        payload: {name, money}
    }
};

export const USER_SELL_ORDERS_REQUESTED = "USER_SELL_ORDERS_REQUESTED";
export const userSellOrdersRequestedAction = (userName, realmName) => {
    return {
        type: USER_SELL_ORDERS_REQUESTED,
        payload: {userName, realmName}
    }
};

export const USER_SELL_ORDERS_REQUEST_SUCCEEDED = "USER_SELL_ORDERS_REQUEST_SUCCEEDED";
export const userSellOrdersRequestSucceededAction = (sellOrders) => {
    return {
        type: USER_SELL_ORDERS_REQUEST_SUCCEEDED,
        payload: {sellOrders}
    }
};

export const ITEM_SOLD_ALERT = "ITEM_SOLD_ALERT";
export const soldAlertAction = (alert) => {
    return {
        type: ITEM_SOLD_ALERT,
        payload: {alert}
    }
}

export const ITEM_BOUGHT_SUBSCRIPTION = "ITEM_BOUGHT_SUBSCRIPTION";
export const itemBoughtSubscriptionAction = (receipt) => {
    return {
        type: ITEM_BOUGHT_SUBSCRIPTION,
        payload: {receipt}
    }
}
