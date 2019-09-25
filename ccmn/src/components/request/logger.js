import axios from 'axios';

export default {
    setLogg(data) {
        return axios.post(`/set-log`, data);
    }
}
