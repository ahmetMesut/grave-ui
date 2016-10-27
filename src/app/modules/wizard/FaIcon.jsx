import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";

// Please look at https://fortawesome.github.io/Font-Awesome/examples/
export  default class FaIcon extends ShallowComponent {

    static propTypes = {
        code: React.PropTypes.string.isRequired,
        size: React.PropTypes.string
    };

    render() {

        return (
            <i className={
            "fa" + " " +
            this.props.code + " " +
            this.props.size  + " " + (this.props.className==undefined?"":this.props.className)
            }/>
        );
    };
}
