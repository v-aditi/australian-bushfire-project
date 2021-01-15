import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

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

  export default function Landing() {
    
    const classes = useStyles();

    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
        <Grid item style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)'}}>
            <Paper className={classes.paper}>
              <h1> Bushfire Visualisation Project </h1>
              <p> <strong>Created by Aditi, Jessica and Zac.</strong></p>
              <p> 
                This visual dashboard was created as part of the Computer Science Project unit.
                It contains information about the climate and bushfire conditions in Australia. </p>
            </Paper>
        </Grid>
        </Grid>
      </div>
    );
  } 