import React from "react";
import {Application} from "robe-react-commons";
import Card from "app/modules/card/Card";
import jajax from "robe-ajax";
import Col from "../../../../node_modules/react-bootstrap/lib/Col";
import Row from "../../../../node_modules/react-bootstrap/lib/Row";
import ButtonToolbar from "../../../../node_modules/react-bootstrap/lib/ButtonToolbar";
import Button from "../../../../node_modules/react-bootstrap/lib/Button";
import SelectInput from "../../../../node_modules/robe-react-ui/lib/inputs/SelectInput";
import NotificationManager from "../../../../node_modules/react-notifications/lib/NotificationManager";
import Arrays from "../../../../node_modules/robe-react-commons/lib/utils/Arrays";
import ShallowComponent from "../../../../node_modules/robe-react-commons/lib/components/ShallowComponent";
import AjaxRequest from "../../../../node_modules/robe-react-commons/lib/connections/AjaxRequest";


class Permission extends ShallowComponent {

    constructor(props: Object) {
        super(props);

        this.state = {
            roleStoreData: [],
            groupsData: [],
            menuData: [],
            servicesData: [],
            role: null
        };
    }

    render(): Object {
        return (
            <Card header="İzin Yönetimi"
                  description="İlk önce değişiklik yapacağınız rolü sonra işlem yapmak istediğiniz izin grubunu seçiniz. İzin grubu ile ilişkili menüler renk farklılığı ile belirtilecektir.">
                <Row>
                    <br />
                </Row>
                <Row>
                    <Col md={12}>
                        <SelectInput
                            label="Rol"
                            items={this.state.roleStoreData}
                            value={this.state.role}
                            valueField={"id"}
                            textField={"name"}
                            onChange={this.__onRoleChange}
                            required={[true, "Required"]}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={8}>
                        <Row>
                            <Col md={12}>
                                <label className="control-label">
                                    <span>Sistemde Mevcut Olan İzin Grupları</span>
                                </label>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <label className="control-label">
                                    <span>Seçili gruba ait servisler</span>
                                </label>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4}>
                        <label className="control-label">
                            <span>İzinli Menüler</span>
                        </label>
                    </Col>
                </Row>

                <Row>
                    <Col xs={12}>
                        <ButtonToolbar className="pull-right">
                            <Button onClick={this.__onClearClick} disabled={this.state.role === null || this.state.role.length === 0}>İptal</Button>
                            <Button bsStyle="primary" onClick={this.__onSaveClick} disabled={this.state.role === null || this.state.role.length === 0}>Kaydet</Button>
                        </ButtonToolbar>
                    </Col>
                </Row>

            </Card>
        );
    }

    __onRoleChange(e: Object) {
        let role = e.target.parsedValue ? [e.target.parsedValue] : [];

        this.setState({
            role: role
        });

        // this.__setComponentCheckStates([], [], []);

        if (e.target.parsedValue) {
            this.__readGroups(role);
            this.__readRolePermissions(role);
        }
    }

    __readRolePermissions() {

    }

    __readMenu() {

    }

    __readGroups() {

    }

    __onGroupsSelection(value: string) {
        if (value && value.length > 0) {
            this.__readGroupMenuAndService(value);
        } else {
            this.setState({
                servicesData: []
            });
        }
    }

    __readGroupMenuAndService() {

    }

    __onGroupsCheck(checkedList: Array, item: Object, checked: boolean) {
        let servicesChecked: Array<string> = this.refs.servicesCheckList.state.checkedItems;
        let selectedMenu = this.refs.menuCheckTree.state.selected;
        let checkedMenu = this.refs.menuCheckTree.state.checkedItems;
        if (checked) {
            for (let i = 0; i < this.state.servicesData.length; i++) {
                servicesChecked.push(this.state.servicesData[i].oid);
            }
            for (let i = 0; i < selectedMenu.length; i++) {
                checkedMenu.push(selectedMenu[i]);
            }
        } else {
            for (let i = 0; i < this.state.servicesData.length; i++) {
                Arrays.remove(servicesChecked, this.state.servicesData[i].oid);
            }
            for (let i = 0; i < selectedMenu.length; i++) {
                Arrays.remove(checkedMenu, selectedMenu[i]);
            }
        }

        this.__setComponentCheckStates(undefined, checkedMenu, servicesChecked);
    }

    __onMenuCheck = (value, status) => {
        let menuChecks = this.refs.menuCheckTree.state.checkedItems;

        var index = menuChecks.indexOf(value);    // <-- Not supported in <IE9

        if (status) {
            if (index == -1) {
                menuChecks.push(value);
            }
        } else {
            if (index !== -1) {
                menuChecks.splice(index, 1);
            }
        }

        this.__setComponentCheckStates(undefined, menuChecks, undefined);
    };


    __onServicesCheck = (checkedItems, value, checked) => {
        if (this.state.role) {
            if (checked) {
                checkedItems.push(value);
            } else {
                Arrays.remove(checkedItems, value);
            }
            this.__setComponentCheckStates(undefined, undefined, checkedItems);
        }
    };


    __setComponentCheckStates = (groupChecks, menuChecks, serviceChecks) => {
        if (groupChecks) {
            this.refs.groupsCheckList.setState({
                checkedItems: groupChecks
            });
            this.refs.groupsCheckList.forceUpdate();
        }
        if (menuChecks) {
            this.refs.menuCheckTree.setState({
                checkedItems: menuChecks
            });
            this.refs.menuCheckTree.forceUpdate();
        }
        if (serviceChecks) {
            this.refs.servicesCheckList.setState({
                checkedItems: serviceChecks
            });
            this.refs.servicesCheckList.forceUpdate();
        }
    };

    __onClearClick = () => {
        this.__setComponentCheckStates([], [], []);

        if (this.state.role) {
            this.__readGroups(this.state.role);
            this.__readRolePermissions(this.state.role);
        }

    };

    __onSaveClick = () => {

        let data = {};

        data.menus = this.refs.menuCheckTree.state.checkedItems;
        data.services = this.refs.servicesCheckList.state.checkedItems;


        let props = {
            "complete": function () {
                NotificationManager.info("Başarılı bir şekilde güncellendi.");
            },
            "type": "POST",
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "url": Application.getBaseUrlPath() + "permissions/" + this.state.role,
            "data": JSON.stringify(data),
            "xhrFields": {
                "withCredentials": true
            },
            crossDomain: true
        };

        jajax.ajax(props);
    };

    componentDidMount = () => {
        // this.__readGroups();
        // this.__readMenu();

        let _readRequest = new AjaxRequest({
            url: "roles",
            type: "GET"
        });

        _readRequest.call(undefined, undefined, (response) => {
            this.setState({
                roleStoreData: response
            })
        });
    };
    componentWillUnmount = () => {
    };

}
module.exports = Permission;