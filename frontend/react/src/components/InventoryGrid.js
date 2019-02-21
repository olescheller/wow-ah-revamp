
import React from 'react';
import {connect} from 'react-redux';
import {Badge, Paper, Tooltip, Typography} from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import './inventoryGrid.css'
import DetailsCard from "./DetailsCard";
import {
    fetchAverageItemPriceRequestedAction,
    fetchRandomItemsRequestedAction,
    setSellingDetails
} from "../redux/actions/itemActions";
import InfoBox from "./InfoBox";
import {setInfoBox} from "../redux/actions/actions";
import {inventorySize} from "../config/config";

class InventoryGrid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {selectedItem: null}
    }

    componentWillMount() {
        this.props.dispatch(setInfoBox(false))

    }

    renderDetails = () => {
        if(this.state.selectedItem) {
            this.props.dispatch(fetchAverageItemPriceRequestedAction(1, this.state.selectedItem.item.id));
            return <DetailsCard/>
        }
    }

    renderIconWithBadge = (inventoryItem) => {
        return inventoryItem.quantity > 1 ?
            <Badge badgeContent={inventoryItem.quantity} color="secondary">
                <img className="inventoryIcon"
                     src={`https://s3.eu-central-1.amazonaws.com/wow-icons/icons/${inventoryItem.item.icon}.jpg`}/>
            </Badge>
            :
            <img className="inventoryIcon"
                 src={`https://s3.eu-central-1.amazonaws.com/wow-icons/icons/${inventoryItem.item.icon}.jpg`}/>
    };


    showDetails = (item) => {
        this.props.dispatch(fetchAverageItemPriceRequestedAction(1, item.item.id));
        this.props.dispatch(setSellingDetails({...item, price: ''}));
        this.setState({selectedItem: item})
    }

    getItemSupplies = () => {
        const result = [];
        const arr = [...this.props.inventoryItems];
        const len = arr.length;
        const empty = len === 0 ? inventorySize : (len >= inventorySize) ? 0 : inventorySize - len;
        for(let i = 0; i < inventorySize; i ++) {
            if(arr[i]) {
                result.push(
                    <Tooltip key={arr[i].item.name} disableFocusListener disableTouchListener title={arr[i].item.name}>
                    <Grid onClick={() => this.showDetails(arr[i])} className="inventoryItem" item sm={3} key={Math.random()}>
                        {this.renderIconWithBadge(arr[i])}
                    </Grid>
                    </Tooltip>
                )
            }
            else {
                result.push(
                    <Grid className="inventoryItem" item sm={3} key={Math.random()}>
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
                        My Inventory
                    </Typography>

                    <Grid container justify='center'>
                        <Grid container justify='center' item xs={6} sm={6}  >
                            <Grid container item xs={4} >
                                <Grid container justify="center" alignItems="flex-start" spacing={0}>
                                    {this.getItemSupplies()}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container item sm={6} >
                            {this.renderDetails()}
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        )

    }
}

export default connect(({inventoryItems}) => ({inventoryItems}))(InventoryGrid);
