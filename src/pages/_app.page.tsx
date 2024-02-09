import { Header } from '@/components/Header'
import { SelecaoProvider } from '@/context'
import { globalStyles } from '@/styles/global'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Auth from './auth/index.page'
import { useEffect, useState } from 'react'

globalStyles()
export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {

  const [token, setToken] = useState('')

  useEffect(() => {
    const token = sessionStorage.getItem('token')

    if (token) {
      setToken(token)
    }

  }, [])


  return (
    <>
      <Header />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SelecaoProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {token ? <Component {...pageProps} /> : <Auth />}

        </SelecaoProvider>
      </LocalizationProvider>
    </>
  )
}
