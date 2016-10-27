import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import Button from "react-bootstrap/lib/Button";
import Col from "react-bootstrap/lib/Col";
import DataForm from "./DataForm";
import NotificationManager from "react-notifications/lib/NotificationManager";

export default class PanelForm extends ShallowComponent {

    static propTypes = {
        title: React.PropTypes.string,
        model: React.PropTypes.array,
        resources: React.PropTypes.object,
        onCancel: React.PropTypes.func,
        cancelButtonText: React.PropTypes.string,
        submitButtonText: React.PropTypes.string,
        searchButtonText: React.PropTypes.string,
        titleText: React.PropTypes.string,
        showCancelButton: React.PropTypes.bool,
        showSearchButton: React.PropTypes.bool,
        showSaveButton: React.PropTypes.bool
    };

    static defaultProps = {
        titleText: "Detay",
        invalidText: ["Lütfen zorunlu alanların eksiksiz doldurulduğundan emin olunuz."],
        cancelButtonText: "İptal",
        submitButtonText: "Kaydet",
        searchButtonText: "Sorgula",
        showCancelButton: true,
        showSaveButton: true,
        showSearchButton: true
    };

    doNotSubmit = false;


    constructor(props) {
        super(props);
        this.state = {
            valid: true,
            show: this.props.show,
            invalidText: this.props.invalidText,
            disableSaveButton: false,
            disableSearchButton: false,
            queryData: {}
        };
    };

    render() {
        return (
            <div>
                <DataForm
                    ref="dataform"
                    model={this.props.model}
                    resources={this.props.resources}
                    onChange={this.__change}
                />
                {this.__renderFooterButtons()}
            </div>
        );
    };

    __renderFooterButtons = () => {
        let showCancelButton = (this.props.showCancelButton) ?
            <Button style={{margin:"0px 4px"}}
                    bsStyle="warning"
                    onClick={this.reset}>
                {this.props.cancelButtonText}
            </Button> : null;
        let showSaveButton = (this.props.showSaveButton) ?
            <Button
                style={{margin:"0px 4px"}}
                bsStyle="primary"
                disabled={this.state.disableSaveButton}
                onClick={this.__submitForm}>
                {this.props.submitButtonText}
            </Button> : null;
        let showSearchButton = (this.props.showSearchButton) ?
            <Button
                style={{margin:"0px 4px"}}
                bsStyle="info"
                disabled={this.state.disableSearchButton}
                onClick={this.__search}>
                {this.props.searchButtonText}
            </Button> : null;

        return (
            <Col xs={12}>
                <Col className="pull-right">
                    {showCancelButton}
                    {showSearchButton}
                    {showSaveButton}
                </Col>
            </Col>
        );
    };

    __renderWarning = (valid, invalidText)=> {

        if (valid) {
            return null;
        }

        let errors = [];

        for (let i = 0; i < invalidText.length; i++) {
            var error = invalidText[i];
            errors.push(<p key={i}>{error}</p>);
        }
        NotificationManager.error(errors);
    };


    __submitForm = (e)=> {
        var newState = this.refs.dataform.state;
        delete newState.filters;
        if (JSON.stringify(this.props.formData) == JSON.stringify(newState)) {
            return;
        }
        var valid = this.refs.dataform.isValid();
        if (!valid) {
            this.__renderWarning(false, this.props.invalidText);
            return;
        }
        if (this.props.onSave && valid == true)
            this.props.onSave(this.props.formData, newState);
    };

    reset = ()=> {
        if (this.props.reset) {
            this.props.reset();
            this.refs.dataform.reset();
        }
    };

    __search = ()=> {
        if (this.props.onSearch) {
            this.props.onSearch(this.state.queryData);
        }
    };
    __change = (state)=> {
        this.setState({queryData: state});
    };

    setData = (data)=> {
        this.refs.dataform.setState(data);
    };

    refresh = ()=> {
        this.refs.dataform.forceUpdate();
        this.forceUpdate();

    }

}