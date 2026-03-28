import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import type { CarStatus, Service, SiteContent } from "../types";

export type Language = "en" | "sv";

type TranslationKey =
  | "nav.home"
  | "nav.cars"
  | "nav.services"
  | "nav.about"
  | "nav.location"
  | "nav.contact"
  | "nav.admin"
  | "nav.adminLogin"
  | "admin.nav.overview"
  | "admin.nav.cars"
  | "admin.nav.content"
  | "admin.layout.title"
  | "admin.layout.copy"
  | "admin.layout.logout"
  | "admin.dashboard.eyebrow"
  | "admin.dashboard.title"
  | "admin.dashboard.copy"
  | "admin.login.eyebrow"
  | "admin.login.title"
  | "admin.login.copy"
  | "admin.login.email"
  | "admin.login.password"
  | "admin.login.signIn"
  | "admin.login.signingIn"
  | "admin.cars.eyebrow"
  | "admin.cars.title"
  | "admin.cars.copy"
  | "admin.cars.add"
  | "admin.cars.loading"
  | "admin.cars.view"
  | "admin.cars.edit"
  | "admin.cars.delete"
  | "admin.cars.confirmDelete"
  | "admin.content.eyebrow"
  | "admin.content.title"
  | "admin.content.copy"
  | "admin.editor.loading"
  | "admin.editor.newEyebrow"
  | "admin.editor.editEyebrow"
  | "admin.editor.newTitle"
  | "admin.editor.editTitle"
  | "admin.editor.copy"
  | "admin.editor.back"
  | "lang.en"
  | "lang.sv"
  | "home.loading"
  | "home.eyebrow"
  | "home.fallbackTitle"
  | "home.locationPreview"
  | "home.featuredEyebrow"
  | "home.featuredTitle"
  | "home.seeAllVehicles"
  | "home.aboutEyebrow"
  | "home.learnMore"
  | "home.servicesEyebrow"
  | "home.servicesTitle"
  | "home.viewAllServices"
  | "home.contactEyebrow"
  | "home.contactTitle"
  | "home.contactCopy"
  | "home.contactTeam"
  | "home.exploreCars"
  | "home.viewServices"
  | "home.whyChooseUs"
  | "home.visitUsFallback"
  | "cars.eyebrow"
  | "cars.title"
  | "cars.copy"
  | "cars.search"
  | "cars.allBrands"
  | "cars.year"
  | "cars.maxPrice"
  | "cars.allVisible"
  | "cars.available"
  | "cars.sold"
  | "cars.newest"
  | "cars.priceAsc"
  | "cars.priceDesc"
  | "cars.yearDesc"
  | "cars.yearAsc"
  | "cars.loading"
  | "cars.empty"
  | "car.viewDetails"
  | "car.featured"
  | "car.loading"
  | "car.quickInquiry"
  | "car.askVehicle"
  | "car.name"
  | "car.email"
  | "car.phone"
  | "car.message"
  | "car.sendInquiry"
  | "car.sending"
  | "car.success"
  | "car.whyBuy"
  | "car.transparentPricing"
  | "car.transparentPricingCopy"
  | "car.mobileReady"
  | "car.mobileReadyCopy"
  | "car.salesCare"
  | "car.salesCareCopy"
  | "car.spec.mileage"
  | "car.spec.fuel"
  | "car.spec.transmission"
  | "car.spec.color"
  | "car.spec.condition"
  | "car.spec.availability"
  | "services.eyebrow"
  | "services.title"
  | "services.copy"
  | "about.eyebrow"
  | "about.valuesFallback"
  | "about.presentation"
  | "about.presentationCopy"
  | "location.eyebrow"
  | "location.address"
  | "location.hours"
  | "location.phoneShortcut"
  | "location.mapUnavailable"
  | "contact.eyebrow"
  | "contact.call"
  | "contact.email"
  | "contact.emailLater"
  | "contact.quickLinks"
  | "contact.browseCars"
  | "contact.viewServices"
  | "contact.whatsapp"
  | "contact.businessHours"
  | "contact.sendMessage"
  | "contact.name"
  | "contact.emailPlaceholder"
  | "contact.phonePlaceholder"
  | "contact.messagePlaceholder"
  | "contact.submit"
  | "contact.submitting"
  | "contact.success"
  | "status.available"
  | "status.sold"
  | "status.hidden";

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    "nav.home": "Home",
    "nav.cars": "Cars for Sale",
    "nav.services": "Services",
    "nav.about": "About",
    "nav.location": "Location",
    "nav.contact": "Contact",
    "nav.admin": "Admin",
    "nav.adminLogin": "Admin login",
    "admin.nav.overview": "Overview",
    "admin.nav.cars": "Cars",
    "admin.nav.content": "Content",
    "admin.layout.title": "Admin Dashboard",
    "admin.layout.copy": "Manage inventory, discounts, and public content from one place.",
    "admin.layout.logout": "Log out",
    "admin.dashboard.eyebrow": "Overview",
    "admin.dashboard.title": "Admin dashboard",
    "admin.dashboard.copy": "Keep an eye on inventory, recent inquiries, and the current health of the public website content.",
    "admin.login.eyebrow": "Admin login",
    "admin.login.title": "Welcome back",
    "admin.login.copy": "Sign in to manage vehicle listings, discounts, services, and the editable public content pages.",
    "admin.login.email": "Admin email",
    "admin.login.password": "Password",
    "admin.login.signIn": "Sign in",
    "admin.login.signingIn": "Signing in...",
    "admin.cars.eyebrow": "Inventory",
    "admin.cars.title": "Car management",
    "admin.cars.copy": "Add, edit, feature, discount, and remove vehicles from the public listings.",
    "admin.cars.add": "Add new car",
    "admin.cars.loading": "Loading inventory...",
    "admin.cars.view": "View",
    "admin.cars.edit": "Edit",
    "admin.cars.delete": "Delete",
    "admin.cars.confirmDelete": "Delete this car and its uploaded images?",
    "admin.content.eyebrow": "Content",
    "admin.content.title": "Site content manager",
    "admin.content.copy": "Update services, About, Location, Contact, and homepage sections without touching code.",
    "admin.editor.loading": "Loading editor...",
    "admin.editor.newEyebrow": "New car",
    "admin.editor.editEyebrow": "Edit car",
    "admin.editor.newTitle": "Create listing",
    "admin.editor.editTitle": "Update listing",
    "admin.editor.copy": "Manage specs, featured status, discount timing, and image ordering from one responsive form.",
    "admin.editor.back": "Back to cars",
    "lang.en": "EN",
    "lang.sv": "SV",
    "home.loading": "Loading showroom experience...",
    "home.eyebrow": "Cars for sale + detailing services",
    "home.fallbackTitle": "Premium cars with care that lasts past the handover",
    "home.locationPreview": "Location preview",
    "home.featuredEyebrow": "Featured inventory",
    "home.featuredTitle": "Cars ready to view",
    "home.seeAllVehicles": "See all vehicles",
    "home.aboutEyebrow": "About the business",
    "home.learnMore": "Learn more",
    "home.servicesEyebrow": "Services",
    "home.servicesTitle": "Keep every car looking exceptional",
    "home.viewAllServices": "View all services",
    "home.contactEyebrow": "Contact",
    "home.contactTitle": "Ready to ask about a car or book a service?",
    "home.contactCopy": "Call, message, or send a quick inquiry from your phone. We keep the process simple and responsive.",
    "home.contactTeam": "Contact the team",
    "home.exploreCars": "Explore cars",
    "home.viewServices": "View services",
    "home.whyChooseUs": "Why choose us",
    "home.visitUsFallback": "Visit us in the auto district",
    "cars.eyebrow": "Cars for sale",
    "cars.title": "Browse the inventory",
    "cars.copy": "Filter by brand, year, status, and price range to find the right fit quickly on mobile or desktop.",
    "cars.search": "Search brand or model",
    "cars.allBrands": "All brands",
    "cars.year": "Year",
    "cars.maxPrice": "Max price",
    "cars.allVisible": "All visible",
    "cars.available": "Available",
    "cars.sold": "Sold",
    "cars.newest": "Newest",
    "cars.priceAsc": "Price low-high",
    "cars.priceDesc": "Price high-low",
    "cars.yearDesc": "Year new-old",
    "cars.yearAsc": "Year old-new",
    "cars.loading": "Loading cars...",
    "cars.empty": "No vehicles match the current filters.",
    "car.viewDetails": "View details",
    "car.featured": "Featured",
    "car.loading": "Loading vehicle details...",
    "car.quickInquiry": "Quick inquiry",
    "car.askVehicle": "Ask about this vehicle",
    "car.name": "Your name",
    "car.email": "Email",
    "car.phone": "Phone (optional)",
    "car.message": "Tell us what you'd like to know",
    "car.sendInquiry": "Send inquiry",
    "car.sending": "Sending...",
    "car.success": "Inquiry sent successfully.",
    "car.whyBuy": "Why buyers like this setup",
    "car.transparentPricing": "Transparent pricing",
    "car.transparentPricingCopy": "Discounts are shown clearly with the original price and final price calculated automatically.",
    "car.mobileReady": "Ready on mobile",
    "car.mobileReadyCopy": "Photos, specs, and inquiry tools are all optimized to be used comfortably from your phone.",
    "car.salesCare": "Sales + care together",
    "car.salesCareCopy": "You can buy, detail, and maintain your next car with one team and one consistent standard.",
    "car.spec.mileage": "Mileage",
    "car.spec.fuel": "Fuel type",
    "car.spec.transmission": "Transmission",
    "car.spec.color": "Color",
    "car.spec.condition": "Condition",
    "car.spec.availability": "Availability",
    "services.eyebrow": "Car care services",
    "services.title": "Professional detailing and restoration support",
    "services.copy": "From routine washes to full reconditioning, every service is described clearly and laid out to stay readable on smaller screens.",
    "about.eyebrow": "About us",
    "about.valuesFallback": "Why choose us",
    "about.presentation": "Presentation matters",
    "about.presentationCopy": "The business is designed to feel like a calm, modern garage: clean presentation, clear answers, and dependable follow-through.",
    "location.eyebrow": "Location",
    "location.address": "Address",
    "location.hours": "Working hours",
    "location.phoneShortcut": "Phone shortcut",
    "location.mapUnavailable": "Map preview unavailable",
    "contact.eyebrow": "Contact",
    "contact.call": "Call",
    "contact.email": "Email",
    "contact.emailLater": "Email can be added later from the admin dashboard.",
    "contact.quickLinks": "Quick links",
    "contact.browseCars": "Browse cars",
    "contact.viewServices": "View services",
    "contact.whatsapp": "WhatsApp",
    "contact.businessHours": "Business hours",
    "contact.sendMessage": "Send a message",
    "contact.name": "Your name",
    "contact.emailPlaceholder": "Email address",
    "contact.phonePlaceholder": "Phone number",
    "contact.messagePlaceholder": "How can we help?",
    "contact.submit": "Submit message",
    "contact.submitting": "Sending...",
    "contact.success": "Your message was sent successfully.",
    "status.available": "available",
    "status.sold": "sold",
    "status.hidden": "hidden"
  },
  sv: {
    "nav.home": "Hem",
    "nav.cars": "Bilar till salu",
    "nav.services": "Tj\u00e4nster",
    "nav.about": "Om oss",
    "nav.location": "Hitta hit",
    "nav.contact": "Kontakt",
    "nav.admin": "Admin",
    "nav.adminLogin": "Admininloggning",
    "admin.nav.overview": "\u00d6versikt",
    "admin.nav.cars": "Bilar",
    "admin.nav.content": "Inneh\u00e5ll",
    "admin.layout.title": "Adminpanel",
    "admin.layout.copy": "Hantera lager, rabatter och publikt inneh\u00e5ll p\u00e5 ett st\u00e4lle.",
    "admin.layout.logout": "Logga ut",
    "admin.dashboard.eyebrow": "\u00d6versikt",
    "admin.dashboard.title": "Adminpanel",
    "admin.dashboard.copy": "H\u00e5ll koll p\u00e5 lager, senaste f\u00f6rfr\u00e5gningar och inneh\u00e5llet p\u00e5 webbplatsen.",
    "admin.login.eyebrow": "Admininloggning",
    "admin.login.title": "V\u00e4lkommen tillbaka",
    "admin.login.copy": "Logga in f\u00f6r att hantera bilannonser, rabatter, tj\u00e4nster och redigerbart inneh\u00e5ll.",
    "admin.login.email": "Admin e-post",
    "admin.login.password": "L\u00f6senord",
    "admin.login.signIn": "Logga in",
    "admin.login.signingIn": "Loggar in...",
    "admin.cars.eyebrow": "Lager",
    "admin.cars.title": "Bilhantering",
    "admin.cars.copy": "L\u00e4gg till, redigera, lyft fram, rabattera och ta bort bilar fr\u00e5n den publika sidan.",
    "admin.cars.add": "L\u00e4gg till bil",
    "admin.cars.loading": "Laddar lager...",
    "admin.cars.view": "Visa",
    "admin.cars.edit": "Redigera",
    "admin.cars.delete": "Ta bort",
    "admin.cars.confirmDelete": "Ta bort den h\u00e4r bilen och dess uppladdade bilder?",
    "admin.content.eyebrow": "Inneh\u00e5ll",
    "admin.content.title": "Inneh\u00e5llshantering",
    "admin.content.copy": "Uppdatera tj\u00e4nster, Om oss, Hitta hit, Kontakt och startsidans inneh\u00e5ll utan att \u00e4ndra kod.",
    "admin.editor.loading": "Laddar redigeraren...",
    "admin.editor.newEyebrow": "Ny bil",
    "admin.editor.editEyebrow": "Redigera bil",
    "admin.editor.newTitle": "Skapa annons",
    "admin.editor.editTitle": "Uppdatera annons",
    "admin.editor.copy": "Hantera specifikationer, utvald-status, rabattperioder och bildordning i ett responsivt formul\u00e4r.",
    "admin.editor.back": "Tillbaka till bilar",
    "lang.en": "EN",
    "lang.sv": "SV",
    "home.loading": "Laddar hemsidan...",
    "home.eyebrow": "Bilar till salu + bilv\u00e5rd",
    "home.fallbackTitle": "Premiumbilar med bilv\u00e5rd som h\u00e5ller \u00e4ven efter leverans",
    "home.locationPreview": "Plats",
    "home.featuredEyebrow": "Utvalda bilar",
    "home.featuredTitle": "Bilar redo att visas",
    "home.seeAllVehicles": "Se alla bilar",
    "home.aboutEyebrow": "Om verksamheten",
    "home.learnMore": "L\u00e4s mer",
    "home.servicesEyebrow": "Tj\u00e4nster",
    "home.servicesTitle": "H\u00e5ll varje bil i toppskick",
    "home.viewAllServices": "Se alla tj\u00e4nster",
    "home.contactEyebrow": "Kontakt",
    "home.contactTitle": "Vill du fr\u00e5ga om en bil eller boka en tj\u00e4nst?",
    "home.contactCopy": "Ring, skicka ett meddelande eller g\u00f6r en snabb f\u00f6rfr\u00e5gan direkt fr\u00e5n mobilen. Vi h\u00e5ller processen enkel och snabb.",
    "home.contactTeam": "Kontakta oss",
    "home.exploreCars": "Utforska bilar",
    "home.viewServices": "Se tj\u00e4nster",
    "home.whyChooseUs": "Varf\u00f6r v\u00e4lja oss",
    "home.visitUsFallback": "Bes\u00f6k oss i K\u00e4vlinge",
    "cars.eyebrow": "Bilar till salu",
    "cars.title": "Bl\u00e4ddra bland utbudet",
    "cars.copy": "Filtrera efter m\u00e4rke, \u00e5r, status och pris f\u00f6r att snabbt hitta r\u00e4tt bil p\u00e5 mobil eller dator.",
    "cars.search": "S\u00f6k m\u00e4rke eller modell",
    "cars.allBrands": "Alla m\u00e4rken",
    "cars.year": "\u00c5r",
    "cars.maxPrice": "H\u00f6gsta pris",
    "cars.allVisible": "Alla synliga",
    "cars.available": "Tillg\u00e4nglig",
    "cars.sold": "S\u00e5ld",
    "cars.newest": "Nyast",
    "cars.priceAsc": "Pris l\u00e5gt-h\u00f6gt",
    "cars.priceDesc": "Pris h\u00f6gt-l\u00e5gt",
    "cars.yearDesc": "\u00c5r ny-gammal",
    "cars.yearAsc": "\u00c5r gammal-ny",
    "cars.loading": "Laddar bilar...",
    "cars.empty": "Inga bilar matchar de valda filtren.",
    "car.viewDetails": "Visa detaljer",
    "car.featured": "Utvald",
    "car.loading": "Laddar bildetaljer...",
    "car.quickInquiry": "Snabb f\u00f6rfr\u00e5gan",
    "car.askVehicle": "Fr\u00e5ga om den h\u00e4r bilen",
    "car.name": "Ditt namn",
    "car.email": "E-post",
    "car.phone": "Telefon (valfritt)",
    "car.message": "Ber\u00e4tta vad du vill veta",
    "car.sendInquiry": "Skicka f\u00f6rfr\u00e5gan",
    "car.sending": "Skickar...",
    "car.success": "F\u00f6rfr\u00e5gan skickad.",
    "car.whyBuy": "Varf\u00f6r det h\u00e4r uppl\u00e4gget uppskattas",
    "car.transparentPricing": "Tydlig priss\u00e4ttning",
    "car.transparentPricingCopy": "Rabatter visas tydligt med ordinarie pris och slutpris uträknat automatiskt.",
    "car.mobileReady": "Mobilanpassat",
    "car.mobileReadyCopy": "Bilder, specifikationer och formul\u00e4r fungerar smidigt direkt i mobilen.",
    "car.salesCare": "Bilf\u00f6rs\u00e4ljning + bilv\u00e5rd",
    "car.salesCareCopy": "Du kan k\u00f6pa, v\u00e5rda och beh\u00e5lla bilen i toppskick med ett och samma team.",
    "car.spec.mileage": "Miltal",
    "car.spec.fuel": "Br\u00e4nsle",
    "car.spec.transmission": "V\u00e4xell\u00e5da",
    "car.spec.color": "F\u00e4rg",
    "car.spec.condition": "Skick",
    "car.spec.availability": "Status",
    "services.eyebrow": "Bilv\u00e5rdstj\u00e4nster",
    "services.title": "Professionell rekond och bilv\u00e5rd",
    "services.copy": "Fr\u00e5n vanlig tv\u00e4tt till full rekond. Allt \u00e4r tydligt presenterat och l\u00e4tt att l\u00e4sa \u00e4ven p\u00e5 mindre sk\u00e4rmar.",
    "about.eyebrow": "Om oss",
    "about.valuesFallback": "Varf\u00f6r v\u00e4lja oss",
    "about.presentation": "Helhetsintrycket betyder n\u00e5got",
    "about.presentationCopy": "Verksamheten \u00e4r byggd f\u00f6r att k\u00e4nnas lugn, modern och p\u00e5litlig med tydlig kommunikation och genomf\u00f6rande.",
    "location.eyebrow": "Hitta hit",
    "location.address": "Adress",
    "location.hours": "\u00d6ppettider",
    "location.phoneShortcut": "Ring direkt",
    "location.mapUnavailable": "Kartvisning inte tillg\u00e4nglig",
    "contact.eyebrow": "Kontakt",
    "contact.call": "Ring",
    "contact.email": "E-post",
    "contact.emailLater": "E-post kan l\u00e4ggas till senare i adminpanelen.",
    "contact.quickLinks": "Snabbl\u00e4nkar",
    "contact.browseCars": "Se bilar",
    "contact.viewServices": "Se tj\u00e4nster",
    "contact.whatsapp": "WhatsApp",
    "contact.businessHours": "\u00d6ppettider",
    "contact.sendMessage": "Skicka ett meddelande",
    "contact.name": "Ditt namn",
    "contact.emailPlaceholder": "E-postadress",
    "contact.phonePlaceholder": "Telefonnummer",
    "contact.messagePlaceholder": "Hur kan vi hj\u00e4lpa dig?",
    "contact.submit": "Skicka meddelande",
    "contact.submitting": "Skickar...",
    "contact.success": "Ditt meddelande skickades.",
    "status.available": "tillg\u00e4nglig",
    "status.sold": "s\u00e5ld",
    "status.hidden": "dold"
  }
};

const storageKey = "bilvard-language";

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
} | null>(null);

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved === "sv" ? "sv" : "en";
  });

  useEffect(() => {
    localStorage.setItem(storageKey, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: TranslationKey) => translations[language][key]
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider.");
  }

  return context;
}

export function translateCarStatus(status: CarStatus, language: Language) {
  if (language === "en") {
    return status.toLowerCase();
  }

  return status === "AVAILABLE"
    ? translations.sv["status.available"]
    : status === "SOLD"
      ? translations.sv["status.sold"]
      : translations.sv["status.hidden"];
}

export function translateDay(day: string, language: Language) {
  if (language === "en") {
    return day;
  }

  const days: Record<string, string> = {
    Sunday: "S\u00f6ndag",
    Monday: "M\u00e5ndag",
    Tuesday: "Tisdag",
    Wednesday: "Onsdag",
    Thursday: "Torsdag",
    Friday: "Fredag",
    Saturday: "L\u00f6rdag"
  };

  return days[day] || day;
}

export function translateHours(value: string, language: Language) {
  if (language === "en") {
    return value;
  }

  return value === "Closed" ? "St\u00e4ngt" : value;
}

export function normalizeExternalUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (/^(https?:)?\/\//i.test(trimmed) || /^mailto:/i.test(trimmed) || /^tel:/i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function localizeService(service: Service, language: Language) {
  if (language === "en") {
    return service;
  }

  const translationsBySlug: Record<string, { title: string; description: string }> = {
    "exterior-car-wash": {
      title: "Utv\u00e4ndig biltv\u00e4tt",
      description: "En noggrann utv\u00e4ndig tv\u00e4tt som avl\u00e4gsnar smuts, trafikfilm och rester samtidigt som glansen \u00e5terst\u00e4lls."
    },
    "interior-cleaning": {
      title: "Inv\u00e4ndig reng\u00f6ring",
      description: "Djup reng\u00f6ring av s\u00e4ten, mattor, paneler och kontaktytor f\u00f6r en fr\u00e4schare kup\u00e9."
    },
    "full-car-reconditioning": {
      title: "Helrekond",
      description: "En komplett inv\u00e4ndig och utv\u00e4ndig behandling med djup reng\u00f6ring, ytv\u00e5rd och visuell uppfr\u00e4schning."
    },
    "polishing-waxing": {
      title: "Polering & vaxning",
      description: "Framh\u00e4v lackens djup och glans med polering och ett skyddande lager vax."
    },
    "paint-protection": {
      title: "Lackskydd",
      description: "Skyddande behandling som hj\u00e4lper lacken att st\u00e5 emot smuts, v\u00e4der och dagligt slitage."
    },
    "tires-change": {
      title: "D\u00e4ckbyte",
      description: "Snabbt och noggrant d\u00e4ckbyte med fokus p\u00e5 s\u00e4ker montering och smidig s\u00e4songsanpassning."
    }
  };

  const translated = translationsBySlug[service.slug];
  return translated ? { ...service, ...translated } : service;
}

export function localizeContent<T extends Record<string, any> | null>(
  key: string,
  content: SiteContent<T> | null,
  language: Language
) {
  if (!content || language === "en") {
    return content;
  }

  const translationsByKey: Record<string, { title: string; content: string; jsonData: Record<string, unknown> }> = {
    homepage_sections: {
      title: "Bilv\u00e5rd center i K\u00e4vlinge",
      content: "Bilf\u00f6rs\u00e4ljning och professionell bilv\u00e5rd med en ren, modern och kundfokuserad upplevelse i K\u00e4vlinge.",
      jsonData: {
        stats: [
          { label: "Bilar redo att visas", value: "6+" },
          { label: "Bilv\u00e5rdspaket", value: "5" },
          { label: "Kundsupport", value: "6 dagar" }
        ],
        whyChooseUs: [
          "Noggrant presenterade bilar med tydlig priss\u00e4ttning",
          "Skicklighet, precision och r\u00e4tt verktyg i varje bilv\u00e5rdsjobb",
          "Snabb, mobilanpassad kontakt och bokning"
        ]
      }
    },
    about_page: {
      title: "Om Bilv\u00e5rd center i K\u00e4vlinge",
      content:
        "P\u00e5 Car Care Center i K\u00e4vlinge \u00e4r v\u00e5rt m\u00e5l enkelt: att leverera resultat som f\u00e5r kunder att komma tillbaka. Vi kombinerar skicklighet, precision och r\u00e4tt verktyg f\u00f6r att s\u00e4kerst\u00e4lla att din bil ser ut som b\u00e4st - varje g\u00e5ng. Verksamma i branschen sedan 1997.",
      jsonData: {
        missionTitle: "V\u00e5rt m\u00e5l",
        missionBody: "Leverera resultat som f\u00e5r kunder att komma tillbaka med skicklighet, precision och r\u00e4tt verktyg.",
        valuesTitle: "Det h\u00e4r kan kunder f\u00f6rv\u00e4nta sig",
        values: ["Skickligt utf\u00f6rt arbete", "Precision i varje detalj", "Resultat som h\u00e5ller"],
        teamTitle: "Byggt p\u00e5 \u00e5terkommande kunder",
        teamBody: "Vi fokuserar p\u00e5 kvalitet och konsekventa resultat s\u00e5 att varje bes\u00f6k l\u00e4mnar bilen i sitt b\u00e4sta skick."
      }
    },
    location_page: {
      title: "Bes\u00f6k Bilv\u00e5rd center i K\u00e4vlinge",
      content: "L\u00e4tt att hitta i K\u00e4vlinge med smidiga \u00f6ppettider och direkt hj\u00e4lp b\u00e5de f\u00f6r bilf\u00f6rs\u00e4ljning och bokning av tj\u00e4nster.",
      jsonData: {
        notes: "Ring innan du kommer om du vill se specifika bilar eller fr\u00e5ga om tillg\u00e4nglighet samma dag."
      }
    },
    contact_page: {
      title: "Kontakta Bilv\u00e5rd center i K\u00e4vlinge",
      content: "H\u00f6r av dig om du har fr\u00e5gor om bilar, inbyte, rekondtider eller om du beh\u00f6ver hj\u00e4lp att hitta hit.",
      jsonData: {}
    }
  };

  const translated = translationsByKey[key];
  if (!translated) {
    return content;
  }

  return {
    ...content,
    title: translated.title,
    content: translated.content,
    jsonData: {
      ...(content.jsonData || {}),
      ...translated.jsonData
    }
  };
}
