import axios from 'axios'
import jscookie from 'js-cookie'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

if (jscookie.get('token')) {
  instance.defaults.headers.common.Authorization = `Bearer ${jscookie.get('token')}`
}

export default instance
