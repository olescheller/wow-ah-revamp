import {all, call, put, takeEvery, takeLatest} from 'redux-saga/effects'

import {
    dummyApiCall,
    downloadItemsSupplyByPartialName,
    fetchAmountOfItemSupplies,
    downloadAverageItemPrice,
    makePurchase, downloadRandomItems, createSellOrder, addItemToSellOrder, removeSellOrder
} from "../api/graphql_api";

import {
    addItemToSellOrderSucceeded,
    averageItemPriceSucceeded,
    buyItemsSucceeded, deleteSellOrderAction, deleteSellOrderSucceeded,
    itemSupplySucceededAction,
    randomItemsSucceeded, sellOrderSucceeded
} from "./actions/itemActions";
import {setLoading} from "./actions/actions";

function* watchFetchItemSupply() {
    yield takeLatest('FETCH_ITEM_SUPPLY_REQUESTED', fetchItemsSupplyByPartialName)
}

function* watchAverageItemPrice() {
    yield takeEvery('AVERAGE_ITEM_PRICE_REQUESTED', fetchAverageItemPrice);
}

function* watchBuyItems() {
    yield takeEvery('BUY_ITEMS_REQUESTED', buyItems);
}

function* watchFetchRandomItems () {
    yield takeEvery('FETCH_RANDOM_ITEMS_REQUESTED', randomItems);
}

function* watchCreateSellOrder () {
    yield takeEvery('CREATE_SELL_ORDER', sellOrder);
}

function* watchAddItemToSellOrder () {
    yield takeEvery('ADD_TO_SELLORDER_REQUESTED', addToSellOrder);
}

function* watchRemoveSellOrder () {
    yield takeEvery('REMOVE_SELLORDER_REQUESTED', _removeSellOrder);
}


export function* sellOrder(action) {
    const {itemId, price, quantity} = action.payload;
    try{
        const data = yield call(createSellOrder, itemId, price, quantity );
        console.log({data})
        yield put(sellOrderSucceeded(data))
    }
    catch(error){
        yield put({type: "SELL_ORDER_FAILED", error})
    }
}

export function* _removeSellOrder(action) {
    const {item, quantity} = action.payload;
    try{
        const data = yield call(removeSellOrder, item.id);
        yield put(deleteSellOrderSucceeded({item, quantity}))
    }
    catch(error){
        yield put({type: "DELETE_SELL_ORDER_FAILED", error})
    }
}


export function* addToSellOrder(action) {
    const {itemId, quantity} = action.payload;
    try{
        const data = yield call(addItemToSellOrder(itemId, quantity));
        yield put(addItemToSellOrderSucceeded(data));
    }
    catch(error) {
        yield put({type: "ADD_ITEM_TO_SELLORDER_FAILED", error})

    }
}

export function* randomItems(action) {
    try{
        const data = yield call(downloadRandomItems);
        yield put(randomItemsSucceeded(data));
    }
    catch(error) {
        yield put({type: 'RANDOM_ITEM_FAILED', error})
    }

}

export function* buyItems(action) {
    const {userName, itemId, amount, total, perItem} = action.payload;
    console.log(perItem)
    try{
        const data = yield call(makePurchase, userName, itemId, amount, total, perItem);
        console.log(data)
        yield put(buyItemsSucceeded(data));
    } catch(error) {
        yield put({type: "BUY_ITEM_FAILED", error})
    }
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
    try {
        const data = yield call(downloadAverageItemPrice, action.payload.itemId, amount);
        if(!data) {
            yield put(averageItemPriceSucceeded(action.payload.itemId, null, null));
        }
        yield put(averageItemPriceSucceeded(action.payload.itemId, data.perUnit, data.total));
    } catch (error) {
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
        watchBuyItems(),
        watchFetchRandomItems(),
        watchCreateSellOrder(),
        watchAddItemToSellOrder(),
        watchRemoveSellOrder(),
    ])
}
