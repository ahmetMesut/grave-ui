import React from "react";
import BaseCrudPage from "app/common/BaseCrudPage";
import SystemParameterModel from "./SystemParameterModel.json";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";


export default class SystemParameter extends ShallowComponent {
    constructor(props) {
        super(props);
        this.state = {
            url: "systemparameters" ,
            idField: "oid" ,
            fields: SystemParameterModel.fields ,
            description: "Description of SystemParameter" ,
            header: "System Parameter"
        }

    }
    render() {
        return (
            <BaseCrudPage data={this.state}></BaseCrudPage>
        );
    }
}

