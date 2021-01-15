import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import MaxTempChart from './echarts/MaxTempChart';
import RainChart from './echarts/RainChart';
import HumidityChart from "./echarts/HumidityChart";
import WindChart from './echarts/WindChart';

import FFDIChart from './echarts/FFDIChart'
import DropdownMenu from './DropdownMenu';
import DroughtFactor from './DroughtFactor'

/**
 * UseStyles stores the styles of components in the Dashboard using Material UI.
 */
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    background: '#F1F1F1',
  },
  dropdownMenu: {
    marginLeft: 1,
  }
}));

/**
 * Dashboard is the main component in the App which consists of the various charts
 * and the user input fields. 
 */

export default function Dashboard() {

  const [location, setLocation] = useState('86068');              // intialise location state
  const [droughtFactor, setDroughtFactor] = useState('1');        // initialise droughtFactor state
  const classes = useStyles();                                    // instantiate styles defined above

  var locationCallback = (childData) => {
    /**
     * Callback function to handle change in selectedLocation in the DropdownMenu component.
     * @param childData location recieved from callback in DropdownMenu
     */
    setLocation(childData);
  }
  var droughtFactorCallback = (childData) => {
    /**
     * Callback function to handle change in selectedLocation in the DroughtFactor component.
     * @param childData droughtFactor recieved from callback in DroughtFactor
     */
    setDroughtFactor(childData);
  }
  
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
      <Grid item xs={4}>
          <Paper className={classes.paper}>
            {/* Welcome tile to provide the user further information */}
            <h3> Welcome! </h3>
            <p> 
              This visual dashboard provides forecasts for bushfire and climate change related data. 
              Choose a location and drought factor to begin. 
            </p>
          </Paper>
          <Paper className={classes.paper}>
            {/* Allow user to input desired location and drought factor */}
            <DropdownMenu parentCallback = {locationCallback} />
            <DroughtFactor parentCallback2 = {droughtFactorCallback} />
          </Paper>
        </Grid>
        <Grid item xs ={8}>
          <Paper className={classes.paper}>
            {/* Display FFDI data using FFDIChart component */}
            < FFDIChart 
            selectedLocation={location} 
            selectedFactor = {droughtFactor}
            />
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={6}>
        <Paper className={classes.paper}>
          {/* Display Temperature data using MaxTempChart component */}
          <MaxTempChart selectedLocation={location} />
        </Paper>
        </Grid>
        <Grid item xs ={6}>
          <Paper className={classes.paper}>
            {/* Display Rainfall data using RainChart component */}
            <RainChart selectedLocation={location} />
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            {/* Display Humidity data using HumidityChart component */}
            <HumidityChart selectedLocation={location} />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            {/* Display Wind Speed data using WindChart component */}
            < WindChart selectedLocation={location} />
          </Paper>
        </Grid>
      </Grid>
      
    </div>
  );
}