import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Pages/Home';
import Landing from './Pages/Landing';
import Colabore from './Pages/Colabore';
import ColaboreForm from './Pages/ColaboreForm';
import ColaboreAdmin from './Pages/ColaboreAdmin';
import PortalNoticiasMain from './Pages/PortalNoticiasMain';
import AdminPortalNoticiasMain from './Pages/AdminPortalNoticiasMain';
import CreateNoticia from './Pages/CreateNoticia';
import NoMatch from './Pages/NoMatch';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Landing} />
                <Route path='/home' component={Home} />
                <Route path='/portal' component={PortalNoticiasMain} />
                <Route path='/portalAdmin' component={AdminPortalNoticiasMain} />
                <Route path='/createNoticia' component={CreateNoticia} />
                <Route path='/colabore' component={Colabore} />
                <Route path='/colaboreformulario' component={ColaboreForm} />
                <Route exact path='/ajude/:id' component={ColaboreAdmin} />
                <Route component={NoMatch} />

            </Switch>
        </BrowserRouter>
    );
}