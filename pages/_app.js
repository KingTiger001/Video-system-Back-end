import Head from 'next/head'  
import { Provider } from 'react-redux'

import { useStore } from '../store'

import '../styles/fonts.css'
import '../styles/_globals.sass'
import '../styles/_globals.sass'

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState)
  
  const head = (
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      {/* <link rel="icon" href="/favicon.ico" /> */}
      <meta name="robots" content="noindex, nofollow" />
    </Head>
  )

  return (
    <Provider store={store}>
      <div className="page">
        {head}
        <Component {...pageProps} />
      </div>
    </Provider>
  )
}

export default MyApp
