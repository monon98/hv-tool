import { bindEvents } from "./tools/item_price";

const search = location.search;

// item price
const itemPriceSearch = ["?s=Bazaar&ss=es", "?s=Forge&ss=up", "?s=Bazaar&ss=ml"];
if (itemPriceSearch.includes(search)) {
  setTimeout(bindEvents, 500);
}
