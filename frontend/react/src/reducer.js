import {INCREMENT, SELECT_CATEGORY} from "./actions";

const initState = {
    user: "Anonymous",
    money: 1000000000,
    selectedCategory: NaN,
    selectedSubCategory: NaN,

    count: 1
};

export default (state = initState, action) => {
    switch(action.type) {
        case INCREMENT:
            return {...state, count: state.count + 1};
        case SELECT_CATEGORY:
            return {...state, selectedCategory: action.payload};
        default:
            return state
    }
}