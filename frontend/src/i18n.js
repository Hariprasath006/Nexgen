import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {

  en:{
    translation:{
      logo:"FreshShop",
      categories:"Categories",
      language:"Language",
      help:"Help",
      search:"Search snacks...",
      add:"Add to Cart"
    }
  },

  hi:{
    translation:{
      logo:"अमेज़न स्नैक्स",
      categories:"श्रेणियाँ",
      language:"भाषा",
      help:"मदद",
      search:"नाश्ता खोजें...",
      add:"कार्ट में जोड़ें"
    }
  },

  ta:{
    translation:{
      logo:"அமேசான் ஸ்நாக்ஸ்",
      categories:"வகைகள்",
      language:"மொழி",
      help:"உதவி",
      search:"ஸ்நாக்ஸ் தேடுங்கள்...",
      add:"கார்டில் சேர்"
    }
  }

};

i18n.use(initReactI18next).init({
  resources,
  lng:"en",
  fallbackLng:"en",
  interpolation:{
    escapeValue:false
  }
});

export default i18n;