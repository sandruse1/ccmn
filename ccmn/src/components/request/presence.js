import axios from 'axios';

export default {
    returnHeaders() {
        return ({
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Basic ${new Buffer('RO:Passw0rd').toString('base64')}`
            }
        });
    },
    getInitialData(url) {
        return axios.get(`https://cisco-presence.unit.ua/api${url}`, this.returnHeaders());
    }
}
