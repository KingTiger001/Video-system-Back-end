import App from 'next/app'
import Head from 'next/head'

import { appWithTranslation } from '../i18n'

import '../styles/_globals.sass'

function MyApp({ Component, pageProps }) {
  const head = (
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet"></link>
      <meta name="robots" content="noindex, nofollow"></meta>
    </Head>
  )

  return (
    <div>
      {head}
      <Component {...pageProps} />
    </div>
  )
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)
  return { ...appProps }
}

export default appWithTranslation(MyApp)
