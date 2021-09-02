import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";

import styles from "@/styles/components/Pagination.module.sass";

const Pagination = ({
  initialPage,
  pageCount,
  route,
  sortBy,
  direction,
  searchQuery,
}) => {
  const router = useRouter();

  const sortOptions = (page) => {
    let options;

    if ((sortBy || searchQuery !== "") && page === 0) {
      options = `?sortBy=${sortBy || "createdAt"}&direction=${direction || -1}${
        searchQuery !== "" ? `&search=${searchQuery}` : ""
      }`;
    } else if ((sortBy || searchQuery !== "") && page > 0) {
      options = `?page=${page + 1}${
        sortBy ? `&sortBy=${sortBy || "createdAt"}` : ""
      }${direction ? `&direction=${direction || -1}` : ""}${
        searchQuery !== "" ? `&search=${searchQuery}` : ""
      }`;
    } else {
      options = "";
    }

    return options;
  };

  const goToPage = (data) => {
    console.log("router", router);
    const { selected: page } = data;
    page > 0
      ? router.push(`${route}?page=${page + 1}${sortOptions(page)}`)
      : router.push(`${route}${sortOptions(page)}`);
  };

  return (
    pageCount > 1 && (
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
    )
  );
};

export default Pagination;
