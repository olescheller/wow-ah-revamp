import {
    INCREMENT,
    SELECT_CATEGORY, SET_LOADING, SET_INFO_BOX, QUANTITY_EXCEEDED} from "./actions/actions";
import {
    BUY_QUANTITY_CHANGED, AVERAGE_ITEM_PRICE_SUCCEEDED,
    FETCH_ITEM_SUPPLY_REQUESTED,
    FETCH_ITEM_SUPPLY_SUCCEEDED, SEARCH_VALUE_CHANGED, BUY_ITEM_SUCCEEDED, BUY_ITEMS_SUCCEEDED
} from "./actions/itemActions";

const initState = {
    user: "Anonymous",
    money: 1000000000,
    selectedCategory: NaN,
    selectedSubCategory: NaN,
    searchTerm: "topaz",
    itemSupplies: [],
    buyQuantity: {
    },
    price: {
    },
    count: 1,
    isLoading: false,
    showInfoBox: false,
    amountOfItemSupplies: 0,
    quantityExceeded: [],
};

export default (state = initState, action) => {
    switch(action.type) {
        case INCREMENT:
            return {...state, count: state.count + 1};
        case SELECT_CATEGORY:
            return {...state, selectedCategory: action.payload};
        // case FETCH_ITEM_SUPPLY_REQUESTED:
        //     return {...state, searchTerm: action.payload.term};
        case SEARCH_VALUE_CHANGED:
            return {...state, searchTerm: action.payload.term}; // missing: category (combine main & subcategory)
        case BUY_QUANTITY_CHANGED:
            let tempBuyQuantity = {...state.buyQuantity};
            tempBuyQuantity[action.payload.itemId] = parseInt(action.payload.amount);
            let tmpQuantityExceeded = [...state.quantityExceeded]
            if(tmpQuantityExceeded.indexOf(action.payload.itemId) !== -1) {
                tmpQuantityExceeded = tmpQuantityExceeded.filter(i => i !== action.payload.itemId);
            }
            if(action.payload.amount === '') {
                let tmpPrice = {...state.price}
                tmpPrice[action.payload.itemId] = {perUnit:0, total:0};
                return {...state, buyQuantity: tempBuyQuantity, price: tmpPrice};
            }
            return {...state, buyQuantity: tempBuyQuantity, quantityExceeded: tmpQuantityExceeded };
        case QUANTITY_EXCEEDED:
            tempBuyQuantity = {...state.buyQuantity};
            tempBuyQuantity[action.payload.itemId] = parseInt(action.payload.amount);
            tmpPrice = {...state.price}
            tmpPrice[action.payload.itemId] = {perUnit:0, total:0};
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
            if(action.payload.amount > 25) {
                amount = parseInt(action.payload.amount);
                showInfoBox = true;
            }
            let tmpPrice = {...state.price};
            for(let supply of action.payload.itemSupplies) {
                tmpPrice[supply.item.id] = {perUnit:0, total:0};
            }
            return {...state, itemSupplies: action.payload.itemSupplies, amountOfItemSupplies: amount, showInfoBox: showInfoBox, price: tmpPrice, buyQuantity: {}};

        case BUY_ITEMS_SUCCEEDED:
            let oldBuyQuantity = {...state.buyQuantity};
            delete oldBuyQuantity[action.payload.itemId];
            return {...state, money: action.payload.money, buyQuantity: {...oldBuyQuantity}};
        case SET_LOADING:
            return {...state, isLoading: action.payload};
        case SET_INFO_BOX:
            return {...state, showInfoBox: action.payload};
        default:
            return state
    }
}