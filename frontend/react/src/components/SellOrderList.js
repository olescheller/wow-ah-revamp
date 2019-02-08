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
import {buyQuantityChangedAction, queryAverageItemPriceAction} from "../redux/actions/itemActions";
import './itemsupply.css'
import { withStyles } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InfoBox from './InfoBox';
import {quantityExceededAction, setLoading} from "../redux/actions/actions";
import Input from "@material-ui/core/es/Input/Input";
import TextField from "@material-ui/core/es/TextField/TextField";


const CustomTableCell = withStyles(theme => ({
    alignLeft: true,
    paddingDense: true
}))(TableCell);

let id = 0;

function createData(name, calories, fat, carbs, protein) {
    id += 1;
    return {id, name, calories, fat, carbs, protein};
}

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        padding: theme.spacing.unit * 2,
    },
    table: {
        minWidth: 1120,
    },
});

class SellOrderList extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props.price)
    }

    getInputField = (itemSupply) => {
        if(this.props.quantityExceeded.indexOf(itemSupply.item.id) !== -1 ) {
            return (
                <TextField error variant="outlined" margin="normal" className="buyQuantity" value={this.props.buyQuantity[itemSupply.item.id]}
                           onChange={(e) => this.onInputQty(e, itemSupply)}
                />
            )
        }
        return (
            <TextField variant="outlined" margin="normal" className="buyQuantity" value={this.props.buyQuantity[itemSupply.item.id]}
                       onChange={(e) => this.onInputQty(e, itemSupply)}
            />
        );
    };

    onInputQty = (e, itemSupply) => {
        const buyQty = e.target.value;
        console.log(buyQty, itemSupply.quantity)
        if(buyQty > itemSupply.quantity) {
            //set error
            this.props.dispatch(quantityExceededAction(itemSupply.item.id));
            this.props.dispatch(setLoading(false));
        }
        else {
            this.props.dispatch(buyQuantityChangedAction(itemSupply.item.id, buyQty));
            this.props.dispatch(queryAverageItemPriceAction(buyQty, itemSupply.item.id));
            }
        }


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
                        <CustomTableCell>Icon</CustomTableCell>
                        <CustomTableCell width="300">Item name</CustomTableCell>
                        <CustomTableCell width="220">Curr. min. buyout</CustomTableCell>
                        <CustomTableCell width="50">Qty available</CustomTableCell>
                        <CustomTableCell width="150">Buy quantity</CustomTableCell>
                        <CustomTableCell width="350">Price per unit & Total</CustomTableCell>
                        <CustomTableCell></CustomTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.itemSupplies.map(itemSupply => (
                        <TableRow   key={itemSupply.item.id}>
                            <TableCell padding="dense" component="th" align="left" scope="row">
                                <img
                                    src={`https://s3.eu-central-1.amazonaws.com/wow-icons/icons/${itemSupply.item.icon}.jpg`}/>

                            </TableCell>
                            <CustomTableCell scope="row">
                                <span>{itemSupply.item.name}</span>

                            </CustomTableCell>
                            <CustomTableCell  padding="dense"><MoneyView money={itemSupply.min_price}></MoneyView></CustomTableCell>
                            <CustomTableCell padding="dense">{itemSupply.quantity}</CustomTableCell>
                            <CustomTableCell padding="dense">
                                {this.getInputField(itemSupply)}
                            </CustomTableCell>
                            <CustomTableCell padding="dense"><MoneyView label="per unit" money={this.props.price[itemSupply.item.id].perUnit}/>
                                <MoneyView label="total" money={this.props.price[itemSupply.item.id].total}/></CustomTableCell>
                            <TableCell  padding="dense" align="right">
                                <Button variant="contained" color="primary"> Buy</Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </Paper>
                <InfoBox type="moreItems"/>
            </div>
        )
    }
}

SellOrderList.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default connect(({itemSupplies, buyQuantity, price, quantityExceeded}) => ({itemSupplies, buyQuantity, price, quantityExceeded}))(withStyles(styles)(SellOrderList));