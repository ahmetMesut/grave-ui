import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import Col from "react-bootstrap/lib/Col";
import Pager from "react-bootstrap/lib/Pager";
import PageItem from "react-bootstrap/lib/PageItem";
import NotificationManager from "react-notifications/lib/NotificationManager";
import Button from "react-bootstrap/lib/Button";
import FaIcon from "./FaIcon";
import "./style.css";


export default class Wizard extends ShallowComponent {

    stepValidInfo = [];
    content = undefined;


    constructor(props) {
        super(props);
        this.state = {
            currentStep: 0
        }
    };

    render() {
        return (
            <div>
                <Col className="wizard">
                    <Col className="wizard-row setup-panel">
                        {this.__renderSteps()}
                    </Col>
                </Col>
                <Col style={{paddingTop:"30px"}}>
                    {this.__renderContent()}
                </Col>
                {this.__renderPager()}
            </div>
        );
    };

    __renderSteps = ()=> {
        var steps = [];
        var correct;
        var wrong;
        var titleStyle;
        var buttonStyle;

        for (var i = 0; i < this.props.steps.length; i++) {
            var item = this.props.steps[i];
            correct = this.stepValidInfo[i] && this.state.currentStep > i ? this.__renderCorrectSteps() : "";
            wrong = this.stepValidInfo[i] == false && this.state.currentStep < i && this.stepValidInfo != "" ? this.__renderWrongSteps() : "";
            titleStyle = this.__stepState(i) + "-title";
            buttonStyle = this.__stepState(i) + "-button";
            var step = (
                <Col key={i} className="wizard-step">
                    <Col componentClass="a" type="button"
                         onClick={this.__onClickStepButton.bind(undefined,i)}
                         className={"btn btn-circle " + buttonStyle}>{i + 1}</Col>
                    {correct}
                    {wrong}
                    <p className={titleStyle}>{item.title}</p>
                </Col>);
            steps.push(step)
        }
        return steps;
    };

    __stepState = (index)=> {
        if (this.state.currentStep == index)
            return "wizard-step-active";

        else if (this.stepValidInfo[index] == false && this.state.currentStep < index && this.stepValidInfo != "")
            return "wizard-step-wrong";

        else if (this.stepValidInfo[index] == true)
            return "wizard-step-succes";
        else
            return "wizard-step-empty";

    };

    __onClickStepButton = (index)=> {

        if (this.state.currentStep == index)
            return;

        if (this.state.currentStep < index)
            if (!this.isValid())
                return;

        this.stepValidInfo[this.state.currentStep] = this.isValid();
        var state = {};
        if (this.state.currentStep < index) {
            if (this.__areStepsValid(this.state.currentStep, index)) {
                state["currentStep"] = index;
                this.setState(state);
            }
            else if (this.__areStepsValid(this.state.currentStep, (this.state.currentStep + 1))) {
                state["currentStep"] = this.state.currentStep + 1;
                this.setState(state);
            }
        } else if (this.state.currentStep > index) {
            state["currentStep"] = index;
            this.setState(state);
        }
    };
    __areStepsValid = (start, end)=> {
        for (start; start < end; start++) {
            if (!this.stepValidInfo[start]) {
                return false;
            }
        }
        return true
    };

    __renderCorrectSteps = () => {
        let item;
        let itemArr = [];
        itemArr.push(<span key="correct"><i style={{marginLeft:0, color:"#1791C5"}} className="fa fa-check"
                                            aria-hidden="true"/></span>);

        return itemArr;
    };

    __renderWrongSteps = () => {
        let item;
        let itemArr = [];
        itemArr.push(<span key="wrong"><i style={{marginLeft:0, color:"red"}} className="fa fa-times"
                                          aria-hidden="true"/></span>);

        return itemArr;
    };

    __renderContent = ()=> {
        this.content = this.props.steps[this.state.currentStep].component;
        return this.content;
    };

    __handleNextButtonClick = ()=> {
        if (this.isValid())
            this.__onClickStepButton(this.state.currentStep + 1);
    };

    __handlePreviousButtonClick = ()=> {
        if (this.isValid())
            this.__onClickStepButton(this.state.currentStep - 1);
    };

    __renderPager = ()=> {
        var nextButton = undefined;
        var previousButton = undefined;
        if (this.state.currentStep == this.props.steps.length - 1) {
            var submitText = this.props.completeButtonText || "Kaydet";
            nextButton =
                this.props.completeButton ?
                    <Col className="pull-right approvement-button">
                        <Button bsStyle="primary" disabled={this.props.disabled}
                                onClick={this.props.onCompleteClick}><FaIcon
                            size="fa-lg" code="fa-check-circle"/>{submitText}</Button>
                    </Col> : null;
        } else {
            nextButton =
                <PageItem next disabled={false}
                          onClick={this.__handleNextButtonClick}>
                    Sonraki Adım &rarr;</PageItem>
        }
        if (this.state.currentStep == 0) {
            previousButton = null;
        }
        else {
            previousButton =
                <PageItem previous disabled={this.state.currentStep==0}
                          onClick={this.state.currentStep==0?null:this.__handlePreviousButtonClick}>&larr;
                    Önceki Adım</PageItem>
        }
        return (
            <Pager>
                {previousButton}
                {nextButton}
            </Pager>
        );
    };

    isValid = ()=> {
        let result = this.content._owner._instance.refs.step.isValid();
        if (!result.status) {
            NotificationManager.error(result.message);
            return false;
        }

        return true;
    };
}
