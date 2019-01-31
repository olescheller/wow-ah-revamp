import React from "react";

import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {connect} from "react-redux";
import {QueryAverageItemPriceAction} from "../redux/actions/itemActions";
import './itemsupply.css'


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
                        <TableCell align="left">Icon</TableCell>
                        <TableCell align="left">Item name</TableCell>
                        <TableCell align="right">Curr. min. buyout</TableCell>
                        <TableCell align="right">Qty available</TableCell>
                        <TableCell align="right">Buy quantity</TableCell>
                        <TableCell align="right">Price per unit</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.itemSupplies.map(itemSupply => (
                        <TableRow key={itemSupply.item.id}>
                            <TableCell padding="dense" component="th" align="left" scope="row">
                                <img
                                    src={`https://s3.eu-central-1.amazonaws.com/wow-icons/icons/${itemSupply.item.icon}.jpg`}/>

                            </TableCell>
                            <TableCell align="right" scope="row">
                                <span>{itemSupply.item.name}</span>

                            </TableCell>
                            <TableCell align="right">{itemSupply.min_price}</TableCell>
                            <TableCell align="right">{itemSupply.quantity}</TableCell>
                            <TableCell align="right">
                                <input value={this.props.buyQuantity[itemSupply.item.id]}
                                       onChange={(e) => this.onInputQty(e, itemSupply.item.id)}
                                />
                            </TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
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