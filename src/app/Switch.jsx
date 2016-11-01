import React from "react";
import { Application, ShallowComponent, AjaxRequest } from "robe-react-commons";
import cookie from "react-cookie";
import HasAuthorization from "./HasAuthorization";
import NoAuthorization from "./NoAuthorization";
import ajax from "robe-ajax";
import Loading from "app/modules/loading/Loading";


export default class Switch extends ShallowComponent {
    constructor(props: Object) {
        super(props);
        Application.setBaseUrlPath("http://demo.mebitech.com/grave/ui");
        Application.getProps().set("ROOT.PATH", "/");
        let username = cookie.load("username");
        let me = this;
        ajax.ajaxSetup({
            error : function(jqXHR, textStatus, errorThrown) {
                switch (jqXHR.status) {
                    case 401:
                        cookie.remove("username");
                        me.setState({
                            hasAuth : false
                        });
                        break;
                    case 403:
                        alert("Yeki Hatası");
                        break;
                    case 404 :
                        alert("Sayfa bulunamadı ! ");
                        break;
                    case 500:
                        alert("Sistem Hatası");
                        break;

                }
            }
        });

        this.state = {
            hasAuth: (username && username.trim() !== ""),
            menu: undefined
        };
    }

    render(): Object {
        if (this.state.hasAuth) {
            if (!this.state.menu) {
               return ( <Loading show={true}/>);
            }
            return (<HasAuthorization menu={this.state.menu} />);
        }
        return (<NoAuthorization />);
    }


    componentDidMount = () => {
        if (this.state.hasAuth) {
            let _readRequest = new AjaxRequest({
                url: "menus/user",
                type: "GET"
            });

            _readRequest.call(undefined, undefined, (response)=> {
                this.setState({menu: response});
            });
        }
    };
}
