import { bindEvents } from "./tools/item_price";
import { setPrices } from "./tools/market_help";

const search = location.search;

// item price
const itemPriceSearch = ["?s=Bazaar&ss=es", "?s=Forge&ss=up", "?s=Bazaar&ss=ml"];
if (itemPriceSearch.includes(search)) {
  setTimeout(bindEvents, 500);
}

// market help
if (search.startsWith('?s=Bazaar&ss=mk&screen=browseitems')) {
  setTimeout(setPrices, 500);
}