import React from "react";
import BaseCrudPage from "app/common/BaseCrudPage";
import UserModel from "./UserModel.json";
import {AjaxRequest} from "robe-react-commons";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";


export default class User extends ShallowComponent {

    constructor(props) {
        super(props);

        this.state = {
            url: "users",
            idField: "oid",
            fields: UserModel.fields,
            description: "Kullanıcıların listelenmesini ve Kullanıcı ile ilgili işlemlerin yönetilmesini sağlar.",
            header: "Kullanıcı Yönetimi",
            propsOfFields:[],
            resources: {
                roleOid: []
            }
        };

        let {tooltip, inputGroupLeft, inputGroupRight, validations, ...newProps} = this.state;
    }

    render() {
        return (
            <BaseCrudPage ref="baseCrud" data={this.state}></BaseCrudPage>
        );
    }

    componentDidMount() {
        let readRequest = new AjaxRequest({
            url: "roles",
            type: "GET"
        });
        readRequest.call(undefined, undefined, (response: Object) => {
            var model = UserModel.fields;
            model.map(function (item) {
                if (item.code == "roleOid") {
                    item.items = response;
                }
            });
            var state = this.state;
            state.resources.roleOid = response;
            state.fields = model;
            state.propsOfFields =response;

            this.setState(state);
            this.forceUpdate();
        });
    }
}
