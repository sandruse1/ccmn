import React, { Component } from 'react';
import api from '../request/presence.js';
import config from '../../config/config.json';
import { Row,Col } from 'react-materialize';
import { Bar, Doughnut } from 'react-chartjs-2';
import logger from '../request/logger.js';

class RepeatVisitors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passerby_range: {},
            visitors_range: {},
            connected_range: {},
            datasets: [],
            labels: [],
            DAILY: [],
            FIRST_TIME: [],
            OCCASIONAL: [],
            WEEKLY: [],
            YESTERDAY: [],
            count_dataset: [],
            data: false,
            dataCount: false,
            barDone: false,
            doughnutDone: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.RepeatVisitors(nextProps.time);
        this.RepeatVisitorsCount(nextProps.time);
    }

    componentDidMount() {
        this.RepeatVisitors(this.props.time);
        this.RepeatVisitorsCount(this.props.time);
    }

    RepeatVisitors(time) {
        let url = '';
        if (time.range.start && time.range.end) {
            url = `/presence/v1/repeatvisitors/daily?siteId=${config.siteId}&startDate=${time.range.start}&endDate=${time.range.end}`
        } else {
            time = config.proximityGraph[time.time];
            url = `/presence/v1/repeatvisitors/${time}?siteId=${config.siteId}`
        }
        this.setState({
            datasets: [],
            DAILY:[],
            FIRST_TIME: [],
            OCCASIONAL: [],
            WEEKLY: [],
            YESTERDAY: []
        });
        api.getInitialData(url)
            .then((response) => {
                if (response.status === 200) {
                    let a = response.data;
                    for (let variable in a) {
                        this.state.DAILY.push(a[variable].DAILY);
                        this.state.FIRST_TIME.push(a[variable].FIRST_TIME);
                        this.state.OCCASIONAL.push(a[variable].OCCASIONAL);
                        this.state.WEEKLY.push(a[variable].WEEKLY);
                        this.state.YESTERDAY.push(a[variable].YESTERDAY);
                    }
                    this.state.datasets.push({
                        label: 'Daily',
                        backgroundColor: 'rgba(0,255,255,0.3)',
                        borderColor: 'rgba(0,255,255,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(0,255,255,0.6)',
                        hoverBorderColor: 'rgba(0,255,255,1)',
                        data: this.state.DAILY
                    });
                    this.state.datasets.push({
                        label: 'First time',
                        backgroundColor: 'rgba(255,0,255,0.3)',
                        borderColor: 'rgba(255,0,255,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,0,255,0.6)',
                        hoverBorderColor: 'rgba(255,0,255,1)',
                        data: this.state.FIRST_TIME
                    });
                    this.state.datasets.push({
                        label: 'Occasional',
                        backgroundColor: 'rgba(255,255,0,0.3)',
                        borderColor: 'rgba(255,255,0,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,255,0,0.6)',
                        hoverBorderColor: 'rgba(255,255,0,1)',
                        data: this.state.OCCASIONAL
                    });
                    this.state.datasets.push({
                        label: 'Weekly',
                        backgroundColor: 'rgba(0,0,255,0.3)',
                        borderColor: 'rgba(0,0,255,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(0,0,255,0.6)',
                        hoverBorderColor: 'rgba(0,0,255,1)',
                        data: this.state.WEEKLY
                    });
                    this.state.datasets.push({
                        label: 'Yesterday',
                        backgroundColor: 'rgba(0,255,0,0.3)',
                        borderColor: 'rgba(0,255,0,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(0,255,0,0.6)',
                        hoverBorderColor: 'rgba(0,255,0,1)',
                        data: this.state.YESTERDAY
                    });
                    this.setState({
                        data: true,
                        labels: Object.keys(response.data),
                        datasets: this.state.datasets
                    });
                } else {
                    logger.setLogg({ text: `${url} FAULT WITH STATUS CODE ${response.status}` });
                }
            })
            .catch((error) => {
                logger.setLogg({ text: `${url} FAULT WITH ERROR ${error}` });
            });
    }

    RepeatVisitorsCount(time) {
        let url = '';
        if (time.range.start && time.range.end) {
            url = `/presence/v1/repeatvisitors/count?siteId=${config.siteId}&startDate=${time.range.start}&endDate=${time.range.end}`
        } else {
            time = config.headerInputTimes[time.time];
            url = `/presence/v1/repeatvisitors/count/${time}?siteId=${config.siteId}`
        }
        api.getInitialData(url)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        count_dataset: Object.values(response.data),
                        dataCount: true
                    });
                } else {
                    logger.setLogg({ text: `${url} FAULT WITH STATUS CODE ${response.status}` });
                }
            })
            .catch((error) => {
                logger.setLogg({ text: `${url} FAULT WITH ERROR ${error}` });
            });
    }

    redrawBar() {
        this.setState({barDone: true});
    }

    redrawDoughnut() {
        this.setState({doughnutDone: true});
    }

    renderDoughnut() {
        if (this.state.dataCount){
            this.redrawDoughnut();
        }
    }

    renderBarChart() {
        if (this.state.data) {
            this.redrawBar();
        }
    }

    render() {
        return (
            <Row className='chart-wrapper'>
                <Col s={12} m={8} className='bar-chart'>
                    <h5 className='graph-headings'>Repeat Visitors</h5>
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
                    <h5 className='graph-headings'>Repeat Visitors Distribution</h5>
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
                            'Daily',
                            'First time',
                            'Occasional',
                            'Weekly',
                            'Yesterday',
                        ],
                        datasets: [{
                            data: this.state.count_dataset,
                            backgroundColor: [
                                'rgba(0,255,255,0.3)',
                                'rgba(255,0,255,0.3)',
                                'rgba(255,255,0,0.3)',
                                'rgba(0,0,255,0.3)',
                                'rgba(0,255,0,0.3)',
                            ],
                            hoverBackgroundColor: [
                                'rgba(0,255,255,0.6)',
                                'rgba(255,0,255,0.6)',
                                'rgba(255,255,0,0.6)',
                                'rgba(0,0,255,0.6)',
                                'rgba(0,255,0,0.6)',
                            ]
                        }]
                    }}  />
                </Col>
            </Row>
        );
    }
}

export default RepeatVisitors;
