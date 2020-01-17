import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import CreateGroup from './CreateGroup';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'


const routing = (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={App}></Route>
          <Route path="/CreateGroup" component={CreateGroup} />
        </Switch>
        
      </div>
    </Router>
  )
ReactDOM.render(routing, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
