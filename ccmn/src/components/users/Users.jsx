import React, { Component } from 'react';
import api from '../request/cmx.js';
import { Button, Collection, CollectionItem, Modal, Row, Input } from 'react-materialize';
import './Users.css';
import moment from 'moment';
import logger from '../request/logger.js';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userFloor1:[],
            userFloor2:[],
            userFloor3:[],
            currentFloor: [],
            search_user:'',
            interval:null,
            whatFloor:1
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        this.getUsers();
        setInterval(this.checkNewUser.bind(this) , 10000);
    }

    checkNewUser() {
        if (this.state.currentFloor.length > 0) {
            let users = [...this.state.userFloor1, ...this.state.userFloor2, ...this.state.userFloor3];
            let newUser = [];
            let flag = true;
            api.getInitialData(`/location/v2/clients`, '')
                .then((response) => {
                    if (response.status === 200) {
                        response.data.forEach((el) => {
                            users.forEach((user) => {
                                if (user.macAddress === el.macAddress){
                                    flag = false;
                                }
                            });
                            if (flag){
                                newUser.push(el);
                            } else {
                                flag = true;
                            }
                        });
                        newUser.forEach((el) => {
                            let floor = el.mapInfo.mapHierarchyString.split('>')[2].replace('_', ' ');
                            NotificationManager.info(`New User - ${el.macAddress} in ${floor}`);
                        });
                        this.getUsers();
                    } else {
                        logger.setLogg({ text: `/location/v2/clients FAULT WITH STATUS CODE ${response.status}` });
                    }
                })
                .catch((error) => {
                    logger.setLogg({ text: `/location/v2/clients FAULT WITH ERROR ${error}` });
                });
        }
    }

    getUsers() {
        api.getInitialData(`/location/v2/clients`, '')
            .then((response) => {
                if (response.status === 200) {
                    let floor1 = [];
                    let floor2 = [];
                    let floor3 = [];
                    response.data.forEach((el) => {
                        if (el.mapInfo.mapHierarchyString.indexOf("1st_Floor") !== -1){
                            floor1.push(el);
                        }
                        else if (el.mapInfo.mapHierarchyString.indexOf("2nd_Floor") !== -1){
                            floor2.push(el);
                        }
                        else if (el.mapInfo.mapHierarchyString.indexOf("3rd_Floor") !== -1){
                            floor3.push(el);
                        }
                    });

                    switch (parseInt(this.state.whatFloor, 10)) {
                        case 1:
                            this.setState({
                                currentFloor: floor1,
                                userFloor1: floor1,
                                userFloor2: floor2,
                                userFloor3: floor3
                            });
                            break;
                        case 2:
                            this.setState({
                                currentFloor: floor2,
                                userFloor1: floor1,
                                userFloor2: floor2,
                                userFloor3: floor3
                            });
                            break;
                        case 3:
                            this.setState({
                                currentFloor: floor3,
                                userFloor1: floor1,
                                userFloor2: floor2,
                                userFloor3: floor3
                            });
                            break;
                        default:
                            this.setState({
                                userFloor1: floor1,
                                userFloor2: floor2,
                                userFloor3: floor3
                            });
                            console.error('No such floor 2');
                            break;
                    }
                } else {
                    logger.setLogg({ text: `/location/v2/clients FAULT WITH STATUS CODE ${response.status}` });
                }
            })
            .catch((error) => {
                logger.setLogg({ text: `/location/v2/clients FAULT WITH ERROR ${error}` });
            });
    }

    changeFloor(event) {
        switch (parseInt(event.target.dataset.floor, 10)) {
            case 1:
                this.setState({ currentFloor: this.state.userFloor1, whatFloor:1});
                break;
            case 2:
                this.setState({ currentFloor: this.state.userFloor2, whatFloor:2});
                break;
            case 3:
                this.setState({ currentFloor: this.state.userFloor3, whatFloor:3});
                break;
            default:
                console.error('No such floor');
                break;
        }
    }

    handleChange(event) {
        this.setState({search_user: event.target.value});
    }

    handleSubmit(event) {
        let users = this.state.userFloor1.concat(this.state.userFloor2, this.state.userFloor3);
        let flag = true;
        users.forEach((el) => {
           if (el.macAddress === this.state.search_user){
               this.setState({
                   currentFloor: [el],
               });
               flag = false;
           }
        });
        if (flag){
            this.setState({ currentFloor: this.state.userFloor1 });
        }
        event.preventDefault();
    }

    resetSearch() {
        this.setState({
            currentFloor: this.state.userFloor1,
            search_user: ''
        });
    }

    render() {
        return (
            <div className="Users main-wrapper-ccmn">
                <NotificationContainer/>
                <div>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <Row>
                            <Input s={6} label="Mac Address" onChange={this.handleChange.bind(this)} value={this.state.search_user}  validate placeholder="Enter Mac Address" />
                            <div className='ccmn-btn-wrapper'>
                                <Button type="submit">Search</Button>
                                <Button onClick={this.resetSearch.bind(this)} >Reset</Button>
                            </div>
                        </Row>
                    </form>
                </div>
                <div className='ccmn-btn-wrapper'>
                    <Button onClick={this.changeFloor.bind(this)} data-floor='1' waves='light'>1 Floor</Button>
                    <Button onClick={this.changeFloor.bind(this)} data-floor='2' waves='light'>2 Floor</Button>
                    <Button onClick={this.changeFloor.bind(this)} data-floor='3' waves='light'>3 Floor</Button>
                </div>
                <div>
                    <Collection>
                        {
                            this.state.currentFloor.map((val, index) => {
                                return (
                                    <Modal
                                        key={`user_list_item${index}`}
                                        header='User info'
                                        fixedFooter
                                        trigger={
                                            <CollectionItem className='modal-triger' key={`user_list_item_triger${index}`}>
                                                <i className="material-icons">person</i>Mac Address: {val.macAddress}
                                            </CollectionItem>
                                        }
                                        >
                                        <div>
                                            <p><strong>apMacAddress : {val.apMacAddress ? val.apMacAddress : 'no info'}</strong></p>
                                            <p><strong>Bytes Received : {val.bytesReceived ? val.bytesReceived : 'no info'}</strong></p>
                                            <p><strong>Bytes Sent : {val.bytesSent ? val.bytesSent : 'no info'}</strong></p>
                                            <p><strong>Currently Tracked : {val.currentlyTracked ? val.currentlyTracked : 'no info'}</strong></p>
                                            <p><strong>Detecting Controllers : {val.detectingControllers ? val.detectingControllers: 'no info'}</strong></p>
                                            <p><strong>Guest User : {val.guestUser ? val.guestUser: 'no info'}</strong></p>
                                            <p><strong>Ip Address : {val.ipAddress ? val.ipAddress[0] : 'no info' }</strong></p>
                                            <p><strong>Mac Address : {val.macAddress ? val.macAddress : 'no info'}</strong></p>
                                            <p><strong>Network Status : {val.networkStatus ? val.networkStatus : 'no info'}</strong></p>
                                            <p><strong>ssid : {val.ssId ? val.ssId : 'no info'}</strong></p>
                                            <p><strong>Current Server Time : {moment(val.statistics.currentServerTime).format('YYYY-MM-DD HH:MM')}</strong></p>
                                            <p><strong>First Located Time : {moment(val.statistics.firstLocatedTime).format('YYYY-MM-DD HH:MM')}</strong></p>
                                            <p><strong>Last Located Time : {moment(val.statistics.lastLocatedTime).format('YYYY-MM-DD HH:MM')}</strong></p>
                                        </div>
                                    </Modal>
                                )
                            })
                        }
                    </Collection>
                </div>
            </div>
        );
    }
}

export default Users;
