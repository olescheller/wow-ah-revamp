import './inventoryGrid.css'
import React from 'react';
import {Button, Card, CardContent, CardMedia, Input, TextField, Typography} from "@material-ui/core";





class DetailsCard extends React.Component {


    render() {
        return(
            <Card className="card">
                <div className="details">
                    <CardContent className="content">
                        <Typography component="h5" variant="h5">
                            {this.props.item.name}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Some additional information
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

export default DetailsCard;