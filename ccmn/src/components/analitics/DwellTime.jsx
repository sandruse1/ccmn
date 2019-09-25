import React, { Component } from 'react';
import api from '../request/presence.js';
import logger from '../request/logger.js';
import config from '../../config/config.json';
import { Row, Col } from 'react-materialize';
import { Bar, Doughnut } from 'react-chartjs-2';

class DwellTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passerby_range: {},
            visitors_range: {},
            connected_range: {},
            datasets: [],
            labels: [],
            FIVE_TO_THIRTY_MINUTES: [],
            THIRTY_TO_SIXTY_MINUTES: [],
            ONE_TO_FIVE_HOURS: [],
            FIVE_TO_EIGHT_HOURS: [],
            EIGHT_PLUS_HOURS: [],
            count_dataset: [],
            data: false,
            dataCount: false,
            barDone: false,
            doughnutDone: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.Dwell(nextProps.time);
        this.DwellTimeCount(nextProps.time);
    }

    componentDidMount() {
        this.Dwell(this.props.time);
        this.DwellTimeCount(this.props.time);
    }

    Dwell(time) {
        let url = '';
        if (time.range.start && time.range.end) {
            url = `/presence/v1/dwell/daily?siteId=${config.siteId}&startDate=${time.range.start}&endDate=${time.range.end}`
        } else {
            time = config.proximityGraph[time.time];
            url = `/presence/v1/dwell/${time}?siteId=${config.siteId}`
        }
        this.setState({
            datasets: [],
            FIVE_TO_THIRTY_MINUTES:[],
            THIRTY_TO_SIXTY_MINUTES: [],
            ONE_TO_FIVE_HOURS: [],
            FIVE_TO_EIGHT_HOURS: [],
            EIGHT_PLUS_HOURS: []
        });
        api.getInitialData(url)
            .then((response) => {
                if (response.status === 200) {
                    let a = response.data;
                    for (let variable in a) {
                        this.state.FIVE_TO_THIRTY_MINUTES.push(a[variable].FIVE_TO_THIRTY_MINUTES);
                        this.state.THIRTY_TO_SIXTY_MINUTES.push(a[variable].THIRTY_TO_SIXTY_MINUTES);
                        this.state.ONE_TO_FIVE_HOURS.push(a[variable].ONE_TO_FIVE_HOURS);
                        this.state.FIVE_TO_EIGHT_HOURS.push(a[variable].FIVE_TO_EIGHT_HOURS);
                        this.state.EIGHT_PLUS_HOURS.push(a[variable].EIGHT_PLUS_HOURS);
                    }
                    this.state.datasets.push({
                        label: '5 - 30 min.',
                        backgroundColor: 'rgba(0,255,255,0.3)',
                        borderColor: 'rgba(0,255,255,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(0,255,255,0.6)',
                        hoverBorderColor: 'rgba(0,255,255,1)',
                        data: this.state.FIVE_TO_THIRTY_MINUTES
                    });
                    this.state.datasets.push({
                        label: '30 - 60 min.',
                        backgroundColor: 'rgba(255,0,255,0.3)',
                        borderColor: 'rgba(255,0,255,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,0,255,0.6)',
                        hoverBorderColor: 'rgba(255,0,255,1)',
                        data: this.state.THIRTY_TO_SIXTY_MINUTES
                    });
                    this.state.datasets.push({
                        label: '1 - 5 h.',
                        backgroundColor: 'rgba(255,255,0,0.3)',
                        borderColor: 'rgba(255,255,0,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,255,0,0.6)',
                        hoverBorderColor: 'rgba(255,255,0,1)',
                        data: this.state.ONE_TO_FIVE_HOURS
                    });
                    this.state.datasets.push({
                        label: '5 - 8 h.',
                        backgroundColor: 'rgba(0,0,255,0.3)',
                        borderColor: 'rgba(0,0,255,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(0,0,255,0.6)',
                        hoverBorderColor: 'rgba(0,0,255,1)',
                        data: this.state.FIVE_TO_EIGHT_HOURS
                    });
                    this.state.datasets.push({
                        label: '8+ h.',
                        backgroundColor: 'rgba(0,255,0,0.3)',
                        borderColor: 'rgba(0,255,0,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(0,255,0,0.6)',
                        hoverBorderColor: 'rgba(0,255,0,1)',
                        data: this.state.EIGHT_PLUS_HOURS
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

    DwellTimeCount(time) {
        let url = '';
        if (time.range.start && time.range.end) {
            url = `/presence/v1/dwell/count?siteId=${config.siteId}&startDate=${time.range.start}&endDate=${time.range.end}`
        } else {
            time = config.headerInputTimes[time.time];
            url = `/presence/v1/dwell/count/${time}?siteId=${config.siteId}`
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
                    <h5 className='graph-headings'>Dwell Time</h5>
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
                    <h5 className='graph-headings'>Dwell Time Distribution</h5>
                    <Doughnut
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
                                '5 - 30 min.',
                                '30 - 60 min.',
                                '1 - 5 h.',
                                '5 - 8 h.',
                                '8+ h.',
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

export default DwellTime;
