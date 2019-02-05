export const INCREMENT = "INCREMENT";
export const incrementAction = () => ({
    type: INCREMENT
});

export const SELECT_CATEGORY = "SELECT_CATEGORY";
export const selectCategoryAction = (category) => ({
    type: SELECT_CATEGORY,
    payload: category
});

export const SELECT_SUBCATEGORY = "SELECT_SUBCATEGORY";
export const selectSubCategoryAction = (subcategory) => ({
    type: SELECT_SUBCATEGORY,
    payload: subcategory
});

export const SET_LOADING = 'SET_LOADING';
export const setLoading = (isLoading) => ({
    type: SET_LOADING,
    payload: isLoading,
});

export const SET_INFO_BOX = 'SET_INFO_BOX';
export const setInfoBox = (visible) => ({
    type: SET_INFO_BOX,
    payload: visible,
});

export const QUANTITY_EXCEEDED = 'QUANTITY_EXCEEDED';
export const quantityExceededAction = (itemId) => ({
    type: QUANTITY_EXCEEDED,
    payload: {itemId}
})


