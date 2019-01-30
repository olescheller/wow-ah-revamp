import {all, call, put, takeEvery} from 'redux-saga/effects'

import {dummyApiCall} from "../api/graphql_api";

import {itemSupplySucceededAction} from "./actions/itemActions";

function* watchFetchItemSupply() {
    yield takeEvery('FETCH_ITEM_SUPPLY_REQUESTED', fetchItemSupply)
}

export function* fetchItemSupply(action) {
    try {
        const data = yield call(dummyApiCall, action.payload.term);
        yield put(itemSupplySucceededAction(data))
    } catch (error) {
        yield put({type: "FETCH_ITEM_SUPPLY_FAILED", error})
    }
}

export default function* rootSaga() {
    yield all([
        watchFetchItemSupply()
    ])
}
