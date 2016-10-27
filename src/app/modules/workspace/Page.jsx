import React from "react";
import ShallowComponent from "../../../../node_modules/robe-react-commons/lib/components/ShallowComponent";
import Col from "../../../../node_modules/react-bootstrap/lib/Col";
import Panel from "../../../../node_modules/react-bootstrap/lib/Panel";
import Alert from "../../../../node_modules/react-bootstrap/lib/Alert";
import FaIcon from "../../../../node_modules/robe-react-ui/lib/faicon/FaIcon";

export default class Page extends ShallowComponent {

    static propTypes = {
        header: React.PropTypes.string,
        description: React.PropTypes.string,
        bsStyle: React.PropTypes.string,
        icon: React.PropTypes.string
    };

    static defaultProps = {
        bsStyle: "",
        icon: "fa-info-circle"
    };

    render(): Object {
        return (
            <Col className="page-content">
                <Panel style={{ paddingBottom: 40 }}>
                    {this.__createHeader()}
                    {this.__renderPageInfo()}
                    {this.props.children}
                </Panel>
            </Col>
        );
    }

    __renderPageInfo(): Object {
        if(this.props.description) {
            let icon = <FaIcon code={this.props.icon} size={"fa-sm"}/>;
            if (this.props.bsStyle === "") {
                return (<Col>{icon}{this.props.description}</Col>);
            }
            return (<Alert bsStyle={this.props.bsStyle}>
                <Col>{icon}{this.props.description}</Col>
            </Alert>);
        }
    }
    __createHeader():Object {
        if (this.props.header) {
            return (<Col style={{ marginTop: 0 }} className="page-header">
                <h2>{this.props.header}</h2>
            </Col>);
        }
    }
}
