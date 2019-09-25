import React, { Component } from 'react';
import config from '../../config/config';
import logger from '../request/logger.js';
import api from '../request/presence.js';
import predict from 'predict';
import { Row, Col, CardPanel } from 'react-materialize';

class HeaderInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalVisitors: 0,
            averageDwellTime: 0,
            peakHour: '? - ?',
            conversionRate: 0,
            topDeviceMaker: '?',
            tomorrowVisitors: '',
            tomorrowPasserby: '',
            tomorrowConnected: ''
        };
    }

    getAverageVal(data) {
        const start = 0.01;
        const array = Object.keys(data).map(key => data[key]);
        const end = start * (array.length + 1);
        const lr = predict.linearRegression(array, this.range(start, end, start));

        return Math.round(lr.predict(start + end));
    }

    range(start, stop, step = 1) {
        return (Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step));
    }

    componentWillReceiveProps(nextProps) {
        this.getData(nextProps.time);
    }

    componentDidMount() {
        this.getData(this.props.time);
    }

    getData(time) {
        let url = '';
        let peak = false;
        if (time.range.start && time.range.end) {
            url = `/presence/v1/kpisummary?siteId=${config.siteId}&startDate=${time.range.start}&endDate=${time.range.end}`
        } else {
            peak = true;
            time = config.headerInputTimes[time.time];
            url = `/presence/v1/kpisummary/${time}?siteId=${config.siteId}`
        }
        api.getInitialData(url)
            .then((response) => {
                if (response.status === 200) {
                    let peakHour = '';
                    if (peak) {
                        peakHour = `${response.data.peakSummary.peakHour}:00 - ${response.data.peakSummary.peakHour + 1}:00`;
                    } else {
                        peakHour = `${response.data.peakMonthSummary.peakHour}:00 - ${response.data.peakMonthSummary.peakHour + 1}:00`;
                    }
                    this.setState({
                        totalVisitors: response.data.visitorCount,
                        averageDwellTime: Math.round(response.data.averageDwell),
                        peakHour: peakHour,
                        conversionRate: response.data.conversionRate,
                        topDeviceMaker: response.data.topManufacturers.name
                    });
                } else {
                    logger.setLogg({ text: `${url} FAULT WITH STATUS CODE ${response.status}` });
                }
            })
            .catch((error) => {
                logger.setLogg({ text: `${url} FAULT WITH ERROR ${error}` });
            });
        api.getInitialData(`/presence/v1/visitor/daily/lastweek?siteId=${config.siteId}`)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({ tomorrowVisitors: this.getAverageVal(response.data) })
                } else {
                    logger.setLogg({ text: `presence/v1/visitor/daily/lastweek?siteId=${config.siteId} FAULT WITH STATUS CODE ${response.status}` });
                }
            })
            .catch((error) => {
                logger.setLogg({ text: `presence/v1/visitor/daily/lastweek?siteId=${config.siteId} FAULT WITH ERROR ${error}` });
            });
        api.getInitialData(`/presence/v1/passerby/daily/lastweek?siteId=${config.siteId}`)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({tomorrowPasserby: this.getAverageVal(response.data) })
                } else {
                    logger.setLogg({ text: `/presence/v1/passerby/daily/lastweek?siteId=${config.siteId} FAULT WITH STATUS CODE ${response.status}` });
                }
            })
            .catch((error) => {
                logger.setLogg({ text: `/presence/v1/passerby/daily/lastweek?siteId=${config.siteId} FAULT WITH ERROR ${error}` });
            });
        api.getInitialData(`/presence/v1/connected/daily/lastweek?siteId=${config.siteId}`)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({tomorrowConnected: this.getAverageVal(response.data) })
                } else {
                    logger.setLogg({ text: `/presence/v1/connected/daily/lastweek?siteId=${config.siteId} FAULT WITH STATUS CODE ${response.status}` });
                }
            })
            .catch((error) => {
                logger.setLogg({ text: `/presence/v1/connected/daily/lastweek?siteId=${config.siteId} FAULT WITH ERROR ${error}` });
            });
    }

    render() {
        return (
            <Row className='top-info'>
                <Col s={12} m={2}>
                    <CardPanel className='teal lighten-4'>
                        <div className='main-block'>
                            <div className='center'>
                                <p>Total Visitors</p>
                                <span>{this.state.totalVisitors}</span>
                            </div>
                        </div>
                    </CardPanel>
                </Col>
                <Col s={12} m={2}>
                    <CardPanel className='teal lighten-4'>
                        <div className='main-block'>
                            <div className='center'>
                                <p>Average Dwell Time</p>
                                <span>{this.state.averageDwellTime} mins</span>
                            </div>
                        </div>
                    </CardPanel>
                </Col>
                <Col s={12} m={2}>
                    <CardPanel className='teal lighten-4'>
                        <div className='main-block'>
                            <div className='center'>
                            <p>Peak Hour</p>
                            <span>{this.state.peakHour}</span>
                            </div>
                        </div>
                    </CardPanel>
                </Col>
                <Col s={12} m={2}>
                    <CardPanel className='teal lighten-4'>
                        <div className='main-block'>
                            <div className='center'>
                                <p>Conversion Rate</p>
                                <span>{this.state.conversionRate}%</span>
                            </div>
                        </div>
                    </CardPanel>
                </Col>
                <Col s={12} m={2}>
                    <CardPanel className='teal lighten-4' >
                        <div className='main-block'>
                            <div className='center'>
                                <p>Top Device Maker</p>
                                <span>{this.state.topDeviceMaker}</span>
                            </div>
                        </div>
                    </CardPanel>
                </Col>
                <Col s={12} m={2}>
                    <CardPanel className='teal lighten-4'>
                        <div className='main-block'>
                            <div className='center'>
                                <p>Tomorrow</p>
                                <span>Visitors ~ {this.state.tomorrowVisitors}</span><br/>
                                <span>Passerby ~ {this.state.tomorrowConnected}</span><br/>
                                <span>Connected ~ {this.state.tomorrowPasserby}</span>
                            </div>
                        </div>
                    </CardPanel>
                </Col>
            </Row>
        );
    }
}

export default HeaderInput;
