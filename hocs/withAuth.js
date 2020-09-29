// import axios from '../plugins/axios'

const withAuth = (Page) => {
  return (props) => {
    // if (!currentUser) {
      // Router.push('/') // or redirect, we can use the Router because we are client side here
    // }
    return <Page {...props}/>
  }
}

export default withAuth