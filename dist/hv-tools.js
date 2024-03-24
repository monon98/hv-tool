// ==UserScript==
// @name         hv-tools
// @namespace    https://github.com/monon98
// @version      0.0.2
// @author       monon98
// @description  基于HV Utils使用，增强功能
// @icon         https://hentaiverse.org/isekai/y/favicon.png
// @match        *://hentaiverse.org/isekai/?s=Bazaar&ss=es*
// @match        *://hentaiverse.org/?s=Bazaar&ss=es*
// @match        *://hentaiverse.org/isekai/?s=Forge&ss=up*
// @match        *://hentaiverse.org/?s=Forge&ss=up*
// @match        *://hentaiverse.org/?s=Bazaar&ss=ml*
// @match        *://hentaiverse.org/isekai/?s=Bazaar&ss=mk&screen=*&filter=*&itemid=*
// @match        *://hentaiverse.org/?s=Bazaar&ss=mk&screen=*&filter=*&itemid=*
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
  'use strict';

  var _GM_notification = /* @__PURE__ */ (() => typeof GM_notification != "undefined" ? GM_notification : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  let dataList = [];
  function bindEvents() {
    setBindEvents("hvut-es-side", 5);
    setBindEvents("hvut-up-buttons", 2);
    setBindEvents("hvut-ml-side", 2);
  }
  function setBindEvents(name, index) {
    const classDiv = document.getElementsByClassName(name)[0];
    if (!classDiv) {
      return;
    }
    const inputElement = classDiv.getElementsByTagName("input")[index];
    if (inputElement) {
      inputElement.onclick = () => {
        sendResponse();
      };
      inputElement.style.backgroundColor = "#ff0000";
    }
  }
  function sendResponse() {
    const isIsekai = window.location.href.includes("isekai");
    const url = isIsekai ? "https://hentaiverse.org/isekai/?s=Bazaar&ss=mk&screen=browseitems&filter=ma" : "https://hentaiverse.org/?s=Bazaar&ss=mk&screen=browseitems&filter=ma";
    _GM_xmlhttpRequest({
      method: "GET",
      url,
      headers: {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "sec-ch-ua": '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1"
      },
      onload: function(response) {
        getItemPrices(response.responseText);
        const textareaElement = document.getElementsByTagName("textarea")[0];
        if (textareaElement) {
          setItemPrices(textareaElement);
        }
      }
    });
  }
  function getItemPrices(html = "") {
    var _a, _b, _c, _d;
    let domparser = new DOMParser();
    let doc = domparser.parseFromString(html, "text/html");
    dataList = [];
    const marketItemListDiv = doc.getElementById("market_itemlist");
    const marketItemList = (marketItemListDiv == null ? void 0 : marketItemListDiv.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")) || [];
    for (let i = 0; i < marketItemList.length; i++) {
      const itemName = (_b = (_a = marketItemList[i].getElementsByTagName("td")) == null ? void 0 : _a[0]) == null ? void 0 : _b.innerText;
      const itemPrice = (_d = (_c = marketItemList[i].getElementsByTagName("td")) == null ? void 0 : _c[3]) == null ? void 0 : _d.innerText.split(" ")[0];
      if (itemName && itemPrice) {
        dataList.push(`${itemName} @ ${itemPrice}`);
      }
    }
    if (dataList.length === 0) {
      _GM_notification({ text: "出现异常，暂无数据", timeout: 3e3 });
      return;
    }
  }
  function setItemPrices(textareaElement) {
    if (!textareaElement || dataList.length === 0) {
      return;
    }
    textareaElement.value = `${dataList.join("\n")}`;
    _GM_notification({ text: "价格数据已更新，请点击保存", timeout: 3e3 });
  }
  function setPrices() {
    const buyPrice = getPrice("market_itemorders", 1);
    const sellPrice = getPrice("market_itemorders", 0);
    if (sellPrice * 0.9 > buyPrice) {
      setPrice("market_placeorder", 0);
      let num = "1000";
      if (sellPrice < 500) {
        num = "10000";
      } else if (sellPrice < 2e3) {
        num = "5000";
      } else if (sellPrice < 5e3) {
        num = "2000";
      } else if (sellPrice < 1e4) {
        num = "1000";
      } else if (sellPrice < 5e4) {
        num = "200";
      } else {
        num = "100";
      }
      setPrice("market_placeorder", 1, num);
    }
    setListens();
  }
  function setPrice(className, index, num = "0") {
    const classDiv = document.getElementsByClassName(className);
    if (classDiv) {
      const tbody = classDiv[index].getElementsByTagName("tbody")[0];
      const tr = tbody.getElementsByTagName("tr");
      tr[0].getElementsByTagName("td")[1].getElementsByTagName("input")[1].value = num;
      if (num === "0") {
        tr[2].getElementsByTagName("td")[0].click();
      }
      tr[4].getElementsByTagName("td")[0].click();
      tr[3].getElementsByTagName("td")[0].getElementsByTagName("input")[0].style.backgroundColor = "#ff0000";
    }
  }
  function getPrice(className, index) {
    const classDiv = document.getElementsByClassName(className);
    if (classDiv) {
      const tbody = classDiv[index].getElementsByTagName("tbody")[0];
      const tr = tbody.getElementsByTagName("tr");
      return Number(
        tr[1].getElementsByTagName("td")[1].innerHTML.split(" ")[0].split(",").join("")
      ) || 0;
    }
    return 0;
  }
  function setListens() {
    document.addEventListener("keydown", function(event) {
      if (event.key === "a") {
        setListen("market_itemheader", 0);
      } else if (event.key === "d") {
        setListen("market_itemheader", 2);
      } else if (event.key === "w") {
        setListen("sellorder_update");
      } else if (event.key === "s") {
        setListen("buyorder_update");
      }
    });
  }
  function setListen(idName, index = -1) {
    var _a;
    if (index > -1) {
      const div = document.querySelector(
        `#${idName} div:nth-child(${index + 1})`
      );
      (_a = div == null ? void 0 : div.querySelector("a")) == null ? void 0 : _a.click();
    } else {
      const div = document.getElementById(idName);
      div == null ? void 0 : div.click();
    }
  }
  const search = location.search;
  const itemPriceSearch = ["?s=Bazaar&ss=es", "?s=Forge&ss=up", "?s=Bazaar&ss=ml"];
  if (itemPriceSearch.includes(search)) {
    setTimeout(bindEvents, 500);
  }
  if (search.startsWith("?s=Bazaar&ss=mk&screen=browseitems")) {
    setTimeout(setPrices, 500);
  }

})();
