import Head from 'next/head'  
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import { useStore } from '@/store'

import 'react-toastify/dist/ReactToastify.min.css'
import '@/styles/fonts.css'
import '@/styles/_globals.sass'
import '@/styles/_globals.sass'

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState)
  
  const head = (
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      {/* <link rel="icon" href="/favicon.ico" /> */}
      <meta name="robots" content="noindex, nofollow" />
    </Head>
  )

  return (
    <Provider store={store}>
      <div className="page">
        {head}
        <Component {...pageProps} />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnHover={false}
          draggable={true}
        />
      </div>
    </Provider>
  )
}

export default MyApp
