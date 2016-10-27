import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import Col from "react-bootstrap/lib/Col";
import Panel from "react-bootstrap/lib/Panel";
import "./style.css";


export default class Card extends ShallowComponent {

    constructor(props) {
        super(props);
        this.state = {
            width: 0
        }
    }

    render() {
        var className = "card";
        if (this.props.borderless)
            className += "-borderless";
        if (this.props.unfilled)
            className += "-unfilled";
        return (
            <Panel className={className}
                   style={this.props.style}
                   header={this.__renderHeader()}>

                {this.__renderDescription()}

                <Col style={{padding:"0px"}}>
                    {this.__renderListContent()}
                </Col>
                {this.props.children}
            </Panel>
        );
    };

    __renderListContent = ()=> {
        var arrItem = [];
        if (this.props.listContent) {
            var content = this.props.listContent;
            var width = this.__maxLength(content) * 9;
            for (let i in content) {
                var item = content[i];
                var toolTip = item.toolTip || "";
                arrItem.push(
                    <Col key={i} xs={12}
                         style={{borderBottom:item.value?"1px dotted #ccc":"0px",margin:"4px 0px",padding:1}}>
                        <Col
                            style={{float:"left",width:item.value?width:"100%",fontWeight:500,color:"#666666",paddingLeft:0}}>{item.title}{toolTip}</Col>
                        {item.value ? (<Col
                            style={{float:"left",minWidth:width,paddingTop:0,paddingLeft:0}}>{item.value}</Col>) : (
                            <span></span>)}
                    </Col>)
            }
            return arrItem;
        }
        return arrItem;

    };

    __maxLength = (array)=> {
        let maxLength = 0;
        for (let i in array) {
            var item = array[i];
            var length = item.title.length;
            if (length > maxLength)
                maxLength = length;
        }
        return maxLength;
    };

    __renderHeader = ()=> {
        var width = this.state.windowWidth;

        if (this.props.smallHeader) {
            if (width < 768)
                return (
                    <Col className="page-header">
                        <h5><b style={{color:"#337ab7",opacity:0.8}}>{this.props.smallHeader}</b></h5>
                    </Col>);
            else return null;
        }

        if (!this.props.header)
            return null;


        return (
            <Col className="page-header">
                <Col className="pull-right"
                     style={{paddingTop:8,fontSize:12}}>{this.props.headerActions}
                </Col>
                <h5>
                    <b style={{color:"#337ab7",opacity:0.8}}>{this.props.header}</b>
                </h5>
            </Col>
        );
    };

    __renderDescription = ()=> {

        if (!this.props.description)
            return null;

        return (<p style={{margin:"0px"}}>{this.props.description}</p>);
    };


    handleResize = ()=> {
        this.setState({
            windowWidth: window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth
        });

    };

    componentDidMount = () => {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();

    };

    componentWillUnmount = ()=> {
        window.removeEventListener('resize', this.handleResize);
    };

}