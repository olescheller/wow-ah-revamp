
import React from 'react';
import {connect} from 'react-redux';
import {Paper, Tooltip, Typography} from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import './inventoryGrid.css'
import DetailsCard from "./DetailsCard";
import {queryAverageItemPriceAction, randomItemsRequested} from "../redux/actions/itemActions";

class InventoryGrid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {selectedItem: null}
    }

    componentWillMount() {
        this.props.dispatch(randomItemsRequested());

    }

    renderDetails = () => {
        if(this.state.selectedItem) {
            this.props.dispatch(queryAverageItemPriceAction(1, this.state.selectedItem.id));
            return <DetailsCard item={this.state.selectedItem}/>
        }
    }

    showDetails = (item) => {
        this.setState({selectedItem: item})
    }

    getItemSupplies = () => {
        const result = [];
        const arr = [...this.props.inventoryItems];
        const len = arr.length;
        console.log(len)
        const empty = len === 0 ? 16 : (len >= 16) ? 0 : 16 - len;
        for(let i = 0; i < 16; i ++) {
            if(arr[i]) {
                result.push(
                    <Tooltip disableFocusListener disableTouchListener title={arr[i].name}>
                    <Grid onClick={() => this.showDetails(arr[i])} className="inventoryItem" item sm={3}spacing={0} key={Math.random()}>
                        <img className="inventoryIcon"
                             src={`https://s3.eu-central-1.amazonaws.com/wow-icons/icons/${arr[i].icon}.jpg`}/>
                    </Grid>
                    </Tooltip>
                )
            }
            else {
                result.push(
                    <Grid className="inventoryItem" item sm={3}spacing={0} key={Math.random()}>
                    </Grid>
                )
            }
        }
        return result;
    }

    render() {

        const { classes } = this.props;
        return (
            <div>

                <Paper className='paper' elevation={1}>
                    <Typography variant="h5" component="h3">
                        Inventory
                    </Typography>

                    <Grid container xs={12} justify='center'>
                        <Grid container justify='center' item xs={6} sm={6}  spacing={2}>
                            <Grid container item xs={4} spacing={2}>
                                <Grid container justify="center" spacing={2}>
                                    {this.getItemSupplies()}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container item sm={6} spacing={2}>
                            {this.renderDetails()}
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        )

    }
}

export default connect(({inventoryItems}) => ({inventoryItems}))(InventoryGrid);
