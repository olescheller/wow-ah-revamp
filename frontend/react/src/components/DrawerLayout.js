import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ShoppingIcon from '@material-ui/icons/ShoppingCart';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import SettingsIcon from '@material-ui/icons/Settings';
import {Route, Switch, withRouter} from "react-router-dom";
import {Link} from "react-router-dom";
import SellingPage from "./SellingPage";
import BuyingPage from "./BuyingPage";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from '@material-ui/icons/Notifications';
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from '@material-ui/icons/Search';
import {fade} from '@material-ui/core/styles/colorManipulator';
import Button from "@material-ui/core/Button";
import {connect} from "react-redux";
import {itemSupplyRequestAction, searchValueChangedAction} from "../redux/actions/itemActions";
import MoneyView from "./MoneyView";
import Paper from "@material-ui/core/Paper";
import SettingsPage from "./SettingsPage";
import AccountCircle from '@material-ui/icons/AccountCircle';


const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    button: {
        margin: theme.spacing.unit,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing.unit * 7 + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9 + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
    },
    grow: {
        flexGrow: 1,
    }, search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
});

class DrawerLayout extends React.Component {
    state = {
        open: true,
    };

    handleDrawerOpen = () => {
        this.setState({open: true});
    };

    handleDrawerClose = () => {
        this.setState({open: false});
    };

    handleClickBuy = () => {
    };

    handleClickSell = () => {
    };

    handleChangeSearchValue = (e) => {
        const searchValue = e.target.value;
        this.props.dispatch(searchValueChangedAction(searchValue))

    };
    handleOnSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            window.scrollTo(0, 0);
            const searchValue = e.target.value;
            this.props.dispatch(itemSupplyRequestAction(searchValue))
        }
    };

    render() {
        const {classes, theme} = this.props;

        return (
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar
                    position="fixed"
                    className={classNames(classes.appBar, {
                        [classes.appBarShift]: this.state.open,
                    })}
                >
                    <Toolbar disableGutters={!this.state.open}>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerOpen}
                            className={classNames(classes.menuButton, {
                                [classes.hide]: this.state.open,
                            })}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" color="inherit" noWrap>
                            wow-ah-revamp
                        </Typography>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon/>
                            </div>
                            <InputBase value={this.props.searchTerm} onChange={this.handleChangeSearchValue}
                                       onKeyPress={this.handleOnSearchKeyPress}
                                       placeholder="Search item ..."
                                       classes={{
                                           root: classes.inputRoot,
                                           input: classes.inputInput,
                                       }}
                            />
                        </div>

                        <div className={classes.grow}/>
                        <AccountCircle style={{marginRight: "5px"}}/>
                            <Typography color={"inherit"}
                                        variant={"h6"} style={{marginRight: "25px"}}>{"Logged in as: " + this.props.user || "Loading user ..."}</Typography>

                        <div className={classes.sectionDesktop}>

                            <div>
                                <Typography color={"inherit"} variant={"h6"}>
                                    <MoneyView displayClass="coins-block" label="" money={this.props.money}/>
                                </Typography>
                            </div>

                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    className={classNames(classes.drawer, {
                        [classes.drawerOpen]: this.state.open,
                        [classes.drawerClose]: !this.state.open,
                    })}
                    classes={{
                        paper: classNames({
                            [classes.drawerOpen]: this.state.open,
                            [classes.drawerClose]: !this.state.open,
                        }),
                    }}
                    open={this.state.open}
                >
                    <div className={classes.toolbar}>
                        <IconButton onClick={this.handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                        </IconButton>
                    </div>
                    <Divider/>
                    <List>
                        <ListItem button key="Buy" component={Link} to={'buy'}>
                            <ListItemIcon> <ShoppingIcon/> </ListItemIcon>
                            <ListItemText primary="Buy"/>
                        </ListItem>
                        <ListItem button key="Sell" component={Link} to={'sell'}>
                            <ListItemIcon> <AttachMoneyIcon/> </ListItemIcon>
                            <ListItemText primary="Sell"/>
                        </ListItem>
                    </List>
                    <Divider/>
                    <List>
                        <ListItem button key="Settings" component={Link} to={'settings'}>
                            <ListItemIcon><SettingsIcon/></ListItemIcon>
                            <ListItemText primary="Settings"/>
                        </ListItem>
                    </List>
                </Drawer>

                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    <Switch>
                        <Route exact path='/' render={(props) => (<div>Pick a category</div>)}/>
                        <Route path='/buy' component={BuyingPage}/>
                        <Route path='/sell' component={SellingPage}/>
                        <Route path='/settings' component={SettingsPage}/>
                    </Switch>
                </main>
            </div>
        );
    }
}

DrawerLayout.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withRouter(
    connect(({searchTerm, money, user}) => ({searchTerm, money, user}))
    (withStyles(styles, {withTheme: true})(DrawerLayout))
);