import {
    SELECT_CATEGORY, SET_LOADING, SET_INFO_BOX, QUANTITY_EXCEEDED, CHANGE_LOGGED_IN_USER
} from "./actions/actions";
import {
    BUY_QUANTITY_CHANGED,
    AVERAGE_ITEM_PRICE_SUCCEEDED,
    FETCH_ITEM_SUPPLY_SUCCEEDED,
    SEARCH_VALUE_CHANGED,
    BUY_ITEM_SUCCEEDED,
    BUY_ITEMS_SUCCEEDED,
    RANDOM_ITEMS_SUCCEEDED,
    SELL_ORDER_SUCCEEDED,
    DELETE_SELL_ORDER,
    ADD_TO_SELLORDER_SUCCEEDED,
    DELETE_SELL_ORDER_SUCCEEDED,
    USER_MONEY_REQUEST_SUCCEEDED,
    ITEM_SUPPLY_CHANGED
} from "./actions/itemActions";

const initState = {
    user: "",
    money: 0,
    selectedCategory: NaN,
    selectedSubCategory: NaN,
    searchTerm: "topaz",
    itemSupplies: [],
    buyQuantity: {},
    price: {},
    isLoading: false,
    showInfoBox: false,
    amountOfItemSupplies: 0,
    quantityExceeded: [],
    inventoryItems: [],
    activeSellOrders: [],
};

export default (state = initState, action) => {
    switch (action.type) {
        case SELECT_CATEGORY:
            return {...state, selectedCategory: action.payload};
        case SEARCH_VALUE_CHANGED:
            return {...state, searchTerm: action.payload.term}; // missing: category (combine main & subcategory)
        case BUY_QUANTITY_CHANGED:
            let tempBuyQuantity = {...state.buyQuantity};
            tempBuyQuantity[action.payload.itemId] = parseInt(action.payload.amount);
            let tmpQuantityExceeded = [...state.quantityExceeded]
            if (tmpQuantityExceeded.indexOf(action.payload.itemId) !== -1) {
                tmpQuantityExceeded = tmpQuantityExceeded.filter(i => i !== action.payload.itemId);
            }
            if (action.payload.amount === '') {
                let tmpPrice = {...state.price}
                tmpPrice[action.payload.itemId] = {perUnit: 0, total: 0};
                return {...state, buyQuantity: tempBuyQuantity, price: tmpPrice};
            }
            return {...state, buyQuantity: tempBuyQuantity, quantityExceeded: tmpQuantityExceeded};
        case QUANTITY_EXCEEDED:
            tempBuyQuantity = {...state.buyQuantity};
            tempBuyQuantity[action.payload.itemId] = parseInt(action.payload.amount);
            tmpPrice = {...state.price}
            tmpPrice[action.payload.itemId] = {perUnit: 0, total: 0};
            tmpQuantityExceeded = [...state.quantityExceeded];
            tmpQuantityExceeded.push(action.payload.itemId);
            return {...state, price: tmpPrice, buyQuantity: tempBuyQuantity, quantityExceeded: tmpQuantityExceeded};
        case AVERAGE_ITEM_PRICE_SUCCEEDED:
            const tempPrice = {...state.price};
            tempPrice[action.payload.itemId] = {perUnit: action.payload.perUnit, total: action.payload.total};
            return {...state, price: tempPrice};
        case FETCH_ITEM_SUPPLY_SUCCEEDED:
            let amount = 0;
            let showInfoBox = false;
            if (action.payload.amount > 25) {
                amount = parseInt(action.payload.amount);
                showInfoBox = true;
            }
            let tmpPrice = {...state.price};
            for (let supply of action.payload.itemSupplies) {
                tmpPrice[supply.item.id] = {perUnit: 0, total: 0};
            }
            return {
                ...state,
                itemSupplies: action.payload.itemSupplies,
                amountOfItemSupplies: amount,
                showInfoBox: showInfoBox,
                price: tmpPrice,
                buyQuantity: {}
            };

        case RANDOM_ITEMS_SUCCEEDED: {
            return {...state, inventoryItems: action.payload};
        }

        case SELL_ORDER_SUCCEEDED: {
            let newInventory = [...state.inventoryItems]
                .filter((item) => {
                    return !(item.item.id === action.payload.item.id && item.quantity === action.payload.quantity)
                })
                .map(item => {
                    const quantity = item.quantity;
                    if (item.item.id === action.payload.item.id) return {
                        ...item,
                        quantity: quantity - action.payload.quantity
                    }
                    return item;
                });
            return {
                ...state,
                activeSellOrders: [...state.activeSellOrders, action.payload],
                inventoryItems: newInventory
            }
        }

        case  ADD_TO_SELLORDER_SUCCEEDED: {
            let newInventory = [...state.inventoryItems]
                .filter((item) => {
                    return !(item.item.id === action.payload.itemId && item.quantity === action.payload.quantity)
                })
                .map(item => {
                    const quantity = item.quantity;
                    if (item.item.id === action.payload.itemId) {
                        return {
                            ...item,
                            quantity: quantity - action.payload.quantity
                        }
                    }
                    return item;
                });
            let newActiveSellOrders = [...state.activeSellOrders]
                .map((sellOrder) => {
                    if (sellOrder.item.id === action.payload.itemId) {
                        const quantity = sellOrder.quantity;
                        return {...sellOrder, quantity: quantity + action.payload.quantity};
                    }
                    return sellOrder;
                });
            return {...state, activeSellOrders: newActiveSellOrders, inventoryItems: newInventory}
        }

        case DELETE_SELL_ORDER_SUCCEEDED: {
            const sellOrderRemoved = state.activeSellOrders.filter(sellOrder => sellOrder.item.id !== action.payload.item.id);
            const inventoryAdded = [...state.inventoryItems];
            let wasAdded = false;
            for (let inventory of inventoryAdded) {
                if (inventory.item.id === action.payload.item.id) {
                    inventory.quantity += action.payload.quantity;
                    wasAdded = true;
                }
            }
            if (!wasAdded) {
                console.log(action.payload)
                inventoryAdded.push(action.payload);
            }
            return {...state, activeSellOrders: sellOrderRemoved, inventoryItems: inventoryAdded}
        }
        case BUY_ITEMS_SUCCEEDED:
            let oldBuyQuantity = {...state.buyQuantity};
            delete oldBuyQuantity[action.payload.item.id];
            //TODO: add to inventory
            const updatedInventory = [...state.inventoryItems];
            const items = new Set();
            let count = 0;
            let toStack = false;
            for (let inv of updatedInventory) {
                if (!items.has(inv.item.name)) {
                    count++;
                    if (inv.item.name === action.payload.item.name) toStack = true;
                    items.add(inv.item.name);
                }
            }
            if (toStack) {
                updatedInventory.map((inv) => {
                    if(inv.item.name === action.payload.item.name) {
                        inv.quantity += action.payload.amountBought;
                        return inv;
                    }
                    return inv;
                });
            }
            else {
                if(count + action.payload.amountBought <= 20) {
                    updatedInventory.push({item: action.payload.item, quantity: action.payload.amountBought})
                }
            }

            // Go through all item supplies to see if amount goes down to 0. If so, remove it.
            let newItemSupplies = state.itemSupplies;

            for (let i in state.itemSupplies) {
                if (state.itemSupplies[i].item.id === action.payload.item.id){
                    if(action.payload.amount === 0) {
                        newItemSupplies.splice(i, 1);
                    }
                }
            }

            return {
                ...state,
                itemSupplies: newItemSupplies,
                money: action.payload.money,
                inventoryItems: updatedInventory,
                buyQuantity: {...oldBuyQuantity}
            }
        case SET_LOADING:
            return {...state, isLoading: action.payload};
        case SET_INFO_BOX:
            return {...state, showInfoBox: action.payload};
        case USER_MONEY_REQUEST_SUCCEEDED:
            return {...state, money: action.payload.money, user: action.payload.name};

        case ITEM_SUPPLY_CHANGED:
            let updatedItemSupplies = [...state.itemSupplies].map(supply => {
                if (supply.item.id === action.payload.itemId) {
                    return {...supply, quantity: action.payload.quantity}
                }
                return supply
            });
            return {...state, itemSupplies: updatedItemSupplies}
        default:
            return state
    }
}