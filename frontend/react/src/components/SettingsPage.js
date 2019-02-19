import * as React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";


class SettingsPage extends React.Component {
    render() {
        return (
            <div>
                <Grid container sm={4} justify='left'>

                    <Grid item sm={12}>
                        <Card style={{margin: "10px"}}>
                            <CardContent>
                                <Typography variant="h5" component="h2" style={{marginBottom: "15px"}}>Switch user</Typography>
                                <Typography component="p">Switch to: Elandura-Silvermoon</Typography>
                                <Typography component="p">Switch to: Titivillus-Silvermoon</Typography>
                                <Typography component="p">Switch to: Meshuggah-Silvermoon</Typography>
                                <Typography component="p">Switch to: Moneyproblem-Silvermoon</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item sm={12}>
                        <Card style={{margin: "10px"}}>
                            <CardContent>
                                <Typography variant="h5" component="h2" style={{marginBottom: "15px"}}>Stock up on gold</Typography>
                                <Typography component="p">Add 1,000,000 gold to balance</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>


            </div>
        )
    }
}

export default SettingsPage;