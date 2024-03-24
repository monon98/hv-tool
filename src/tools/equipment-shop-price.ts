import { GM_notification, GM_xmlhttpRequest } from "$";

/**
 * Materials Prices按钮绑定事件
 */ 
export function bindButtonEvents() {
  // 武器店页面
  setBindEvents("hvut-es-side", 5);
  // 装备强化页面
  setBindEvents("hvut-up-buttons", 2);
  // 装备强化页面
  setBindEvents("hvut-ml-side", 2);
}

/**
 * 设置价格按钮事件监听
 * @param name button的class类名
 * @param index  name下子元素的顺序
 * @returns 
 */
function setBindEvents(name: string, index: number) {
  const classDiv = document.getElementsByClassName(name)[0];
  if (!classDiv) {
    return;
  }
  const inputElement = classDiv.getElementsByTagName("input")[index];
  if (inputElement) {
    inputElement.onclick = () => {
      inquire();
    };
    inputElement.style.backgroundColor = "#ff0000";
  }
}

/**
 * 询价
 */
function inquire() {
  const isIsekai = window.location.href.includes("isekai");
  const url = isIsekai
    ? "https://hentaiverse.org/isekai/?s=Bazaar&ss=mk&screen=browseitems&filter=ma"
    : "https://hentaiverse.org/?s=Bazaar&ss=mk&screen=browseitems&filter=ma";
  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "sec-ch-ua":
        '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
    },
    onload: function (response) {
      const itemPriceList: string[] = dealInquireText(response.responseText);
      // 获取到最新数据后，自动填充
      const textareaElement = document.getElementsByTagName("textarea")[0];
      if (textareaElement) {
        setPriceInput(textareaElement, itemPriceList);
      }
    },
  });
}

/**
 * 询价接口数据处理
 * @param text 
 * @returns {Array<string>}
 */
function dealInquireText(text = "") {
  let domparser = new DOMParser();
  let doc = domparser.parseFromString(text, "text/html");
  const itemPriceList: Array<string> = [];
  const marketItemListDiv = doc.getElementById("market_itemlist");
  const marketItemList =
    marketItemListDiv
      ?.getElementsByTagName("table")[0]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr") || [];

  for (let i = 0; i < marketItemList.length; i++) {
    const itemName =
      marketItemList[i].getElementsByTagName("td")?.[0]?.innerText;
    const itemPrice = marketItemList[i]
      .getElementsByTagName("td")?.[3]
      ?.innerText.split(" ")[0];
    if (itemName && itemPrice) {
      itemPriceList.push(`${itemName} @ ${itemPrice}`);
    }
  }
  if (itemPriceList.length === 0) {
    GM_notification({ text: "出现异常，暂无数据", timeout: 3000 });
  }
  return itemPriceList;
}

/***
 * 填充价格输入框
 * @param textareaElement 
 * @param itemPriceList 
 */
function setPriceInput(textareaElement: HTMLTextAreaElement, itemPriceList: string[]) {
  if (!textareaElement || itemPriceList.length === 0) {
    return;
  }
  textareaElement.value = `${itemPriceList.join("\n")}`;
  GM_notification({ text: "价格数据已更新，请点击保存", timeout: 3000 });
}
