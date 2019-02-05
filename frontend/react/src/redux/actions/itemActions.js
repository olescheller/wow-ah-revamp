
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