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
import ApolloClient from "apollo-boost";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk, sagaMiddleware)));
sagaMiddleware.run(rootSaga);


const client = new ApolloClient({
    uri: "http://localhost:4000/"
});


ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <ApolloProvider client={client}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
            </ApolloProvider>
        </MuiThemeProvider>
    </Provider>, document.getElementById('root'));