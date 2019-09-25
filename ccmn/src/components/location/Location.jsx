import React, { Component } from 'react';
import api from '../request/cmx.js';
import { Button, Icon, Modal,Row, Input } from 'react-materialize';
import './Location.css';
import moment from 'moment';
import logger from '../request/logger.js';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class Location extends Component {
    constructor(props) {
        super(props);
        this.state = {
            floors:[],
            img: [
                {
                    img: ''
                },
                {
                    img: ''
                },
                {
                    img: ''
                }
            ],
            showImg: '',
            img_w:'',
            img_h:'',
            userFloor1:[],
            userFloor2:[],
            userFloor3:[],
            currentFloor:[],
            allFloorsGet: [false, false, false],
            usersData: null,
            interval:null,
            whatFloor:1,
            appUser: document.querySelector('meta[name="user-ip"]').content || false,
            searchUser: ''
        };
    }

    componentDidMount(){
        this.getMap();
        setInterval(this.checkNewUser.bind(this) , 10000);
    }

    checkNewUser(){
       if (this.state.currentFloor.length > 0){
           let users = this.state.userFloor1.concat(this.state.userFloor2, this.state.userFloor3);
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
                       switch (parseInt(this.state.whatFloor, 10)) {
                           case 1:
                               this.setState({usersData: this.addUsersToMap(this.state.userFloor1)});
                               break;
                           case 2:
                               this.setState({usersData: this.addUsersToMap(this.state.userFloor2)});
                               break;
                           case 3:
                               this.setState({usersData: this.addUsersToMap(this.state.userFloor3)});
                               break;
                           default:
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
    }

    getMap() {
        api.getInitialData(`/config/v1/maps`, '')
            .then((response) => {
                if (response.status === 200) {
                    response.data.campuses.forEach((el) =>  {
                        if (el.buildingList.length > 0) {
                            this.setState({floors: el.buildingList[0].floorList});
                            this.getFloorData(el.buildingList[0].floorList);
                        }
                    });
                } else {
                    logger.setLogg({ text: `/config/v1/maps FAULT WITH STATUS CODE ${response.status}` });
                }
            })
            .catch((error) => {
                logger.setLogg({ text: `/config/v1/maps FAULT WITH ERROR ${error}` });
            });
    }

    getFloorData(floors) {
        let img = [];
        let allFloorsGetChecker = [false, false, false];

        floors.forEach((el, index) => {
            api.getInitialData(`/config/v1/maps/imagesource/${el.image.imageName}`, 'arraybuffer')
                .then((response) => {
                    if (response.status === 200) {
                        let imageType = response.headers['content-type'];
                        let base64 = new Buffer(response.data).toString('base64');
                        let dataURI = 'data:' + imageType + ';base64,' + base64;

                        img.push({
                            img: dataURI,
                            img_w: el.image.width ,
                            img_h: el.image.height ,
                            floor: el.floorNumber
                        });
                        allFloorsGetChecker[index] = true;
                        if (img.length === floors.length) {
                            let imgData = {
                                showImg: '',
                                img_w: '',
                                img_h: ''
                            }
                            img.forEach((val) => {
                                if (val.floor === 1) {
                                    imgData.showImg = val.img;
                                    imgData.img_w = val.img_w ;
                                    imgData.img_h = val.img_h ;
                                }
                            });
                            this.setState({
                                showImg: imgData.showImg,
                                img_w: imgData.img_w,
                                img_h: imgData.img_h,
                                img: img,
                                allFloorsGet: allFloorsGetChecker
                            })
                        }
                        this.getUsers();
                    } else {
                        logger.setLogg({ text: `/config/v1/maps/imagesource/${el.image.imageName} FAULT WITH STATUS CODE ${response.status}` });
                    }
                })
                .catch((error) => {
                    logger.setLogg({ text: `/config/v1/maps/imagesource/${el.image.imageName} FAULT WITH ERROR ${error}` });
                });
        });
    }

    getUsers() {
        if (!this.state.allFloorsGet.includes(false)) {
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
                                    usersData: this.addUsersToMap(floor1)
                                });
                                break;
                            case 2:
                                this.setState({
                                    currentFloor: floor2,
                                    usersData: this.addUsersToMap(floor2)
                                });
                                break;
                            case 3:
                                this.setState({
                                    currentFloor: floor3,
                                    usersData: this.addUsersToMap(floor3)
                                });
                                break;
                            default:
                                console.error('No such floor 2');
                                break;
                        }
                        this.setState({
                            userFloor1: floor1,
                            userFloor2: floor2,
                            userFloor3: floor3,
                        });
                    } else {
                        logger.setLogg({ text: `/location/v2/clients FAULT WITH STATUS CODE ${response.status}` });
                    }
                })
                .catch((error) => {
                    logger.setLogg({ text: `/location/v2/clients FAULT WITH ERROR ${error}` });
                });
        }
    }

    addUsersToMap(users) {
        return (
            users.map((el, index) => {
                let classes = '';
                if (el.ipAddress) {
                    if (el.ipAddress[0] && el.ipAddress[0] === this.state.appUser && this.state.appUser !== '') {
                        classes = 'current-user';
                    }
                }
                let newX = ((this.state.img_w / 2) * el.mapCoordinate.x) / el.mapInfo.floorDimension.width;
                let newY = ((this.state.img_h /2) * el.mapCoordinate.y) / el.mapInfo.floorDimension.length;
                return (
                    <Modal
                        key={`user_list_item${index}`}
                        header='User info'
                        fixedFooter
                        trigger={
                            <span
                                key={`user_icon${index}`}
                                className={`user-icon ${classes}`}
                                id={'id-' + el.macAddress.split(':').join('')}
                                data-id={index}
                                style={{ left: newX, bottom: newY }}>
                                { classes !== '' ? <Icon small>face</Icon> : <Icon tiny>face</Icon>}
                            </span>
                        }
                        >
                        <div>
                            <p><strong>apMacAddress : {el.apMacAddress ? el.apMacAddress : 'no info'}</strong></p>
                            <p><strong>Bytes Received : {el.bytesReceived ? el.bytesReceived : 'no info'}</strong></p>
                            <p><strong>Bytes Sent : {el.bytesSent ? el.bytesSent : 'no info'}</strong></p>
                            <p><strong>Currently Tracked : {el.currentlyTracked ? el.currentlyTracked : 'no info'}</strong></p>
                            <p><strong>Detecting Controllers : {el.detectingControllers ? el.detectingControllers: 'no info'}</strong></p>
                            <p><strong>Guest User : {el.guestUser ? el.guestUser: 'no info'}</strong></p>
                            <p><strong>Ip Address : {el.ipAddress ? el.ipAddress[0] : 'no info' }</strong></p>
                            <p><strong>Mac Address : {el.macAddress ? el.macAddress : 'no info'}</strong></p>
                            <p><strong>Network Status : {el.networkStatus ? el.networkStatus : 'no info'}</strong></p>
                            <p><strong>ssid : {el.ssId ? el.ssId : 'no info'}</strong></p>
                            <p><strong>Current Server Time : {moment(el.statistics.currentServerTime).format('YYYY-MM-DD HH:MM')}</strong></p>
                            <p><strong>First Located Time : {moment(el.statistics.firstLocatedTime).format('YYYY-MM-DD HH:MM')}</strong></p>
                            <p><strong>Last Located Time : {moment(el.statistics.lastLocatedTime).format('YYYY-MM-DD HH:MM')}</strong></p>
                        </div>
                    </Modal>
                )
            })
        );
    }

    changeFloor(event) {
        let imgData = {
            showImg: '',
            img_w: '',
            img_h: ''
        }
        this.state.img.forEach((val) => {
            if (val.floor === parseInt(event.target.dataset.floor, 10)) {
                imgData.showImg = val.img;
                imgData.img_w = val.img_w;
                imgData.img_h = val.img_h ;
            }
        });
        switch (parseInt(event.target.dataset.floor, 10)) {
            case 1:
                this.setState({
                    currentFloor: this.state.userFloor1,
                    whatFloor: 1,
                    usersData: this.addUsersToMap(this.state.userFloor1),
                    showImg: imgData.showImg,
                    img_w: imgData.img_w,
                    img_h: imgData.img_h
                });
                break;
            case 2:
                this.setState({
                    currentFloor: this.state.userFloor2,
                    whatFloor: 2,
                    usersData: this.addUsersToMap(this.state.userFloor2),
                    showImg: imgData.showImg,
                    img_w: imgData.img_w,
                    img_h: imgData.img_h
                });
                break;
            case 3:
                this.setState({
                    currentFloor: this.state.userFloor3,
                    whatFloor: 3,
                    usersData: this.addUsersToMap(this.state.userFloor3),
                    showImg: imgData.showImg,
                    img_w: imgData.img_w,
                    img_h: imgData.img_h
                });
                break;
            default:
                this.setState({
                    showImg: imgData.showImg,
                    img_w: imgData.img_w,
                    img_h: imgData.img_h
                });
                console.error('No such floor');
                break;
        }
    }

    handleChange(event) {
        this.setState({searchUser: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        let user = document.querySelectorAll(`.user-icon`);
        let userIcon = document.querySelectorAll(`.user-icon i`);
        console.log(userIcon[0].classList.value.split(' '))
        for (let i = 0; i < user.length; i++) {
            user[i].classList.remove('search-user');
        }
        for (let i = 0; i < userIcon.length; i++) {
            if (!userIcon[i].classList.value.split(' ').includes('current-user')) {
                userIcon[i].classList.remove('small');
                userIcon[i].classList.add('tiny');
            }
        }
        let users = [...this.state.userFloor1, ...this.state.userFloor2, ...this.state.userFloor3];
        users.forEach((el) => {
           if (el.macAddress === this.state.searchUser){
               if (document.querySelector(`#id-${el.macAddress.split(':').join('')}`)) {
                   document.querySelector(`#id-${el.macAddress.split(':').join('')}`).classList.add('search-user');
               }
               let currentUserIcon = document.querySelector(`#id-${el.macAddress.split(':').join('')} i`);
               if (currentUserIcon) {
                   currentUserIcon.classList.remove('tiny');
                   currentUserIcon.classList.add('small');
               }
           }
        });
    }

    render() {
        return (
            <div className="Location main-wrapper-ccmn">
                <NotificationContainer/>
                <div>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <Row className='search-wrapper'>
                            <Input s={6} label="Mac Address" onChange={this.handleChange.bind(this)} value={this.state.searchUser} validate placeholder="Enter Mac Address" />
                            <div className='ccmn-btn-wrapper'>
                                <Button type="submit">Search</Button>
                            </div>
                        </Row>
                    </form>
                </div>
                <div className='ccmn-btn-wrapper'>
                    <Button onClick={this.changeFloor.bind(this)} data-floor='1' waves='light'>1 Floor</Button>
                    <Button onClick={this.changeFloor.bind(this)} data-floor='2' waves='light'>2 Floor</Button>
                    <Button onClick={this.changeFloor.bind(this)} data-floor='3' waves='light'>3 Floor</Button>
                </div>
                <div className="setmap">
                    <div className="map"  style={{ width:this.state.img_w / 2, height:this.state.img_h /2 }}>
                        {this.state.usersData}
                        <img src={this.state.showImg} width={this.state.img_w / 2 } height={this.state.img_h /2 }  alt=""/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Location;
