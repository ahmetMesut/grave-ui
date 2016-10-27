import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import BurialModel from "./model/BurialModel.json";
import PersonnelModel from "../definition/model/PersonnelModel.json";
import Card from "app/modules/card/Card";
import PanelForm from "app/modules/dataform/PanelForm";
import BaseCrudPage from "app/common/BaseCrudPage";
import Loading from "app/modules/loading/Loading";
import {AjaxRequest} from "robe-react-commons";
import NotificationManager from "react-notifications/lib/NotificationManager";



export default class BurialDetail extends ShallowComponent {

    userOid = [];
    graveType = [
        {
            value: "NEXT_TO_PAID",
            text: "Ücretli Yanı"
        },
        {
            value: "NEXT_TO_FREE",
            text: "Ücretsiz Yanı"
        },
        {
            value: "FREE",
            text: "Ücretsiz"
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
            url: "personnel",
            idField: "oid",
            fields: PersonnelModel.fields,
            header: "Kişiler",
            toolbar: [],
            resources: {
                userOid: [],
                graveType: this.graveType,
                grave: this.grave
            },

            formData: {},
            responseData:{},
            showLoading: false
        };

    }

    render() {
        return (
            <div>
                <Card borderless header="Arama">
                    <PanelForm
                        ref="panelForm"
                        model={PersonnelModel.fields}
                        formData={this.state.formData}
                        cancelButtonText="Temizle"
                        reset={this.reset}
                        showSaveButton={false}
                        onSearch={this.__search}
                        resources={this.state.resources}
                    />
                </Card>
                <Loading show={this.state.showLoading}/>
                <BaseCrudPage borderless onClickRow={this.__onClickRow} ref="baseCrud" data={this.state}/>
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

    reset = ()=> {
        this.setState({formData: {}});
        this.__search({});
    };
    __onClickRow = (data)=> {
        this.refs.panelForm.setData(data);
        this.setState({formData: data});
        if (this.props.onChange) {
            this.props.onChange(data);
        }

        let itHasGrave = new AjaxRequest({
            type: "GET",
            url: "buyGrave/" + data.oid
        });

        itHasGrave.call(undefined, undefined, (res)=> {
            this.setState({responseData: res});
        });


    };

    componentDidMount() {
        let readRequestForPersonnel = new AjaxRequest({
            type: "GET",
            url: "personnel"
        });

        readRequestForPersonnel.call(undefined, undefined, (res)=> {
            NotificationManager.info("Defin işlemi için önce mezar sahibi seçmeniz gerekir.");
            var state = this.state;
            state.resources.userOid = res;
            var model = BurialModel.fields;
            model.map(function (item) {
                if (item.code == "userOid") {
                    item.items = res;
                }
            });
            BurialModel.fields = model;
            this.setState(state);
            this.forceUpdate();
            this.refs.panelForm.refresh();
        });
    }

    __isEmpty = (obj)=> {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return JSON.stringify(obj) === JSON.stringify({});
    };

    isValid = ()=> {

        let result = {
            status: true,
            message: ""
        };
        if (this.state.responseData.freeGraveCount + this.state.responseData.paidGraveCount + this.state.responseData.nextFreeGraveCount == 0) {
            result.status = false;
            result.message="Bu kişiye ait mezar bulunamamıştır.Lütfen önce mezar yeri satın alınız"
        }

        if (this.__isEmpty(this.state.formData)) {
            result.status = false;
            result.message = "Kişi Seçmeden İlerleyemezsiniz"
        }


        return result;
    };


}