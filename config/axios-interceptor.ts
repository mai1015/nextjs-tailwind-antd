import type { AxiosResponse, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { processError } from '~/utils'

const TIMEOUT = 1 * 60 * 1000
axios.defaults.timeout = TIMEOUT
axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_API_URL

const setupAxiosInterceptors = (onUnauthenticated: () => void) => {
    const onRequestSuccess = (config: AxiosRequestConfig) => {
        const token = localStorage.getItem('authenticationToken') || ''
        if (token) {
            // @ts-ignore
            config.headers.Authorization = `Bearer ${token}`
            // } else {
            //   config.headers.Authorization = `Bearer test!!!`
        }
        return config
    }
    const onResponseSuccess = (response: AxiosResponse) => {
        if (response.data.code !== 0) {
            console.log('err', response.data)
            return Promise.reject(response.data.message)
        }
        return Promise.resolve(response)
    }
    const onResponseError = (err: any) => {
        console.log(err)
        const status = err.status || (err.response ? err.response.status : 0)
        if (status === 403 || status === 401) {
            onUnauthenticated()
        }
        return Promise.reject(processError(err))
    }
    axios.interceptors.request.use(onRequestSuccess)
    axios.interceptors.response.use(onResponseSuccess, onResponseError)
}

export default setupAxiosInterceptors
