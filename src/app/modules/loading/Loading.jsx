import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import "app/modules/loading/style.css"
import Card from "app/modules/card/Card";
import PanelForm from "app/modules/dataform/PanelForm";
import BaseCrudPage from "app/common/BaseCrudPage";
import Loader from "react-loading";


export default class Loading extends ShallowComponent {

    static defaultProps = {
        show: true
    };

    constructor(props) {
        super(props);

        this.state = {
            windowHeight: window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight};

    }

    render() {
        var show = this.props.show ? "loading" : "hidden-loading";
        return (
            <div className={show} style={{height:this.state.windowHeight,paddingTop:(this.state.windowHeight/3)}}>
                <div className="center-block" style={{maxWidth:100}}>
                    <Loader width="170" type="bubbles" color='#FFF'/>
                </div>
            </div>
        );
    }


    handleResize() {
        this.setState({
            windowHeight: window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight
        });
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

}