import styles from '@/styles/components/Campaign/Logo.module.sass'

const Logo = ({ data = {} }) => {
  return data.value
    ?
      <div
        className={`${styles.logo} ${styles[data.placement]}`}
        style={{
          height: data.size,
          width: data.size,
        }}
      >
        <img src={data.value} />
      </div>
    :
      null
}


export default Logo