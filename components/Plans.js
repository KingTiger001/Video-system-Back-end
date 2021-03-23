import { useEffect, useState } from 'react'

import { mainAPI } from '@/plugins/axios'

import Button from '@/components/Button'

import styles from '@/styles/components/Plans.module.sass'

const Plans = ({ className, renderAction }) => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function getProducts () {
      const { data: products } = await mainAPI.get('/subscriptions/products')
      const { data: prices } = await mainAPI.get('/subscriptions/prices')
      const productsOrdered = products.data
        .map((product) => ({
          ...product,
          price: prices.data.find(price => price.product === product.id),
        }))  
        .sort((a, b) => (a.metadata.order > b.metadata.order) ? 1 : -1)
      setProducts(productsOrdered)
    } 
    getProducts()
  }, [])

  return products.length > 0 
    ? (
      <ul className={`${className} ${styles.plansList}`}>
        { products.map((product) => (
          <li
            className={product.name === 'Business' ? styles.planBusiness : styles.planPro}
            key={product.id}
          >
            <div className={styles.planColorBanner} />
            <div className={styles.planContent}>
              <p className={styles.planTitle}>{product.name}</p>
              <div className={styles.planPrice}>
                <p className={styles.planPriceValue}>${product.price.unit_amount / 100}</p>
                <p className={styles.planPriceText}>per user/month<br/><span>billed annually</span></p>
              </div>
              <ul className={styles.planDetails}>
                { product.metadata.features.split(',').map((feature) => (
                  <li
                    className={styles.planDetailsItem}
                    key={feature}
                  >
                    <img src={`/assets/home/${product.name === 'Business' ? 'planCheckSecondary' : 'planCheckPrimary'}.svg`} />
                    <p>{feature}</p>
                  </li>
                ))}
              </ul>
              { renderAction(product) }
            </div>
          </li>
        ))}
        
        <li>
          <div className={styles.planContent}>
            <p className={styles.planTitle}>5+ Users Enterprise</p>
            <div className={styles.planPrice}>
              <p className={styles.planPriceValue}>Contact us</p>
            </div>
            <div className={styles.planDetails}>
              <div className={styles.advanced}>
                <img src="/logo-circle.svg" />
                <p>Advanced features</p>
              </div>
            </div>
            <Button
              href="mailto:contact@myfomo.io"
              outline={true}
              type="link"
              width={160}
            >
              Contact us
            </Button>
            <p className={styles.creditCardNotRequired}></p>
          </div>
        </li>
      </ul>
    )
  : null
}


export default Plans