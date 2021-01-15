import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  /**
  * UseStyles stores the styles of components in the NavBar using Material UI.
  */
  root: {
    flexGrow: 1,
  },
  title: {
    color: '##c5c2c2',
  },
  navbar: {
    background : '#7d1818',
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    borderBottomColor: theme.palette.divider,
  },
}));

/**
 * Dropdown Menu is a Select based component that allows the user to select 
 * their location.
 */

export default function NavBar() {
  const classes = useStyles();                // instantiate styles defined above

  return (
    <div className={classes.root}>
      {/* Material UI AppBar component used to construct NavBar */}
      <AppBar position="static" className={classes.navbar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Bushfire Visualisation
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}