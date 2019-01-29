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

export const SEARCH = "SEARCH";
export const SearchAction = (term, category) => ({
    type: SEARCH,
    payload: {term, category}
});
