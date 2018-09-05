var foo = 0;
document.addEventListener("click", function(e) {
  if (!e.target.classList.contains("page-choice")) {
    return;
  }

  var chosenPage = "https://" + e.target.textContent;
  /*
  browser.tabs.create({
    url: chosenPage
  });
  */

  /*
  var foo = browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT})
  .then(tabs => browser.tabs.get(tabs[0].id))
  .then(tab => {
    console.info(tab);
  });
  */
  console.info(foo++);
  console.info(bar++);
});
