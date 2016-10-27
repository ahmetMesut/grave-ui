import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import BaseCrudPage from "../../../common/BaseCrudPage"
import BurialModel from "./model/BurialModel.json";
import Button from "react-bootstrap/lib/Button";
import Modal from "react-bootstrap/lib/Modal";
import BurialRecordModelForPopup from "./model/BurialRecordModelForPopup.json";
import {AjaxRequest} from "robe-react-commons";
import NotificationManager from "react-notifications/lib/NotificationManager";
import SelectInput from "robe-react-ui/lib/inputs/SelectInput";
import moment from "moment";

export default class Burial extends ShallowComponent {

    operationType = [
        {
            value: "NON_MUNICIPAL",
            text: "Belediye Dışı"
        },
        {
            value: "IN_MUNICIPAL",
            text: "Bilgi İçin"
        },
        {
            value: "BURIED",
            text: "Defnedildi"
        },
        {
            value: "WILL_BURIAL",
            text: "Defnedilecek"
        }
    ];
    gender = [
        {
            value: "MALE",
            text: "Bay"
        },
        {
            value: "FEMALE",
            text: "Bayan"
        }
    ];
    burialTime = [
        {
            value: "NONE",
            text: "Belirtilmemiş"
        },
        {
            value: "MORNING",
            text: "Sabah"
        },
        {
            value: "NOON",
            text: "Öğle"
        },
        {
            value: "AFTERNOON",
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
    graveState = [
        {
            value: "NULL",
            text: "Boş"
        },
        {
            value: "FULL",
            text: "Dolu"
        },
        {
            value: "OVER_BURIAL",
            text: "Üzerine Defnedildi"
        },
        {
            value: "CANCELLED",
            text: "İptal Edildi"
        }
    ];
    userOid = [];


    constructor(props) {
        super(props);
        this.state = {
            url: "burial?_filter=userOid=" + this.props.stepData.selectPerson.oid,
            idField: "oid",
            fields: BurialModel.fields,
            header: "Defin ",
            toolbar: [
                {
                    name: "customBurial",
                    text: "Defin",
                    icon: "fa-plus-square",
                    onClick: this.__onClickCustomBurial
                },
                {
                    name: "customTransfer",
                    text: "Yer Devir",
                    icon: "fa-plus-square",
                    onClick: this.__onClickCustomTransfer
                },
                {
                    name: "customGoToBuyGrave",
                    text: "Mezar Satışa Git",
                    icon: "fa-plus-square",
                    onClick: this.__onClickcustomGoToBuyGrave
                }
            ],
            formData: {},
            burialDetail: {
                url: "burialRecord",
                idField: "oid",
                fields: BurialRecordModelForPopup.fields,
                toolbar: [],
                resources: {
                    gender: this.gender,
                    causeOfDeath: [],
                    operationType: this.operationType,
                    provinceOfDeath: [],
                    districtOfDeath: [],
                    mosque: [],
                    burialTime: this.burialTime,
                    grave: this.grave,
                    graveType: this.graveType,
                    birthPlace: []
                }
            },
            gridOid: null,
            popupOid: null,
            showBurial: false,
            showTransfer: false,
            resources: {
                userOid: [],
                grave: this.grave,
                graveType: this.graveType,
                graveState: this.graveState

            },
        };
    }

    render() {
        return (

            <div>
                <BaseCrudPage borderless onClickRow={this.__onClickRow} ref="baseCrud" data={this.state}/>
                <Modal
                    show={this.state.showBurial}
                    onHide={this.__close}
                    container={this}
                    aria-labelledby="contained-modal-title">
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title">Defin Islemi</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <BaseCrudPage borderless onClickRow={this.__onClickRowForPopup}
                                      data={this.state.burialDetail}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            style={{margin:"0px 4px"}}
                            bsStyle="warning"
                            onClick={this.__close}> İptal

                        </Button>
                        <Button style={{margin:"0px 4px"}}
                                bsStyle="success"
                                onClick={this.__submit}> Kaydet
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal
                    show={this.state.showTransfer}
                    onHide={this.__close}
                    container={this}
                    aria-labelledby="contained-modal-title">
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title">Yer Devir Islemi</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <SelectInput
                            label="Kişi Seçimi"
                            items={this.state.resources.userOid}
                            textField="name"
                            valueField="oid"
                            placeHolder="<Seçiniz>"
                            onChange={this.__handleChange}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            style={{margin:"0px 4px"}}
                            bsStyle="warning"
                            onClick={this.__close}> İptal

                        </Button>
                        <Button style={{margin:"0px 4px"}}
                                bsStyle="success"
                                onClick={this.__submitForTransfer}> Devret
                        </Button>
                    </Modal.Footer>
                </Modal>


            </div>);
    }

    __onClickRow = (data)=> {
        if (data.lastBurialOid) {
            let requestForBurialDate = new AjaxRequest({
                type: "GET",
                url: "burialRecord/" + data.lastBurialOid
            });
            requestForBurialDate.call(undefined, undefined, (res)=> {
                if (res.burialDate) {
                    NotificationManager.info("Bu mezara son defin  " + moment(res.burialDate).format("DD.MM.YYYY") + "  tarihinde yapıldı.Üzerine defin gerçekleştirilecek.");
                } else {
                    NotificationManager.info("Dolu mezar seçtiniz üzerine defin gerçekleştirilecek.");
                }
            });

        }
        if (data.lastBurialOidName) {
            this.state.toolbar[0].text = "Üzerine Defin"
        } else {
            this.state.toolbar[0].text = "Defin"
        }
        this.setState({formData: data, gridOid: data.oid});

    };
    __onClickRowForPopup = (data)=> {
        this.setState({popupOid: data.oid});
    };


    __close = () => {
        this.setState({showBurial: false, showTransfer: false});
    };


    __onClickCustomBurial = ()=> {
        this.setState({showBurial: true});
    };

    __onClickCustomTransfer = ()=> {
        if (this.state.formData.lastBurialOid != null) {
            NotificationManager.error("Dolu mezar devredilemez.")
        } else {
            this.setState({showTransfer: true});
        }

    };
    __onClickcustomGoToBuyGrave = ()=> {
        window.location.href=("/BuyGrave");
    };

    __handleChange = (e)=> {
        var value = e.target.value;
        this.setState({selectedValue: value});
    };
    __submitForTransfer = (e)=> {
        e.preventDefault();
        var postRequestForTransfer = new AjaxRequest({
            type: "PUT",
            url: "burial/transfer/" + this.state.gridOid + "/" + this.state.selectedValue
        });
        postRequestForTransfer.call(undefined, undefined, ()=> {
            NotificationManager.success("Başarı ile devredildi");
            this.refs.baseCrud.readData();
            this.setState({showTransfer: false});
        });
    };
    __submit = (e)=> {
        e.preventDefault();
        var postRequestForBurial = new AjaxRequest({
            type: "PUT",
            url: "burial/" + this.state.gridOid + "/" + this.state.popupOid
        });
        postRequestForBurial.call(undefined, undefined, ()=> {
            NotificationManager.success("Başarı ile defin yapıldı");
            this.refs.baseCrud.readData();
            this.setState({showBurial: false});

        }, (res)=> {
            if(res.statusText == "Conflict"){
                NotificationManager.error("Seçtiğiniz kişi daha önce defnedildi.");

            }
        });
    };

    componentDidMount() {
        let readRequestForPersonnel = new AjaxRequest({
            type: "GET",
            url: "personnel"
        });

        readRequestForPersonnel.call(undefined, undefined, (res)=> {
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
        });
    }

    isValid = ()=> {
        let result = {
            status: true,
            message: ""
        };
        return result;
    }

}