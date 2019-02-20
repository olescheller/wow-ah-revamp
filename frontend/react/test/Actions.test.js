import * as actions from '../src/redux/actions/actions'
import * as itemActions from '../src/redux/actions/itemActions'

describe('actions', () => {
    it('should create an action to notify of exceeded quantity of an item', () => {
        const expectedAction = {
            type: actions.QUANTITY_EXCEEDED,
            payload: {itemId: 1337}
        };
        expect(actions.quantityExceededAction(1337)).toEqual(expectedAction)
    })
});

describe('actions', () => {
    it('should create an action to set loading', () => {
        const expectedAction = {
            type: actions.SET_LOADING,
            payload: true
        };
        expect(actions.setLoading(true)).toEqual(expectedAction)
    })
});