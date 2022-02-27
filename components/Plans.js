import {useEffect, useState} from "react";
import {loadStripe} from "@stripe/stripe-js";
import {mainAPI} from "@/plugins/axios";

import Button from "@/components/Button";
import styles from "@/styles/components/Plans.module.sass";

let stripePromise;

const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe('pk_test_51HVPIcGGTGLaoBgeyXuRyJ6wonYC6QDaTPwO3Wg5V85keEOzptmx99k5Z9quTmoGXa6btyEoXo5RxgxgemtUFn9Y006oRn58yy');
    }
    return stripePromise;
};

const Plans = ({className, renderAction}) => {
    const [products, setProducts] = useState([]);
    const [checkoutOptions, setCheckoutOptions] = useState(undefined);

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
            setProducts(productsOrdered);

            const businessPlan = productsOrdered.find(prod => prod.name === "Business");

            if (businessPlan) {
                const item = {
                    price: businessPlan?.price?.id ?? '',
                    quantity: 1
                };
                const checkoutOptions = {
                    lineItems: [item],
                    mode: "subscription",
                    successUrl: `${window.location.origin}/app/billing`,
                    cancelUrl: `${window.location.origin}/app/billing`
                };
                setCheckoutOptions(checkoutOptions);
            }
        }

        getProducts();
    }, []);

    const redirectToCheckout = async (options) => {
        const stripe = await getStripe();
        await stripe.redirectToCheckout(options);
    };

    return products.length > 0 ? (
        <ul className={`${className} ${styles.plansList}`}>
            {products
                .filter((p) => p.name !== "Pro") // TODO: remove this line to reactivate Pro plan
                .map((product) => (
                    <li
                        className={
                            product.name === "Business" ? styles.planBusiness : styles.planPro
                        }
                        key={product.id}
                    >
                        <div className={styles.planColorBanner}/>
                        <div className={styles.planContent}>
                            <p className={styles.planTitle}>
                                <svg width="19" height="26" viewBox="0 0 19 26" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9.49995 0C4.26178 0 0 4.11222 0 9.16727V22.7118C0 24.0119 1.05291 25.0694 2.34747 25.0694C3.64113 25.0694 4.69423 24.012 4.69423 22.7118V21.6644C4.69423 20.9829 5.24571 20.4289 5.9231 20.4289C6.60105 20.4289 7.15253 20.9831 7.15253 21.6644V22.7118C7.15253 24.0119 8.20544 25.0694 9.5 25.0694C10.7946 25.0694 11.8475 24.012 11.8475 22.7118V21.6644C11.8475 20.9829 12.3989 20.4289 13.0767 20.4289C13.7543 20.4289 14.306 20.9831 14.306 21.6644V22.7118C14.306 24.0119 15.3589 25.0694 16.6527 25.0694C17.9471 25.0694 19 24.012 19 22.7118V9.16727C19 4.11241 14.7387 0 9.50005 0H9.49995ZM5.77466 10.0042L4.21721 10.8262L4.51412 9.08395L3.25415 7.85047H4.99604L5.77484 6.01174L6.55331 7.85047H8.2952L7.03486 9.08395L7.33177 10.8262L5.77466 10.0042ZM9.49995 19.0828C7.9596 19.0828 6.7059 17.8238 6.7059 16.2764C6.7059 14.7299 7.9596 13.4702 9.49995 13.4702C11.0403 13.4702 12.294 14.7293 12.294 16.2764C12.294 17.8238 11.0403 19.0828 9.49995 19.0828ZM14.486 9.08433L14.7829 10.8266L13.2255 10.0045L11.6686 10.8266L11.9655 9.08433L10.7055 7.85085H12.4474L13.2259 6.01211L14.0047 7.85085H15.7466L14.486 9.08433Z"
                                        fill="#FF5C00"/>
                                    <path
                                        d="M9.50027 14.593C8.57623 14.593 7.82373 15.3484 7.82373 16.2769C7.82373 17.2052 8.57605 17.9608 9.50027 17.9608C10.4243 17.9608 11.177 17.2054 11.177 16.2769C11.177 15.3484 10.4243 14.593 9.50027 14.593Z"
                                        fill="#FF5C00"/>
                                </svg>
                                {product.name}
                            </p>
                            <div className={styles.planPrice}>
                                <p className={styles.planPriceValue}>
                                    ${product.price.unit_amount / 100}*
                                </p>
                                <p className={styles.planPriceText}>
                                    *Special “early birds” first year
                                    <br/>
                                    <span style={{color: '#FF5C00'}}>*Save 20%</span>
                                    <br/>
                                    <span style={{color: '#000'}}>or $30* billed monthly</span>
                                </p>
                            </div>
                            <ul className={styles.planDetails}>
                                {product.metadata.features.split(",").map((feature) => (
                                    <li className={styles.planDetailsItem} key={feature}>
                                        <img
                                            src={`/assets/home/${
                                                product.name === "Business"
                                                    ? "planCheckPrimary"
                                                    : "planCheckSecondary"
                                            }.svg`}
                                        />
                                        <p>{feature}</p>
                                    </li>
                                ))}
                            </ul>
                            {/*<span style={{*/}
                            {/*    fontSize: '9px',*/}
                            {/*    lineHeight: '8px',*/}
                            {/*    textAlign: 'center',*/}
                            {/*    letterSpacing: '-0.01px',*/}
                            {/*    textTransform: 'capitalize',*/}
                            {/*    color: '#3C546A',*/}
                            {/*    marginBottom: '2px',*/}
                            {/*    display: 'flex',*/}
                            {/*    alignItems: 'ceter',*/}
                            {/*    justifyContent: 'center'*/}
                            {/*}}>No credit card required</span>*/}

                            {renderAction(product)}

                            {/*<div style={{*/}
                            {/*    display: "flex",*/}
                            {/*    marginTop: '15px',*/}
                            {/*    justifyContent: 'center',*/}
                            {/*    alignItems: 'center',*/}
                            {/*}}>*/}
                            {/*    <b>or &nbsp;</b>*/}
                            {/*    <p*/}
                            {/*        onClick={() => redirectToCheckout(checkoutOptions)}*/}
                            {/*        style={{*/}
                            {/*            fontWeight: 'bold',*/}
                            {/*            fontSize: '17px',*/}
                            {/*            lineHeight: '8px',*/}
                            {/*            color: '#535BFF',*/}
                            {/*            cursor: 'pointer',*/}
                            {/*        }}>Buy Now</p>*/}
                            {/*</div>*/}
                        </div>
                    </li>
                ))}

            <li
                className={styles.planPro}
            >
                <div className={styles.planColorBanner}/>
                <div className={styles.planContent}>
                    <p className={styles.planTitle}>
                        <svg width="19" height="26" viewBox="0 0 19 26" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9.49995 0C4.26178 0 0 4.11222 0 9.16727V22.7118C0 24.0119 1.05291 25.0694 2.34747 25.0694C3.64113 25.0694 4.69423 24.012 4.69423 22.7118V21.6644C4.69423 20.9829 5.24571 20.4289 5.9231 20.4289C6.60105 20.4289 7.15253 20.9831 7.15253 21.6644V22.7118C7.15253 24.0119 8.20544 25.0694 9.5 25.0694C10.7946 25.0694 11.8475 24.012 11.8475 22.7118V21.6644C11.8475 20.9829 12.3989 20.4289 13.0767 20.4289C13.7543 20.4289 14.306 20.9831 14.306 21.6644V22.7118C14.306 24.0119 15.3589 25.0694 16.6527 25.0694C17.9471 25.0694 19 24.012 19 22.7118V9.16727C19 4.11241 14.7387 0 9.50005 0H9.49995ZM5.77466 10.0042L4.21721 10.8262L4.51412 9.08395L3.25415 7.85047H4.99604L5.77484 6.01174L6.55331 7.85047H8.2952L7.03486 9.08395L7.33177 10.8262L5.77466 10.0042ZM9.49995 19.0828C7.9596 19.0828 6.7059 17.8238 6.7059 16.2764C6.7059 14.7299 7.9596 13.4702 9.49995 13.4702C11.0403 13.4702 12.294 14.7293 12.294 16.2764C12.294 17.8238 11.0403 19.0828 9.49995 19.0828ZM14.486 9.08433L14.7829 10.8266L13.2255 10.0045L11.6686 10.8266L11.9655 9.08433L10.7055 7.85085H12.4474L13.2259 6.01211L14.0047 7.85085H15.7466L14.486 9.08433Z"
                                fill="#5B5FEE"/>
                            <path
                                d="M9.50027 14.593C8.57623 14.593 7.82373 15.3484 7.82373 16.2769C7.82373 17.2052 8.57605 17.9608 9.50027 17.9608C10.4243 17.9608 11.177 17.2054 11.177 16.2769C11.177 15.3484 10.4243 14.593 9.50027 14.593Z"
                                fill="#5B5FEE"/>
                        </svg>
                        Entreprise
                    </p>
                    <div className={styles.planPrice}>
                        <p className={styles.planPriceValue}>
                            For Teams
                        </p>
                    </div>
                    <ul className={styles.planDetails}>
                        <li className={styles.planDetailsItem}>
                            <img
                                src={`/assets/home/planCheckSecondary.svg`}
                            />
                            <p>+ Users</p>
                        </li>
                        <li className={styles.planDetailsItem}>
                            <img
                                src={`/assets/home/planCheckSecondary.svg`}
                            />
                            <p>More features</p>
                        </li>
                        <li className={styles.planDetailsItem}>
                            <img
                                src={`/assets/home/planCheckSecondary.svg`}
                            />
                            <p>Team collaboration</p>
                        </li>
                        <li className={styles.planDetailsItem}>
                            <img
                                src={`/assets/home/planCheckSecondary.svg`}
                            />
                            <p>Custom offer</p>
                        </li>

                    </ul>

                    <Button
                        href="mailto:contact@myfomo.io"
                        type="link"
                        width={160}
                    >
                        Contact Sales
                    </Button>


                </div>
            </li>
        </ul>
    ) : null;
};

export default Plans;
