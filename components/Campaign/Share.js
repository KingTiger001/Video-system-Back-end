import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import { mainAPI, mediaAPI } from "@/plugins/axios";

import Button from "@/components/Button";
import PopupAddContact from "@/components/Popups/PopupAddContact";
import PopupImportContacts from "@/components/Popups/PopupImportContacts";
import PopupQuitShare from "@/components/Popups/PopupQuitShare";

import { MsalProvider, useIsAuthenticated, useMsal } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { requestScopes, msalConfig } from "config/MsConfig";

import styles from "@/styles/components/Campaign/Share.module.sass";
import { useGoogleLogin } from "react-google-login";
import { googleConfig } from "config/GoogleConfig";
import { Collapse } from "react-collapse";
import "react-tabs/style/react-tabs.css";
import Popup from "../Popups/Popup";
import { set } from "nprogress";

const providers = {
  GOOGLE: "GOOGLE",
  MICROSOFT: "MICROSOFT",
  // FOMO: "FOMO",
};

const RenderStepTree = ({ setSendVia, sendVia }) => {
  const { instance: outlookInstance } = useMsal();
  const [msAccesToken, setMsAccessToken] = useState(undefined);
  const isOutlookAuthentified = useIsAuthenticated();

  const [googleCredentials, setGoogleCredentials] = useState(undefined);
  const [googleProfile, setGoogleProfile] = useState(undefined);
  const { signIn: handleGmailSignIn } = useGoogleLogin({
    onSuccess: (session) => refreshGmailToken(session),
    ...googleConfig,
  });

  const [stepThreeError, setStepThreeError] = useState("");


  const handleOutlookLogin = (outlookInstance) => {
    outlookInstance
      .loginPopup(requestScopes)
      .then(() => {
        console.log('Signed in with outlook success!!');
        // setSendVia({
        //   ...sendVia,
        //   provider: providers.MICROSOFT,
        //   // email: outlookInstance.getAllAccounts()[0].username,
        //   // maybe delete it all
        // });
        setSendVia({
          ...sendVia,
          provider: providers.MICROSOFT,
          microsoft: {
            accessToken: msAccesToken,
            email: outlookInstance.getAllAccounts()[0].username,
          },
        });
        // setSendedVia(sendVia.provider);
        // setFormDetails({
        //   ...formDetails,
        //   from: `${_FROM} via ${sendVia.provider}`,
        // });
        // refrechSendVia();
        console.log(sendVia);
      })
      .catch((e) => {
        setStepThreeError("Error occurred");
        console.error(e);
      });
  };

  //request accesstokens
  useEffect(() => {
    if (isOutlookAuthentified) refreshOutlookToken();
  }, [isOutlookAuthentified]);

  // OnTokensChange
  useEffect(() => {
    if (msAccesToken)
      setSendVia({
        ...sendVia,
        microsoft: {
          accessToken: msAccesToken,
          email: outlookInstance.getAllAccounts()[0].username,
        },
      });
    if (googleCredentials)
      setSendVia({
        ...sendVia,
        google: { credentials: googleCredentials, email: googleProfile.email },
      });
  }, [msAccesToken, googleCredentials]);

  const refreshGmailToken = async (session) => {
    if (session.code) {
      const { data } = await mainAPI.post(`/campaigns/googleToken`, {
        code: session.code,
      });

      const { profile, credentials } = data;

      setGoogleProfile(profile);
      setGoogleCredentials(credentials);
      console.log("googleProfile", googleProfile);
      console.log("googleCredentials", googleCredentials);
      console.log("data returned from api", data);
      console.log("data in the session", session);
      
      console.log('Signed in with gmail success!! && refreshed token');
      setSendVia({
        ...sendVia,
        provider: providers.GOOGLE,
        google: { credentials: googleCredentials, email: googleProfile.email },
      });
      // setSendedVia(sendVia.provider);
      // setFormDetails({
      //   ...formDetails,
      //   from: `${_FROM} via ${sendVia.provider}`,
      // });
      // refrechSendVia();
      console.log(sendVia.provider);
    } else {
      setGoogleProfile(session.profileObj);
      console.log('Signed in with gmail success!!', session.profileObj);
      setSendVia({
        ...sendVia,
        provider: providers.GOOGLE,
        google: { credentials: session.profileObj.googleId, email: session.profileObj.email },
      });
      // setSendedVia(sendVia.provider);
      // setFormDetails({
      //   ...formDetails,
      //   from: `${_FROM} via ${sendVia.provider}`,
      // });
      // refrechSendVia();
      console.log(sendVia.provider);
    }
  };

  const refreshOutlookToken = () => {
    outlookInstance
      .acquireTokenSilent({
        account: outlookInstance.getAllAccounts()[0],
        scopes: requestScopes.scopes,
      })
      .then((response) => setMsAccessToken(response.accessToken))
      .catch((e) => {
        outlookInstance
          .acquireTokenPopup(requestScopes)
          .then((response) => setMsAccessToken(response.accessToken))
          .catch((e) => {
            setStepThreeError(e);
            console.error(e);
          });
      });
  };

  const changeProvider = (event) => {
    event.target.value === providers.GOOGLE &&
      setSendVia({
        ...sendVia,
        provider: providers.GOOGLE,
        google: { credentials: googleCredentials, email: googleProfile.email },
      });
    event.target.value === providers.MICROSOFT &&
      setSendVia({
        ...sendVia,
        provider: providers.MICROSOFT,
        microsoft: {
          accessToken: msAccesToken,
          email: outlookInstance.getAllAccounts()[0].username,
        },
      });
    // event.target.value === providers.FOMO &&
    //   setSendVia({
    //     ...sendVia,
    //     provider: providers.FOMO,
    //     fomo: { email: "noreply@myfomo.io" },
    //   });
  };

  return (
    <div className={styles.stepThree}>
      <div>
        {/* <p className={styles.mailHeader}>
          Choose how you want to send your Email.
        </p> */}
        <div className={styles.mailContainer}>
          <p className={styles.mailTitle}>
            You can connect your email address to send your video message
          </p>
          <div className={styles.mailOption}>
            {/* <input
              name="email"
              type="radio"
              value={providers.GOOGLE}
              disabled={
                !(googleProfile && sendVia.google && sendVia.google.credentials)
              }
              onClick={changeProvider}
              checked={
                googleProfile &&
                sendVia.google &&
                sendVia.provider === providers.GOOGLE
              }
            /> */}
            <img
              className={styles.mailLogo}
              src="/assets/socials/gmail_icon.svg"
            />
            {!(
              googleProfile &&
              sendVia.google &&
              sendVia.google.credentials
            ) ? (
              <a href="#" onClick={() => handleGmailSignIn()}>
                <b>Sign in with Gmail</b>
              </a>
            ) : (
              <b>{googleProfile.email}</b>
            )}
          </div>
          <div className={styles.mailOption}>
            {/* <input
              name="email"
              type="radio"
              value={providers.MICROSOFT}
              disabled={
                !(
                  isOutlookAuthentified &&
                  sendVia.microsoft &&
                  sendVia.microsoft.accessToken
                )
              }
              onClick={changeProvider}
              checked={
                isOutlookAuthentified &&
                sendVia.microsoft &&
                sendVia.provider === providers.MICROSOFT
              }
            /> */}
            <img
              className={styles.mailLogo}
              src="/assets/socials/outlook_icon.svg"
            />
            {!(
              isOutlookAuthentified &&
              sendVia.microsoft &&
              sendVia.microsoft.accessTokent
            ) ? (
              <a href="#" onClick={() => handleOutlookLogin(outlookInstance)}>
                <b>Sign in with Outlook</b>
              </a>
            ) : (
              <b>{outlookInstance.getAllAccounts()[0].username}</b>
            )}
          </div>
        </div>
        {/* <div className={styles.mailContainer}>
          <p className={styles.mailTitle}>
            You can use Fomo to send your video message
          </p>
          <div className={styles.mailOption}>
            <input
              name="email"
              type="radio"
              value={providers.FOMO}
              onClick={changeProvider}
              checked={sendVia.provider === providers.FOMO}
            />
            <img className={styles.mailLogo} src="/logo-circle.svg"></img>
            <b>Fomo</b>
          </div>
        </div> */}
      </div>
      {stepThreeError && <p className={styles.error}>{stepThreeError}</p>}
    </div>
  );
};

const Share = ({ campaignId, onClose, onDone, me }) => {
  const _FROM = `${me.firstName} ${me.lastName} `;
  const SUBJECT = `${me.firstName} from ${me.company} sent you a video message`;

  const dispatch = useDispatch();

  const popup = useSelector((state) => state.popup);
  const hidePopup = () => dispatch({ type: "HIDE_POPUP" });
  const showPopup = (popupProps) =>
    dispatch({ type: "SHOW_POPUP", ...popupProps });

  const [campaign, setCampaign] = useState({});
  const [contacts, setContacts] = useState({});
  const [contactsSelected, setContactsSelected] = useState([]);
  const [sendedVia, setSendedVia] = useState(undefined);
  const [formDetails, setFormDetails] = useState({
    from: `${_FROM} via FOMO`,
    message: "",
    subject: "",
  });
  const [lists, setLists] = useState({});
  const [listsSelected, setListsSelected] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [stepOneError, setStepOneError] = useState("");
  const [stepTwoError, setStepTwoError] = useState("");
  const [stepFourError, setStepFourError] = useState("");
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedWithThumbnail, setCopiedWithThumbnail] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(false);
  const [showProvidersNotification, setShowProvidersNotification] = useState(false);
  const [displayPopupVariable, showPopupVariables] = useState(false);
  const [variable, setVariable] = useState("firstName");

  const formDetailsRef = useRef(null);
  const textareaMessageRef = useRef(null);
  const variablesPopupRef = useRef(null);

  const msalInstance = new PublicClientApplication(msalConfig);
  const [sendVia, setSendVia] = useState({
    provider: '',
    // fomo: { email: "" },
    // provider: providers.FOMO,
    // fomo: { email: "noreply@myfomo.io" },
  });

  // Close click outside text style
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        variablesPopupRef.current &&
        !variablesPopupRef.current.contains(event.target)
      ) {
        setVariable(false);
        showPopupVariables(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [variablesPopupRef]);

  // mounted
  useEffect(() => {
    getCampaign();
    getContacts();
    getLists();
    getLastUsedProvider();
  }, []);

  useEffect(() => {
    const via =
      sendVia.provider === providers.GOOGLE && sendVia.google
        ? sendVia.google.email
        : sendVia.provider === providers.MICROSOFT && sendVia.microsoft
        ? sendVia.microsoft.email
        : '';
        // : providers.FOMO;
    setFormDetails({
      ...formDetails,
      from: `${_FROM} via ${via}`,
    });
  }, [sendVia]);

  const refrechSendVia = () => {
    const via =
      sendVia.provider === providers.GOOGLE && sendVia.google
        ? sendVia.google.email
        : sendVia.provider === providers.MICROSOFT && sendVia.microsoft
        ? sendVia.microsoft.email
        : '';
    setFormDetails({
      ...formDetails,
      from: `${_FROM} via ${via}`,
    });
  };

  useEffect(() => {
    if (
      campaign.share &&
      campaign.share.contacts &&
      campaign.share.lists &&
      (campaign.share.contacts.length > 0 || campaign.share.lists.length > 0)
    ) {
      setStep(3);
    } else if (
      campaign.share &&
      campaign.share.from &&
      campaign.share.message &&
      campaign.share.subject
    ) {
      setStep(2);
    }
  }, [mounted]);

  const getCampaign = async () => {
    const { data: campaign } = await mainAPI.get(`/campaigns/${campaignId}`);
    if (campaign.share && campaign.share.contacts) {
      campaign.share.contacts = campaign.share.contacts.map((c) => c._id);
    }
    setCampaign(campaign);
    setFormDetails({
      from: `${_FROM} via FOMO`,
      message: campaign.share ? campaign.share.message : "",
      subject: campaign.share ? campaign.share.subject : "",
    });
    
    if (campaign.share.sendVia) {
      console.log("send via", campaign.share.sendVia);
      setSendVia(campaign.share.sendVia);
      refrechSendVia();
    }

    setContactsSelected(
      campaign.share && campaign.share.contacts ? campaign.share.contacts : []
    );
    setListsSelected(
      campaign.share && campaign.share.lists
        ? campaign.share.lists.map((l) => l._id)
        : []
    );
    setMounted(true);
  };
  const getContacts = async () => {
    const { data: contacts } = await mainAPI.get(
      `/users/me/contacts?pagination=false`
    );
    setContacts(contacts);
  };
  const searchContacts = async (query) => {
    if (!query) {
      return getContacts();
    }
    const { data } = await mainAPI.get(`/contacts/search?query=${query}`);
    setContacts(data);
  };

  const getLists = async () => {
    const { data: lists } = await mainAPI.get(
      `/users/me/contactLists?pagination=false`
    );
    setLists(lists);
  };

  const getLastUsedProvider = async () => {
    const lastSendVia = localStorage.getItem("sendVia");
    if (lastSendVia) {
      setSendVia(JSON.parse(lastSendVia));
      refrechSendVia();
    }
  };

  const searchLists = async (query) => {
    if (!query) {
      return getLists();
    }
    const { data } = await mainAPI.get(`/contactLists/search?query=${query}`);
    setLists(data);
  };

  const extractDataFromCSV = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    const { data } = await mainAPI.post("/contacts/csv", formData);
    showPopup({ display: "IMPORT_CONTACTS", data });
  };

  const handleSelectedContact = (e) => {
    const contactId = e.target.value;
    if (contactsSelected.includes(contactId)) {
      return setContactsSelected(
        contactsSelected.filter((c) => c !== contactId)
      );
    }
    setContactsSelected([...contactsSelected, e.target.value]);
  };

  const handleSelectedList = (e) => {
    const listId = e.target.value;
    if (listsSelected.includes(listId)) {
      return setListsSelected(listsSelected.filter((l) => l !== listId));
    }
    setListsSelected([...listsSelected, e.target.value]);
  };

  const insertVariableInMessage = () => {
    const cursorPosition = textareaMessageRef.current.selectionStart;
    const value = textareaMessageRef.current.value;
    setFormDetails({
      ...formDetails,
      message: `${value.substring(
        0,
        cursorPosition
      )}{{${variable}}}${value.substring(cursorPosition, value.length)}`,
    });
    showPopupVariables(false);
    setVariable("firstName");
  };

  const next = async () => {
    try {
      switch (step) {
        case 1:
          await stepOne();
          break;
        case 2:
          await stepTwo();
          break;
        case 3:
          await stepThree();
          break;
      }
      setStep(step + 1);
    } catch (err) {
      console.log(err);
    }
  };

  const share = async () => {
    try {
      setShareLoading(true);
      await mainAPI.post("/campaigns/share", { campaign, sendVia });
      onDone();
    } catch (err) {
      setStepFourError("An error has occured.");
    } finally {
      setShareLoading(false);
    }
  };

  const stepOne = async () => {
    if (!formDetailsRef.current.checkValidity()) {
      throw formDetailsRef.current.reportValidity();
    }
    try {
      const { data: campaignUpdated } = await mainAPI.patch(
        `/campaigns/${campaignId}`,
        {
          share: {
            ...campaign.share,
            ...formDetails,
          },
        }
      );
      setCampaign({
        ...campaign,
        share: {
          ...campaignUpdated.share,
        },
      });
    } catch (err) {
      throw setStepOneError("An error has occured.");
    }
  };

  const stepTwo = async () => {
    try {
      setStepTwoError("");
      if (contactsSelected.length <= 0 && listsSelected.length <= 0) {
        throw new Error("You need at least one contact or one list selected.");
      }
      const { data: campaignUpdated } = await mainAPI.patch(
        `/campaigns/${campaignId}`,
        {
          share: {
            ...campaign.share,
            contacts: contactsSelected,
            lists: listsSelected,
          },
        }
      );
      setCampaign({
        ...campaign,
        share: {
          ...campaignUpdated.share,
        },
      });
    } catch (err) {
      console.log(err);
      throw setStepTwoError(err.message || "An error has occured.");
    }
  };

  const stepThree = async () => {
    try {
      localStorage.setItem("sendVia", JSON.stringify(sendVia));
    } catch (err) {
      throw setStepOneError("An error has occured.");
    }
    getCampaign();
  };
  const removeThumbnail = async () => {
    await mediaAPI.delete("/", {
      data: {
        url: campaign.share.thumbnail,
      },
    });
    const { data: campaignUpdated } = await mainAPI.patch(
      `/campaigns/${campaignId}`,
      {
        share: {
          ...campaign.share,
          thumbnail: null,
        },
      }
    );
    setCampaign({
      ...campaign,
      share: {
        ...campaignUpdated.share,
      },
    });
  };

  const uploadThumbnail = async (file) => {
    setThumbnailFile(file);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "thumbnails");
    formData.append("width", 800);
    try {
      setThumbnailLoading(true);
      const { data: url } = await mediaAPI.post("/images", formData);
      if (campaign.share && campaign.share.thumbnail) {
        await mediaAPI.delete("/", {
          data: {
            url: campaign.share.thumbnail,
          },
        });
      }
      const { data: campaignUpdated } = await mainAPI.patch(
        `/campaigns/${campaignId}`,
        {
          share: {
            ...campaign.share,
            thumbnail: url,
          },
        }
      );
      setCampaign({
        ...campaign,
        share: {
          ...campaignUpdated.share,
        },
      });
    } catch (err) {
      console.log(err);
      const code = err.response && err.response.data;
      if (code === "Upload.incorrectFiletype") {
        setStepOneError("Only .jpg and .png images are accepted.");
      } else {
        setStepOneError("Thumbnail upload failed.");
      }
    } finally {
      setThumbnailLoading(false);
      setTimeout(() => setStepOneError(""), 5000);
    }
  };

  // Process for copy link with thumbnail process
  // to change and link to copy link with thumb function of 

  const handleCopiedLinkWithThumbnail=()=>{
    
    if (campaign.share.thumbnail) {
      setCopiedWithThumbnail(true);
      // add thumbnile process
      try {
        // setThumbnailLoading(true);
        console.log(thumbnailFile);
        // linkToCopie = "https://test.myfomo.io/campaigns/"+campaign._id+"?thumbnail=1";
        navigator.clipboard.writeText("https://test.myfomo.io/campaigns/"+campaign._id+"?thumbnail=1");
        // navigator.clipboard.write([
        //     new ClipboardItem({
        //       'image/png': thumbnailFile
        //     })
        //     // new ClipboardItem({
        //     //   'text/plain': new Blob([linkToCopie], { type: "text/plain" })
        //     // })
        //   ]
        // );
      } catch (err) {
        console.log(err);
        // const code = err.response && err.response.data;
        setStepOneError("Can't show the thumbnail.");
      } finally {
        setTimeout(()=>{
          setCopiedWithThumbnail(false);
          setStepOneError("")
        },5000)
      }
    } else {
      console.log("thumbnail is not loaded");
    }
  }


  const showWarningMessage=()=>{
    setShowProvidersNotification(true);
    // console.log("showWarningMessage");
  }
  
  // end

  const renderContact = (contact, checked = true) =>
    contact ? (
      <div className={styles.contactsItem} key={contact._id}>
        {(me.freeTrial ||
          me.subscription.level !== "business" ||
          (me.subscription.level === "business" &&
            (contactsSelected.length < 1 ||
              contactsSelected.includes(contact._id)))) &&
          checked && (
            <input
              checked={contactsSelected.includes(contact._id)}
              onChange={handleSelectedContact}
              type="checkbox"
              value={contact._id}
            />
          )}
        <p>
          {contact.firstName} {contact.lastName}
        </p>
        <p>{contact.email}</p>
        <p>{contact.company}</p>
        <p>{contact.job}</p>
      </div>
    ) : (
      <div className={`${styles.contactsItem} ${styles.empty}`}>
        <p>No contacts found</p>
      </div>
    );

  const [show, setShow] = useState(undefined);
  const [listContent, setListContent] = useState({});

  const getContactList = async (id) => {
    const { data } = await mainAPI.get(`/contactLists/${id}`);
    setListContent(data);
  };

  const showList = (id) => {
    if (id === show) setShow(null);
    else {
      setShow(id);
      setListContent(null);
      getContactList(id);
    }
  };

  const renderList = (list) => {
    return list ? (
      <div>
        <div className={styles.listsItem} key={list._id}>
          <input
            checked={listsSelected.includes(list._id)}
            onChange={handleSelectedList}
            type="checkbox"
            value={list._id}
          />
          <p>#{list.uniqueId}</p>
          <p>{list.name}</p>
          <p
            className={styles.contactCount}
            href="#"
            onClick={() => showList(list._id)}
          >
            {list.list.length} contacts
          </p>
        </div>

        <Collapse isOpened={show === list._id && listContent}>
          <div className={styles.listsItemSubRow}>
            {listContent &&
              listContent.list &&
              listContent.list.map((contact) => renderContact(contact, false))}
          </div>
        </Collapse>
      </div>
    ) : (
      <div className={`${styles.listsItem} ${styles.empty}`}>
        <p>No lists found</p>
      </div>
    );
  };

  const RenderStepTwo = () => {
    // TODO: reduce this if possible
    const sortBySelected = (contacts) => {
      const selected = contacts.filter(
        (contact) =>
          contactsSelected.length && contactsSelected.includes(contact._id)
      );
      const inselected = contacts.filter(
        (contact) => !selected.includes(contact)
      );
      return [...selected, ...inselected];
    };

    return (
      <div className={styles.stepTwo}>
        <div>
          <Tabs>
            <TabList>
              <Tab>
                <span className={styles.sectionHeaderOption}>Contacts</span>
              </Tab>
              <Tab>
                <span className={styles.sectionHeaderOption}>Lists</span>
              </Tab>
            </TabList>

            <TabPanel>
              <div className={styles.sectionHeaderButton}>
                <div className={styles.search}>
                  <img src="/assets/common/search.svg" />
                  <input
                    placeholder="Search"
                    onChange={(e) => searchContacts(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => showPopup({ display: "ADD_CONTACT" })}
                  outline={true}
                  size="small"
                >
                  Create contact
                </Button>
                <Button
                  color="secondary"
                  onChange={extractDataFromCSV}
                  size="small"
                  type="file"
                >
                  Import contacts
                </Button>
              </div>
              <div className={styles.contactsHeader}>
                <input
                  checked={
                    (contacts.docs ?? contacts).length ===
                    contactsSelected.length
                  }
                  onChange={(e) => {
                    setContactsSelected(
                      e.target.checked
                        ? (contacts.docs ?? contacts).map((c) => c._id)
                        : []
                    );
                  }}
                  type="checkbox"
                />
                <p>Full name</p>
                <p>Email</p>
                <p>Company</p>
                <p>Job Title</p>
              </div>
              <div className={styles.contactsList}>
                {contacts.totalDocs > 0 &&
                  sortBySelected(contacts.docs).map((contact) =>
                    renderContact(contact)
                  )}
                {!contacts.totalDocs &&
                  contacts.length > 0 &&
                  sortBySelected(contacts).map((contact) =>
                    renderContact(contact)
                  )}
                {(contacts.totalDocs <= 0 ||
                  (!contacts.totalDocs && contacts.length <= 0)) &&
                  renderContact()}
              </div>
            </TabPanel>
            <TabPanel>
              <div className={styles.sectionHeaderButton}>
                <div className={styles.search}>
                  <img src="/assets/common/search.svg" />
                  <input
                    placeholder="Search"
                    onChange={(e) => searchLists(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.listsHeader}>
                <div />
                <p>ID</p>
                <p>Name</p>
                <p>Number of contacts</p>
              </div>
              <div className={styles.listsList}>
                {lists.totalDocs > 0 &&
                  lists.docs.map((list) => renderList(list))}
                {!lists.totalDocs &&
                  lists.length > 0 &&
                  lists.map((list) => renderList(list))}
                {(lists.totalDocs <= 0 ||
                  (!lists.totalDocs && lists.length <= 0)) &&
                  renderList()}
              </div>
            </TabPanel>
          </Tabs>
        </div>

        {stepTwoError && <p className={styles.error}>{stepTwoError}</p>}
      </div>
    );
  };

  const countContact = () => {
    let listsIds = [];
    campaign.share.lists.forEach((l) => {
      if (l.list)
        listsIds = [...listsIds, ...l.list.map((contact) => contact._id)];
    });
    const contacts = [...campaign.share.contacts, ...listsIds].filter(
      (value, index, self) => self.indexOf(value) === index
    );
    return contacts.length;
  };
  const getListNames = () => {
    const limits = 10;
    let listName = [];
    campaign.share.lists.forEach((l) => {
      if (l.name) listName = [...listName, l.name];
    });
    return (
      listName.slice(0, limits).join(", ") +
      (listName.length > limits ? ", ..." : "")
    );
  };

  const handleCopiedLink=()=>{
    setCopied(true)
    navigator.clipboard.writeText("https://test.myfomo.io/campaigns/"+campaign._id) ;
    setTimeout(()=>{
      setCopied(false)
    },3000)
  }
  return (
    <MsalProvider instance={msalInstance}>
      <div className={styles.shareCampaign}>
        {popup.display === "ADD_CONTACT" && (
          <PopupAddContact
            onDone={() => {
              getContacts();
              getLists();
              hidePopup();
              toast.success("Contact added.");
            }}
          />
        )}
        {popup.display === "IMPORT_CONTACTS" && (
          <PopupImportContacts
            me={me}
            onDone={() => {
              getContacts();
              getLists();
              hidePopup();
              toast.success("Contacts imported.");
            }}
          />
        )}
        {popup.display === "QUIT_SHARE" && (
          <PopupQuitShare
            onDone={() => {
              onClose();
              hidePopup();
            }}
          />
        )}

        <div className={styles.backdrop} />
        <div className={styles.box}>
          

         {/* <div className={styles.header}>
            <p className={styles.headerTitle}>Your video campaign</p>
            <img
              onClick={() => showPopup({ display: "QUIT_SHARE" })}
              src="/assets/common/close.svg"
            />
          </div>
          <div className={styles.steps}>
            <div
              className={`${styles.step} ${step === 1 ? styles.current : ""} ${
                step > 1 ? styles.valid : ""
              }`}
            >
              <p>Message</p>
              <div className={styles.stepStatus}>
                <img src="/assets/common/doneWhite.svg" />
              </div>
            </div>
            <div
              className={`${styles.step} ${step === 2 ? styles.current : ""} ${
                step > 2 ? styles.valid : ""
              }`}
            >
              <p>Contacts</p>
              <div className={styles.stepStatus}>
                <img src="/assets/common/doneWhite.svg" />
              </div>
            </div>
            <div
              className={`${styles.step} ${step === 3 ? styles.current : ""} ${
                step > 3 ? styles.valid : ""
              }`}
            >
              <p>Send via</p>
              <div className={styles.stepStatus}>
                <img src="/assets/common/doneWhite.svg" />
              </div>
            </div>
            <div
              className={`${styles.step} ${step === 4 ? styles.current : ""}`}
            >
              <p>Confirmation</p>
              <div className={styles.stepStatus}>
                <img src="/assets/common/doneWhite.svg" />
              </div>
            </div>
          </div> */}

        <div className={styles.header}>
            <p className={styles.backLink} onClick={() => showPopup({ display: "QUIT_SHARE" })}>    Back to video edition</p>

            <img
              onClick={() => showPopup({ display: "QUIT_SHARE" })}
              src="/assets/common/close.svg"
            />
          </div>
          <div className={styles.content}>
            {step === 1 && (
              <form className={styles.stepOne} ref={formDetailsRef}>

                   
            <div  style={{ border:'solid 0px' , display:"flex" ,justifyContent:'space-between' }} >
   
   <div  style={{ border:'solid 0px red'  }} >
     <div className={styles.uploadThumbnail}>
         <label>Thumbnail</label>
         <p className={styles.text}>
           You can upload an image, your logo for example, 
           <br />that will appear in your email.
           <br /> By default there will be no image.
         </p>
         <label
           className={styles.uploadThumbnailArea}
           htmlFor="thumbnail"
         >
           <img 
            src={(!campaign.share || !campaign.share.thumbnail)? "/assets/common/thumbnail.svg" : campaign.share.thumbnail} 
            className={(campaign.share && campaign.share.thumbnail)? styles.thumbnailSecStyle : ''}
           />

           {!thumbnailLoading && <p>Download image</p>}
           {thumbnailLoading && <p>Downloading...</p>}
         </label>
         <input
           accept="image/*"
           id="thumbnail"
           type="file"
           onChange={(e) => uploadThumbnail(e.target.files[0])}
           className={styles.uploadThumbnailInput}
         />
          {(campaign.share && campaign.share.thumbnail) && (
            <div>
              <p
                className={styles.removeThumbnail}
                onClick={removeThumbnail}
              >
                Remove thumbnail
              </p>
            </div>
          )}
         {/* {campaign.share && campaign.share.thumbnail && (
           <div>
             <img
               className={styles.uploadThumbnailPreview}
               src={campaign.share.thumbnail}
             />
             <p
               className={styles.removeThumbnail}
               onClick={removeThumbnail}
             >
               Remove thumbnail
             </p>
           </div>
         )} */}
         <p className={styles.uploadThumbnailRecoSize}>
           (Recommended format: 16/9)
         </p>
       </div>
     </div> 
        
   <div style={{ border:'solid 0px green' ,paddingTop:50 , display: "flex",flexDirection: "column" , paddingRight:10,    alignItems: "center" }} >

              <div className={styles.fomoCopyLinksContainer}>
                  <a
                    href={false}
                    className={copiedWithThumbnail ? styles.buttonLinkSuccess : styles.buttonLinkWithThumb }
                    onClick={handleCopiedLinkWithThumbnail}
                  >              
                    <img className={styles.imgLinkWithThumb} src={`/assets/common/${copiedWithThumbnail ? 'doneWhite' : 'cpThumbFull'}.svg`} />

                    {copiedWithThumbnail ? 'Copied' : `Copy link  + thumbnail`}

                    {/* <input
                      accept="image/*"
                      id="linkandthumbnail"
                      type="file"
                      onChange={(e) => uploadThumbnailForLink(e.target.files[0])}
                      className={styles.uploadThumbnailForLinkInput}
                    /> */}
                  
                  </a>
                  
                  <a
                    href={false}
                    className={copied ? styles.buttonLinkSuccess : styles.buttonLink}
                    onClick={handleCopiedLink}
                  >              
                    <img className={styles.imgLink} src={`/assets/common/${copied ? 'doneWhite' : 'link'}.svg`} />

                    {copied ? 'Copied' : 'Copy links'}
                  
                  </a>
              </div>
              <div className={styles.socialShareAndBtImage} style={{ "margin-top": '35px' }}>
                {/* <img className={styles.imgLinkBottom} src="/assets/common/linkBottom.svg" /> */}
                <div style={{ border:'solid 0px black', display: "flex" , alignItems:'center', flexDirection:'row' }} >

                  <img className={styles.shareRow} src="/assets/common/shareRow.svg" />
                  <label>Social Share</label>
                </div>

                <div style={{ border:'solid 0px black', display: "flex" , justifyContent:'space-between',    alignItems: "center" }} >
                  <img className={styles.socialImg} src="/assets/socials/group.svg" />
                </div>
              </div>



   </div> 
     </div> 

     <div  style={{ border:'solid 0px black', padding:20,  display:"flex" ,justifyContent:'space-between' ,background: 'white', boxShadow:'0px 4px 4px 5px rgba(0, 0, 0, 0.06)',borderRadius: 6 }} >
     <div  style={{ border:'solid 0px red' ,width:'40%' }} >

     <div style={{ marginBottom:30, display: "flex" , alignItems:'center', flexDirection:'row' }} >

    <img className={styles.mailShare} src="/assets/common/mail.svg" />
    <h2 className={styles.EmailTitle}>Email Share </h2>
     
      </div>
  
     <RenderStepTree sendVia={sendVia} setSendVia={setSendVia} />
     </div>
     <div style={{ border:'solid 0px green' ,width:'55%' }} >
              
                 <div style={{display:'flex',flexDirection: "row",  alignItems: "end" , width:"100%"}}>
                  <div className={styles.detailsMessageHeader}>
                  <label>Subject: </label>
                  </div>
                  <input   onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        subject: e.target.value,
                      })
                    }
                    required
                    value={formDetails.subject}
                    type="text" />                
                  </div>

                <div style={{display:'flex',flexDirection: "row",marginTop:20,  alignItems: "start" , width:"100%"}}>
                  <div className={styles.detailsMessageHeader}>
                  <label>Message: </label>
                  </div>
                    
                  <textarea
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        message: e.target.value,
                      })
                    }
                    ref={textareaMessageRef}
                    type="text"
                    value={formDetails.message}
                  />
                  </div>
</div>

      </div>
              </form>
            )}
            {step === 2 && RenderStepTwo()}
            {/* {step === 3 && (
              <RenderStepTree sendVia={sendVia} setSendVia={setSendVia} />
            )} */}
            {step === 3 && (
              <div className={styles.stepFour}>
                <p className={styles.title}>Your video is ready to be sent.</p>
                <p className={styles.text}>
                  Review the summary below before sending your video.
                </p>
                <div className={styles.summary}>
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryItemHeader}>
                      <div className={styles.summaryChecked}>
                        <img src="/assets/common/doneWhite.svg" />
                      </div>
                      <p>Message</p>
                      <span onClick={() => setStep(1)}>
                        Return to this step
                      </span>
                    </div>
                    <div className={styles.summaryItemContent}>
                      <p>
                        <b>Subject: </b>
                        {campaign.share.subject}
                      </p>
                      <p>
                        <b>From: </b>
                        {formDetails.from}
                      </p>
                      <p>
                        <b>Message: </b>
                        {(campaign.share.message &&
                          campaign.share.message.trim()) ||
                          "none"}
                      </p>
                      <div>
                        <b>Thumbnail: </b>
                        {campaign.share && campaign.share.thumbnail ? (
                          <div>
                            <br />
                            <img
                              className={styles.summaryThumbnailPreview}
                              src={campaign.share.thumbnail}
                            />
                          </div>
                        ) : (
                          "none"
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryItemHeader}>
                      <div className={styles.summaryChecked}>
                        <img src="/assets/common/doneWhite.svg" />
                      </div>
                      <p>Contacts</p>
                      <span onClick={() => setStep(2)}>
                        Return to this step
                      </span>
                    </div>
                    <div className={styles.summaryItemContent}>
                      <p>
                        <b>Contacts: </b>
                        {countContact()} selected
                      </p>
                      <p>
                        <b>Lists: </b>
                        {campaign.share.lists.length} selected
                        {campaign.share.lists.length &&
                        campaign.share.lists.length < 10
                          ? ` ( ${getListNames()} )`
                          : ``}
                      </p>
                    </div>
                  </div>
                </div>
                {stepFourError && (
                  <p className={styles.error}>{stepFourError}</p>
                )}
              </div>
            )}
          </div>
          <div className={styles.footer}>
            <div>
              {step > 1 && (
                <Button outline={true} onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
            </div>
            <div>
              {step < 3 && (
                <Button
                // optimize
                  disabled={(step == 1 && (!sendVia || !sendVia.google || !sendVia.google.credentials) && (!sendVia || !sendVia.microsoft || sendVia.microsoft.accessTokent))}
                  onClick={next}
                  onMouseEnter={showWarningMessage}
                  alt={showProvidersNotification? 'Please select a provider to continue' : ''}
                >
                  {step==1 ? "Select Contacts" : "Next"}
                </Button>
              )}
              {/* {(showProvidersNotification && step==1) && (
                <Popup
                  title={'Select a provider'}
                  showCloseIcon={true}
                >Please select a provider to continue</Popup>
              )} */}
              {step === 3 && (
                <Button loading={shareLoading} onClick={share}>
                  Share
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MsalProvider>
  );
};

export default Share;
