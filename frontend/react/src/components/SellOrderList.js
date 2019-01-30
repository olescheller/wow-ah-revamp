import React from "react";

import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {connect} from "react-redux";
import {QueryAverageItemPriceAction} from "../redux/actions/itemActions";


let id = 0;

function createData(name, calories, fat, carbs, protein) {
    id += 1;
    return {id, name, calories, fat, carbs, protein};
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];


class SellOrderList extends React.Component {

    constructor(props) {
        super(props);

        this.chosenQty = {0: 0, 1: 1, 2: 0, 3: 3, 4: 4, 5: 5};
        this.pricePerUnit = {}

        let {sellOrders} = props;

    }

    onInputQty = (e, itemId) => {
        const buyQty = e.target.value;
        this.props.dispatch(QueryAverageItemPriceAction(buyQty, itemId))
    }

    render() {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Item name</TableCell>
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
                            <TableCell component="th" scope="row">
                                {itemSupply.item.name}
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
                            <TableCell align="right"><Button variant="contained"
                                                             color="primary"> Buy</Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }
}

export default connect(({itemSupplies, buyQuantity}) => ({itemSupplies, buyQuantity}))(SellOrderList);