import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { mainAPI } from "@/plugins/axios";

import Button from "@/components/Button";
import Popup from "./Popup";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import styles from "@/styles/components/Popups/PopupImportContacts.module.sass";

const animatedComponents = makeAnimated();
const customStyles = {
  control: (base) => ({
    ...base,
    minHeight: 55,
  }),
};

const PopupImportContacts = ({ listId, me, onDone }) => {
  const dispatch = useDispatch();
  const hidePopup = () => dispatch({ type: "HIDE_POPUP" });
  const popup = useSelector((state) => state.popup);

  const { columns, columnsMatching, columnsFound, contacts = [] } = popup.data;

  const [columnsMatchingComplete, setColumnsMatchingComplete] = useState(
    popup.data.columnsMatching
  );
  const [loading, setLoading] = useState(true);

  const isColumnMissing = Object.keys(columnsMatching).find(
    (key) => columnsMatching[key] === null
  );

  const capitalize = (str) => {
    let splitStr = str.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++)
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    return splitStr.join(" ");
  };
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (listId) return;
    async function getList() {
      const { data } = await mainAPI.get(
        `/users/me/contactLists?limit=1000&page=1`
      );
      setLoading(false);
      setOptions(data.docs.map((list) => ({ value: list, label: list.name })));
    }
    getList();
  }, []);

  const importContacts = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const contactsFormatted = contacts.map((contact, contactIndex) => {
        const contactFormatted = Object.entries(contact)
          .map(([key]) => {
            const column = Object.entries(columnsMatchingComplete).find(
              ([k, e]) => e === key
            );
            if (column) {
              const [contactKey, contactEntry] = column;
              return { [contactKey]: contacts[contactIndex][contactEntry] };
            }
          })
          .filter((item) => item)
          .reduce(
            (obj, item) => ({
              ...obj,
              [Object.keys(item)[0]]: Object.values(item)[0],
            }),
            {}
          );
        return contactFormatted;
      });
      const { data: contactsCreated } = await mainAPI.post(
        "/contacts",
        contactsFormatted
      );
      await addImportedContactsInList(contactsCreated);
    } catch (err) {
      setLoading(false);
    }
    onDone();
  };

  const addImportedContactsInList = async (contacts) => {
    const contactsId = contacts.map((c) => c._id);

    const selectedList = selectedOptions.map((op) => op.value);

    const selectedListsIds = selectedList.map((list) => list._id);
    if (listId) selectedListsIds.push(listId);

    const promises = selectedListsIds.map((listid) =>
      mainAPI.post(`/contactLists/${listid}/contacts`, {
        contactsId,
        ownerId: me._id,
      })
    );
    await Promise.all(promises);
  };
  console.log("POPUPIMPORT CONTACT");
  return (
    <Popup title="Import contacts">
      {contacts.length > 0 ? (
        <form onSubmit={importContacts}>
          <p className={styles.countContactsFound}>
            <span>{contacts.length} contacts found</span> in your CSV file.
          </p>
          {isColumnMissing && (
            <div className={styles.columnsNotMatching}>
              <p>
                We are unable to detect some of the columns in your CSV.
                <br />
                Please connect the missing columns with the correct columns from
                your file.
              </p>
              <div className={styles.columnsNotMatchingList}>
                {Object.keys(columnsMatching).map((key) => {
                  if (columnsMatching[key] === null) {
                    return (
                      <div className={styles.columnsNotMatchingItem} key={key}>
                        <p>
                          {capitalize(key.replace(/([A-Z])/g, " $1").trim())}
                        </p>
                        <select
                          defaultValue=""
                          onChange={(e) =>
                            setColumnsMatchingComplete({
                              ...columnsMatchingComplete,
                              [key]: e.target.value,
                            })
                          }
                        >
                          <option value="" disabled></option>
                          {columnsFound.map((c) => (
                            <option value={c} key={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            </div>
          )}
          {!listId && (
            <div>
              <label className={styles.columnsAddToList}>
                Add to existing lists
              </label>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={options}
                styles={customStyles}
                onChange={setSelectedOptions}
              />
            </div>
          )}
          <div className={styles.footer}>
            <Button loading={loading}>Import</Button>
            <p className={styles.cancel} onClick={hidePopup}>
              Cancel
            </p>
          </div>
        </form>
      ) : (
        <div>
          <p>No contacts found</p>
          <Button>Close</Button>
        </div>
      )}
    </Popup>
  );
};

export default PopupImportContacts;
