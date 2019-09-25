import React, { Component } from 'react';
import api from '../request/presence.js';
import logger from '../request/logger.js';
import config from '../../config/config.json';
import { Row, Col } from 'react-materialize';
import { Bar } from 'react-chartjs-2';

class HourlyConnectedVisitors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datasets:[],
            labels:[],
            count_dataset:[],
            data: false,
            dataCount:[false],
            barDone: false,
        };
    }

    componentDidMount() {
        this.HourlyConnected();
    }

    HourlyConnected(){
        api.getInitialData(`/presence/v1/connected/hourly/today?siteId=${config.siteId}`)
            .then((response) => {
                if (response.status === 200) {
                    let dataset = [];
                    dataset.push({
                        label: 'Connected Visitors',
                        backgroundColor: 'rgba(0,255,255,0.3)',
                        borderColor: 'rgba(0,255,255,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(0,255,255,0.6)',
                        hoverBorderColor: 'rgba(0,255,255,1)',
                        data: Object.values(response.data)
                    });
                    this.setState({
                        data: true,
                        labels: Object.keys(response.data),
                        datasets: dataset
                    });
                } else {
                    logger.setLogg({ text: `/presence/v1/connected/hourly/today?siteId=${config.siteId} FAULT WITH STATUS CODE ${response.status}` });
                }
            })
            .catch((error) => {
                logger.setLogg({ text: `/presence/v1/connected/hourly/today?siteId=${config.siteId} FAULT WITH ERROR ${error}` });
            });
    }

    renderBarChart() {
        if (this.state.data) {
            return (
                <Bar
                    data={{labels: this.state.labels, datasets:this.state.datasets}}
                    height={100}
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
            )
        }
    }

    render() {
        return (
            <Row className='chart-wrapper'>
                <Col s={12} m={10} className='bar-chart'>
                    <h5 className='graph-headings'>Hourly Connected Visitors</h5>
                    { this.renderBarChart() }
                </Col>
            </Row>
        );
    }
}

export default HourlyConnectedVisitors;
