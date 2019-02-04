import {
    INCREMENT,
    SELECT_CATEGORY, SET_LOADING, SET_INFO_BOX} from "./actions/actions";
import {
    AVERAGE_ITEM_PRICE_REQUESTED,
    FETCH_ITEM_SUPPLY_REQUESTED,
    FETCH_ITEM_SUPPLY_SUCCEEDED, SEARCH_VALUE_CHANGED
} from "./actions/itemActions";

const initState = {
    user: "Anonymous",
    money: 1000000000,
    selectedCategory: NaN,
    selectedSubCategory: NaN,
    searchTerm: "topaz",
    itemSupplies: [],
    buyQuantity: {
        "2592": 5
    },
    count: 1,
    isLoading: false,
    showInfoBox: false,
    amountOfItemSupplies: 0,
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
        case AVERAGE_ITEM_PRICE_REQUESTED:
            const tempBuyQuantity = {...state.buyQuantity};
            tempBuyQuantity[action.payload.itemId] = action.payload.amount;
            return {...state, buyQuantity: tempBuyQuantity };
        case FETCH_ITEM_SUPPLY_SUCCEEDED:
            let amount = 0;
            let showInfoBox = false;
            if(action.payload.amount > 25) {
                amount = action.payload.amount;
                showInfoBox = true;
            }
            return {...state, itemSupplies: action.payload.itemSupplies, amountOfItemSupplies: amount, showInfoBox: showInfoBox};
        case SET_LOADING:
            return {...state, isLoading: action.payload};
        case SET_INFO_BOX:
            return {...state, showInfoBox: action.payload};
        default:
            return state
    }
}