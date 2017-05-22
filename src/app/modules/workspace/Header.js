import React from "react";
import {Application} from "robe-react-commons";
import ShallowComponent from "../../../../node_modules/robe-react-commons/lib/components/ShallowComponent";
import Navbar from "../../../../node_modules/react-bootstrap/lib/Navbar";
import Button from "../../../../node_modules/react-bootstrap/lib/Button";
import ButtonToolbar from "../../../../node_modules/react-bootstrap/lib/ButtonToolbar";
import ButtonGroup from "../../../../node_modules/react-bootstrap/lib/ButtonGroup";
import Col from "../../../../node_modules/react-bootstrap/lib/Col";
import FaIcon from "../../../../node_modules/robe-react-ui/lib/faicon/FaIcon";
import Link from "../../../../node_modules/react-router/lib/Link";
import cookie from "react-cookie";

export default class Header extends ShallowComponent {
    constructor(props: Object) {
        super(props);
        this.state = {
            data: []
        };
    }

    render(): Object {
        return (
            <Navbar fluid fixedTop inverse className="container-fluid">
                <Button onClick={this.props.open} className="navbar-toggle pull-left">
                    <Col componentClass="span" className="sr-only">Toggle navigation</Col>
                    <Col componentClass="span" className="icon-bar" />
                    <Col componentClass="span" className="icon-bar" />
                    <Col componentClass="span" className="icon-bar" />
                </Button>
                <Link className="content" to={Application.getProps().get("ROOT.PATH")}>
                    <Navbar.Brand>
                        <Col className="hidden-xs" style={{paddingTop:15}}>Mezarlık Sistemi</Col>
                    </Navbar.Brand>
                </Link>
                <ButtonToolbar className="pull-right buttongroups-header" style={{ marginTop: "7px", marginRight: "-20px" }}>
                    <ButtonGroup>
                        <Button bsStyle="primary" className="btn-header-button btn-header" onClick={this.__onExit}>
                            <FaIcon code="fa-sign-out" size="fa-lg"/>
                            <Col componentClass="span" className="hidden-xs"> Çıkış</Col>
                        </Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </Navbar>
        );
    }
    __onExit() {
        cookie.remove("domain", { path: "/" });
        cookie.remove("username", { path: "/" });
        cookie.remove("password", { path: "/" });
        location.reload();
    }
}
