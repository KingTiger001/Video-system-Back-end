import styles from '@/styles/components/Campaign/Logo.module.sass'

const Logo = ({ data = {} }) => {
  return data.value
    ?
      <div
        className={`${styles.logo} ${styles[data.placement]}`}
        style={{
          width: `${(data.size / 4)}%`, 
          height: `${(data.size / 4)}%`, 
        }}
      >
        <img src={data.value} />
      </div>
    :
      null
}


export default Logo