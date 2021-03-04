import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-c8d97-default-rtdb.firebaseio.com/'
});

export default instance;