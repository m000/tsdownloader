var myWindowId;
const urls = document.querySelector("#urls");
const monitor = document.querySelector("#monitor");

/*
Make url box editable when mouse is over the side panel.
*/
window.addEventListener("mouseover", () => {
  urls.setAttribute("contenteditable", true);
});

/*
When the user mouses out, save the current contents of the box.
*/
window.addEventListener("mouseout", () => {
  urls.setAttribute("contenteditable", false);
  browser.tabs.query({windowId: myWindowId, active: true}).then((tabs) => {
    let contentToStore = {};
    contentToStore[tabs[0].url] = urls.textContent;
    browser.storage.local.set(contentToStore); // YYY
  });
});

/*
Update the sidebar's content.

1) Get the active tab in this sidebar's window.
2) Get its stored content.
3) Put it in the content box.
*/
function updateContent() {
  browser.tabs.query({windowId: myWindowId, active: true})
    .then((tabs) => {
      return browser.storage.local.get(tabs[0].url); // YYY
    })
    .then((storedInfo) => {
      urls.textContent = storedInfo[Object.keys(storedInfo)[0]];
    });
}

/*
Update content when a new tab becomes active.
*/
browser.tabs.onActivated.addListener(updateContent);

/*
Update content when a new page is loaded into a tab.
*/
browser.tabs.onUpdated.addListener(updateContent);

/*
Monitors toggle switch to turn monitoring for ts files on/off.
*/
monitor.addEventListener("input", function (event) {
  if (event.target.checked == true){
    // XXX: listener will intercept requests from *any* tab
    browser.webRequest.onBeforeRequest.addListener(logURL, {
        urls: ["*://*/*.ts"]
    });
    console.log("hello");
  } else {
    browser.webRequest.onBeforeRequest.removeListener(logURL);
    console.log("world");
  }
});

/*
Log intercepted urls to the console.
*/
function logURL(requestDetails) {
  console.log("Loading: " + requestDetails.url);
  urls.textContent += requestDetails.url + "\n";
  /*
    var dl = browser.downloads.download({
        "url": requestDetails.url,
        "filename": "foo.mp4"
    });
    */
}

/*
When the sidebar loads, get the ID of its window, and update its content.
*/
browser.windows.getCurrent({populate: true}).then((windowInfo) => {
  myWindowId = windowInfo.id;
  updateContent();
});
