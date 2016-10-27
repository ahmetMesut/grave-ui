import React from "react";
import BaseCrudPage from "app/common/BaseCrudPage";
import DeadOfCauseModel from "./model/DeadOfCauseModel.json";
import GravePriceModel from "./model/GravePriceModel.json";
import MosqueModel from "./model/MosqueModel.json";
import PersonnelModel from "./model/PersonnelModel.json";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";


export default class Definition extends ShallowComponent {

    priceType = [
        {
            value: "NEXT_TO_PAID" ,
            text: "Ücretli Yanı"
        } ,
        {
            value: "NEXT_TO_FREE" ,
            text: "Ücretsiz Yanı"
        } ,
        {
            value: "FREE" ,
            text: "Ücretsiz"
        }
    ];

    constructor(props) {
        super(props);

        this.state = {

            deadOfCauseData: {
                url: "deadOfCause" ,
                idField: "oid" ,
                fields: DeadOfCauseModel.fields ,
                toolbar: [{name: "create" , text: "Yeni"} , {name: "edit" , text: "Düzenle"} , {name: "delete" , text: "Sil"}],
                searchable:true
            } ,
            mosqueData: {
                url: "mosque" ,
                idField: "oid" ,
                fields: MosqueModel.fields ,
                toolbar: [{name: "create" , text: "Yeni"} , {name: "edit" , text: "Düzenle"} , {name: "delete" , text: "Sil"}],
                searchable:true
            } ,
            graveData: {
                url: "gravePrice" ,
                idField: "oid" ,
                fields: GravePriceModel.fields ,
                toolbar: [{name: "create" , text: "Yeni"} , {name: "edit" , text: "Düzenle"} , {name: "delete" , text: "Sil"}] ,
                resources: {priceType: this.priceType},
                searchable:true
            } ,
            personnelData: {
                url: "personnel" ,
                idField: "oid" ,
                fields: PersonnelModel.fields ,
                toolbar: [{name: "create" , text: "Yeni"} , {name: "edit" , text: "Düzenle"} , {name: "delete" , text: "Sil"}],
                searchable:true
            } ,
            tabSelectedIndex: 0
        };

    }

    render() {
        return (
            <Tabs onSelect={this.__handleSelectTab}
                  selectedIndex={this.state.tabSelectedIndex}>
                <TabList style={{margin:0}}>
                    <Tab>
                        <b style={{color:"rgb(51, 122, 183)"}}>Camiler</b>
                    </Tab>
                    <Tab>
                        <b style={{color:"rgb(51, 122, 183)"}}>Ölüm Nedenleri</b>
                    </Tab>
                    <Tab>
                        <b style={{color:"rgb(51, 122, 183)"}}>Mezar Ücretleri</b>
                    </Tab>
                    <Tab>
                        <b style={{color:"rgb(51, 122, 183)"}}>Kişi Ekleme</b>
                    </Tab>
                </TabList>

                <TabPanel>
                    <BaseCrudPage data={this.state.mosqueData}/>
                </TabPanel>
                <TabPanel>
                    <BaseCrudPage data={this.state.deadOfCauseData}/>
                </TabPanel>
                <TabPanel>
                    <BaseCrudPage data={this.state.graveData}/>
                </TabPanel>
                <TabPanel>
                    <BaseCrudPage data={this.state.personnelData}/>
                </TabPanel>
            </Tabs>
        );

    }

    __handleSelectTab(index , last) {
        this.setState({tabSelectedIndex: index});
    };

}