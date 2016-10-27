import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import Form from "react-bootstrap/lib/FormGroup";
import Col from "react-bootstrap/lib/Col";
import SelectInput from "robe-react-ui/lib/inputs/SelectInput";
import HtmlEditor from "robe-react-ui/lib/inputs/htmleditor/HtmlEditor";
import CheckInput from "robe-react-ui/lib/inputs/CheckInput";
import DateInput from "robe-react-ui/lib/inputs/DateInput";
import NumericInput from "robe-react-ui/lib/inputs/NumericInput";
import TextInput from "robe-react-ui/lib/inputs/TextInput";
import {AjaxRequest} from "robe-react-commons";
import InputValidations from "robe-react-ui/lib/validation/InputValidations";


export default class DataForm extends ShallowComponent {
    constructor(props) {
        super(props);
        this.state = {filters: {}};
    };

    resources = [];
    prices = [];

    render() {

        return (
            <Form>
                {this.__createForm(this.props.model, this.state)}
            </Form>
        );
    };

    isValid = ()=> {
        for (let key in this.refs) {
            if (this.refs.hasOwnProperty(key)) {
                let child = this.refs[key];
                if (child.isValid) {
                    if (!child.isValid())
                        return false;
                }
            }
        }
        return true;
    };

    __createForm = (model, data)=> {
        var elements = [];
        var sizeData = this.__getMultiple(model.length);
        for (var i = 0; i < model.length; i += (i + sizeData.itemSize) >= (model.length) ? model.length - i : sizeData.itemSize) {
            var cols = [];
            for (var j = i; j < i + sizeData.itemSize && j < model.length; j++) {
                cols.push(
                    <div style={{maxHeight:58}}>
                        {this.__decideElement(model[j], data, 0 == 1)}
                    </div>);
            }
            elements.push(
                <Col xs={12} md={sizeData.colSize}>
                    {cols}
                </Col>);
        }
        return elements;
    };
    __getMultiple = (length)=> {
        var index = {};
        if (length > 29)
            index = {colSize: 3, itemSize: 8};
        else if (length > 12 && length < 28)
            index = {colSize: 3, itemSize: 4};
        else if (length >= 6 && length <= 12)
            index = {colSize: 4, itemSize: 3};
        else if (length >= 3 && length <= 5)
            index = {colSize: 3, itemSize: 1};
        else
            index = 4;
        return index;
    };



    __filterUndefined = (value)=> {
        if (value === 0)
            return 0;
        return value ? value : "";
    };


    __decideElement = (model, data, focus)=> {
        if (!data)
            data = {};
        var value = this.__filterUndefined(data[model.code]);

        var validations = model.validations;

        if (validations) {
            // validations["required"] = validations["required"] ? InputValidations.required : undefined;
            // validations["minLength"] = validations["minLength"] ? InputValidations.minLength : undefined;
        }
        let disabled = model.editable != undefined ? !model.editable : false;
        switch (model.type) {
            case "number":
                return (<NumericInput
                    type="text"
                    label={model.label}
                    floatingLabel={true}
                    key={model.code}
                    ref={model.code}
                    validations={validations}
                    focus={focus}
                    disabled={disabled}
                    onChange={this.__handleChange.bind(undefined,model)}
                    value={value}
                />);
            case "string":
                return (<TextInput
                    type="text"
                    label={model.label}
                    key={model.code}
                    ref={model.code}
                    disabled={disabled}
                    validations={validations}
                    focus={focus}
                    onChange={this.__handleChange.bind(undefined,model)}
                    value={value}/>);
            case "textarea":
                return (<TextInput
                    type="textarea"
                    label={model.label}
                    key={model.code}
                    ref={model.code}
                    validations={validations}
                    focus={focus}
                    disabled={disabled}
                    regex={regex}
                    onChange={this.__handleChange.bind(undefined,model)}
                    value={value}/>);
            case "password":
                return (<TextInput
                    label={model.label}
                    key={model.code}
                    ref={model.code}
                    validations={validations}
                    focus={focus}
                    disabled={disabled}
                    type={"password"}
                    onChange={this.__handleChange.bind(undefined,model)}
                    value={value}/>);
            case "date":

                // TODO format={model.format}
                return (<DateInput
                    label={model.label}
                    key={model.code}
                    disabled={disabled}
                    validations={validations}
                    ref={model.code}
                    focus={focus}
                    onChange={this.__handleChange.bind(undefined,model)}
                    value={value}/>);
            case "list" :

                var dataTextField = model.dataTextField || "name";
                var dataValueField = model.dataValueField || "oid";
                var optionLabel = model.optionLabel || "<Lütfen Seçiniz>";

                return (
                    <SelectInput
                        label={model.label}
                        key={model.code}
                        ref={model.code}
                        onChange={this.__handleChange.bind(undefined,model)}
                        value={value}
                        validations={validations}
                        disabled={disabled}
                        textField={dataTextField}
                        valueField={dataValueField}
                        optionLabel={optionLabel}
                        focus={focus}
                        items={this.resources[model.code]|| this.props.resources[model.code]}/>);
            case "bool":
                if (!value)
                    value = false;
                return (
                    <CheckInput
                        label={model.label}
                        key={model.code}
                        validations={validations}
                        ref={model.code}
                        focus={focus}
                        disabled={disabled}
                        onChange={this.__handleChange.bind(undefined,model)}
                        value={value}/>);
            case "editor":
                return (
                    <HtmlEditor
                        label={model.label}
                        key={model.code}
                        ref={model.code}
                        validations={validations}
                        disabled={disabled}
                        onChange={this.__handleChange.bind(undefined,model)}
                        value={value}
                        focus={focus}
                    />);

        }
    };

    __handleChange = (model, e)=> {
        var code = model.code;
        var cascade = model.cascade;
        var type = model.type;
        var changeCode = model.changeCode;

        var state = {};
        var value = e.target.parsedValue != undefined ? e.target.parsedValue : e.target.value;


        if (cascade) {
            for (var cCode in cascade) {
                if (e.target.default != true)
                    state[cCode] = undefined;
                var items = this.props.resources[cCode];
                var newItems = [];
                for (var i in items) {
                    var item = items[i];
                    if (item[cascade[cCode]] == value) {
                        newItems.push(item);
                    }
                }
                this.resources[cCode] = newItems;
                this.refs[cCode].forceUpdate();
                this.forceUpdate();
            }
        }

        var filter = "";
        if (value != undefined && value != "") {
            switch (type) {
                case "bool":
                    if (value !== "all")
                        filter += (code + "=" + value);
                    break;
                case "number":
                    filter += (code + "~=" + value);
                    break;
                case "string":
                    filter += (code + "~=" + value);

                    break;
                case "textarea":
                    filter += (code + "~=" + value);
                    break;
                case "date":
                    filter += (code + "~=" + value);
                    break;
                case "list":
                    filter += (code + "=" + value);
            }
        }

        if (changeCode) {

            for (var j in changeCode) {
                if (changeCode.hasOwnProperty(j)) {
                    for (var k in this.prices) {
                        if (this.prices[k]["priceType"] == changeCode[j]) {
                            var total = this.state[j] || 0;
                            total += value * parseInt(this.prices[k]["unitPrice"]) -
                                ((this.state[code] || 0) * parseInt(this.prices[k]["unitPrice"]));
                            state[j] = total;
                        }
                    }
                }
            }
        }

        state[code] = value;
        state["filters"] = this.state.filters || {};
        state["filters"][code] = filter;
        if (this.props.onChange) {
            this.props.onChange(state);
        }
        this.setState(state);
    };

    reset = ()=> {
        let state = {};
        var items = this.state;
        for (let i in items) {
            if (items.hasOwnProperty(i)) {
                state[i] = "";
            }
        }
        state.filters = {};
        this.setState(state);
    };
    componentDidMount = () => {
        let graveUnitPrice = new AjaxRequest({
            type: "GET",
            url: "gravePrice"
        });
        graveUnitPrice.call(undefined, undefined, (res)=> {
            this.prices = res;
        });
    };
}