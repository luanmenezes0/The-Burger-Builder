import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-my-burger-ea1e4.firebaseio.com/'
})

export default instance;