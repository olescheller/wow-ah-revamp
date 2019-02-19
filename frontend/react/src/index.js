import {BrowserRouter} from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {applyMiddleware, compose, createStore} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createSagaMiddleware from 'redux-saga';
import { ApolloProvider } from 'react-apollo';
import rootSaga from './redux/sagas'
import theme from './theme/materialTheme'
import reducer from './redux/reducer'
import {randomItemsRequested, userMoneyAction} from "./redux/actions/itemActions";
import ApolloClient from "apollo-client";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { getMainDefinition } from 'apollo-utilities';

const wsLink = new WebSocketLink({
    uri: `ws://localhost:4000/`,
    options: {
        reconnect: true
    }
});

// Create an http link:
const httpLink = new HttpLink({
    uri: 'http://localhost:4000/'
});


const link = split(
    // split based on operation type
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
);


const cache = new InMemoryCache();
const options = {link, cache}
const client = new ApolloClient(options)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk, sagaMiddleware)));
sagaMiddleware.run(rootSaga);
store.dispatch(randomItemsRequested());
store.dispatch(userMoneyAction("Elandura", "Silvermoon"));

ReactDOM.render(
    <ApolloProvider client={client}>

    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <ApolloProvider client={client}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
            </ApolloProvider>
        </MuiThemeProvider>
    </Provider></ApolloProvider>, document.getElementById('root'));