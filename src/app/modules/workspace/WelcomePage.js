import React from "react";
import ShallowComponent from "../../../../node_modules/robe-react-commons/lib/components/ShallowComponent";
import Grid from "../../../../node_modules/react-bootstrap/lib/Grid";
import Row from "../../../../node_modules/react-bootstrap/lib/Row";
import Col from "../../../../node_modules/react-bootstrap/lib/Col";

export default class WelcomePage extends ShallowComponent {
    render():Object {
        return (
            <Grid fluid>
                <Row>
                    <Col lg={12}>
                        <Col componentClass="h1">Mezarlık Bilgi Sistemi Yazılımına Hoşgeldiniz.</Col>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
