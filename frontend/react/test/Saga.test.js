import expect from 'expect'
import {put, call} from 'redux-saga/effects';
import {cloneableGenerator} from '@redux-saga/testing-utils';
import {updateUserMoney} from "../src/redux/sagas";
import {getUserMoney} from "../src/api/graphql_api";
import {fetchUserMoneyRequestedAction} from "../src/redux/actions/itemActions";
import {fetchUserMoneySucceededAction} from "../src/redux/actions/itemActions";

const user = "Foo";
const realm = "Bar";
const userMoneyAction = fetchUserMoneyRequestedAction(user, realm);
const result = {
    name: user,
    money: 1337
};

describe('gold request flow', () => {
    it('gold request saga should yield correct function calls', () => {
        const generator = cloneableGenerator(updateUserMoney)(userMoneyAction);
        expect(generator.next().value).toEqual(call(getUserMoney, user, realm));
        expect(generator.next(result).value).toEqual(put(fetchUserMoneySucceededAction(result)));
        expect(generator.next().done).toEqual(true);
    });
});

