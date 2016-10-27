import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import BaseCrudPage from "../../../common/BaseCrudPage"
import PanelForm from "app/modules/dataform/PanelForm";
import Card from "app/modules/card/Card";
import BuyGraveModel from "./BuyGraveModel.json";
import NotificationManager from "react-notifications/lib/NotificationManager";
import {AjaxRequest} from "robe-react-commons";
import Loading from "app/modules/loading/Loading";


export default class BuyGrave extends ShallowComponent {

    isReceiptCancel = [
        {
            text: "Evet",
            value: "YES"
        },
        {
            text: "Hayır",
            value: "NO"
        }
    ];
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
            url: "buyGrave",
            idField: "oid",
            fields: BuyGraveModel.fields,
            header: "Mezar Satış ",
            toolbar: [{name: "delete", text: "Sil"}],
            resources: {
                grave: this.grave,
                isReceiptCancel: this.isReceiptCancel,
                userOid: []
            },
            formData: {},
            showLoading: false
        };
    }

    render() {
        return (
            <div>
                <Card header="Arama" borderless>
                    <PanelForm
                        ref="panelForm"
                        onSave={this.__onSave}
                        model={BuyGraveModel.fields}
                        formData={this.state.formData}
                        reset={this.reset}
                        resources={this.state.resources}
                        cancelButtonText="Temizle"
                        onSearch={this.__search}/>
                </Card>
                <Loading show={this.state.showLoading}/>

                <BaseCrudPage borderless onClickRow={this.__onClickRow} onDeleteClick={this.__onClick} ref="baseCrud"
                              data={this.state}/>
            </div>
        );
    }

    __search = (state)=> {
        if (!state) {
            this.setState({showLoading: true});
        } else {
            this.setState({showLoading: false});
            this.refs.baseCrud.refreshTable(state);
        }

    };
    __onClickRow = (data)=> {
        this.refs.panelForm.setData(data);
        this.setState({formData: data});
        if (this.props.onChange) {
            this.props.onChange(data);
        }
    };
    __onSave = (oldData, newData)=> {
        if (newData.oid) {
            let updateRequest = new AjaxRequest({
                type: "PUT",
                url: "buyGrave/" + newData.oid
            });
            updateRequest.call(newData, undefined, ()=> {
                NotificationManager.success("Başarı ile güncellendi");
                this.refs.panelForm.reset();
                this.refs.baseCrud.readData();
            });
        }
        else {
            delete newData.lastUpdated;
            delete newData.oid;
            let createRequest = new AjaxRequest({
                type: "POST",
                url: "buyGrave"
            });
            createRequest.call(newData, undefined, ()=> {
                NotificationManager.success("Başarı ile kaydedildi");
                this.refs.panelForm.reset();
                this.refs.baseCrud.readData();
            });
        }

    };

    reset = ()=> {
        this.setState({formData: {}});
        this.__search({});
    };


    __onClick = ()=> {
        this.reset();
        this.refs.panelForm.reset();
    };

    componentDidMount() {
        let readRequestForPersonnel = new AjaxRequest({
            type: "GET",
            url: "personnel"
        });

        readRequestForPersonnel.call(undefined, undefined, (res)=> {
            var state = this.state;
            state.resources.userOid = res;
            var model = BuyGraveModel.fields;
            model.map(function (item) {
                if (item.code == "userOid") {
                    item.items = res;
                }
            });
            BuyGraveModel.fields = model;
            this.setState(state);
            this.forceUpdate();
            this.refs.panelForm.refresh();
        });
    }


}