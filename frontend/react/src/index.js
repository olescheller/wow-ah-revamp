import {BrowserRouter} from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {applyMiddleware, createStore} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createSagaMiddleware from 'redux-saga';

import rootSaga from './redux/sagas'
import theme from './theme/materialTheme'
import reducer from './redux/reducer'
import ApolloClient, {HttpLink} from "apollo-boost";
import gql from "graphql-tag";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(thunk, sagaMiddleware));
sagaMiddleware.run(rootSaga);

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })


const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    fetchOptions: {
        mode: 'no-cors',

    },
});

client
    .query({
        query: gql`
      {
        test
      }
    `
    })
    .then(result => console.log(result))
    .catch((err => console.log(err)))

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </MuiThemeProvider>
    </Provider>, document.getElementById('root'));