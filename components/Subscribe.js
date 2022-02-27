import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { mainAPI } from '@/plugins/axios'

import Button from '@/components/Button'
import Plans from '@/components/Plans'

import styles from '@/styles/components/Subscribe.module.sass'

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      color: '#000',
      fontFamily: 'Inter, sans-serif',
      fontSize: '18px',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#B3BAC5',
      },
      ':focus::placeholder': {
        color: '#B3BAC5',
      },
    },
    invalid: {
      color: 'red',
      ':focus': {
        color: 'red',
      },
      '::placeholder': {
        color: 'red',
      },
    },
  }
}

const Subscribe = ({ onClose, onDone, me: meProps }) => {
  const dispatch = useDispatch()
  const elements = useElements()
  const stripe = useStripe()

  const checkoutRef = useRef(null)

  const [me, setMe] = useState(meProps)
  const [plan, setPlan] = useState({})
  const [step, setStep] = useState(1)
  const [cardName, setCardName] = useState(null)
  const [cardError, setCardError] = useState(null)
  const [checkoutError, setCheckoutError] = useState(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)


  const handleSelectPlan = (plan) => {
    setPlan(plan)
    setStep(2)
  }

  const createCustomer = async () => {
    const { data: customer } = await mainAPI.post(
      '/subscriptions/customer',
      { 
        data: {
          email: me.email,
          name: `${me.firstName} ${me.lastName}`,
        },
        userId: me._id,
      },
    )
    return customer.id
  }

  const createSubscription = async (e) => {
    e.preventDefault()

    if (!checkoutRef.current.checkValidity()) {
      throw checkoutRef.current.reportValidity()
    }
    try {
      setCheckoutError(null)
      setCheckoutLoading(true)

      if (cardError) {
        elements.getElement(CardElement).focus();
        return;
      }

      const customerId = me.subscription ? me.subscription.stripeCustomer : await createCustomer()

      const { paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
        billing_details: {
          name: cardName,
        }
      });

      const { data: stripeSubscription } = await mainAPI.post('/subscriptions', {
        customerId,
        paymentMethodId: paymentMethod.id,
        priceId: plan.price.id,
        level: plan.metadata.level,
      })

      return handlePaymentThatRequiresCustomerAction({
        paymentMethodId: paymentMethod.id,
        priceId: plan.price.id,
        subscription: stripeSubscription,
      })
    } catch (err) {
      toast.error('An error succeeded during subscription.')
      setCheckoutLoading(false)
    }
  }

  const handlePaymentThatRequiresCustomerAction = async ({
    isRetry,
    invoice,
    paymentMethodId,
    priceId,
    subscription,
  }) => {
    if (subscription && subscription.status === 'active') {
      // Subscription is active, no customer actions required.
      return handleRequiresPaymentMethod({ subscription, priceId, paymentMethodId });
    }
  
    // If it's a first payment attempt, the payment intent is on the subscription latest invoice.
    // If it's a retry, the payment intent will be on the invoice itself.
    let paymentIntent = invoice ? invoice.payment_intent : subscription.latest_invoice.payment_intent;
  
    if (
      paymentIntent.status === 'requires_action' ||
      (isRetry === true && paymentIntent.status === 'requires_payment_method')
    ) {
      try {
        const result = await stripe.confirmCardPayment(paymentIntent.client_secret, {
          payment_method: paymentMethodId,
        })
        if (result.error) {
          // Start code flow to handle updating the payment details.
          // Display error message in your UI.
          // The card was declined (i.e. insufficient funds, card has expired, etc).
          throw result;
        } else {
          if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to your customer.
            ('passed 3d sec')
            return handleRequiresPaymentMethod({
              priceId: priceId,
              subscription: subscription,
              invoice: invoice,
              paymentMethodId: paymentMethodId,
            })
          }
        }
      } catch (err) {
        setCheckoutLoading(false)
        return setCheckoutError(err.error)
      }
    } else {
      // No customer action needed.
      return handleRequiresPaymentMethod({ subscription, priceId, paymentMethodId });
    }
  }

  const handleRequiresPaymentMethod = ({
    subscription,
    paymentMethodId,
    priceId,
  }) => {
    if (subscription.status === 'active') {
      // subscription is active, no customer actions required.
      return onSubscriptionComplete({ subscription, priceId, paymentMethodId });
    } else if (
      subscription.latest_invoice.payment_intent.status ===
      'requires_payment_method'
    ) {
      // Using localStorage to manage the state of the retry here,
      // feel free to replace with what you prefer.
      // Store the latest invoice ID and status.
      localStorage.setItem('latestInvoiceId', subscription.latest_invoice.id)
      localStorage.setItem(
        'latestInvoicePaymentIntentStatus',
        subscription.latest_invoice.payment_intent.status
      );
      return setCheckoutError({ message: 'Your card was declined' })
    } else {
      return onSubscriptionComplete({ subscription, priceId, paymentMethodId })
    }
  }

  const onSubscriptionComplete = async ({ subscription }) => {
    // Payment was successful.
    if (subscription.status === 'active') {
      // Change your UI to show a success message to your customer.
      // Call your backend to grant access to your service based on
      // `result.subscription.items.data[0].price.product` the customer subscribed to.
      await mainAPI.post('/subscriptions/complete', { stripeSubscriptionId: subscription.id })
      
      const { data } = await mainAPI.get('/users/me')
      setMe(data)
      
      setStep(3)
      setCheckoutLoading(false)
    } else {
      let countCheck = 0
      const { data: user } = await mainAPI.get('/users/me')
      const interval = setInterval(async () => {
        if (countCheck >= 50) {
          clearInterval(interval)
          return setCheckoutLoading(false)
        }
        const { data: userSubscription } = await mainAPI.get(`/subscriptions/${user.subscription._id}`)
        if (userSubscription.status === 'active') {
          clearInterval(interval)
      
          const { data } = await mainAPI.get('/users/me')
          setMe(data)

          setStep(3)
          return setCheckoutLoading(false)
        }
        countCheck += 1        
      }, 1000);
    }
  }
  
  return (
    <div className={styles.subscribe}>
      <div
        className={styles.backdrop}
        onClick={() => {
          if (!checkoutLoading) {
            onClose()
            step === 3 && onDone(me)
          }
        }}
      />
      <div className={styles.box}>
        <div className={styles.header}>
          <p className={styles.headerTitle}>Subscribe to FOMO</p>
          <img
            onClick={() => {
              if (!checkoutLoading) {
                onClose()
                step === 3 && onDone(me)
              }
            }}
            src="/assets/common/close.svg"
          />
        </div>
        <div className={styles.steps}>
          <div className={`${styles.step} ${step === 1 ? styles.current : ''} ${step > 1 ? styles.valid : ''}`}>
            <p>Choose your plan</p>
            <div className={styles.stepStatus}>
              <img src="/assets/common/doneWhite.svg" />
            </div>
          </div>
          <div className={`${styles.step} ${step === 2 ? styles.current : ''} ${step > 2 ? styles.valid : ''}`}>
            <p>Payment details</p>
            <div className={styles.stepStatus}>
              <img src="/assets/common/doneWhite.svg" />
            </div>
          </div>
          <div className={`${styles.step} ${step === 3 ? styles.current : ''}`}>
            <p>Confirmation</p>
            <div className={styles.stepStatus}>
              <img src="/assets/common/doneWhite.svg" />
            </div>
          </div>
        </div>
        <div className={styles.content}>
          { step === 1 && 
            <>
              <p className={styles.stepOneTitle}>Choose a plan</p>
              <Plans
                renderAction={(plan) => (
                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    //outline={true}
                  >
                    Try it free
                  </Button>
                )}
              />
            </>
          }
          { step === 2 &&
            <div className={styles.stepTwo}>
              <p className={styles.stepTwoTitles}>Selected plan</p>
              <div className={`${styles.selectedPlan} ${plan.name === 'Business' ? styles.planBusiness : styles.planPro}`}>
                <div className={styles.selectedPlanPrice}>
                  <p className={styles.selectedPlanPriceValue}>${plan.price.unit_amount / 100}</p>
                  <p className={styles.selectedPlanPriceText}>per user/month<br/><span>billed annually</span></p>
                </div>
                <p className={styles.selectedPlanName}>{plan.name} plan</p>
                <Button
                  className={styles.anotherPlan}
                  onClick={() => setStep(step - 1)}
                  outline={true}
                >
                  Select another plan
                </Button>
              </div>
              <p className={styles.stepTwoTitles}>Payment details</p>
              <form
                className={styles.stripeForm}
                ref={checkoutRef}
                onSubmit={createSubscription}
              >
                <div className={styles.cardName}>
                  <label>Name on card</label>
                  <input
                    className={styles.stripeInput}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Ex: John"
                    required
                  />
                </div>
                <div className={styles.cardNumber}>
                  <label>Card number</label>
                  <CardElement
                    className={styles.stripeInput}
                    onChange={(e) => setCardError(e.error)}
                    options={CARD_OPTIONS}
                  />
                </div>
                {cardError && <p className={styles.error}>{cardError.message}</p>}
                {checkoutError && <p className={styles.error}>{checkoutError.message}</p>}
              </form>
            </div>
          }
          {
            step === 3 && 
            <div className={styles.stepThree}>
              <img
                className={styles.stepThreeLogo}
                src="/logo-circle.svg"
              />
              <p className={styles.stepThreeTitle}>Welcome to FOMO</p>
              <p className={styles.stepThreeText}>Your payment has been processed.</p>
              <Button
                onClick={() => {
                  onClose()
                  onDone(me)
                }}
              >
                Back to dashboard
              </Button>
            </div>
          }
        </div>
        { step <= 2 &&
          <div className={styles.footer}>
            <div>
              { step > 1 && 
                <Button
                  onClick={() => {
                    if (!checkoutLoading) {
                      setStep(step - 1)
                    }
                  }}
                  outline={true}
                >
                  Back
                </Button>
              }
            </div>
            <div>
              { step === 2 && 
                <Button
                  loading={checkoutLoading}  
                  onClick={createSubscription}
                >
                  Complete order
                </Button>
              }
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Subscribe
