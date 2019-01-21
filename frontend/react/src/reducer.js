import {INCREMENT} from "./actions";

const initState = {count: 1};

export default (state = initState, action) => {
    switch(action.type) {
        case INCREMENT:
            return {...state, count: state.count + 1}
        default:
            return state
    }
}