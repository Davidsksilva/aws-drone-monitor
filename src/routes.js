import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import Main from './pages/Main';
import DroneDetail from './pages/DroneDetail';



const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Main} exact/>
        <Route path="/drone/:serial" component={DroneDetail} exact/>
      </Switch>
    </BrowserRouter>
  )
}

export default Routes
