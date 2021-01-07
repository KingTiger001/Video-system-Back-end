import { useRouter } from 'next/router'
import ReactPaginate from 'react-paginate'

import styles from '@/styles/components/Pagination.module.sass'

const Pagination = ({ initialPage, pageCount, route }) => {
  const router = useRouter()

  const goToPage = (data) => {
    const { selected: page } = data
    page > 0
      ? router.push(`${route}?page=${page + 1}`)
      : router.push(route)
  }

  return pageCount > 1 && 
    <ReactPaginate
      activeClassName={styles.selected}
      containerClassName={styles.pagination}
      disabledClassName={styles.disabled}
      initialPage={initialPage}
      nextLabel={<img src="/assets/pagination/next.svg" />}
      nextClassName={styles.next}
      onPageChange={goToPage}
      pageClassName={styles.page}
      pageCount={pageCount}
      previousLabel={<img src="/assets/pagination/previous.svg" />}
      previousClassName={styles.previous}
    />
}


export default Pagination