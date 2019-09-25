import React, { Component } from 'react';
import './App.css';
import Switcher from './Switcher.jsx';
import { Navbar } from 'react-materialize'
import { Link } from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <div className='App'>
                <Navbar brand='C C M N' left>
                    <li className='location'><Link to='/location'><i className='material-icons'>location_on</i>Location</Link></li>
                    <li className='analytics_menu'><Link to='/analytics'><i className='material-icons'>bar_chart</i>Analytics</Link></li>
                    <li className='users'><Link to='/users'><i className='material-icons'>group</i>Users</Link></li>
                </Navbar>
                <Switcher />
            </div>
        );
    }
}

export default App;
