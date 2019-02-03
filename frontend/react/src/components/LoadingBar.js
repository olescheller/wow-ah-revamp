import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import {connect} from 'react-redux';

const styles = {
    root: {
        flexGrow: 1,
    },
};

function LinearQuery(props) {
    const { classes } = props;
    if(props.isLoading) {
        return (

            <div className={classes.root}>
                <LinearProgress color="secondary" variant="query" />
            </div>
        );
    }
    return (

        <div>
        </div>
    );
}

export default connect(({isLoading}) => ({isLoading}))(withStyles(styles)(LinearQuery));
