import './inventoryGrid.css'
import React from 'react';
import {Button, Card, CardContent, CardMedia, IconButton, Input, TextField, Typography} from "@material-ui/core";
import {
    addItemToSellOrderRequestedAction,
    addItemToSellOrderSucceeded, changeDetailItem,
    createSellOrderRequestedAction,
    fetchAverageItemPriceRequestedAction
} from "../redux/actions/itemActions";
import {connect} from "react-redux";
import MoneyView from "./MoneyView";
import MinPriceIcon from "@material-ui/icons/PanoramaFishEyeOutlined";
import LessIcon from "@material-ui/icons/ArrowDownwardOutlined";
import MoreIcon from "@material-ui/icons/ArrowUpwardOutlined"
import {setInfoBox} from "../redux/actions/actions";


class DetailsCard extends React.Component {

    constructor(props) {
        super(props);
    }

    renderPrice = () => {
        if (this.props.price[this.props.detailItem.item.id] && this.props.price[this.props.detailItem.item.id].perUnit) {
            return (<div>Current min price: <MoneyView displayClass="coins-inline" className="price"
                                                       money={this.props.price[this.props.detailItem.item.id].perUnit}/>
            </div>);
        } else {
            return (<div> Be the first seller of {this.props.detailItem.item.name} </div>);
        }
    };

    calcPrice = (direction) => {
        if (this.props.price[this.props.detailItem.item.id]) {
            const newPrice = direction < 0 ? this.props.price[this.props.detailItem.item.id].perUnit * 0.9 :
                (direction > 0) ? this.props.price[this.props.detailItem.item.id].perUnit * 1.1 :
                    this.props.price[this.props.detailItem.item.id].perUnit;
            this.props.dispatch(changeDetailItem({price: Math.floor(newPrice)}));
        }
    };

    sellItem = (item) => {
        const [seller_name, seller_realm] = this.props.user.split("-");
        if (this.props.activeSellOrders.reduce((acc, curr) => {
            return acc || curr.item.id === item.id
        }, false)) {
            const sellOrder = {
                itemId: item.id,
                quantity: this.props.detailItem.quantity,
                seller_name: seller_name.toString(),
                seller_realm: seller_realm.toString()
            };
            this.props.dispatch(addItemToSellOrderRequestedAction(sellOrder));
        } else if (this.props.detailItem.quantity > 0 && this.props.inventoryItem.quantity >= this.props.detailItem.quantity) {
            const sellOrder = {
                itemId: item.id,
                price: this.props.detailItem.price,
                quantity: this.props.detailItem.quantity,
                seller_name: seller_name.toString(),
                seller_realm: seller_realm.toString()
            };
            this.props.dispatch(createSellOrderRequestedAction(sellOrder));
        }
    };

    render() {
        return (
            <Card className="card">
                <div className="details" style={{padding:"10px"}}>
                    <CardContent className="content"
                    >
                        <Typography component="h5" variant="h5">
                            {this.props.detailItem.item.name}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Category: {this.props.detailItem.item.item_class.name}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Sub-Category: {this.props.detailItem.item.item_sub_class.name}
                        </Typography>

                        <Typography variant="subtitle1" color="textSecondary">
                            {this.renderPrice()}
                        </Typography>

                    </CardContent>
                    <span className='controls'>
                        <TextField
                            label="Value in Copper"
                            type="number"
                            variant="outlined"
                            value={this.props.detailItem.price}
                            onChange={(e) => this.props.dispatch(changeDetailItem({price: e.target.value}))}
                            className='priceInput'
                            style={{margin: "10px"}}
                        />
                         <TextField
                             label="Amount"
                             type="number"
                             variant="outlined"
                             value={this.props.detailItem.quantity}
                             onChange={(e) => this.props.dispatch(changeDetailItem({quantity: e.target.value}))}
                             style={{margin: "10px"}}
                             className='amountInput'
                         />
                                             </span>
                    <span>
                    <Button onClick={() => this.calcPrice(-1)} size="small" color="primary">
                            <LessIcon/>
                            10%
                        </Button>
                        <Button onClick={() => this.calcPrice(0)} size="small" color="primary">
                            <MinPriceIcon/>
                            Min
                        </Button>
                        <Button onClick={() => this.calcPrice(1)} size="small" color="primary">
                            <MoreIcon/>
                            10%
                        </Button>
                        <Button disabled={!parseInt(this.props.detailItem.price)}
                                onClick={() => this.sellItem(this.props.detailItem.item)} id='sellButton'
                                variant="contained" color="secondary"> Sell</Button>
                    </span>
                    <CardContent className="content">

                        <Typography variant="subtitle1" color="textSecondary">
                            <MoneyView displayClass="coins-inline" className="price"
                                       money={this.props.detailItem.price}/>
                        </Typography>
                    </CardContent>

                </div>
                <CardMedia
                    className='icon'
                    image={`https://s3.eu-central-1.amazonaws.com/wow-icons/icons/${this.props.detailItem.item.icon}.jpg`}
                    title={this.props.detailItem.item.name}
                />
            </Card>
        )
    }
}

export default connect(({price, activeSellOrders, user, detailItem}) => ({
    price,
    activeSellOrders,
    user,
    detailItem
}))(DetailsCard);