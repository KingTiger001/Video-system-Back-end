import Head from 'next/head'

import '../styles/fonts.css'
import '../styles/_globals.sass'
import '../styles/_globals.sass'

function MyApp({ Component, pageProps }) {
  const head = (
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      {/* <link rel="icon" href="/favicon.ico" /> */}
      <meta name="robots" content="noindex, nofollow" />
    </Head>
  )

  return (
    <div className="page">
      {head}
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
