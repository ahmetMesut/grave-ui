import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import {Application} from "robe-react-commons";
import Router from "react-router/lib/Router";
import Route from "react-router/lib/Route";
import IndexRoute from "react-router/lib/IndexRoute";
import BrowserHistory from "react-router/lib/browserHistory";
import Main from "./common/Main";
import Login from "app/modules/login/Login";

export default class NoAuthorization extends ShallowComponent {
    render(): Object {
        return (
            <Router history={BrowserHistory}>
                <Route path={Application.getProps().get("ROOT.PATH")} component={Main}>
                    <IndexRoute component={Login} />
                    <Route path="Login" component={Login} />
                    <Route path="*" component={Login} />
                </Route>
            </Router>
        );
    }
}
