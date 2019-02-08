import {all, call, put, takeEvery, takeLatest} from 'redux-saga/effects'

import {dummyApiCall, downloadItemsSupplyByPartialName, fetchAmountOfItemSupplies, downloadAverageItemPrice} from "../api/graphql_api";

import {averageItemPriceSucceeded, itemSupplySucceededAction} from "./actions/itemActions";
import {setLoading} from "./actions/actions";

function* watchFetchItemSupply() {
    yield takeLatest('FETCH_ITEM_SUPPLY_REQUESTED', fetchItemsSupplyByPartialName)
}

function* watchAverageItemPrice() {
    yield takeEvery('AVERAGE_ITEM_PRICE_REQUESTED', fetchAverageItemPrice);
}

export function* fetchItemSupply(action) {
    try {
        const data = yield call(dummyApiCall, action.payload.term);
        yield put(itemSupplySucceededAction(data))
    } catch (error) {
        yield put({type: "FETCH_ITEM_SUPPLY_FAILED", error})
    }
}

export function* fetchAverageItemPrice(action) {
    let amount = action.payload.amount === '' ? 0 : action.payload.amount;
    yield put(setLoading(true));
    try {
        const data = yield call(downloadAverageItemPrice, action.payload.itemId, amount);
        yield put(averageItemPriceSucceeded(action.payload.itemId, data.perUnit, data.total));
        yield put(setLoading(false));
    } catch (error) {
        yield put(setLoading(false));
        yield put({type: "AVERAGE_ITEM_PRICE_FAILED", error})
    }
}

export function* fetchItemsSupplyByPartialName(action) {
    if (action.payload.term.length < 2) {
        yield put(setLoading(false));
        return {};
    }
    yield put(setLoading(true))
    try {
        const data = yield call(downloadItemsSupplyByPartialName, action.payload.term);
        const amount = yield call(fetchAmountOfItemSupplies, action.payload.term);
        yield put(itemSupplySucceededAction(data, amount))
        yield put(setLoading(false));
    } catch (error) {
        yield put({type: "FETCH_ITEM_SUPPLY_FAILED", error})
    }
}

export default function* rootSaga() {
    yield all([
        watchFetchItemSupply(),
        watchAverageItemPrice(),
    ])
}
