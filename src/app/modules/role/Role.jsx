import React from "react";
import BaseCrudPage from "app/common/BaseCrudPage";
import RoleModel from "./RoleModel.json";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";


export default class Role extends ShallowComponent {
    constructor(props) {
        super(props);
        this.state = {
            url: "roles" ,
            idField: "oid" ,
            fields: RoleModel.fields ,
            description: "Description of Role" ,
            header: "Role Management"
        };
    }

    render() {
        return (
            <BaseCrudPage data={this.state}/>
        );
    }
}
