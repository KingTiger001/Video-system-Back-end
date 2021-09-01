import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
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
import PopupAddContact from "@/components/Popups/PopupAddContact";
import PopupDeleteContact from "@/components/Popups/PopupDeleteContact";
import PopupEditContact from "@/components/Popups/PopupEditContact";
import PopupImportContacts from "@/components/Popups/PopupImportContacts";
import PopupContactListCreate from "@/components/Popups/PopupContactListCreate";

import layoutStyles from "@/styles/layouts/App.module.sass";
import styles from "@/styles/layouts/Contact.module.sass";
import PopupContactListSelect from "@/components/Popups/PopupContactListSelect";

const CONTACTS_LIMIT = 5;

const Contacts = ({ initialContacts, me }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const popup = useSelector((state) => state.popup);
  const hidePopup = () => dispatch({ type: "HIDE_POPUP" });
  const showPopup = (popupProps) =>
    dispatch({ type: "SHOW_POPUP", ...popupProps });

  const [contacts, setContacts] = useState({});
  const [sortBy, setSortBy] = useState({ category: null, direction: -1 });
  // const [sortBy, setSortBy] = useState({ category: null, type: "ascend" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState([]);
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [showListOptions, setShowListOptions] = useState(false);

  useEffect(() => {
    console.log("initialContactList", initialContacts);
    setContacts(initialContacts);
  }, [initialContacts]);

  const extractDataFromCSV = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    const { data } = await mainAPI.post("/contacts/csv", formData);
    showPopup({ display: "IMPORT_CONTACTS", data });
  };

  const getContacts = async () => {
    const { data } = await mainAPI.get(
      `/users/me/contacts?limit=${CONTACTS_LIMIT}&page=${
        router.query.page ? router.query.page : 1
      }`
    );
    setContacts(data);
  };

  const sortContacts = async (category) => {
    console.log("category", category, sortBy);
    const direction = sortBy.category !== category ? 1 : -sortBy.direction;
    const { data } = await mainAPI.get(
      `/users/me/contacts?limit=${CONTACTS_LIMIT}&page=${
        router.query.page ? router.query.page : 1
      }&sortBy=${category}&direction=${direction}`
    );
    setSortBy({
      category,
      direction,
    });
    setContacts(data);
  };

  const searchContacts = async (query) => {
    if (!query) {
      return getContacts();
    }
    const { data } = await mainAPI.get(`/contacts/search?query=${query}`);
    const array = Object.assign({}, contacts);
    array.docs = data;
    setContacts(array);
  };

  const deleteRef = useRef(null);
  const sortByRef = useRef({ category: null, type: "ascend" });
  const contactRef = useRef(null);
  const listRef = useRef(null);

  const renderContact = (contact = {}) => (
    <ListItem
      className={styles.contactsItem}
      empty={Object.keys(contact).length > 0 ? false : true}
      key={contact._id}
      renderDropdownActions={() => (
        <ul>
          <li
            onClick={() =>
              showPopup({
                display: "EDIT_CONTACT",
                data: contact,
              })
            }
          >
            <p>Edit</p>
          </li>
          <li
            onClick={() =>
              showPopup({
                display: "DELETE_CONTACT",
                data: [contact._id],
              })
            }
          >
            <p>Delete</p>
          </li>
        </ul>
      )}
      renderEmpty={() => <p>No contacts found.</p>}
    >
      <input
        type="checkbox"
        value={contact._id}
        onChange={selectOne}
        checked={selectedContact.includes(contact._id)}
      />
      <p>{contact.firstName}</p>
      <p>{contact.lastName}</p>
      <p>{contact.email}</p>
      <p>{contact.job}</p>
      <p>{contact.company}</p>
      <p>{contact.city}</p>
      <p>{contact.phone}</p>
    </ListItem>
  );

  const selectOne = (e) => {
    const contactId = e.target.value;
    setSelectedContact(
      e.target.checked
        ? [...selectedContact, contactId]
        : selectedContact.filter((c) => c !== contactId)
    );
  };
  const selectAll = (e) => {
    setSelectedContact(e.target.checked ? contacts.docs.map((e) => e._id) : []);
  };

  const sortArray = (category) => {
    let type;
    if (sortBy.category !== category) {
      type = "ascend";
    } else if (sortBy.type === "ascend") {
      type = "descend";
    } else {
      type = "ascend";
    }
    sortByRef.current = { category, type };

    setSortBy({
      category: category,
      type,
    });
    switch (category) {
      case "firstname":
        contacts.docs.sort((a, b) =>
          sortByRef.current.type === "ascend"
            ? a.firstName < b.firstName
              ? -1
              : 1
            : b.firstName > a.firstName
            ? 1
            : -1
        );
        setContacts(contacts);
        break;
      case "lastname":
        contacts.docs.sort((a, b) =>
          sortByRef.current.type === "ascend"
            ? a.lastName < b.lastName
              ? -1
              : 1
            : b.lastName > a.lastName
            ? 1
            : -1
        );
        setContacts(contacts);
        break;
      case "email":
        contacts.docs.sort((a, b) =>
          sortByRef.current.type === "ascend"
            ? a.email < b.email
              ? -1
              : 1
            : b.email > a.email
            ? 1
            : -1
        );
        setContacts(contacts);
        break;
      case "job":
        contacts.docs.sort((a, b) => {
          if (a.job === undefined) {
            return 1;
          } else if (b.job === undefined) {
            return -1;
          } else {
            return sortByRef.current.type === "ascend"
              ? a.job < b.job
                ? -1
                : 1
              : b.job > a.job
              ? 1
              : -1;
          }
        });
        setContacts(contacts);
        break;
      case "company":
        contacts.docs.sort((a, b) =>
          sortByRef.current.type === "ascend"
            ? a.company < b.company
              ? -1
              : 1
            : b.company > a.company
            ? 1
            : -1
        );
        setContacts(contacts);
        break;
      case "city":
        contacts.docs.sort((a, b) => {
          if (a.city === undefined) {
            return 1;
          } else if (b.city === undefined) {
            return -1;
          } else {
            return sortByRef.current.type === "ascend"
              ? a.city < b.city
                ? -1
                : 1
              : b.city > a.city
              ? 1
              : -1;
          }
        });
        setContacts(contacts);
        break;
    }
  };

  const arrowIcon = (category) => {
    return sortBy.category === category && sortBy.direction === 1 ? (
      <span>▲</span>
    ) : sortBy.category === category && sortBy.direction === -1 ? (
      <span>▼</span>
    ) : null;
  };

  useEffect(() => {
    if (showContactOptions || showListOptions)
      document.body.addEventListener("click", hidePopupButtons);
    else document.body.removeEventListener("click", hidePopupButtons);
    return () => {
      document.body.removeEventListener("click", hidePopupButtons);
    };
  }, [showContactOptions, showListOptions]);

  const hidePopupButtons = (e) => {
    if (!contactRef.current.contains(e.target)) setShowContactOptions(false);
    if (!listRef.current.contains(e.target)) setShowListOptions(false);
  };

  return (
    <AppLayout>
      <Head>
        <title>Contacts | FOMO</title>
      </Head>
      {popup.display === "CONTACT_LIST_CREATE" && (
        <PopupContactListCreate
          onDone={(e) => {
            const { data } = e;
            mainAPI
              .post(`/contactLists/${data._id}/contacts`, {
                contactsId: selectedContact,
                ownerId: me._id,
              })
              .then(() => {
                hidePopup();
                toast.success("List created.");
              });
          }}
        />
      )}
      {popup.display === "CONTACT_LIST_SELECT" && (
        <PopupContactListSelect
          onDone={async (selectedLists) => {
            const promises = selectedLists.map((list) =>
              mainAPI.post(`/contactLists/${list._id}/contacts`, {
                contactsId: selectedContact,
                ownerId: me._id,
              })
            );
            await Promise.all(promises);
            hidePopup();
            toast.success("List Saved.");
          }}
        />
      )}

      {popup.display === "ADD_CONTACT" && (
        <PopupAddContact
          onDone={() => {
            getContacts();
            hidePopup();
            toast.success("Contact added.");
          }}
        />
      )}
      {popup.display === "EDIT_CONTACT" && (
        <PopupEditContact
          me={me}
          onDone={() => {
            getContacts();
            hidePopup();
          }}
        />
      )}
      {(popup.display === "DELETE_CONTACT" ||
        popup.display === "DELETE_MULTIPLE_CONTACT") && (
        <PopupDeleteContact
          me={me}
          onDone={() => {
            getContacts();
            hidePopup();
            setSelectedContact([]);
            toast.success("Contact deleted.");
          }}
        />
      )}
      {popup.display === "IMPORT_CONTACTS" && (
        <PopupImportContacts
          me={me}
          onDone={() => {
            getContacts();
            hidePopup();
            toast.success("Contacts imported.");
          }}
        />
      )}

      <ContactLayout>
        <div className={layoutStyles.header}>
          <div className={layoutStyles.headerTop}>
            <h1 className={layoutStyles.headerTitle}>
              Contacts{" "}
              <span>
                ({searchQuery ? contacts.docs?.length : contacts.totalDocs})
              </span>
            </h1>
            <div className={layoutStyles.headerActions}>
              <div className={layoutStyles.buttonContainer} ref={listRef}>
                <Button
                  onClick={() =>
                    selectedContact.length &&
                    setShowListOptions(!showListOptions)
                  }
                  size="small"
                  outline
                  color={selectedContact.length == 0 ? "grey" : "primary"}
                >
                  Add to list
                </Button>
                {showListOptions && selectedContact.length > 0 && (
                  <div className={layoutStyles.buttonPopup}>
                    <Button
                      onClick={() =>
                        showPopup({ display: "CONTACT_LIST_CREATE" })
                      }
                      size="small"
                      outline={true}
                      color="greyLite"
                      outline
                    >
                      Create new
                    </Button>
                    <div className={layoutStyles.spiler} />
                    <Button
                      onClick={() =>
                        showPopup({ display: "CONTACT_LIST_SELECT" })
                      }
                      size="small"
                      outline={true}
                      color="greyLite"
                      outline
                    >
                      Add to existing
                    </Button>
                  </div>
                )}
              </div>
              <div className={layoutStyles.buttonContainer} ref={contactRef}>
                <Button
                  onClick={() => setShowContactOptions(!showContactOptions)}
                  size="small"
                  outline
                >
                  Add contact
                </Button>
                {showContactOptions && (
                  <div className={layoutStyles.buttonPopup}>
                    <Button
                      size="small"
                      onClick={() => showPopup({ display: "ADD_CONTACT" })}
                      outline={true}
                      color="greyLite"
                      outline
                    >
                      Create new
                    </Button>
                    <div className={layoutStyles.spiler} />
                    <Button
                      size="small"
                      onChange={extractDataFromCSV}
                      outline={true}
                      color="greyLite"
                      type="file"
                      outline
                    >
                      Import csv
                    </Button>
                  </div>
                )}
              </div>
              <div className={layoutStyles.buttonContainer} ref={deleteRef}>
                {selectedContact.length > 0 && (
                  <Button
                    onClick={() =>
                      showPopup({
                        display: "DELETE_MULTIPLE_CONTACT",
                        data: selectedContact,
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
                  searchContacts(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <ListHeader className={styles.contactsHeader}>
          <input type="checkbox" onChange={selectAll} />
          <div>
            <p onClick={() => sortContacts("firstName", 1)}>
              First name {arrowIcon("firstName")}
            </p>
          </div>
          <div>
            <p onClick={() => sortContacts("lastName")}>
              Last name {arrowIcon("lastName")}
            </p>
          </div>
          <div>
            <p onClick={() => sortContacts("email")}>
              Email {arrowIcon("email")}
            </p>
          </div>
          <div>
            <p onClick={() => sortContacts("job")}>
              Job Title {arrowIcon("job")}
            </p>
          </div>
          <div>
            <p onClick={() => sortContacts("company")}>
              Company {arrowIcon("company")}
            </p>
          </div>
          <div>
            <p onClick={() => sortContacts("city")}>City {arrowIcon("city")}</p>
          </div>
          <div>
            <p>Phone number</p>
          </div>
        </ListHeader>
        <div className={styles.contacts}>
          {contacts.docs?.length > 0 &&
            contacts.docs.map((contact) => renderContact(contact))}
          {contacts.docs?.length <= 0 && renderContact()}
        </div>
        {!searchQuery && (
          <Pagination
            pageCount={contacts.totalPages}
            initialPage={
              router.query.page ? parseInt(router.query.page, 10) - 1 : 0
            }
            route="/app/contacts"
            sortBy={sortBy.category}
            direction={sortBy.direction}
          />
        )}
      </ContactLayout>
    </AppLayout>
  );
};

export default Contacts;
export const getServerSideProps = withAuthServerSideProps(async ({ query }) => {
  console.log("query", query);
  const { data: initialContacts } = await mainAPI.get(
    `/users/me/contacts?limit=${CONTACTS_LIMIT}&page=${
      query.page ? query.page : 1
    }&sortBy=${query.sortBy || "createdAt"}&direction=${query.direction || -1}`
  );
  return {
    initialContacts,
  };
});
