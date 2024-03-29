import {
    SET_LOADING,
    SET_INFO_BOX,
    QUANTITY_EXCEEDED,
    REMOVE_ALERT
} from "./actions/actions";
import {
    BUY_QUANTITY_CHANGED,
    FETCH_AVERAGE_ITEM_PRICE_SUCCEEDED,
    FETCH_ITEM_SUPPLY_SUCCEEDED,
    SEARCH_VALUE_CHANGED,
    BUY_ITEM_SUCCEEDED,
    BUY_ITEMS_SUCCEEDED,
    FETCH_RANDOM_ITEMS_SUCCEEDED,
    CREATE_SELL_ORDER_SUCCEEDED,
    DELETE_SELL_ORDER,
    DELETE_SELLORDER_SUCCEEDED,
    FETCH_USER_MONEY_SUCCEEDED,
    ITEM_SUPPLY_CHANGED, ITEM_SOLD_ALERT,
    FETCH_USER_SELLORDERS_SUCCEEDED, ITEM_BOUGHT_SUBSCRIPTION, SET_SELLING_DETAILS, CHANGE_DETAIL_ITEM
} from "./actions/itemActions";
import {inventorySize} from "../config/config";

export const initState = {
    user: "",
    money: 0,
    selectedCategory: NaN,
    selectedSubCategory: NaN,
    searchTerm: "topaz",
    itemSupplies: [],
    buyQuantity: {},
    price: {},
    detailItem: null,
    isLoading: false,
    showInfoBox: false,
    amountOfItemSupplies: 0,
    quantityExceeded: [],
    inventoryItems: [],
    activeSellOrders: [],
    soldAlert:null,
    alert: false,
};

export default (state = initState, action) => {
    switch (action.type) {

        // Set the details of the currently selected item on the selling page
        case SET_SELLING_DETAILS:
            return {...state, detailItem: action.payload};

        // Change the item that is currently selected as a the detail item
        case CHANGE_DETAIL_ITEM:
            return {...state, detailItem: {...state.detailItem, ...{...action.payload}}};

        // The search value is changed in the search box
        case SEARCH_VALUE_CHANGED:
            return {...state, searchTerm: action.payload.term};

        // A mapping of itemIDs to buy quantity for each of the input fields of item supplies
        case BUY_QUANTITY_CHANGED:
            let tempBuyQuantity = {...state.buyQuantity};
            tempBuyQuantity[action.payload.itemId] = parseInt(action.payload.amount);
            let tmpQuantityExceeded = [...state.quantityExceeded];
            if (tmpQuantityExceeded.indexOf(action.payload.itemId) !== -1) {
                tmpQuantityExceeded = tmpQuantityExceeded.filter(i => i !== action.payload.itemId);
            }
            if (action.payload.amount === '') {
                let tmpPrice = {...state.price};
                tmpPrice[action.payload.itemId] = {perUnit: 0, total: 0};
                return {...state, buyQuantity: tempBuyQuantity, price: tmpPrice};
            }
            return {...state, buyQuantity: tempBuyQuantity, quantityExceeded: tmpQuantityExceeded};

        // A list of itemIDs whose entered amount is higher than the amount available in the item supply
        case QUANTITY_EXCEEDED:
            tempBuyQuantity = {...state.buyQuantity};
            tempBuyQuantity[action.payload.itemId] = parseInt(action.payload.amount);
            tmpPrice = {...state.price}
            tmpPrice[action.payload.itemId] = {perUnit: 0, total: 0};
            tmpQuantityExceeded = [...state.quantityExceeded];
            tmpQuantityExceeded.push(action.payload.itemId);
            return {...state, price: tmpPrice, buyQuantity: tempBuyQuantity, quantityExceeded: tmpQuantityExceeded};

        // Saga action type of fetching the average and total item price of an item supply after entering an amount
        case FETCH_AVERAGE_ITEM_PRICE_SUCCEEDED:
            const tempPrice = {...state.price};
            tempPrice[action.payload.itemId] = {perUnit: action.payload.perUnit, total: action.payload.total};
            return {...state, price: tempPrice};

        // Saga action type of fetching a list of item supplies.
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

        // Saga action type of fetching random items to put into the user inventory
        case FETCH_RANDOM_ITEMS_SUCCEEDED: {
            return {...state, inventoryItems: action.payload};
        }

        case CREATE_SELL_ORDER_SUCCEEDED: {
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

        // Saga action type of fetching the user's active sell orders
        case FETCH_USER_SELLORDERS_SUCCEEDED:
            return {...state, activeSellOrders: [...action.payload.sellOrders]};

        // Saga action of deleting a sell order
        case DELETE_SELLORDER_SUCCEEDED: {
            const sellOrdersRemoved =  state.activeSellOrders.filter(sellOrder => sellOrder.item.id === action.payload.item.id);
            const newSellOrders = state.activeSellOrders.filter(sellOrder => sellOrder.item.id !== action.payload.item.id);
            const inventoryAdded = [...state.inventoryItems];
            let wasAdded = false;
            for (let inventory of inventoryAdded) {
                if (inventory.item.id === action.payload.item.id) {
                    for(let sellOrder of sellOrdersRemoved) {
                        inventory.quantity += sellOrder.quantity;
                    }
                    wasAdded = true;
                }
            }
            if (!wasAdded) {
                let quantity = 0;
                for (let sellOrder of sellOrdersRemoved) {
                    quantity += sellOrder.quantity;
                }
                inventoryAdded.push({...action.payload, quantity: quantity});
            }
            return {...state, activeSellOrders: newSellOrders, inventoryItems: inventoryAdded}
        }

        //
        case BUY_ITEMS_SUCCEEDED:
            let oldBuyQuantity = {...state.buyQuantity};
            delete oldBuyQuantity[action.payload.item.id];
            const updatedInventory = [...state.inventoryItems];
            const items = new Set();
            let count = 0;
            let toStack = false;
            for (let inv of updatedInventory) {
                if (!items.has(inv.item.name)) {
                    count++;
                    if (inv.item.name === action.payload.item.name) {
                        toStack = true;
                    }
                    items.add(inv.item.name);
                }
            }
            if (toStack) {
                updatedInventory.map((inv) => {
                    if (inv.item.name === action.payload.item.name) {
                        inv.quantity += action.payload.amountBought;
                        return inv;
                    }
                    return inv;
                });
            } else {
                if (count  <= inventorySize) {
                    updatedInventory.push({item: action.payload.item, quantity: action.payload.amountBought})
                }
            }

            // Go through all item supplies to see if amount goes down to 0. If so, remove it.
            let newItemSupplies = state.itemSupplies;

            for (let i in state.itemSupplies) {
                if (state.itemSupplies[i].item.id === action.payload.item.id) {
                    if (action.payload.amount === 0) {
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
            };
        case SET_LOADING:
            return {...state, isLoading: action.payload};
        case SET_INFO_BOX:
            return {...state, showInfoBox: action.payload};
        case FETCH_USER_MONEY_SUCCEEDED:
            return {...state, money: action.payload.money, user: action.payload.name};

        case ITEM_SUPPLY_CHANGED:
            let updatedItemSupplies = [...state.itemSupplies].map(supply => {
                if (supply.item.id === action.payload.itemId) {
                    return {...supply, quantity: action.payload.quantity}
                }
                return supply
            });
            return {...state, itemSupplies: updatedItemSupplies}
        case ITEM_SOLD_ALERT:{
            // increase money:
            const money = action.payload.alert.money;
            const activeSellOrders = [...state.activeSellOrders];
            const updatedSellOrders = activeSellOrders.filter(sellOrder => {
                return (sellOrder.item.name !== action.payload.alert.itemName) ||
                (sellOrder.item.name === action.payload.alert.itemName && sellOrder.quantity - action.payload.alert.amount > 0)
            }).map(sellOrder => {
                if(sellOrder.item.name === action.payload.alert.itemName) {
                    const quantity = sellOrder.quantity - action.payload.alert.amount;
                    return {...sellOrder, quantity: quantity};
                }
                return sellOrder;
            });
            return {...state, money: money, activeSellOrders: updatedSellOrders, soldAlert: action.payload.alert, alert: true}
        }
        case REMOVE_ALERT:
            return {...state, alert: false}

        case ITEM_BOUGHT_SUBSCRIPTION:
        {
            const receipt = action.payload.receipt;
            let itemSupplies = [...state.itemSupplies];
            itemSupplies = itemSupplies
                .map(supply => {
                    if(supply.item.id === receipt.item.id) {
                        return {...supply, quantity: receipt.amount, min_price: receipt.min_price };
                    }
                    return supply;
                });
            return {...state, itemSupplies: itemSupplies};
        }
        default:
            return state
    }
}