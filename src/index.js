import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './Login';
import Register from './Register';
import { HashRouter,Route } from 'react-router-dom';
import todoList from './todolist';
import Inbox from './inbox';
import setting from './setting';
import task from './task7';

ReactDOM.render((
    <HashRouter>
        <div>
            <Route exact path="/"component={App} />
            <Route path="/Login" component={Login} />
            <Route path="/Register" component={Register} />
            <Route path="/todolist" component={todoList} />
            <Route path="/inbox" component={Inbox} />
            <Route path="/setting" component={setting} />
            <Route path="/task" component={task} />
        </div>
    </HashRouter>
), document.getElementById( 'root' ));
