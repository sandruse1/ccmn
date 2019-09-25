import React, { Component } from 'react';
import { Button, Input } from 'react-materialize'
import HeaderInput from './HeaderInput';
import Proximity from './Proximity';
import DwellTime from './DwellTime';
import RepeatVisitors from './RepeatVisitors';
import HourlyConnectedVisitors from './HourlyConnectedVisitors';
import HourlyPasserbyVisitors from './HourlyPasserbyVisitors';
import moment from 'moment';

class Analitics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                time:'today',
                range: {
                    start:'',
                    end:''
                }
            }
        };
    }

    click(event) {
        this.setState({
            data:{
                time:event.target.dataset.str,
                range: {
                    start:'',
                    end:''
                }
            }
        });
    }

    dateStart(event, value) {
        this.setState({
            data:{
                time: this.state.data.time,
                range: {
                    start: moment(value).format('YYYY-MM-DD'),
                    end: this.state.data.range.start
                }
            }
        });
    }

    dateEnd(event, value) {
        this.setState({
            data:{
                time: this.state.data.time,
                range: {
                    start: this.state.data.range.start,
                    end: moment(value).format('YYYY-MM-DD')
                }
            }
        });
    }
    render() {
        return (
            <div className='main-wrapper-ccmn'>
                <div className='ccmn-btn-wrapper'>
                    <Button onClick={this.click.bind(this)} data-str='today' waves='light'>Today</Button>
                    <Button onClick={this.click.bind(this)} data-str='yesterday' waves='light'>Yesterday</Button>
                    <Button onClick={this.click.bind(this)} data-str='lastweek' waves='light'>Last Week</Button>
                    <Button onClick={this.click.bind(this)} data-str='lastmonth' waves='light'>Last Month</Button>
                </div>
                <div className='ccmn-date-wrapper'>
                    <Input name='on' type='date' onChange={this.dateStart.bind(this)} label='Date from' />
                    <Input name='on' type='date' onChange={this.dateEnd.bind(this)} label='Date to' />
                </div>
                <HeaderInput time={this.state.data} />
                <Proximity time={this.state.data} />
                <DwellTime time={this.state.data} />
                <RepeatVisitors time={this.state.data} />
                <HourlyConnectedVisitors time={this.state.data} />
                <HourlyPasserbyVisitors time={this.state.data} />
            </div>
        );
    }
}

export default Analitics;
