import Paper from '@material-ui/core/Paper'
import React from "react";
import {connect} from "react-redux";
import {withStyles} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import Button from "@material-ui/core/Button";
import MoneyView from "./MoneyView";
import {deleteSellOrderAction} from "../redux/actions/itemActions";
import InfoBox from "./InfoBox";



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



class ActiveSellOrders extends React.Component {


    deleteSellOrder = (sellOrder) => {
        this.props.dispatch(deleteSellOrderAction(sellOrder));
    }

    render(){
        const { classes } = this.props;

        return (
                <div>
                    <Paper elevation={1} className={classes.root}>
                        <Typography variant="h5" component="h3">
                            My Sell Orders
                        </Typography>

                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <CustomTableCell width="60">Icon</CustomTableCell>
                                    <CustomTableCell width="300">Item name</CustomTableCell>
                                    <CustomTableCell width="300">Buyout</CustomTableCell>
                                    <CustomTableCell width="60">Quantity</CustomTableCell>
                                    <CustomTableCell width="60"></CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.props.activeSellOrders.map(sellOrder => (
                                    <TableRow key={sellOrder.item.id}>
                                        <TableCell padding="dense" component="th" align="left" scope="row">
                                            <img
                                                src={`https://s3.eu-central-1.amazonaws.com/wow-icons/icons/${sellOrder.item.icon}.jpg`}/>

                                        </TableCell>
                                        <CustomTableCell align="left" scope="row">
                                            <span>{sellOrder.item.name}</span>

                                        </CustomTableCell>
                                        <CustomTableCell padding="dense">
                                            <MoneyView
                                            money={sellOrder.price}/>
                                        </CustomTableCell>
                                        <CustomTableCell padding="dense">{sellOrder.quantity}</CustomTableCell>
                                        <CustomTableCell padding="dense" align="right">
                                            <Button onClick={() => this.deleteSellOrder(sellOrder)} variant="contained" color="primary"> Delete</Button></CustomTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
            )
        }
}

ActiveSellOrders.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(({activeSellOrders}) => ({activeSellOrders})) (withStyles(styles) (ActiveSellOrders));