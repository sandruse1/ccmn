import axios from 'axios';

export default {
    returnHeaders(type) {
        return ({
            responseType: `${type}`,
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Basic ${new Buffer('RO:just4reading').toString('base64')}`
            }
        });
    },
    getInitialData(url, type) {
        return axios.get(`https://cisco-cmx.unit.ua/api${url}`,  this.returnHeaders(type));
    }
}
