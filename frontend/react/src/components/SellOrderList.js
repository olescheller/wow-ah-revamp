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
import {QueryAverageItemPriceAction} from "../redux/actions/itemActions";
import './itemsupply.css'
import { withStyles } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const CustomTableCell = withStyles(theme => ({
    align: 'left',
    padding:"none"
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

    }

    onInputQty = (e, itemId) => {
        const buyQty = e.target.value;
        this.props.dispatch(QueryAverageItemPriceAction(buyQty, itemId))
    };

    render() {
        const { classes } = this.props;

        return (
            <Paper elevation={1} className={classes.root}>
                <Typography variant="h5" component="h3">
                    Buy
                </Typography>

                <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <CustomTableCell>Icon</CustomTableCell>
                        <CustomTableCell width="300">Item name</CustomTableCell>
                        <CustomTableCell width="320">Curr. min. buyout</CustomTableCell>
                        <CustomTableCell width="100">Qty available</CustomTableCell>
                        <CustomTableCell width="75">Buy quantity</CustomTableCell>
                        <CustomTableCell width="300">Price per unit & Total</CustomTableCell>
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
                            <CustomTableCell>{itemSupply.quantity}</CustomTableCell>
                            <CustomTableCell padding="dense">
                            <input className="buyQuantity" value={this.props.buyQuantity[itemSupply.item.id]}
                                       onChange={(e) => this.onInputQty(e, itemSupply.item.id)}
                                />
                            </CustomTableCell>
                            <CustomTableCell padding="dense"><MoneyView money={762362}></MoneyView>
                                <MoneyView money={929839283}></MoneyView></CustomTableCell>
                            <TableCell  padding="dense" align="right">
                                <Button variant="contained" color="primary"> Buy</Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </Paper>
        )
    }
}

SellOrderList.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default connect(({itemSupplies, buyQuantity}) => ({itemSupplies, buyQuantity}))(withStyles(styles)(SellOrderList));