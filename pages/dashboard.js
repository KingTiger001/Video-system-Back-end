import jscookie from 'js-cookie'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import withAuth from '../hocs/withAuth'
import withAuthServerSideProps from '../hocs/withAuthServerSideProps'

import Button from '../components/Button'

import styles from '../styles/pages/dashboard.module.sass'

const Dashboard = ({ user }) => {
  const router = useRouter()

  const logout = () => {
    router.push('/login')
    jscookie.remove('token')
  }

  return (
    <div className={styles.dashboard}>
      <Head>
        <title>Dashboard | FOMO</title>
      </Head>

      <Link href="/">
        <a>
          <img src="/logo.svg" />
        </a>
      </Link>
      <h1>Hello {user.firstName} 👋</h1>
      <Button
        href="/editing"
        type="link"
      >
        Create a video
      </Button>
      <p
        onClick={logout}
      >
        Log out
      </p>
    </div>
  )
}

export default withAuth(Dashboard)
export const getServerSideProps = withAuthServerSideProps()