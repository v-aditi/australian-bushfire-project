import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import {Slider} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

// Drought Factor Selector component ranges from 1-10
export default class DroughtFactor extends React.Component {
    constructor(props){
        //Constructs states/methods for object
        super(props);
        this.state = {droughtFactor: ""};
        this.handleChange.bind(this);
        this.sendData.bind(this);
    }

    handleChange = (event,droughtFactor) => {
        //Updates Drought factor and sends new DF to Dashboard via sendData
        this.setState({droughtFactor: droughtFactor},() => this.sendData())
    }
    sendData = () => {
        //Sends new Drught Factor to the Dashbard
        this.props.parentCallback2(this.state.droughtFactor);
    }
    //How Component should be structured
    render(){
        return(
            <div>
                <Grid container spacing={3}>
                    <Grid item xs>
                        <h4>Drought Factor(1-10): </h4>
                    </Grid>
                    <Grid item xs>
                        <FormControl 
                            style={{
                                minWidth: 160
                                }}>
                            <div style = {{margin:16}}>
                                <Slider 
                                    defaultValue = {1}
                                    max = {10}
                                    min = {1}
                                    step = {1}
                                    valueLabelDisplay = 'auto'
                                    onChange = {this.handleChange} // On slider movemovement updates Drought Factor and sends it to the Dashboard
                                    >
                                    </Slider>
                            </div>
                        </FormControl> 
                    </Grid>
                </Grid>
            </div>
        );
    }
}