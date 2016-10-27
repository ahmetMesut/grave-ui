import React from "react";
import BaseCrudPage from "app/common/BaseCrudPage";
import BurialRecordModel from "./model/BurialRecordModel.json";
import BurialRecordModelForGrid from "./model/BurialRecordModelForGrid.json";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import Card from "app/modules/card/Card";
import PanelForm from "app/modules/dataform/PanelForm";
import { AjaxRequest } from "robe-react-commons";
import NotificationManager from "react-notifications/lib/NotificationManager";
import Loading from "app/modules/loading/Loading";



export default class BurialRecord extends ShallowComponent {

    operationType = [
        {
            value: "NON_MUNICIPAL" ,
            text: "Belediye Dışı"
        } ,
        {
            value: "IN_MUNICIPAL" ,
            text: "Bilgi İçin"
        } ,
        {
            value: "BURIED" ,
            text: "Defnedildi"
        } ,
        {
            value: "WILL_BURIAL" ,
            text: "Defnedilecek"
        }
    ];
    gender = [
        {
            value: "MALE" ,
            text: "Bay"
        } ,
        {
            value: "FEMALE" ,
            text: "Bayan"
        }
    ];
    burialTime = [
        {
            value: "NONE" ,
            text: "Belirtilmemiş"
        } ,
        {
            value: "MORNING" ,
            text: "Sabah"
        } ,
        {
            value: "NOON" ,
            text: "Öğle"
        } ,
        {
            value: "AFTERNOON" ,
            text: "İkindi"
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
            url: "burialRecord" ,
            idField: "oid" ,
            fields: BurialRecordModelForGrid.fields ,
            header: "Defin Kayıt Listesi" ,
            toolbar: [{name: "delete" , text: "Sil"}] ,
            resources: {
                gender: this.gender ,
                causeOfDeath: [] ,
                operationType: this.operationType ,
                provinceOfDeath: [] ,
                districtOfDeath: [] ,
                mosque: [] ,
                burialTime: this.burialTime ,
                grave: this.grave ,
                birthPlace: []
            } ,
            showLoading : false,
            formData: {}
        };

    }

    render() {
        return (
            <div>
                <Card header="Defin Kayıt / Arama">
                    <PanelForm
                        ref="panelForm"
                        onSave={this.__onSave}
                        model={BurialRecordModel.fields}
                        formData={this.state.formData}
                        resources={this.state.resources}
                        cancelButtonText="Temizle"
                        reset={this.reset}
                        onSearch={this.__search}
                    />
                </Card>
                <Loading show={this.state.showLoading}/>

                <BaseCrudPage onClickRow={this.__onClickRow} ref="baseCrud" data={this.state}/>
            </div>
        );
    }

    __onSave = (oldData , newData , complete)=> {
        if (newData.oid) {
            let updateRequest = new AjaxRequest({
                type: "PUT" ,
                url: "burialRecord/" + newData.oid
            });
            updateRequest.call(newData , undefined , ()=> {
                NotificationManager.success("Başarı ile güncellendi");
                this.refs.panelForm.reset();
                this.refs.baseCrud.readData();
            },(res)=>{
                NotificationManager.error();
            });
        }
        else {
            delete newData.lastUpdated;
            delete newData.oid;
            let createRequest = new AjaxRequest({
                type: "POST" ,
                url: "burialRecord"
            });
            createRequest.call(newData , undefined , ()=> {
                NotificationManager.success("Başarı ile kaydedildi");
                this.refs.panelForm.reset();
                this.refs.baseCrud.readData();
            });
        }

    };

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

    };

    reset = ()=> {
        this.setState({formData: {}});
        this.__search({});
    };

    componentDidMount() {
        let readRequestForProvince = new AjaxRequest({
            type: "GET" ,
            url: "province"
        });

        readRequestForProvince.call(undefined , undefined , (res)=> {
            var state = this.state;
            state.resources.birthPlace = res;
            state.resources.provinceOfDeath = res;
            var model = BurialRecordModel.fields;
            model.map(function (item) {
                if (item.code == "birthPlace") {
                    item.items = res;
                }
                if (item.code == "provinceOfDeath") {
                    item.items = res;
                }
            });
            BurialRecordModel.fields = model;
            this.setState(state);
            this.forceUpdate();
            this.refs.panelForm.refresh();
        });

        let readRequestForDistrict = new AjaxRequest({
            type: "GET" ,
            url: "district"
        });

        readRequestForDistrict.call(undefined , undefined , (res)=> {
            var state = this.state;
            state.resources.districtOfDeath = res;
            var model = BurialRecordModel.fields;
            model.map(function (item) {
                if (item.code == "districtOfDeath") {
                    item.items = res;
                }

            });
            BurialRecordModel.fields = model;
            this.setState(state);
            this.forceUpdate();
            this.refs.panelForm.refresh();
        });

        let readRequestForMosque = new AjaxRequest({
            type: "GET" ,
            url: "mosque"
        });

        readRequestForMosque.call(undefined , undefined , (res)=> {
            var state = this.state;
            state.resources.mosque = res;
            var model = BurialRecordModel.fields;
            model.map(function (item) {
                if (item.code == "mosque") {
                    item.items = res;
                }

            });
            BurialRecordModel.fields = model;
            this.setState(state);
            this.forceUpdate();
            this.refs.panelForm.refresh();
        });

        let readRequestDeadOfCause = new AjaxRequest({
            type: "GET" ,
            url: "deadOfCause"
        });

        readRequestDeadOfCause.call(undefined , undefined , (res)=> {
            var state = this.state;
            state.resources.causeOfDeath = res;
            var model = BurialRecordModel.fields;
            model.map(function (item) {
                if (item.code == "causeOfDeath") {
                    item.items = res;
                }

            });
            BurialRecordModel.fields = model;
            this.setState(state);
            this.forceUpdate();
            this.refs.panelForm.refresh();
        });
    }

}