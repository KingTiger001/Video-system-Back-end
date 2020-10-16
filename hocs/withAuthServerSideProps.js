// import { CURRENT_USER } from '../operations/queries/users'
// import { initializeApollo } from '../config/apollo/client'
import cookie from 'cookie'
import jwtDecode from 'jwt-decode'

import axios from '../plugins/axios'

const withAuthServerSideProps = (serverSidePropsFunc) => {
  return async (ctx) => {
    const cookies = cookie.parse(ctx.req.headers.cookie || '')
    if (cookies.token) {
      // TODO: check expiration token
      // console.log(jwtDecode(cookies.token))
      axios.defaults.headers.common.Authorization = `Bearer ${cookies.token}`
      try {
        let user
        const { data } = await axios.get('/users/me')
        user = data
        if ((!user.firstName || !user.lastName) && !ctx.req.url.includes('details')) {
          ctx.res.writeHead(302, { Location: '/signup/details' });
          return ctx.res.end()
        }
        if (serverSidePropsFunc) {
          const otherProps = await serverSidePropsFunc(ctx, user)
          return {
            props: {
              ...(user && { user }),
              ...otherProps,
            },
          }
        }
        return {
          props: {
            ...(user && { user }),
          },
        }
      } catch (err) {
        ctx.res.writeHead(302, { Location: '/' });
        ctx.res.end()
      }
    } else if (!ctx.req.url.includes('login') && !ctx.req.url.includes('signup')) {
      ctx.res.writeHead(302, { Location: '/' });
      return ctx.res.end()
    } else {
      return { props: {} };
    }
  }
}

export default withAuthServerSideProps