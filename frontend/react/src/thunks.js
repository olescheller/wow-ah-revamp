import {incrementAction} from "./actions";

export const incrementThunk = (my, values) => (dispatch) => {
    // do something async here:
    setTimeout(() => {
        console.log(my, values);
        dispatch(incrementAction());
    }, 1000)
};