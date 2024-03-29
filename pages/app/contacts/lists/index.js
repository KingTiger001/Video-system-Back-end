import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import withAuthServerSideProps from "@/hocs/withAuthServerSideProps";

import { mainAPI } from "@/plugins/axios";

import AppLayout from "@/layouts/AppLayout";
import ContactLayout from "@/layouts/ContactLayout";

import Button from "@/components/Button";
import ListHeader from "@/components/ListHeader";
import ListItem from "@/components/ListItem";
import Pagination from "@/components/Pagination";
import PopupContactListCreate from "@/components/Popups/PopupContactListCreate";
import PopupDeleteContactList from "@/components/Popups/PopupDeleteContactList";
import PopupRenameContactList from "@/components/Popups/PopupRenameContactList";

import layoutStyles from "@/styles/layouts/App.module.sass";
import styles from "@/styles/layouts/Contact.module.sass";

const CONTACT_LISTS_LIMIT = 50;

const ContactLists = ({ initialContactLists, me }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const popup = useSelector((state) => state.popup);
  const hidePopup = () => dispatch({ type: "HIDE_POPUP" });
  const showPopup = (popupProps) =>
    dispatch({ type: "SHOW_POPUP", ...popupProps });

  const [contactLists, setContactLists] = useState({});
  const [sortBy, setSortBy] = useState({ category: null, direction: -1 });
  const [selectedContactList, setSelectedContactList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const checkboxRef = useRef();

  useEffect(() => {
    setContactLists(initialContactLists);
  }, [initialContactLists]);

  const getContactLists = async () => {
    const { data } = await mainAPI.get(
      `/users/me/contactLists?limit=${CONTACT_LISTS_LIMIT}&page=${
        router.query.page ? router.query.page : 1
      }&sortBy=${router.query.sortBy || "updatedAt"}&direction=${
        router.query.direction || -1
      }`
    );
    setContactLists(data);
  };

  const searchContactLists = async (query) => {
    if (!query) {
      return getContactLists();
    }
    const { data } = await mainAPI.get(
      `/users/me/contactLists?limit=${CONTACT_LISTS_LIMIT}&page=${
        router.query.page ? router.query.page : 1
      }&sortBy=${
        router.query.sortBy || "updatedAt"
      }&search=${query}&direction=${router.query.direction || -1}`
    );
    setContactLists(data);
  };

  const selectOne = (e) => {
    const contactId = e.target.value;
    setSelectedContactList(
      e.target.checked
        ? [...selectedContactList, contactId]
        : selectedContactList.filter((c) => c !== contactId)
    );
  };

  const selectAll = (e) => {
    setSelectedContactList(
      e.target.checked ? contactLists.docs.map((e) => e._id) : []
    );
  };

  const sortContactLists = async (category) => {
    const direction = sortBy.category !== category ? 1 : -sortBy.direction;
    const { data } = await mainAPI.get(
      `/users/me/contactLists?limit=${CONTACT_LISTS_LIMIT}&page=${
        router.query.page ? router.query.page : 1
      }&sortBy=${category}&direction=${direction}${
        searchQuery !== "" ? `&search=${searchQuery}` : ""
      }`
    );
    setSortBy({
      category,
      direction,
    });
    setContactLists(data);
  };

  const arrowIcon = (category) => {
    return sortBy.category === category && sortBy.direction === 1 ? (
      <span>▲</span>
    ) : sortBy.category === category && sortBy.direction === -1 ? (
      <span>▼</span>
    ) : null;
  };

  const renderContactList = (contactList = {}) => (
    <ListItem
      className={styles.contactListsItem}
      empty={Object.keys(contactList).length > 0 ? false : true}
      key={contactList._id}
      renderDropdownActions={() => (
        <ul>
          <li
            onClick={() =>
              showPopup({
                display: "RENAME_CONTACT_LIST",
                data: contactList,
              })
            }
          >
            <p>Rename</p>
          </li>
          <li
            onClick={() =>
              showPopup({
                display: "DELETE_CONTACT_LIST",
                data: contactList,
              })
            }
          >
            <p>Delete</p>
          </li>
        </ul>
      )}
      renderEmpty={() => <p>No contact lists found.</p>}
    >
      <input
        type="checkbox"
        value={contactList._id}
        onChange={selectOne}
        checked={selectedContactList.includes(contactList._id)}
      />
      <p>
        <b>#{contactList.uniqueId}</b>
      </p>
      <Link href={`/app/contacts/lists/${contactList._id}`}>
        <a className={styles.link}>{contactList.name}</a>
      </Link>
      {contactList.list && <p>{contactList.list.length}</p>}
    </ListItem>
  );

  return (
    <AppLayout>
      <Head>
        <title>Lists | SEEMEE</title>
      </Head>

      {popup.display === "CONTACT_LIST_CREATE" && (
        <PopupContactListCreate
          onDone={() => {
            getContactLists();
            hidePopup();
            toast.success("List created.");
          }}
        />
      )}
      {popup.display === "RENAME_CONTACT_LIST" && (
        <PopupRenameContactList
          me={me}
          onDone={() => {
            getContactLists();
            hidePopup();
            toast.success("List updated.");
          }}
        />
      )}
      {(popup.display === "DELETE_CONTACT_LIST" ||
        popup.display === "DELETE_MULTIPLE_CONTACT_LIST") && (
        <PopupDeleteContactList
          me={me}
          onDone={() => {
            getContactLists();
            hidePopup();
            toast.success("List deleted.");
          }}
        />
      )}

      <ContactLayout>
        <div className={layoutStyles.header}>
          <div className={layoutStyles.headerTop}>
            <h1 className={layoutStyles.headerTitle}>
              Lists <span>({contactLists.totalDocs})</span>
            </h1>
            <div className={layoutStyles.headerActions}>
              <div className={layoutStyles.buttonContainer}>
                <Button
                  color="primary"
                  onClick={() => showPopup({ display: "CONTACT_LIST_CREATE" })}
                  size="small"
                >
                  Add new list
                </Button>
              </div>

              <div className={layoutStyles.buttonContainer}>
                {selectedContactList.length > 0 && (
                  <Button
                    onClick={() =>
                      showPopup({
                        display: "DELETE_MULTIPLE_CONTACT_LIST",
                        data: selectedContactList,
                      })
                    }
                    size="small"
                    color={"danger"}
                  >
                    delete
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className={layoutStyles.headerBottom}>
            <div className={layoutStyles.headerSearch}>
              <img src="/assets/common/search.svg" />
              <input
                placeholder="Search"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchContactLists(e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        <ListHeader className={styles.contactListsHeader}>
          <input type="checkbox" onChange={selectAll} ref={checkboxRef} />
          <div>
            <p>ID</p>
          </div>
          <div>
            <p onClick={() => sortContactLists("name")}>
              Name<span>{arrowIcon("name")}</span>
            </p>
          </div>
          <div>
            <p onClick={() => sortContactLists("contacts")}>
              Contacts<span>{arrowIcon("contacts")}</span>
            </p>
          </div>
        </ListHeader>
        <div className={styles.contactLists}>
          {contactLists.docs?.length > 0 &&
            contactLists.docs.map((contactList) =>
              renderContactList(contactList)
            )}
          {contactLists.docs?.length <= 0 && renderContactList()}
        </div>

        {/* {!searchQuery && ( */}
        <Pagination
          pageCount={contactLists.totalPages}
          initialPage={
            router.query.page ? parseInt(router.query.page, 10) - 1 : 0
          }
          route="/app/contacts/lists"
          searchQuery={searchQuery}
          sortBy={sortBy.category}
          direction={sortBy.direction}
        />
        {/* )} */}
      </ContactLayout>
    </AppLayout>
  );
};

export default ContactLists;
export const getServerSideProps = withAuthServerSideProps(async ({ query }) => {
  const { data: initialContactLists } = await mainAPI.get(
    `/users/me/contactLists?limit=${CONTACT_LISTS_LIMIT}&page=${
      query.page ? query.page : 1
    }&sortBy=${query.sortBy || "updatedAt"}&direction=${query.direction || -1}${
      query.search !== "" && query.search !== undefined
        ? `&search=${query.search}`
        : ""
    }`
  );
  return {
    initialContactLists,
  };
});
