import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Analitics from './analitics/Analitics.jsx';
import Location from "./location/Location";
import Users from "./users/Users";

class Switcher extends Component {
    render() {
        return (
            <Switch>
                <Route path='/' render={ ({history})  => (<Analitics history={ history }/>)} exact/>
                <Route path='/location' render={ ({history})  => (<Location history={ history }/>)} exact/>
                <Route path='/analytics' render={ ({history})  => (<Analitics history={ history }/>)} exact/>
                <Route path='/users' render={ ({history})  => (<Users history={ history }/>)} exact/>
            </Switch>
        );
    }
}

export default Switcher;
