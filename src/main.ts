import { bindButtonEvents } from "./tools/equipment-shop-price";
import { setBuyPrices } from "./tools/market-price-setting";

const search = location.search;

// equipment shop price button
const equipmentShopKeys: string[] = ["?s=Bazaar&ss=es", "?s=Forge&ss=up", "?s=Bazaar&ss=ml"];
const isEquipmentShop: boolean = equipmentShopKeys.some(key => search.includes(key));
if (isEquipmentShop) {
  setTimeout(bindButtonEvents, 500);
}

// market help
if (search.startsWith('?s=Bazaar&ss=mk&screen=browseitems')) {
  setTimeout(setBuyPrices, 500);
}