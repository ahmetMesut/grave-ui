import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import Wizard from "app/modules/wizard/Wizard";
import SelectPerson from "app/modules/site/burial/SelectPerson";
import Burial from "app/modules/site/burial/Burial";


export default class BurialAndDetail extends ShallowComponent {

    constructor(props) {
        super(props);

        this.state = {
            stepData: {
                selectPerson:{},
                burial: {}
            }
        };
    }

    render() {
        return (
            <Wizard ref="wizard" completeButton={false} steps={[
        {
            title: "Mezar Sahibi Seçimi",
            component:<SelectPerson ref="step" stepData={this.state.stepData} onChange={this.__onChange.bind(undefined,"selectPerson")}/>

        },
         {
            title: "Mezar Seçimi",
            component:<Burial ref="step" stepData={this.state.stepData} onChange={this.__onChange.bind(undefined,"burial")}/>

        }
    ]}
                    onCompleteClick={this.__onSaveButtonClick}/>
        );
    }

    __onSaveButtonClick = ()=> {

    };

    __onChange = (code, stepData)=> {
        var state = {};
        state["stepData"] = {};
        state["stepData"][code] = stepData;
        this.setState(state);

    }

}