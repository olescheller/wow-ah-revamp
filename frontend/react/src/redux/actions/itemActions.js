
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
export const buyItemAction = (userName, itemId, amount, total, perItem) => ({
    type: BUY_ITEMS_REQUESTED,
    payload:  {userName, itemId, amount, total, perItem},
});


export const FETCH_RANDOM_ITEMS_REQUESTED = "FETCH_RANDOM_ITEMS_REQUESTED";
export const randomItemsRequested = () => ({
  type:  FETCH_RANDOM_ITEMS_REQUESTED,
    payload: {}
});

export const RANDOM_ITEMS_SUCCEEDED = "RANDOM_ITEMS_SUCCEEDED";
export const randomItemsSucceeded = (items) => {
    return {
        type: RANDOM_ITEMS_SUCCEEDED,
        payload: items,
    }
}

export const BUY_ITEMS_SUCCEEDED = "BUY_ITEMS_SUCCEEDED";
export const buyItemsSucceeded = (buyItems) => {
    console.log({buyItems});
    return {
        type: BUY_ITEMS_SUCCEEDED,
        payload: buyItems,
    };
}

export const CREATE_SELL_ORDER = "CREATE_SELL_ORDER";
export const createSellOrder = (sellOrder) => {
    return {
        type: CREATE_SELL_ORDER,
        payload: sellOrder,
    }
}

export const SELL_ORDER_SUCCEEDED = "SELL_ORDER_SUCCEEDED";
export const sellOrderSucceeded = (sellOrder) => {
    return {
        type: SELL_ORDER_SUCCEEDED,
        payload: sellOrder
    };
}


export const ADD_TO_SELLORDER_REQUESTED = 'ADD_TO_SELLORDER_REQUESTED';
export const addItemToSellOrderRequested = (sellOrder) => {
    return {
        type: ADD_TO_SELLORDER_REQUESTED,
        payload: sellOrder,
    }
}


export const ADD_TO_SELLORDER_SUCCEEDED = 'ADD_TO_SELLORDER_SUCCEEDED';
export const addItemToSellOrderSucceeded = (sellOrder) => {
    return {
        type: ADD_TO_SELLORDER_SUCCEEDED,
        payload: sellOrder,
    }
}


export const AVERAGE_ITEM_PRICE_REQUESTED = "AVERAGE_ITEM_PRICE_REQUESTED";
export const queryAverageItemPriceAction = (amount, itemId) => ({
    type: AVERAGE_ITEM_PRICE_REQUESTED,
    payload: {amount, itemId}
});

export const AVERAGE_ITEM_PRICE_SUCCEEDED = "AVERAGE_ITEM_PRICE_SUCCEEDED";
export const averageItemPriceSucceeded = (itemId, perUnit, total) => ({
    type: AVERAGE_ITEM_PRICE_SUCCEEDED,
    payload: {itemId, perUnit, total}
});

export const REMOVE_SELLORDER_REQUESTED = "REMOVE_SELLORDER_REQUESTED";
export const deleteSellOrderAction = (sellOrder) => {
    return {
        type: REMOVE_SELLORDER_REQUESTED,
        payload: sellOrder,
    }
}

export const DELETE_SELL_ORDER_SUCCEEDED = "DELETE_SELL_ORDER_SUCCEEDED";
export const deleteSellOrderSucceeded = (sellOrder) => {
    return {
        type: DELETE_SELL_ORDER_SUCCEEDED,
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