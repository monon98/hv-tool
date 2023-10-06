export function setPrices() {
  const buyPrice = getPrice("market_itemorders", 1);
  const sellPrice = getPrice("market_itemorders", 0);
  // 比较价格
  if (sellPrice * 0.9 > buyPrice) {
    setPrice("market_placeorder", 0);
    setPrice("market_placeorder", 1, "1000");
    //   GM_notification({ text: "订单数据已自动填充", timeout: 1000 });
  }
}

// 设置价格
function setPrice(className: string, index: number, num: string = "0") {
  const classDiv = document.getElementsByClassName(className);
  if (classDiv) {
    const tbody = classDiv[index].getElementsByTagName("tbody")[0];
    const tr = tbody.getElementsByTagName("tr");
    tr[0].getElementsByTagName("td")[1].getElementsByTagName("input")[1].value =
      num;
    if (num === "0") {
      tr[2].getElementsByTagName("td")[0].click();
    }
    tr[4].getElementsByTagName("td")[0].click();
    tr[3]
      .getElementsByTagName("td")[0]
      .getElementsByTagName("input")[0].style.backgroundColor = "#ff0000";
    //   tr[3]
    //     .getElementsByTagName("td")[0]
    //     .getElementsByTagName("input")[0].click();
  }
}

// 获取价格
function getPrice(className: string, index: number): number {
  const classDiv = document.getElementsByClassName(className);
  if (classDiv) {
    const tbody = classDiv[index].getElementsByTagName("tbody")[0];
    const tr = tbody.getElementsByTagName("tr");
    return (
      Number(
        tr[1]
          .getElementsByTagName("td")[1]
          .innerHTML.split(" ")[0]
          .split(",")
          .join("")
      ) || 0
    );
  }
  return 0;
}
