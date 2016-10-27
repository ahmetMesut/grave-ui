import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import BurialDetailModel from "./BurialDetailModel.json";
import Card from "app/modules/card/Card";
import PanelForm from "app/modules/dataform/PanelForm";
import BaseCrudPage from "app/common/BaseCrudPage";
import Loading from "app/modules/loading/Loading";
import {AjaxRequest} from "robe-react-commons";
import NotificationManager from "react-notifications/lib/NotificationManager";


export default class BurialDetail extends ShallowComponent {

    grave = [
        {
            value: "AGM",
            text: "Asrı Mezarlığı"
        },
        {
            value: "BGM",
            text: "Bağçeşme Mezarlığı"
        },
        {
            value: "KBBM",
            text: "KBB Kent Mezarlığı"
        },
        {
            value: "KM",
            text: "Kuruçeşme Mezarlığı"
        },
        {
            value: "TM",
            text: "Tavşantepe Mezarlığı"
        }
    ];

    constructor(props) {
        super(props);

        this.state = {
            url: "burial/detail",
            idField: "oid",
            fields: BurialDetailModel.fields,
            header: "Defin Geçmişi",
            toolbar: [{
                name: "custom",
                text: "Yeni Defin",
                icon: "fa-plus-square",
                onClick: this.__onClickNewBurial
            }],
            resources: {
                grave: this.grave,
                userOid: []
            },

            formData: {},
            showLoading: false,
        };

    }

    render() {
        return (
            <div>
                <Card borderless header="Arama">
                    <PanelForm
                        ref="panelForm"
                        model={BurialDetailModel.fields}
                        formData={this.state.formData}
                        resources={this.state.resources}
                        cancelButtonText="Temizle"
                        reset={this.reset}
                        showSaveButton={false}
                        onSearch={this.__search}
                    />
                </Card>
                <Loading show={this.state.showLoading}/>
                <BaseCrudPage borderless onClickRow={this.__onClickRow} ref="baseCrud" data={this.state}/>
            </div>
        );
    }


    __search = (state)=> {

        if (state.userOid) {
            let request = new AjaxRequest({
                type: "GET",
                url: "burial/detail/" + state.userOid
            });
            request.call(undefined, undefined, (res)=> {
                if (res.length == 0) {
                    NotificationManager.info("Bu bilgilere sahip birine ait defin bulunamadı.");
                }
            });
        }

        if (!state) {
            this.setState({showLoading: true});
        } else {
            this.setState({showLoading: false});
            this.refs.baseCrud.refreshTable(state);
        }
    };
    reset = ()=> {
        this.setState({formData: {}});
        this.__search({});
    };

    componentDidMount() {
        let readRequestForPersonnel = new AjaxRequest({
            type: "GET",
            url: "personnel"
        });

        readRequestForPersonnel.call(undefined, undefined, (res)=> {
            var state = this.state;
            state.resources.userOid = res;
            var model = BurialDetailModel.fields;
            model.map(function (item) {
                if (item.code == "userOid") {
                    item.items = res;
                }
            });
            BurialDetailModel.fields = model;
            this.setState(state);
            this.forceUpdate();
            this.refs.panelForm.refresh();
        });
    }

    __onClickNewBurial = ()=> {
         window.location.href=("/SelectAndBurial");
    };

    isValid = ()=> {
        let result = {
            status: true,
            message: ""
        };
        return result;
    }

}