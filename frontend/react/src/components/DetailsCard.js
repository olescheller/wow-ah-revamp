import './inventoryGrid.css'
import React from 'react';
import {Button, Card, CardContent, CardMedia, IconButton, Input, TextField, Typography} from "@material-ui/core";
import {
    addItemToSellOrderRequested,
    addItemToSellOrderSucceeded,
    createSellOrder,
    queryAverageItemPriceAction
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
        this.state = {currentPrice: 0, amount: 1};
    }

    renderPrice = () => {
        if(this.props.price[this.props.inventoryItem.item.id] && this.props.price[this.props.inventoryItem.item.id].perUnit ) {
            return(<div>Current min price: <MoneyView  displayClass="coins-inline" className="price" money={this.props.price[this.props.inventoryItem.item.id].perUnit}/></div>);
        }
        else {
            return(<div> Be the first seller of {this.props.inventoryItem.item.name} </div>);
        }
    };

    calcPrice = (direction) => {
        if(this.props.price[this.props.inventoryItem.item.id]) {
            const newPrice = direction < 0 ? this.props.price[this.props.inventoryItem.item.id].perUnit * 0.9 :
                (direction > 0) ? this.props.price[this.props.inventoryItem.item.id].perUnit * 1.1 :
                    this.props.price[this.props.inventoryItem.item.id].perUnit;
            this.setState({currentPrice: newPrice})
        }
        else {
            this.setState({currentPrice: 0})

        }
    };

    sellItem = (item) => {
        const [seller_name, seller_realm] = this.props.user.split("-");
        if(this.props.activeSellOrders.reduce((acc, curr) => {
            return acc || curr.item.id === item.id
        }, false)) {
            const sellOrder = {itemId: item.id, quantity: this.state.amount, seller_name: seller_name.toString(), seller_realm: seller_realm.toString()}
            this.props.dispatch(addItemToSellOrderRequested(sellOrder));
            //this.props.dispatch(setInfoBox(true));
           // setTimeout(() => this.props.dispatch(setInfoBox(false)), 3000);
        }
        else if(this.state.amount > 0 && this.state.amount <= this.props.inventoryItem.quantity){
            const sellOrder = {itemId: item.id, price: this.state.currentPrice, quantity: this.state.amount, seller_name: seller_name.toString(), seller_realm: seller_realm.toString()}
            this.props.dispatch(createSellOrder(sellOrder));
        }
        this.setState({currentPrice: 0, amount:  1})
    };

    render() {
        return(
            <Card className="card">
                <div className="details">
                    <CardContent className="content">
                        <Typography component="h5" variant="h5">
                            {this.props.inventoryItem.item.name}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Category: {this.props.inventoryItem.item.item_class.name}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                        Sub-Category: {this.props.inventoryItem.item.item_sub_class.name}
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

                            value={this.state.currentPrice}
                            onChange={(e) => this.setState({currentPrice: e.target.value})}
                            className='priceInput'
                            margin="normal"
                        />
                         <TextField
                             label="Amoount"
                             type="number"
                             variant="outlined"
                             value={this.state.amount}
                             onChange={(e) => this.setState({amount: e.target.value})}
                             className='amountInput'
                             InputLabelProps={{
                                 shrink: true,
                             }}
                             margin="normal"
                         />
                        <Button onClick={() => this.calcPrice(-1)} size="small" color="primary">
                            <LessIcon />
                            10%
                        </Button>
                        <Button onClick={() => this.calcPrice(0)}  size="small" color="secondary">
                            <MinPriceIcon />
                            Min
                        </Button>
                        <Button onClick={() => this.calcPrice(1)}  size="small" color="primary">
                            <MoreIcon />
                            10%
                        </Button>
                        <Button onClick={() => this.sellItem(this.props.inventoryItem.item)} id='sellButton' variant="contained" color="secondary"> Sell</Button>
                    </span>
                    <CardContent className="content">

                        <Typography variant="subtitle1" color="textSecondary">
                    <MoneyView  displayClass="coins-inline" className="price" money={this.state.currentPrice}/>
                        </Typography>
                    </CardContent>

                </div>
                <CardMedia
                    className='icon'
                    image={`https://s3.eu-central-1.amazonaws.com/wow-icons/icons/${this.props.inventoryItem.item.icon}.jpg`}
                    title={this.props.inventoryItem.item.name}
                />
            </Card>
        )
    }
}

export default connect(({price, activeSellOrders, user}) => ({price, activeSellOrders, user})) (DetailsCard);