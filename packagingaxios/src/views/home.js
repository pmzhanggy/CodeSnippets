import React, { Component } from 'react';

import { fetchData } from '../api';

const { log } = console;

class Home extends Component {
    constructor (props) {
        super(props);
        this.state = {

        }

        // this.fetchData = this.fetchData.bind(this);
    }

    render () {
        return (
            <div>sadfasdf</div>
        );
    }

    componentDidMount () {
        // log(axios.request({}))
        console.log(fetchData());
        fetchData()
        .then((res) => {

        })
        .catch((err) => {

        });
    }
}

export default Home;