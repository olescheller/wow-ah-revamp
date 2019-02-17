
import React from 'react';
import {connect} from 'react-redux';
import {Paper, Typography} from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import './inventoryGrid.css'

class InventoryGrid extends React.Component {

    getItemSupplies = () => {
        const arr = [...this.props.itemSupplies];
        const len = arr.length;
        const empty = 16 - len - len%4;
        arr.slice(0, len - len%4)
        for(let i = 0; i < empty; i ++) {
            console.log(i)
            arr.push({item: {icon: 'inv_jewelcrafting_nobletopaz_02', name: 'placeholder'}})
        }
        return arr;
    }

    render() {

        const { classes } = this.props;
        return (
            <div>

                <Paper elevation={1}>
                    <Typography variant="h5" component="h3">
                        Inventory
                    </Typography>

                    <Grid container justify='center' spacing={0}>
                        <Grid container item xs={2} spacing={0}>
                            <Grid container justify="center" spacing={0}>
                                {this.getItemSupplies().map(itemSupply => (
                                    <Grid item sm={3}spacing={0} key={itemSupply.item.name}>
                                        <Paper>
                                        <img
                                            src={`https://s3.eu-central-1.amazonaws.com/wow-icons/icons/${itemSupply.item.icon}.jpg`}/>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        )

    }
}

export default connect(({itemSupplies}) => ({itemSupplies}))(InventoryGrid);
