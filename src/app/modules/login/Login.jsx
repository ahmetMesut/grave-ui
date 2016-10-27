import React from "react";
import Form from "../../../../node_modules/react-bootstrap/lib/FormGroup";
import {
    FormGroup,
    Col,
    Row,
    Image,
    Button
} from "react-bootstrap";
import {
    TextInput,
    PasswordInput
} from "robe-react-ui/lib/inputs";
import SHA256 from "crypto-js/sha256";
import {
    Application,
    ShallowComponent,
    AjaxRequest
} from "robe-react-commons";
import cookie from "react-cookie";
import NotificationManager from "../../../../node_modules/react-notifications/lib/NotificationManager";

export default class Login extends ShallowComponent {


    loginAction;

    constructor(props:Object) {
        super(props);
        this.loginAction = new AjaxRequest({
            url: "authentication/login" ,
            type: "POST"
        });
        this.state = {
            username: "" ,
            password: "" ,
            rememberme: false
        };
    }

    render():Object {

        return (
            <Col  className="center-block" style={{maxWidth:300,marginTop:20,padding:10}}>
                <FormGroup>
                    <Row>
                        <Col xs={8} xsOffset={2}>
                            <Image src="./logo.png" responsive/>
                        </Col>
                    </Row>
                    <Row>
                        <
                            Col className="input-group login-input">
                            <Col componentClass="span" className="input-group-addon">
                                <Col componentClass="i" className="glyphicon glyphicon-user"/>
                            </Col>
                            <TextInput ref="username"
                                       type="email"
                                       placeholder="Username"
                                       value={this.state.username}
                                       onChange={this.__handleChange.bind(undefined,"username")}
                                       required autofocus/>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="input-group login-input">
                            <Col componentClass="span" className="input-group-addon">
                                <Col componentClass="i" className="glyphicon glyphicon-lock"/>
                            </Col>
                            <PasswordInput ref="password"
                                           className="form-control"
                                           value={this.state.password}
                                           onChange={this.__handleChange.bind(undefined,"password")}
                                           placeholder="Password"
                                           required/>
                        </Col>
                    </Row>
                    <Row>
                        <br/>
                        <Button
                            className="btn btn-primary btn-login btn-block"
                            type="submit"
                            ref="submitBtn"
                            onClick={this.handleSubmit}>Giriş
                        </Button>
                    </Row>
                </FormGroup>
            </Col>
        );

    }

    __handleChange(code:any , e:Object):boolean {
        let state = {};
        let value = e.target.parsedValue !== undefined ? e.target.parsedValue : e.target.value;
        state[code] = value;
        this.setState(state);
        return true;
    }

    handleSubmit() {

        cookie.remove("auth-token" , {
            "domain": window.location.hostname ,
            "path": "/"
        });
        cookie.remove("auth-token" , {
            "domain": "." + window.location.hostname ,
            "path": "/"
        });

        this.loginAction.call(
            {
                username: this.state.username ,
                password: SHA256(this.state.password).toString()
            } ,
            undefined ,
            (response , xhr) => {
                var domain = response.domain;
                var params = domain.split(';');

                var path = "";

                for ( var i in params ) {
                    var param = params[i];
                    if (param.indexOf("path") == 0) {
                        path = param.split("=")[1];
                    }
                    if (param.indexOf("domain") == 0) {
                        domain = param.split("=")[1];
                    }
                }
                cookie.save('domain' , domain , {path: path});
                cookie.save('username' , this.state.username.trim() , {path: path});
                window.location.reload();
            } ,
            (xhr) => {
                console.error("Login Failed... Detail : ");
                console.error(xhr);
            }
        );
    }
}
