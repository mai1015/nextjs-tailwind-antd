import '../styles/globals.css'
import type { AppProps } from 'next/app'

import setupAxiosInterceptors from "~/config/axios-interceptor";
import {useUser} from "~/store/user";
setupAxiosInterceptors(() => {
  useUser.getState().logout()
})

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
