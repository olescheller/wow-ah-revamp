import {all, call, put, takeEvery, takeLatest} from 'redux-saga/effects'

import {dummyApiCall, downloadItemsSupplyByPartialName, fetchAmountOfItemSupplies} from "../api/graphql_api";

import {itemSupplySucceededAction} from "./actions/itemActions";
import {setLoading} from "./actions/actions";

function* watchFetchItemSupply() {
    yield takeLatest('FETCH_ITEM_SUPPLY_REQUESTED', fetchItemsSupplyByPartialName)
}

export function* fetchItemSupply(action) {
    try {
        const data = yield call(dummyApiCall, action.payload.term);
        yield put(itemSupplySucceededAction(data))
    } catch (error) {
        yield put({type: "FETCH_ITEM_SUPPLY_FAILED", error})
    }
}
export function* fetchItemsSupplyByPartialName(action) {
    if (action.payload.term.length < 4) {
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
        watchFetchItemSupply()
    ])
}
