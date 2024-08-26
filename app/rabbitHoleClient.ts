interface updateUserProfileInterface {
    accessToken: string,
    profile: {
      name: string,
      assistantName: string,
      assistantVoice: string,
      email: string,
      locations: Array<LocationInterface>
      dietaryPreferences: {
        restrictions: string,
        preferences: string
      }
    }
  }
  interface LocationInterface {
    name: string,
    address: {
      street: string,
      street2: string, //optional
      country: string,
      city: string,
      state: string,
      zip: string
    }
  }
  interface addOrUpdateLocationInterface {
    accessToken: string,
    location: LocationInterface,
    deleteLocationName: string
  }
  interface createLessonInterface {
    accessToken: string,
    lesson: {
      domain: string,
      name: string,
      description: string
    }
  }
  interface deleteConnectionStorageInterface {
    accessToken: string,
    appId: string
  }
  interface deleteLessonInterface {
    accessToken: string,
    lessonId: string
  }
  interface devResetUserInterface {
    accessToken: string
  }
  interface setDeviceLostInterface {
    accessToken: string,
    deviceLost: boolean,
    message: string //optional
  }
  interface updateJournalEntryInterface {
    accessToken: string,
    entryId: string,
    deleteEntry: boolean, //optional
    newTextContent: string, //optional and currently doesn't work
  }
  interface updateLessonInterface {
    accessToken: string,
    lessonId: string,
    lesson: {
      name: string, //optional
      description: string //optional
    }
  }
//@ts-ignore  
class rabbitHoleClient {
    accessToken: string;
    constructor(accessToken: string) {
      this.accessToken = accessToken;
    }  
  
    async rabbitGetRequest(url: string) {
      return await fetch(url, {
        "headers": {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "no-cache",
          "pragma": "no-cache",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Linux\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "Referer": "https://hole.rabbit.tech/teach-mode/lessons/test-twitter/record",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      });
    }
    async rabbitPostRequest(url: string, payload: object) {
      return await fetch(url, {
        "headers": {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "no-cache",
          "content-type": "application/json",
          "pragma": "no-cache",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Linux\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "Referer": "https://hole.rabbit.tech/teach-mode/lessons/test-twitter/record",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": JSON.stringify(payload),
        "method": "POST"
      });
    }
    async fetchIsUserEntitledTeachMode() {
      return await this.rabbitGetRequest(`https://hole.rabbit.tech/apis/fetchIsUserEntitledTeachMode?accessToken=${this.accessToken}`)
    }
    async fetchJournalEntry(entryId: string) {
      return await this.rabbitGetRequest(`https://hole.rabbit.tech/apis/fetchJournalEntry?accessToken=${this.accessToken}&entryId=${entryId}`);
    }
    //urls is an array with urls ofc, example: imgs from magic cam
    async fetchJournalEntryResources(urls: Array<String>) {
      let convertedURLs = "[";
      for(const url of urls) {
        convertedURLs+=`"${url}",`;
      }
      //replaces last character in the string
      convertedURLs = convertedURLs.replace(/.$/,"]")
      return await this.rabbitGetRequest(`https://hole.rabbit.tech/apis/fetchJournalEntryResources?accessToken=${this.accessToken}&urls=${encodeURIComponent(convertedURLs)}`);
    }
    async fetchLesson(lessonId: string) {
      return await this.rabbitGetRequest(`https://hole.rabbit.tech/apis/fetchLesson?accessToken=${this.accessToken}&lessonId=${lessonId}`);
    }
    async fetchMyLessons() {
      return await this.rabbitGetRequest(`https://hole.rabbit.tech/apis/fetchMyLessons?accessToken=${this.accessToken}`);
    }
    async fetchMySessions() {
      //might fill with `fetchLessons` but I'm not sure if that's different
      return await this.rabbitGetRequest(`https://hole.rabbit.tech/apis/fetchMySessions?accessToken=${this.accessToken}`);
    }
    async fetchUserProfile() {
      return await this.rabbitGetRequest(`https://hole.rabbit.tech/apis/fetchUserProfile?accessToken=${this.accessToken}`);
    }
  
    /**
     * @param {string} deviceId optional
     */
    async linkDevice(userId: string, linkingPasscode: string, deviceId: string) {
      //deviceId is optional according to the API??
      return await this.rabbitGetRequest(`https://hole.rabbit.tech/apis/linkDevice?userId=${userId}&linkingPasscode=${linkingPasscode}&deviceId=${deviceId}`);
    }
  
    //PATCH
    async updateUserProfile(payload: updateUserProfileInterface) {
      return await fetch("https://hole.rabbit.tech/apis/updateUserProfile", {
        "headers": {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "no-cache",
          "content-type": "application/json",
          "pragma": "no-cache",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Linux\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "Referer": "https://hole.rabbit.tech/teach-mode/lessons/test-twitter/record",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": JSON.stringify(payload),
        "method": "PATCH"
      });
    }
  
    //POST
    async acceptSocialTerms() {
      return await this.rabbitPostRequest("https://hole.rabbit.tech/apis/acceptSocialTerms", {accessToken: this.accessToken});
    }
    async addOrUpdateLocation(payload: addOrUpdateLocationInterface) {
      return await this.rabbitPostRequest("https://hole.rabbit.tech/apis/addOrUpdateLocation", payload);
    }
    async bigRedButton() {
      //uhhhh idk how to read that webpack shit and its in some other api docs that get
      //passed to the user so if you want to, implement it. It's not like you're going
      //to use it since you can't :p
      return {};
    }
    async createLesson(payload: createLessonInterface) {
      return await this.rabbitPostRequest("https://hole.rabbit.tech/apis/createLesson", payload);
    }
    async deleteConnectionStorage(payload: deleteConnectionStorageInterface) {
      return await this.rabbitPostRequest("https://hole.rabbit.tech/apis/deleteConnectionStorage", payload);
    }
    async deleteLesson(payload: deleteLessonInterface) {
      return await this.rabbitPostRequest("https://hole.rabbit.tech/apis/deleteLesson", payload);
    }
    async devResetUser(payload: devResetUserInterface) {
      //the payload only cosists of an `accessToken` but for the user's safety it isnt as easy to use lol
      return await this.rabbitPostRequest("https://hole.rabbit.tech/apis/devResetUser", payload);
    }
    async fetchDeviceState() {
      return await this.rabbitPostRequest("https://hole.rabbit.tech/apis/fetchDeviceState", {accessToken: this.accessToken});
    }
    async fetchSessionState() {
      //returns an empty object but I still decided to recreate it here.
      return await this.rabbitPostRequest("https://hole.rabbit.tech/apis/fetchSessionState", {accessToken: this.accessToken});
    }
    async fetchUserConnectionState() {
      return await this.rabbitPostRequest("https://hole.rabbit.tech/apis/fetchUserConnectionState", {accessToken: this.accessToken});
    }
    async fetchUserExpediaBookingEntries() {
      return await this.rabbitPostRequest("https://hole.rabbit.tech/apis/fetchUserExpediaBookingEntries", {accessToken: this.accessToken});
    }
    async fetchUserExpediaBookingEntry(entryId: string) {
      return await this.rabbitPostRequest("https://hole.rabbit.tech/apis/fetchUserExpediaBookingEntry", {accessToken: this.accessToken, entryId: entryId});
    }
    async fetchUserJournal() {
      return await this.rabbitPostRequest("https://hole.rabbit.tech/apis/fetchUserJournal", {accessToken: this.accessToken});
    }
    async generateLinkingPasscode() {
      return await this.rabbitPostRequest("https://hole.rabbit.tech/apis/generateLinkingPasscode", {accessToken: this.accessToken});
    }
    async sendResetPasswordEmail() {
    return await this.rabbitPostRequest("https://hole.rabbit.tech/apis/sendResetPasswordEmail", {accessToken: this.accessToken});
    }
    async setDeviceLost(payload: setDeviceLostInterface) {
      return await this.rabbitPostRequest("https://hole.rabbit.tech/apis/setDeviceLost", payload);
    }
    async unlinkDevice() {
      return await this.rabbitPostRequest("https://hole.rabbit.tech/apis/unlinkDevice", {accessToken: this.accessToken});
    }
    async updateJournalEntry(payload: updateJournalEntryInterface) {
      return await this.rabbitPostRequest("https://hole.rabbit.tech/apis/updateJournalEntry", payload);
    }
    async updateLesson(payload: updateLessonInterface) {
      return await this.rabbitPostRequest("https://hole.rabbit.tech/apis/updateLesson", payload);
    }
  }

export default new rabbitHoleClient("token");