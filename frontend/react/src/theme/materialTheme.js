import {createMuiTheme} from "@material-ui/core";

export default createMuiTheme({
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