import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AccountLayout from '@/layouts/AccountLayout'
import AppLayout from '@/layouts/AppLayout'

import { mainAPI } from '@/plugins/axios'
import dayjs from '@/plugins/dayjs'

import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import Button from '@/components/Button'

import layoutStyles from '@/styles/layouts/App.module.sass'
import styles from '@/styles/pages/app/billing.module.sass'
import PopupUnsubscribe from '@/components/Popups/PopupUnsubscribe'

const Billing = ({ products, me: meProps }) => {
  const dispatch = useDispatch()

  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })
  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })
  const popup = useSelector(state => state.popup)

  const [plan, setPlan] = useState(null)
  const [me, setMe] = useState(meProps)


  const getMe = async () => {
    const { data } = await mainAPI.get('/users/me')
    setMe(data)
  }

  useEffect(() => {
    setPlan(products.find(product => product.price.id === me.subscription.stripePrice))
  }, [])

  return (
    <AppLayout>
      <Head>
        <title>Account | FOMO</title>
      </Head>

      <AccountLayout>
        { popup.display === 'UNSUBSCRIBE' &&
          <PopupUnsubscribe
            onDone={() => {
              getMe()
              hidePopup()
            }}
          />
        }

        <div className={layoutStyles.header}>
          <div className={layoutStyles.headerTop}>
            <h1 className={layoutStyles.headerTitle}>Billing</h1>
          </div>
          <div className={layoutStyles.headerBottom} />
        </div>
        <div>
          { plan && 
            <div className={`${styles.selectedPlan} ${plan.name === 'Business' ? styles.planBusiness : styles.planPro}`}>
              <div className={styles.selectedPlanPrice}>
                <p className={styles.selectedPlanPriceValue}>${plan.price.unit_amount / 100}</p>
                <p className={styles.selectedPlanPriceText}>per user/month<br/><span>billed annually</span></p>
              </div>
              <p className={styles.selectedPlanName}>{plan.name} plan</p>
              { me.subscription && !me.subscription.cancelAt &&
                <Button
                  className={styles.anotherPlan}
                  onClick={() => showPopup({
                    display: 'UNSUBSCRIBE',
                  })}
                  outline={true}
                >
                  Unsubscribe
                </Button>
              }
              { me.subscription && me.subscription.cancelAt &&
                <p className={styles.cancelAt}>End of subscription: <br />{dayjs(me.subscription.cancelAt * 1000).format('MM/DD/YYYY')}</p>
              }
            </div>
          }
        </div>
      </AccountLayout>
    </AppLayout>
  )
};

export default Billing
export const getServerSideProps = withAuthServerSideProps(async () => {
  const { data: products } = await mainAPI.get('/subscriptions/products')
  const { data: prices } = await mainAPI.get('/subscriptions/prices')
  const productsOrdered = products.data
    .map((product) => ({
      ...product,
      price: prices.data.find(price => price.product === product.id),
    }))  
    .sort((a, b) => (a.metadata.order > b.metadata.order) ? 1 : -1)

  return {
    products: productsOrdered
  }
})