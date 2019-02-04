import React from 'react';
import {connect} from 'react-redux';
import InfoIcon from '@material-ui/icons/InfoSharp';
import CloseIcon from '@material-ui/icons/Close';
import Typography from "@material-ui/core/Typography";
import './infobox.css';
import {setInfoBox} from "../redux/actions/actions";

class InfoBox extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClose = () => {
        this.props.dispatch(setInfoBox(false));
        //set state to invisible
    }

    renderText = () => {
        switch (this.props.type) {
            case 'moreItems':
                return `There are ${this.props.amountOfItemSupplies} total results for ${this.props.searchTerm} but only 25 are shown. Please specify your search term to view more auctions.`;
            default:
                return ''
        }
    }
    render() {
        if(this.props.showInfoBox) {
            return (
                <div  className="info">
                    <InfoIcon className="icon"/> <span id="space"/><Typography>{this.renderText()}</Typography> <CloseIcon onClick={this.handleClose} className="icon2"/>
                </div>
            );
        }
        else {
            return <div></div>
        }
    }

}

export default connect(({searchTerm, showInfoBox, amountOfItemSupplies}) => ({searchTerm, showInfoBox, amountOfItemSupplies})) (InfoBox);