import React from "react";
import BaseCrudPage from "app/common/BaseCrudPage";
import MenuModel from "./MenuModel.json";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";


export default class Menu extends ShallowComponent {
    constructor(props) {
        super(props);
        this.state = {
            url: "menuList" ,
            idField: "oid" ,
            fields: MenuModel.fields ,
            description: "Description of menu management" ,
            header: "Menu Management"
        }
    }

    render() {
        return(<BaseCrudPage data={this.state}/>);

    }
}
