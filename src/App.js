import React from 'react';
import NavBar from './components/navigation/NavBar';
import './App.css';
import Image from './assets/landing.png';
import Dashboard from './components/Dashboard';
import Landing from './components/Landing';

const styles = {
  // Defines style of the landing page component.
  Landing: {
    height : '100vh',
    backgroundImage: `url(${Image})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }
}

/** 
 * This component is the main App component that is parent 
 * to all other components.
 */ 

export default class  App extends React.Component {

  render() {
  return (
    <div className="App">
      <div style={styles.Landing} className="Landing">
        <Landing />
      </div>
      <NavBar />
      <Dashboard />
    </div>
  );
}
}
