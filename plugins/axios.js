import axios from 'axios'
import jscookie from 'js-cookie'

const mainAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
})
const videosAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_VIDEOS_API,
})

if (jscookie.get('token')) {
  mainAPI.defaults.headers.common.Authorization = `Bearer ${jscookie.get('token')}`
}

export { mainAPI, videosAPI }
