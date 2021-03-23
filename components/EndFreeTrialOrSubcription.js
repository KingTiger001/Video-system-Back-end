import { useEffect, useState } from 'react'

import { mainAPI } from '@/plugins/axios'
import dayjs from '@/plugins/dayjs'

import Subscribe from '@/components/Subscribe'

import styles from '@/styles/components/EndFreeTrialOrSubcription.module.sass'

const EndFreeTrialOrSubcription = () => {
  const [displaySubscribe, showSubscribe] = useState(false)
  const [me, setMe] = useState({})
  
  useEffect(() => {
    async function getMe () {
      const { data } = await mainAPI.get('/users/me')
      setMe(data)
    }
    getMe()
  }, [])

  return dayjs().diff(dayjs(me.createdAt), 'day') > 14 && (!me.subscription || me.subscription.status !== 'active')
    ? (
      <>
        <div className={styles.endFreeTrialOrSubcription}>
          {(!me.subscription || (me.subscription && me.subscription.status === 'pending')) && <p>🙋‍♂️&nbsp; Your trial period has just ended. Continue your experience by subscribing.<span onClick={() => showSubscribe(true)}>Click here</span></p>}
          {me.subscription && me.subscription.status === 'ended' && <p>🙋‍♂️&nbsp; Your subscription has just ended. Continue your experience by renewing it.<span onClick={() => showSubscribe(true)}>Click here</span></p>}
        </div>
        { displaySubscribe &&
          <Subscribe
            onClose={() => showSubscribe(false)}
            onDone={(value) => {
              setMe(value)
            }}
            me={me}
          />
        }
      </>
    )
    : null
}


export default EndFreeTrialOrSubcription