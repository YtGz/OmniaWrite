import { Client, Account, Storage, ID, Query } from "appwrite";
import { appState, settings } from "./stores.svelte";

const APP_ENDPOINT = process.env.APPWRITE_ENDPOINT;
const APP_PROJECT = process.env.APPWRITE_PROJECT;
const APP_EXT_HOST = window.location.origin + "/";
const APP_BUCKET_ID = process.env.APPWRITE_BUCKET_ID || "backups";

const client = new Client();

client
  .setEndpoint(APP_ENDPOINT)
  .setProject(APP_PROJECT)
  .setLocale(settings.language || "en");

const account = new Account(client);
const storage = new Storage(client);

const cloud = {
  currentUser: null,
  /**
   * Registers new user.
   * @param {string} name Fullname of the user.
   * @param {string} email E-mail of the user.
   * @param {string} pass Password of the user.
   * @returns Promise<user>
   */
  register: (name, email, pass) => {
    return account.create(ID.unique(), email, pass, name);
  },
  /**
   * Send verify email to user.
   * @returns Promise<response>
   */
  createConfirmation: () => {
    return account.createVerification(APP_EXT_HOST + "#/verify-account");
  },
  /**
   * Checks if user is logged in.
   * @returns Promise<boolean>
   */
  isUserLoggedIn: async () => {
    return account.get().then(user => {
      cloud.currentUser = user.$id;
      return user;
    });
  },
  /**
   * Checks if user is logged in.
   * @returns Promise<boolean>
   */
  getUser: () => {
    return account.get();
  },
  /**
   * Send password recovery email.
   * @param {string} mail Email of user.
   * @returns Promise<repsonse>
   */
  recoverPassword: mail => {
    return account.createRecovery(mail, APP_EXT_HOST + "#/reset-password");
  },
  /**
   * Confirm and change password from recovery.
   * @param {string} user User token.
   * @param {string} secret Secret token.
   * @param {string} password New password.
   * @returns Promise<response>
   */
  confirmPassword: (user, secret, password) => {
    return account.updateRecovery(user, secret, password);
  },
  /**
   * Verify account.
   * @param {string} id
   * @param {string} token
   * @returns Promise<response>
   */
  confirm: (id, token) => {
    return account.updateVerification(id, token);
  },
  /**
   * Login user and sets user ID in appState.
   * @param {string} user E-Mail
   * @param {string} pass Password
   * @returns Promise<session>
   */
  login: (user, pass) => {
    return account.createEmailPasswordSession(user, pass);
  },
  /**
   * Logs out session form user.
   * @param {string} id Session ID
   * @returns Promise<response>
   */
  logoutSession: id => {
    return account.deleteSession(id);
  },
  /**
   * @param {string} id Backup ID
   * @returns Promise<response>
   * Set Cloud Timestamp from specific file
   */
  setCloudTimestamp: id => {
    return storage.getFile(APP_BUCKET_ID, id).then(response => {
      appState.updateCloudTimestamp(new Date(response.$createdAt).getTime() / 1000);
    });
  },
  /**
   * Saves all stores into cloud.
   * @returns Promise<boolean>
   */
  saveToCloud: () => {
    const keys = [
      "cards",
      "chapters",
      "projects",
      "scenes",
      "state",
      "tabs",
      "intern",
      "settings",
    ].reduce((obj, key) => {
      obj[key] = localStorage.getItem(key);
      return obj;
    }, {});
    let blob = new Blob(["\ufeff", JSON.stringify(keys)], {
      type: "application/json",
    });

    return storage
      .createFile(
        APP_BUCKET_ID,
        ID.unique(),
        new File([blob], `user:${cloud.currentUser}.json`)
      )
      .then(response => {
        appState.updateCloudTimestamp(new Date(response.$createdAt).getTime() / 1000);
        return response;
      });
  },
  /**
   * Get Security log from account.
   */
  getSecurityLog: () => {
    return account.listLogs();
  },
  /**
   * Get Sessions from account.
   */
  getSessions: () => {
    return account.listSessions();
  },
  /**
   * Restore from a backup.
   * @param {string} id Backup ID
   * @returns Promise<response>
   */
  restoreBackup: async id => {
    const fileUrl = storage.getFileView(APP_BUCKET_ID, id);
    const response = await fetch(fileUrl, {
      method: "GET",
      credentials: "include",
      mode: "cors",
    });
    if (!response.ok) throw new Error("Something went wrong");
    const data = await response.json();
    const dataObject = Object.keys(data);
    dataObject.forEach(k => localStorage.setItem(k, data[k]));
    await cloud.setCloudTimestamp(id);
    return true;
  },
  /**
   * Get all backups.
   */
  getAllBackups: () => {
    return storage.listFiles(
      APP_BUCKET_ID,
      [
        Query.limit(25),
        Query.orderDesc("$createdAt"),
        Query.search("name", `user:${cloud.currentUser}.json`)
      ]
    );
  },
  /**
   * Get latest backup.
   */
  getLatestBackup: () => {
    return storage.listFiles(
      APP_BUCKET_ID,
      [
        Query.limit(1),
        Query.orderDesc("$createdAt")
      ]
    );
  },
  /**
   * Update e-mail.
   * @param {string} mail New e-mail.
   * @param {string} pass Current password.
   * @returns Promise<response>
   */
  updateEmail: (mail, pass) => {
    return account.updateEmail(mail, pass);
  },
  /**
   * Update name.
   * @param {string} name New name.
   * @returns Promise<response>
   */
  updateName: name => {
    return account.updateName(name);
  },
  /**
   * Update password.
   * @param {string} pass New password.
   * @param {string} old Current password.
   * @returns Promise<response>
   */
  updatePassword: (pass, old) => {
    return account.updatePassword(pass, old);
  },
};

export default cloud;
