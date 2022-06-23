import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
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
import PopupContactListAddContacts from "@/components/Popups/PopupContactListAddContacts";
import PopupContactListRemoveContact from "@/components/Popups/PopupContactListRemoveContact";
import PopupEditContact from "@/components/Popups/PopupEditContact";
import PopupImportContacts from "@/components/Popups/PopupImportContacts";

import layoutStyles from "@/styles/layouts/App.module.sass";
import styles from "@/styles/layouts/Contact.module.sass";
import { useEffect } from "react";

const ContactList = ({ initialContactList, me }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const popup = useSelector((state) => state.popup);
  const hidePopup = () => dispatch({ type: "HIDE_POPUP" });
  const showPopup = (popupProps) =>
    dispatch({ type: "SHOW_POPUP", ...popupProps });

  const [contactList, setContactList] = useState(initialContactList);
  const getContactList = async () => {
    const { data } = await mainAPI.get(`/contactLists/${router.query.listId}`);
    setContactList(data);
  };

  const extractDataFromCSV = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    const { data } = await mainAPI.post("/contacts/csv", formData);
    showPopup({ display: "IMPORT_CONTACTS", data });
  };

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
                display: "CONTACT_LIST_REMOVE_CONTACT",
                data: {
                  ...contactList,
                  contactId: contact._id,
                },
              })
            }
          >
            <p>Delete</p>
          </li>
        </ul>
      )}
      renderEmpty={() => <p>No contacts found.</p>}
    >
      <input type="checkbox" />
      <p>{contact.firstName}</p>
      <p>{contact.lastName}</p>
      <p>{contact.job}</p>
      <p>{contact.company}</p>
      <p>{contact.city}</p>
      <p>{contact.email}</p>
      <p>{contact.phone}</p>
    </ListItem>
  );

  return (
    <AppLayout>
      <Head>
        <title>Contacts | SEEMEE</title>
      </Head>

      {popup.display === "CONTACT_LIST_ADD_CONTACTS" && (
        <PopupContactListAddContacts
          me={me}
          onDone={() => {
            getContactList();
            hidePopup();
            toast.success("Contacts added.");
          }}
        />
      )}
      {popup.display === "CONTACT_LIST_REMOVE_CONTACT" && (
        <PopupContactListRemoveContact
          me={me}
          onDone={() => {
            getContactList();
            hidePopup();
            toast.success("Contact removed.");
          }}
        />
      )}
      {popup.display === "EDIT_CONTACT" && (
        <PopupEditContact
          me={me}
          onDone={() => {
            getContactList();
            hidePopup();
          }}
        />
      )}
      {popup.display === "IMPORT_CONTACTS" && (
        <PopupImportContacts
          listId={router.query.listId}
          me={me}
          onDone={() => {
            getContactList();
            hidePopup();
            toast.success("Contacts imported.");
          }}
        />
      )}

      <ContactLayout>
        <div className={layoutStyles.header}>
          <div className={layoutStyles.headerTop}>
            <div>
              <Link href="/app/contacts/lists">
                <a className={layoutStyles.headerBack}>&lt; Back to lists</a>
              </Link>
              <h1 className={layoutStyles.headerTitle}>
                Lists / {contactList.name}
              </h1>
            </div>
            <div className={layoutStyles.headerActions}>
              <Button
                onClick={() =>
                  showPopup({
                    display: "CONTACT_LIST_ADD_CONTACTS",
                    data: contactList,
                  })
                }
                outline={true}
                size="small"
              >
                Add contacts
              </Button>
              <Button
                color="primary"
                onChange={extractDataFromCSV}
                size="small"
                type="file"
              >
                Import contacts
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.contacts}>
          <ListHeader className={styles.contactsHeader}>
            <input type="checkbox" />
            <p>First name</p>
            <p>Last name</p>
            <p>Job Title</p>
            <p>Company</p>
            <p>City</p>
            <p>Email</p>
            <p>Phone number</p>
          </ListHeader>
          {contactList.list.length > 0 &&
            contactList.list.map((contact) => renderContact(contact))}
          {contactList.list.length <= 0 && renderContact()}
        </div>
      </ContactLayout>
    </AppLayout>
  );
};

export default ContactList;
export const getServerSideProps = withAuthServerSideProps(
  async ({ params }) => {
    const { data: initialContactList } = await mainAPI.get(
      `/contactLists/${params.listId}`
    );
    return {
      initialContactList,
    };
  }
);
