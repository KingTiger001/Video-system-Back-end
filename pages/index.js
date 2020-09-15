import Head from 'next/head'

import { withTranslation } from '../i18n'

import styles from '../styles/pages/index.module.sass'

const Index = ({ t }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <p>Logo</p>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>{t('landing:choke')}</h1>
        <h2>{t('common:h2')}</h2>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

Index.getInitialProps = async () => ({
  namespacesRequired: ['common', 'landing'],
})

export default withTranslation()(Index)