import React from "react";
import PropTypes from 'prop-types';
import MoneyView from './MoneyView';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {connect} from "react-redux";
import {
    buyItemsRequestedAction,
    buyQuantityChangedAction,
    itemBoughtSubscriptionAction,
    fetchAverageItemPriceRequestedAction
} from "../redux/actions/itemActions";
import './itemsupply.css'
import { withStyles } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InfoBox from './InfoBox';
import {quantityExceededAction, setLoading} from "../redux/actions/actions";
import TextField from "@material-ui/core/es/TextField/TextField";
import {ReceiptSubscription, SellOrderAlertSubscription} from "./SubscriptionComponent";
import CustomizedSnackbar from "./SnackBar";

import defaultIcon from '../assets/inv_misc_questionmark.jpg'

const CustomTableCell = withStyles(theme => ({
    alignLeft: true,
    paddingDense: true
}))(TableCell);

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        padding: theme.spacing.unit * 2,
    },
    table: {
        minWidth: 1300,
    },
});

class SellOrderList extends React.Component {

    constructor(props) {
        super(props);
    }


    handleBuyClick = (itemId) => {
        const {perUnit, total} = this.props.price[itemId];
        const amount = this.props.buyQuantity[itemId];
        this.props.dispatch(buyItemsRequestedAction(this.props.user, itemId, amount, total, perUnit))
    };

    getInputField = (itemSupply) => {
        if(this.props.quantityExceeded.indexOf(itemSupply.item.id) !== -1 ) {
            return (
                <TextField error variant="outlined" margin="normal" className="buyQuantity" value={this.props.buyQuantity[itemSupply.item.id] || ""}
                           onChange={(e) => this.onInputQty(e, itemSupply)}
                />
            )
        }
        return (
            <TextField variant="outlined" margin="normal" className="buyQuantity" value={this.props.buyQuantity[itemSupply.item.id] || ""}
                       onChange={(e) => this.onInputQty(e, itemSupply)}
            />
        );
    };

    onInputQty = (e, itemSupply) => {
        const buyQty = e.target.value;
        if(buyQty > itemSupply.quantity) {
            //set error
            this.props.dispatch(quantityExceededAction(itemSupply.item.id));
            this.props.dispatch(setLoading(false));
        }
        else {
            this.props.dispatch(buyQuantityChangedAction(itemSupply.item.id, buyQty));
            this.props.dispatch(fetchAverageItemPriceRequestedAction(buyQty, itemSupply.item.id));
            }
        };

        isBuyQuantityEmpty = (itemId) => {
            return ! this.props.buyQuantity[itemId];
        };

        canUserAffordItem = (itemId) => (this.props.money >= this.props.price[itemId].total);


        dispatchReceipt = (receipt) => {
            this.props.dispatch(itemBoughtSubscriptionAction(receipt));
        };


    render() {

        const { classes } = this.props;

        return (
            <div>
            <Paper elevation={1} className={classes.root}>
                <Typography variant="h5" component="h3">
                    Buy
                </Typography>
                <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <CustomTableCell width="60">Icon</CustomTableCell>
                        <CustomTableCell width="300">Item name</CustomTableCell>
                        <CustomTableCell width="300">Curr. min. buyout</CustomTableCell>
                        <CustomTableCell width="60">Qty available</CustomTableCell>
                        <CustomTableCell width="100">Buy quantity</CustomTableCell>
                        <CustomTableCell width="350">Price per unit & Total</CustomTableCell>
                        <CustomTableCell width="60"></CustomTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.itemSupplies.map(itemSupply => (
                        <TableRow   key={itemSupply.item.id}>
                            <TableCell padding="dense" component="th" align="left" scope="row">
                                <img
                                    src={
                                        itemSupply.item.icon ?
                                        `https://s3.eu-central-1.amazonaws.com/wow-icons/icons/${itemSupply.item.icon}.jpg` :
                                    defaultIcon}/>

                            </TableCell>
                            <CustomTableCell align="left" scope="row">
                                <span>{itemSupply.item.name}</span>

                            </CustomTableCell>
                            <CustomTableCell  padding="dense">
                                {ReceiptSubscription(itemSupply, "QUANTITY", this.dispatchReceipt)}
                                <MoneyView displayClass="coins-inline" money={itemSupply.min_price}/>
                            </CustomTableCell>
                            <CustomTableCell padding="dense">
                                {itemSupply.quantity}
                            </CustomTableCell>
                            <CustomTableCell padding="dense">
                                {this.getInputField(itemSupply)}
                            </CustomTableCell>
                            <CustomTableCell padding="dense">  {! this.isBuyQuantityEmpty(itemSupply.item.id) ?  <MoneyView displayClass="coins-block" label="per unit" money={this.props.price[itemSupply.item.id].perUnit}/> : '' }
                                {! this.isBuyQuantityEmpty(itemSupply.item.id) ? <MoneyView  displayClass="coins-block" label="total" money={this.props.price[itemSupply.item.id].total}/> : ''}</CustomTableCell>
                            <CustomTableCell  padding="dense" align="right">
                                <Button disabled={this.isBuyQuantityEmpty(itemSupply.item.id) || !this.canUserAffordItem(itemSupply.item.id)} onClick={() => this.handleBuyClick(itemSupply.item.id)} variant="contained" color="primary"> Buy</Button></CustomTableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </Paper>
                <InfoBox type="moreItems" infoClass="info"/>
            </div>
        )
    }
}

SellOrderList.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default connect(({itemSupplies, buyQuantity, price, quantityExceeded, user, money}) => ({itemSupplies, buyQuantity, price, quantityExceeded, user, money}))(withStyles(styles)(SellOrderList));