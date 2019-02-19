import * as React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import connect from "react-redux/es/connect/connect";
import {userMoneyAction} from "../redux/actions/itemActions";


class SettingsPage extends React.Component {

    handleSwitchUser = (userName, realmName) => () => {
        this.props.dispatch(userMoneyAction(userName,realmName));
    };

    render() {
        return (
            <div>
                <Grid container sm={4} justify='left'>

                    <Grid item sm={12}>
                        <Card style={{margin: "10px"}}>
                            <CardContent>
                                <Typography variant="h5" component="h2" style={{marginBottom: "15px"}}>Switch user</Typography>
                                <Button onClick={this.handleSwitchUser("Elandura", "Silvermoon")}>Switch to: Elandura-Silvermoon</Button>
                                <Button onClick={this.handleSwitchUser("Titivillus","Silvermoon")}>Switch to: Titivillus-Silvermoon</Button>
                                <Button onClick={this.handleSwitchUser("Meshuggah","Silvermoon")}>Switch to: Meshuggah-Silvermoon</Button>
                                <Button onClick={this.handleSwitchUser("Moneyproblem","Silvermoon")}>Switch to: Moneyproblem-Silvermoon</Button>
                            </CardContent>
                        </Card>
                    </Grid>



                </Grid>


            </div>
        )
    }
}

export default connect()(SettingsPage);