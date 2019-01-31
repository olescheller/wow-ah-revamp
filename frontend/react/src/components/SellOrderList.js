import React from "react";

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

const CustomTableCell = withStyles(theme => ({
    align: 'left',
}))(TableCell);

let id = 0;

function createData(name, calories, fat, carbs, protein) {
    id += 1;
    return {id, name, calories, fat, carbs, protein};
}


class SellOrderList extends React.Component {

    constructor(props) {
        super(props);
    }

    onInputQty = (e, itemId) => {
        const buyQty = e.target.value;
        this.props.dispatch(QueryAverageItemPriceAction(buyQty, itemId))
    };

    render() {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <CustomTableCell>Icon</CustomTableCell>
                        <CustomTableCell width="400em">Item name</CustomTableCell>
                        <CustomTableCell>Curr. min. buyout</CustomTableCell>
                        <CustomTableCell>Qty available</CustomTableCell>
                        <CustomTableCell>Buy quantity</CustomTableCell>
                        <CustomTableCell>Price per unit</CustomTableCell>
                        <CustomTableCell>Total</CustomTableCell>
                        <CustomTableCell></CustomTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.itemSupplies.map(itemSupply => (
                        <TableRow key={itemSupply.item.id}>
                            <TableCell padding="dense" component="th" align="left" scope="row">
                                <img
                                    src={`https://s3.eu-central-1.amazonaws.com/wow-icons/icons/${itemSupply.item.icon}.jpg`}/>

                            </TableCell>
                            <CustomTableCell width="400em" scope="row">
                                <span>{itemSupply.item.name}</span>

                            </CustomTableCell>
                            <CustomTableCell><MoneyView money={itemSupply.min_price}></MoneyView></CustomTableCell>
                            <CustomTableCell>{itemSupply.quantity}</CustomTableCell>
                            <CustomTableCell>
                            <input className="buyQuantity" value={this.props.buyQuantity[itemSupply.item.id]}
                                       onChange={(e) => this.onInputQty(e, itemSupply.item.id)}
                                />
                            </CustomTableCell>
                            <CustomTableCell></CustomTableCell>
                            <CustomTableCell></CustomTableCell>
                            <TableCell  padding="dense" align="right">
                                <Button variant="contained" color="primary"> Buy</Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }
}

export default connect(({itemSupplies, buyQuantity}) => ({itemSupplies, buyQuantity}))(SellOrderList);