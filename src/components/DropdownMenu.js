import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';

/**
 * Dropdown Menu is a Select based component that allows the user to select 
 * their location.
 */
export default class DropdownMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            location: null
        }
        this.handleChange.bind(this);
        this.sendData.bind(this);
    }
  
    handleChange = (event) => {
        /**
         * Function to handle when user selects a new location
         * @param event the event triggered when the user selects new location
         */
        this.setState({location: event.target.value}, () => 
        this.sendData());           // send data to Dashboard via callback
    };

    sendData = () => {
        /**
         * Function that sends new location to Dashboard so new data can be displayed
         * via updated charts.
         */
        this.props.parentCallback(this.state.location);        // callback function to Dashboard
   };

    render() {
        return(
            <div>
                <Grid container spacing={3}>
                    <Grid item xs>
                        <h4>Location </h4>
                    </Grid>
                    <Grid item xs>
                        {/* Form that collects user input */}
                        <FormControl 
                            style={{
                                minWidth: 160
                            }}>
                            <InputLabel id="select-location"> Select </InputLabel>
                            <Select
                            labelId="select-location"
                            id="select-location"
                            data-testid= "dropdown"
                            className= "dropdown"
                            value={this.location}
                            onChange={this.handleChange}
                            >
                                {/* list of fire danger zones to be displayed*/}
                                <MenuItem value={'86068'}>VIC - Central</MenuItem>
                                <MenuItem value={'88043'}>VIC - North Central</MenuItem>
                                <MenuItem value={'90194'}>VIC - South West</MenuItem>
                                <MenuItem value={'79028'}>VIC - Wimmera</MenuItem>
                                <MenuItem value={'77094'}>VIC - Mallee</MenuItem>
                                <MenuItem value={'88051'}>VIC - Northern Country</MenuItem>
                                <MenuItem value={'82138'}>VIC - North East</MenuItem>
                                <MenuItem value={'84143'}>VIC - East Gippsland</MenuItem>
                                <MenuItem value={'85072'}>VIC - West and South Gippsland</MenuItem>
                                <MenuItem value={'66194'}>NSW - Sydney</MenuItem>
                                <MenuItem value={'59140'}>NSW - North Eastern</MenuItem>
                                <MenuItem value={'61250'}>NSW - Hunter</MenuItem>
                                <MenuItem value={'52088'}>NSW - North Western</MenuItem>
                                <MenuItem value={'67113'}>NSW - Greater Sydney</MenuItem>
                                <MenuItem value={'69022'}>NSW - South Eastern</MenuItem>
                                <MenuItem value={'72150'}>NSW - South Western</MenuItem>
                                <MenuItem value={'65068'}>NSW - Western</MenuItem>
                                <MenuItem value={'2032'}>WA - Nothern</MenuItem>
                                <MenuItem value={'12038'}>WA - Central and Eastern </MenuItem>
                                <MenuItem value={'9215'}>WA - South West Land Division</MenuItem>
                                <MenuItem value={'27073'}>QLD - Far Nothern</MenuItem>
                                <MenuItem value={'29127'}>QLD - Nothern</MenuItem>
                                <MenuItem value={'36031'}>QLD - Central</MenuItem>
                                <MenuItem value={'44026'}>QLD - South Western</MenuItem>
                                <MenuItem value={'40913'}>QLD - Brisbane</MenuItem>
                                <MenuItem value={'40764'}>QLD - South Eastern</MenuItem>
                                <MenuItem value={'40043'}>QLD - North Coast</MenuItem>
                                <MenuItem value={'70339'}>ACT - Central</MenuItem>
                                <MenuItem value={'94212'}>TAS - Southern</MenuItem>
                                <MenuItem value={'91107'}>TAS - North West</MenuItem>
                                <MenuItem value={'91237'}>TAS - Northern</MenuItem>
                                <MenuItem value={'11019'}>SA - Eyre Peninsula</MenuItem>
                                <MenuItem value={'26021'}>SA - South Eastern</MenuItem>
                                <MenuItem value={'22018'}>SA - Yorke Peninsula</MenuItem>
                                <MenuItem value={'22841'}>SA - Kangaroo Island</MenuItem>
                                <MenuItem value={'23122'}>SA - Mid North</MenuItem>
                                <MenuItem value={'24024'}>SA - Riverland</MenuItem>
                                <MenuItem value={'24521'}>SA - Murray Bridge</MenuItem>
                                <MenuItem value={'23343'}>SA - Mt Lofty Ranges</MenuItem>
                                <MenuItem value={'23013'}>SA - Metropolitan</MenuItem>
                                <MenuItem value={'14272'}>NT - Vernon Arafura</MenuItem>
                                <MenuItem value={'14401'}>NT - Arnhem</MenuItem>
                                <MenuItem value={'15135'}>NT - Savanna</MenuItem>
                                <MenuItem value={'15602'}>NT - Barkly</MenuItem>
                                <MenuItem value={'15590'}>NT - Alice Springs</MenuItem>
                            </Select>
                        </FormControl> 
                    </Grid>
                </Grid>
            </div>
        );
    }
    }