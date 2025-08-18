import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  ns: ["marketplace"],
  defaultNS: "marketplace",
  resources: {
    en: {
      marketplace: {
        place_bid: "Place a Bid",
        like: "Like",
        unlike: "Unlike",
        highest_bid: "Highest Bid",
        auction_ended: "Auction Ended",
      },
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
