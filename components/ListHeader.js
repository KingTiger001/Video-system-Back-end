import styles from '@/styles/components/ListHeader.module.sass'

const ListHeader = ({
  children,
  className,
}) => {
  return (
    <div className={`${styles.listHeader} ${className ? className : ''}`}>
      {children}
    </div>
  )
}

export default ListHeader