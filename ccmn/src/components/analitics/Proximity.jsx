import React, { Component } from 'react';
import api from '../request/presence.js';
import config from '../../config/config.json';
import {Row,Col} from 'react-materialize';
import {Bar, Doughnut} from 'react-chartjs-2';
import logger from '../request/logger.js';

class Proximity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passerby_range:{},
            visitors_range:{},
            connected_range:{},
            datasets:[],
            labels:[],
            totalPasserbyCount:0,
            totalVisitorCount:0,
            totalConnectedCount:0,
            data: [false, false, false],
            dataCount: false,
            barDone: false,
            doughnutDone: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.proximity(nextProps.time);
        this.proximityCount(nextProps.time);
    }

    componentDidMount() {
        this.proximity(this.props.time);
        this.proximityCount(this.props.time);
    }

    proximity(time) {
        let currentTime = time;
        let url = '';
        if (currentTime.range.start && currentTime.range.end) {
            url = `/presence/v1/passerby/daily?siteId=${config.siteId}&startDate=${time.range.start}&endDate=${time.range.end}`
        } else {
            time = config.proximityGraph[currentTime.time];
            url = `/presence/v1/passerby/${time}?siteId=${config.siteId}`
        }
        let dataCheck = [false, false, false];

        this.setState({ datasets: [] });
        api.getInitialData(url)
            .then((response) => {
                let currentURL = url;
                if (response.status === 200) {
                    dataCheck[0] = true;
                    this.state.datasets.push({
                        label: 'Passerby',
                        backgroundColor: 'rgba(0,255,255,0.3)',
                        borderColor: 'rgba(0,255,255,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(0,255,255,0.6)',
                        hoverBorderColor: 'rgba(0,255,255,1)',
                        data: Object.values(response.data)
                    });
                    this.setState({
                        passerby_range: response.data,
                        labels: Object.keys(response.data),
                        datasets: this.state.datasets,
                        data: dataCheck
                    });
                    this.renderBarChart();
                } else {
                    logger.setLogg({ text: `${currentURL} FAULT WITH STATUS CODE ${response.status}` });
                }
            })
            .catch((error) => {
                let currentURL = url;
                logger.setLogg({ text: `${currentURL} FAULT WITH ERROR ${error}` });
            });
        if (currentTime.range.start && currentTime.range.end) {
            url = `/presence/v1/visitor/daily?siteId=${config.siteId}&startDate=${time.range.start}&endDate=${time.range.end}`
        } else {
            time = config.proximityGraph[currentTime.time];
            url = `/presence/v1/visitor/${time}?siteId=${config.siteId}`
        }
        api.getInitialData(url)
            .then((response) => {
                let currentURL = url;
                if (response.status === 200) {
                    dataCheck[1] = true;
                    this.state.datasets.push({
                        label: 'Visitors',
                        backgroundColor: 'rgba(255,255,0,0.3)',
                        borderColor: 'rgba(255,255,0,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,255,0,0.6)',
                        hoverBorderColor: 'rgba(255,255,0,1)',
                        data: Object.values(response.data)
                    });
                    this.setState({
                        visitors_range:response.data,
                        datasets: this.state.datasets,
                        data: dataCheck
                    });
                    this.renderBarChart();
                } else {
                    logger.setLogg({ text: `${currentURL} FAULT WITH STATUS CODE ${response.status}` });
                }
            })
            .catch((error) => {
                let currentURL = url;
                logger.setLogg({ text: `${currentURL} FAULT WITH ERROR ${error}` });
            });
        if (currentTime.range.start && currentTime.range.end) {
            url = `/presence/v1/connected/daily?siteId=${config.siteId}&startDate=${time.range.start}&endDate=${time.range.end}`
        } else {
            time = config.proximityGraph[currentTime.time];
            url = `/presence/v1/connected/${time}?siteId=${config.siteId}`
        }
        api.getInitialData(url)
            .then((response) => {
                let currentURL = url;
                if (response.status === 200) {
                    dataCheck[2] = true;
                    this.state.datasets.push({
                        label: 'Connected',
                        backgroundColor: 'rgba(255,0,255,0.3)',
                        borderColor: 'rgba(255,0,255,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,0,255,0.6)',
                        hoverBorderColor: 'rgba(255,0,255,1)',
                        data: Object.values(response.data)
                    });
                    this.setState({
                        connected_range:response.data,
                        datasets: this.state.datasets,
                        data: dataCheck
                    });
                    this.renderBarChart();
                } else {
                    logger.setLogg({ text: `${currentURL} FAULT WITH STATUS CODE ${response.status}` });
                }
            })
            .catch((error) => {
                let currentURL = url;
                logger.setLogg({ text: `${currentURL} FAULT WITH ERROR ${error}` });
            });
    }

    proximityCount(time) {
        let url = '';
        if (time.range.start && time.range.end) {
            url = `/presence/v1/kpisummary?siteId=${config.siteId}&startDate=${time.range.start}&endDate=${time.range.end}`
        } else {
            time = config.headerInputTimes[time.time];
            url = `/presence/v1/kpisummary/${time}?siteId=${config.siteId}`
        }

        api.getInitialData(url)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        totalPasserbyCount: response.data.totalPasserbyCount,
                        totalVisitorCount: response.data.totalVisitorCount,
                        totalConnectedCount: response.data.totalConnectedCount,
                        dataCount: true
                    });
                    this.renderDoughnut();
                } else {
                    logger.setLogg({ text: `${url} FAULT WITH ERROR ${response.status}` });
                }
            })
            .catch((error) => {
                logger.setLogg({ text: `${url} FAULT WITH ERROR ${error}` });
            });
    }

    renderDoughnut(){
        if (this.state.dataCount){
            this.redrawDoughnut();
        }
    }

    renderBarChart() {
        if (!this.state.data.includes(false)) {
            this.redrawBar();
        }
    }

    redrawBar() {
        this.setState({ barDone: true });
    }

    redrawDoughnut() {
        this.setState({ doughnutDone: true });
    }

    render() {
        return (
            <Row className='chart-wrapper'>
                <Col s={12} m={8} className='bar-chart'>
                    <h5 className='graph-headings'>Proximity</h5>
                    <Bar
                        data={{labels: this.state.labels, datasets:this.state.datasets}}
                        height={100}
                        redraw={this.state.barDone}
                        options={{
                            legend: {
                                labels: {
                                    fontColor: 'white',
                                    fontSize: 18
                                }
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        fontColor: 'white',
                                    },
                                    gridLines: {
                                        display: true,
                                        color: 'rgba(0,255,255,0.2)'
                                    }
                                }],
                                xAxes: [{
                                    ticks: {
                                        fontColor: 'white',
                                        fontSize: 14,
                                        stepSize: 1,
                                        beginAtZero: true
                                    },
                                    gridLines: {
                                        display: true,
                                        color: 'rgba(0,255,255,0.2)'
                                    }
                                }]
                            }
                        }}
                    />
                </Col>
                <Col s={12} m={4}>
                    <h5 className='graph-headings'>Proximity Distribution</h5>
                    <Doughnut
                        redraw={this.state.doughnutDone}
                        height={200}
                        options={{
                            legend: {
                                labels: {
                                    fontColor: 'white',
                                    fontSize: 18
                                }
                            }
                        }}
                        data={{
                        labels: [
                            'Visitors',
                            'Passerby',
                            'Connected'
                        ],
                        datasets: [{
                            data: [
                                this.state.totalVisitorCount,
                                this.state.totalPasserbyCount,
                                this.state.totalConnectedCount,
                            ],
                            backgroundColor: [
                                'rgba(255,255,0,0.3)',
                                'rgba(0,255,255,0.3)',
                                'rgba(255,0,255,0.3)'
                            ],
                            hoverBackgroundColor: [
                                'rgba(255,255,0,0.6)',
                                'rgba(0,255,255,0.6)',
                                'rgba(255,0,255,0.6)'
                            ]
                        }]
                    }}  />
                </Col>

            </Row>

        );
    }
}

export default Proximity;
