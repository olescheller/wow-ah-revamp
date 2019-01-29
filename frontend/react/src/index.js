import {BrowserRouter} from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {applyMiddleware, createStore} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import reducer from './reducer'
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import {createMuiTheme} from "@material-ui/core";

const store = createStore(reducer, applyMiddleware(thunk));
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#505050',
        },
        secondary: {
            main: '#FFD700',
        },
        error:
            {
                main: '#FF0000'
            },
        type: 'light',

    },
    typography: {
        useNextVariants: true
    }
});

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme = { theme }>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
        </MuiThemeProvider>
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
