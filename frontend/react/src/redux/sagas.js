import {all, call, put, takeEvery, takeLatest} from 'redux-saga/effects'

import {
    downloadItemsSupplyByPartialName,
    fetchAmountOfItemSupplies,
    downloadAverageItemPrice,
    makePurchase,
    downloadRandomItems,
    createSellOrder,
    removeSellOrder,
    getUserMoney,
    getUserSellOrder
} from "../api/graphql_api";

import {
    addItemToSellOrderSucceeded,
    fetchAverageItemPriceSucceededAction,
    buyItemsSucceededAction,
    deleteSellOrderRequestedAction,
    deleteSellOrderSucceededAction,
    itemSupplySucceededAction,
    fetchRandomItemsSucceededAction,
    createSellOrderSucceededAction,
    FETCH_USER_MONEY_REQUESTED,
    FETCH_USER_SELLORDERS_REQUESTED,
    fetchUserMoneySucceededAction, fetchUserSellOrdersSucceededAction
} from "./actions/itemActions";
import {setLoading} from "./actions/actions";

function* watchFetchItemSupply() {
    yield takeLatest('FETCH_ITEM_SUPPLY_REQUESTED', fetchItemsSupplyByPartialName)
}

function* watchAverageItemPrice() {
    yield takeEvery('FETCH_AVERAGE_ITEM_PRICE_REQUESTED', fetchAverageItemPrice);
}

function* watchBuyItems() {
    yield takeEvery('BUY_ITEMS_REQUESTED', buyItems);
}

function* watchFetchRandomItems () {
    yield takeEvery('FETCH_RANDOM_ITEMS_REQUESTED', randomItems);
}

function* watchCreateSellOrder () {
    yield takeEvery('CREATE_SELL_ORDER_REQUESTED', sellOrder);
}

function* watchRemoveSellOrder () {
    yield takeEvery('DELETE_SELLORDER_REQUESTED', _removeSellOrder);
}
function* watchGetUserMoney () {
    yield takeEvery(FETCH_USER_MONEY_REQUESTED, updateUserMoney);
}
function* watchGetUserSellOrders () {
    yield takeEvery(FETCH_USER_SELLORDERS_REQUESTED, updateUserSellOrders);
}

export function* updateUserSellOrders(action) {
    const {userName , realmName} = action.payload;
    try{
        const data = yield call(getUserSellOrder, userName, realmName);
        yield put(fetchUserSellOrdersSucceededAction(data))
    } catch (e) {

    }
}

export function* updateUserMoney(action) {
    const {userName , realmName} = action.payload;
    try{
        const data = yield call(getUserMoney, userName, realmName);
        yield put(fetchUserMoneySucceededAction(data))
    } catch (e) {

    }
}

export function* sellOrder(action) {
    const {itemId, price, quantity, seller_name, seller_realm} = action.payload;
    try{
        const data = yield call(createSellOrder, itemId, price, quantity, seller_name, seller_realm );
        yield put(createSellOrderSucceededAction(data))
    }
    catch(error){
        yield put({type: "SELL_ORDER_FAILED", error})
    }
}

export function* _removeSellOrder(action) {
    console.log(action.payload)
    const {item, quantity, seller_name, seller_realm} = action.payload;
    try{
        const data = yield call(removeSellOrder, item.id, seller_name, seller_realm);
        yield put(deleteSellOrderSucceededAction({item, quantity}))
    }
    catch(error){
        yield put({type: "DELETE_SELL_ORDER_FAILED", error})
    }
}


export function* randomItems(action) {
    try{
        const data = yield call(downloadRandomItems);
        yield put(fetchRandomItemsSucceededAction(data));
    }
    catch(error) {
        yield put({type: 'RANDOM_ITEM_FAILED', error})
    }

}

export function* buyItems(action) {
    const {userName, itemId, amount, total, perItem} = action.payload;
    try{
        const data = yield call(makePurchase, userName, itemId, amount, total, perItem);
        console.log(data)
        yield put(buyItemsSucceededAction(data));
    } catch(error) {
        yield put({type: "BUY_ITEM_FAILED", error})
    }
}

export function* fetchAverageItemPrice(action) {
    let amount = action.payload.amount === '' ? 0 : action.payload.amount;
    try {
        const data = yield call(downloadAverageItemPrice, action.payload.itemId, amount);
        if(!data) {
            yield put(fetchAverageItemPriceSucceededAction(action.payload.itemId, null, null));
        }
        yield put(fetchAverageItemPriceSucceededAction(action.payload.itemId, data.perUnit, data.total));
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
        watchRemoveSellOrder(),
        watchGetUserMoney(),
        watchGetUserSellOrders(),
    ])
}
