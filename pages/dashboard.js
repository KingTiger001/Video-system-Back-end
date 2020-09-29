import jscookie from 'js-cookie'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import withAuth from '../hocs/withAuth'
import withAuthServerSideProps from '../hocs/withAuthServerSideProps'

import Button from '../components/Button'

const Dashboard = ({ user }) => {
  const router = useRouter()

  const logout = () => {
    router.push('/login')
    jscookie.remove('token')
  }

  return (
    <div className="dashboard">
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
        onClick={logout}
      >
        Log out
      </Button>
    </div>
  )
}

export default withAuth(Dashboard)
export const getServerSideProps = withAuthServerSideProps()