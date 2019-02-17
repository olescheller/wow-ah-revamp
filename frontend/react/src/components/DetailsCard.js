import './inventoryGrid.css'
import React from 'react';
import {Button, Card, CardContent, CardMedia, Input, TextField, Typography} from "@material-ui/core";
import {queryAverageItemPriceAction} from "../redux/actions/itemActions";
import {connect} from "react-redux";
import MoneyView from "./MoneyView";





class DetailsCard extends React.Component {

    componentWillMount() {
        this.props.dispatch(queryAverageItemPriceAction(1, this.props.item.id));

    }

    renderPrice = () => {
        if(this.props.price[this.props.item.id]) {
            return(<div>Current min price: <MoneyView money={this.props.price[this.props.item.id].perUnit}/></div>);
        }
        else {
            return(<div> Be the first seller of {this.props.item.name} </div>);
        }
    }

    render() {
        return(
            <Card className="card">
                <div className="details">
                    <CardContent className="content">
                        <Typography component="h5" variant="h5">
                            {this.props.item.name}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Category: {this.props.item.item_class.name}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                        Sub-Category: {this.props.item.item_sub_class.name}
                        </Typography>

                        <Typography variant="subtitle1" color="textSecondary">
                            {this.renderPrice()}
                        </Typography>

                    </CardContent>
                    <span className='controls'>
                        <TextField
                            id="outlined-number"
                            label="Value in Copper"
                            type="number"
                            className='priceInput'
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"
                            variant="outlined"
                        />
                       <Button id='sellButton' variant="contained" color="secondary"> Sell item</Button>
                    </span>
                </div>
                <CardMedia
                    className='icon'
                    image={`https://s3.eu-central-1.amazonaws.com/wow-icons/icons/${this.props.item.icon}.jpg`}
                    title={this.props.item.name}
                />
            </Card>
        )
    }
}

export default connect(({price}) => ({price})) (DetailsCard);