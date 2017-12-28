
//异步加载的包装组件Bundle,Bundle的主要功能就是接收一个组件异步加载的方法(load)，并返回相应的react组件

import  { Component } from 'react';
export default class Bundle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mod: null
        };
    }

    componentWillMount() {
        //首次渲染
        this.initAsync(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.load !== this.props.load) {
            this.initAsync(nextProps)
        }
    }

    initAsync(props) {
        this.setState({
            mod: null
        });

        props.load(
           (mod) => {
                this.setState({
                    mod: mod.default ? mod.default : mod
                });
           });
    }

    render() {
        return this.state.mod ?   this.props.children( this.state.mod ) : null;
    }
}