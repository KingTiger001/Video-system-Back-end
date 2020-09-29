import axios from 'axios'
import jscookie from 'js-cookie'

const instance = axios.create({
  baseURL: 'http://localhost:7030/v1',
  // baseURL: process.env.API_URL,
})

if (jscookie.get('token')) {
  instance.defaults.headers.common.Authorization = `Bearer ${jscookie.get('token')}`
}

export default instance
