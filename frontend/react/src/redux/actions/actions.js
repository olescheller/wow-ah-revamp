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
});

export const REMOVE_ALERT = 'REMOVE_ALERT';
export const closeAlertAction = () => ({type: REMOVE_ALERT})