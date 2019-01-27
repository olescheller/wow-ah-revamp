import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import React, {Component} from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import categories from "./categories";
import TableBody from "./SellOrderList";
import {selectCategoryAction} from "./actions";
import {connect} from "react-redux";
import {withStyles} from "@material-ui/core";

const ExpansionPanelSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0,0,0,.03)',
        borderBottom: '1px solid rgba(0,0,0,.125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
        '&:before': {
            display: 'none',
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },

    },
    expanded: {},
})(props => <MuiExpansionPanelSummary {...props} />);

ExpansionPanelSummary.muiName = 'ExpansionPanelSummary';

class CategorySelector extends React.Component {
    constructor(props) {
        super(props);
        const {classes} = props;
        this.classes = PropTypes.object.isRequired;
        this.categories = categories["classes"]
    }

    handleSelectedCategory = categoryId => (event, expanded) => {
        this.props.dispatch(selectCategoryAction(categoryId != this.props.selectedCategory ? categoryId : ""));
    };


    render() {
        return (
            <div>
                {this.categories.map(row => (
                <ExpansionPanel expanded={this.props.selectedCategory === row.id} onChange={this.handleSelectedCategory(row.id)}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography className={this.classes.heading}>{row.name}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{  display: "block"}}>

                        {row.subclasses.map(subclass => (
                            <ul>{subclass.name}</ul>

                        ))}

                    </ExpansionPanelDetails>
                </ExpansionPanel>
                    ))}
            </div>
        )
    }
}

export default connect(({selectedCategory,selectedSubCategory})=>({selectedCategory,selectedSubCategory}))(CategorySelector);