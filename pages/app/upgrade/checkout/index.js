import Head from "next/head";

import withAuth from "@/hocs/withAuth";

import layoutStyles from "@/styles/layouts/App.module.sass";
import styles from "@/styles/components/Subscribe.module.sass";
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {useDispatch} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {mainAPI} from "@/plugins/axios";
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import {countries} from "countries-list";

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


const Checkout = () => {

    const dispatch = useDispatch()
    const router = useRouter();
    const elements = useElements()
    const stripe = useStripe()

    const checkoutRef = useRef(null)

    const [plan, setPlan] = useState({})
    const [step, setStep] = useState(1)
    const [me, setMe] = useState({})
    const [cardError, setCardError] = useState(null)
    const [cardName, setCardName] = useState(null)
    const [checkoutLoading, setCheckoutLoading] = useState(false)
    const [checked, setChecked] = useState(false)
    const [checkoutError, setCheckoutError] = useState(null)
    const [country, setCountry] = useState('')
    const orderedCountries = Object.values(countries).sort((a, b) => a.name.localeCompare(b.name))
    const priceYear = 'price_1KXmidGGTGLaoBgea9iKq7gi';
    const priceMonth = 'price_1KXmiIGGTGLaoBgezGTWU9pG';
    const [priceId, setPriceId] = useState(priceMonth);

    const handleSelectPlan = (plan) => {
        setPlan(plan)
        setStep(2)
    }

    useEffect(() => {
        async function getProducts() {
            const {data: products} = await mainAPI.get("/subscriptions/products");
            const {data: prices} = await mainAPI.get("/subscriptions/prices");
            const productsOrdered = products.data
                .map((product) => ({
                    ...product,
                    price: prices.data.find((price) => price.product === product.id),
                }))
                .sort((a, b) => (a.metadata.order > b.metadata.order ? 1 : -1));

            const businessPlan = productsOrdered.find(prod => prod.name === "Business");

            if (businessPlan) {
                setPlan(businessPlan);
            }
        }

        getProducts();
    }, []);

    useEffect(() => {
        async function getMe() {
            const {data} = await mainAPI.get('/users/me')
            setMe(data)
        }

        getMe()
    }, [])

    const createCustomer = async () => {
        const {data: customer} = await mainAPI.post(
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

            const {paymentMethod} = await stripe.createPaymentMethod({
                type: "card",
                card: elements.getElement(CardElement),
                billing_details: {
                    name: cardName,
                }
            });

            const {data: stripeSubscription} = await mainAPI.post('/subscriptions', {
                customerId,
                paymentMethodId: paymentMethod.id,
                priceId: price === 30 ? priceMonth : priceYear,
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
            return handleRequiresPaymentMethod({subscription, priceId, paymentMethodId});
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
            return handleRequiresPaymentMethod({subscription, priceId, paymentMethodId});
        }
    }

    const handleRequiresPaymentMethod = ({
                                             subscription,
                                             paymentMethodId,
                                             priceId,
                                         }) => {
        if (subscription.status === 'active') {
            // subscription is active, no customer actions required.
            return onSubscriptionComplete({subscription, priceId, paymentMethodId});
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
            return setCheckoutError({message: 'Your card was declined'})
        } else {
            return onSubscriptionComplete({subscription, priceId, paymentMethodId})
        }
    }

    const onSubscriptionComplete = async ({subscription}) => {
        // Payment was successful.
        if (subscription.status === 'active') {
            // Change your UI to show a success message to your customer.
            // Call your backend to grant access to your service based on
            // `result.subscription.items.data[0].price.product` the customer subscribed to.
            await mainAPI.post('/subscriptions/complete', {stripeSubscriptionId: subscription.id})

            const {data} = await mainAPI.get('/users/me')
            setMe(data)
            setCheckoutLoading(false)
            //toast.success('Your subscription has been created successfully.')
            router.push('/app/upgrade/success');
        } else {
            let countCheck = 0
            const {data: user} = await mainAPI.get('/users/me')
            const interval = setInterval(async () => {
                if (countCheck >= 50) {
                    clearInterval(interval)
                    return setCheckoutLoading(false)
                }
                const {data: userSubscription} = await mainAPI.get(`/subscriptions/${user.subscription._id}`)
                if (userSubscription.status === 'active') {
                    clearInterval(interval)

                    const {data} = await mainAPI.get('/users/me')
                    setMe(data)

                    setStep(3)
                    toast.success('Your subscription has been created successfully.')
                    router.push('/app/billing');
                    setCheckoutLoading(false)
                }
                countCheck += 1
            }, 1000);
        }
    }

    const [price, setPrice] = useState(30);

    return (
        <div style={{
            padding: '21px 39px'
        }}>
            <Head>
                <title>Checkout | SEEMEE</title>
            </Head>

            <div style={{
                display: 'flex',
                marginLeft: '10px',
                alignItems: 'center',
                gap: '110px',
                marginBottom: '68px',
            }}>
                <img src='/assets/common/dashboard-orange.png' width='48.4px' height='27.4px'/>
                <h2 style={{
                    fontSize: '26px',
                    color: '#4C4A60'
                }}>Upgrade to SEEMEE Business</h2>
            </div>

            <div className={layoutStyles.container}>

                <form
                    ref={checkoutRef}
                    style={{
                        width: '474px',
                        display: "flex",
                        podding: '10px 0px',
                        flexDirection: "column",
                        gap: '20px',
                    }}
                    onSubmit={createSubscription}
                >
                    <div style={{
                        position: "absolute",
                        right: '150px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '30px',
                            width: '30vw',
                            background: '#F4F7F9',
                            borderRadius: '3px',
                            padding: '29px 10px',
                        }}>

                            {
                                price === 288 &&
                                <div style={{
                                    color: '#5D7183',
                                }}>
                                    <p style={{
                                        marginBottom: '3px',
                                    }}>$30 x 12 months x 1 user ..................................................  $360.00</p>
                                    <p>20% billed annually .........................................................  - $72.00</p>
                                </div>
                            }
                            {
                                price === 30 &&
                                <p style={{
                                    color: '#5D7183',
                                }}>
                                    <p>$30 x 1 month x 1 user .....................................................   $30.00</p>
                                </p>
                            }


                            <h2 style={{
                                color: '#4C4A60',
                                letterSpacing: '1px'
                            }}>${price}.00</h2>

                            <div style={{
                                color: '#5D7183',
                                fontSize: '11px',
                            }}>
                                {
                                    price === 288 &&
                                    <>
                                        <p>12 months subscription</p>
                                        <p style={{marginTop: '8px'}}>Pricing is in USD, plus applicable taxes</p>
                                    </>
                                }
                                {
                                    price === 30 &&
                                    <>
                                        <p>Pricing is in USD, plus applicable taxes</p>
                                        <p style={{marginTop: '8px'}}>Each month you will be charged $30/mo per user until you cancel your subscription</p>
                                    </>
                                }
                            </div>
                        </div>
                        <br/>
                        <br/><br/><br/>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px'
                        }}>
                            <input
                                required
                                type="checkbox"
                                onChange={(val) => setChecked(val.target.checked)}/>
                            <p style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                fontSize: '12px'
                            }}>I accept the <a href='https://www.seemee.io/terms-conditions/' target='_blank' style={{
                                color: '#5B5FEE',
                            }}> &nbsp;Terms & Conditions</a>
                            </p>
                        </div>
                        <br/>
                        {
                            !checkoutLoading &&
                            <input type='submit' value='Submit' style={{
                                height: '34px',
                                width: '202px',
                                border: '1px solid #eee',
                                background: checked ? '#5B5FEE' : '#525E7F',
                                color: 'white',
                                borderRadius: '5px',
                                cursor: 'pointer'

                            }}/>
                        }

                        {checkoutLoading && <img src="/assets/socials/spinner.gif" alt="spinner" width='30px' height='30px'/>}
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        marginBottom: '42px',
                        width: '30vw',
                    }}>
                    <span style={{
                        color: '#203B54',
                    }}>
                        <input type="radio" name='subs' onChange={() => setPrice(288)} value='year'/> Billed annually (save 20%)
                    </span>
                        <span>
                        <input defaultChecked type="radio" name='subs' onChange={() => setPrice(30)} value='month'/> Billed monthly
                    </span>
                    </div>

                    <p style={{
                        color: '#53687C',
                        fontSize: '20px',
                        fontWeight: 600
                    }}>Payment information</p>

                    <div className={styles.cardNumber}>
                        <p style={{
                            color: '#2D475E',
                            padding: '10px 0'
                        }}>Card number</p>
                        <CardElement
                            className={styles.stripeInput}
                            onChange={(e) => setCardError(e.error)}
                            options={CARD_OPTIONS}
                        />
                    </div>
                    <div>
                        <p style={{
                            color: '#2D475E',
                            marginBottom: '5px'
                        }}>Name on card</p>
                        <input
                            style={{
                                background: '#F4F7F9',
                                border: '1px solid rgba(83, 104, 124, 0.37)',
                                boxSizing: 'border-box',
                                borderRadius: '4px',
                                height: '36px',
                                width: '30vw'
                            }}
                            onChange={(e) => setCardName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <p style={{
                            color: '#2D475E',
                            marginBottom: '5px'
                        }}>Country</p>
                        <select
                            style={{
                                background: '#F4F7F9',
                                border: '1px solid rgba(83, 104, 124, 0.37)',
                                boxSizing: 'border-box',
                                borderRadius: '4px',
                                height: '36px',
                                width: '50%'
                            }}
                            name="country">
                            <option key='-1' name='-1'></option>
                            {
                                orderedCountries?.map((country) => <option selected={country.name === 'United States'}
                                                                           onChange={(event) => setCountry(event.target.value)}
                                                                           key={country.name}
                                                                           value={country.name}>{country?.name}</option>
                                )
                            }
                        </select>
                    </div>

                    <div style={{
                        display: "flex",
                        width: '100%',
                        gap: '2vw'
                    }}>
                        <div>
                            <p style={{
                                color: '#2D475E',
                                marginBottom: '5px'
                            }}
                            >Address 1 *</p>
                            <input
                                style={{
                                    background: '#F4F7F9',
                                    border: '1px solid rgba(83, 104, 124, 0.37)',
                                    boxSizing: 'border-box',
                                    borderRadius: '4px',
                                    height: '36px',
                                    width: '30vw'
                                }}
                                //onChange={(e) => setCardName(e.target.value)}
                                required
                                placeholder='Street'
                            />
                        </div>
                        <div>
                            <p style={{
                                color: '#2D475E',
                                marginBottom: '5px'
                            }}>Address 2</p>
                            <input
                                style={{
                                    background: '#F4F7F9',
                                    border: '1px solid rgba(83, 104, 124, 0.37)',
                                    boxSizing: 'border-box',
                                    borderRadius: '4px',
                                    height: '36px',
                                    width: '30vw'
                                }}
                                placeholder='Suite, unit, Apt...'
                            />
                        </div>

                    </div>

                    <div style={{
                        display: "flex",
                        width: '100%',
                    }}>
                        <div>
                            <p style={{
                                color: '#2D475E',
                                marginBottom: '5px'
                            }}>City*</p>
                            <input
                                style={{
                                    background: '#F4F7F9',
                                    border: '1px solid rgba(83, 104, 124, 0.37)',
                                    boxSizing: 'border-box',
                                    borderRadius: '4px',
                                    height: '36px',
                                    width: '14vw'
                                }}
                                //onChange={(e) => setCardName(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{
                            minWidth: '2vw'
                        }}></div>
                        <div>
                            <p style={{
                                color: '#2D475E',
                                marginBottom: '5px'
                            }}>State, province*</p>
                            <input
                                style={{
                                    background: '#F4F7F9',
                                    border: '1px solid rgba(83, 104, 124, 0.37)',
                                    boxSizing: 'border-box',
                                    borderRadius: '4px',
                                    height: '36px',
                                    width: '14vw'
                                }}
                                onChange={(e) => setCardName(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{
                            minWidth: '2vw'
                        }}></div>
                        <div>
                            <p style={{
                                color: '#2D475E',
                                marginBottom: '5px'
                            }}>Zip Code*</p>
                            <input
                                style={{
                                    background: '#F4F7F9',
                                    border: '1px solid rgba(83, 104, 124, 0.37)',
                                    boxSizing: 'border-box',
                                    borderRadius: '4px',
                                    height: '36px',
                                    width: '15vw'
                                }}
                                onChange={(e) => setCardName(e.target.value)}
                                required
                            />
                        </div>

                    </div>

                    <br/>
                    <div style={{
                        display: "flex",
                        width: '100%',
                        gap: '2vw',
                        alignItems: 'end'
                    }}>
                        <div>
                            <p style={{
                                color: '#2D475E',
                                marginBottom: '5px'
                            }}>Billing *</p>
                            <input
                                style={{
                                    background: '#F4F7F9',
                                    border: '1px solid rgba(83, 104, 124, 0.37)',
                                    boxSizing: 'border-box',
                                    borderRadius: '4px',
                                    height: '36px',
                                    width: '30vw'
                                }}
                                onChange={(e) => setCardName(e.target.value)}
                                placeholder='Company or customer name'
                                required
                            />
                        </div>
                        <div>
                            <p style={{
                                color: '#2D475E',
                                marginBottom: '5px'
                            }}>Email address*</p>
                            <input
                                style={{
                                    background: '#F4F7F9',
                                    border: '1px solid rgba(83, 104, 124, 0.37)',
                                    boxSizing: 'border-box',
                                    borderRadius: '4px',
                                    height: '36px',
                                    width: '30vw'
                                }}
                                onChange={(e) => setCardName(e.target.value)}
                                required
                            />
                        </div>

                        <a href='/app/upgrade' style={{
                            fontSize: '16px',
                            color: '#5B5FEE',
                            marginBottom: '9px',
                            textDecoration: 'underline',
                            marginLeft: '200px'
                        }}>Back</a>

                    </div>
                </form>


            </div>
        </div>
    );
};

export default withAuth(Checkout);
