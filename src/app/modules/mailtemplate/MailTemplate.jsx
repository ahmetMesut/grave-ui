import React from "react";
import BaseCrudPage from "app/common/BaseCrudPage";
import MailTemplateModel from "./MailTemplateModel.json";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";


export default class MailTemplate extends ShallowComponent {
    constructor(props) {
        super(props);

        this.state = {
            url: "mailtemplates" ,
            idField: "oid" ,
            fields: MailTemplateModel.fields ,
            description: "Description of MailTemplate" ,
            header: "Mail Template"
        };

    }

    render() {
        return (
            <BaseCrudPage data={this.state}/>
        );
    }
}