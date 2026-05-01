import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import type { Service, SiteContent } from "../types";

export type Language = "en" | "sv";

type TranslationKey =
  | "nav.home"
  | "nav.services"
  | "nav.about"
  | "nav.location"
  | "nav.contact"
  | "nav.admin"
  | "nav.bookCTA"
  | "brand.tagline"
  | "admin.nav.overview"
  | "admin.nav.pricing"
  | "admin.nav.branding"
  | "admin.nav.content"
  | "admin.layout.title"
  | "admin.layout.copy"
  | "admin.layout.logout"
  | "admin.dashboard.eyebrow"
  | "admin.dashboard.title"
  | "admin.dashboard.copy"
  | "admin.dashboard.activeServices"
  | "admin.dashboard.totalInquiries"
  | "admin.dashboard.recentInquiries"
  | "admin.dashboard.noInquiries"
  | "admin.dashboard.manageContent"
  | "admin.dashboard.kindContact"
  | "admin.dashboard.kindCar"
  | "admin.login.eyebrow"
  | "admin.login.title"
  | "admin.login.copy"
  | "admin.login.email"
  | "admin.login.password"
  | "admin.login.signIn"
  | "admin.login.signingIn"
  | "admin.content.eyebrow"
  | "admin.content.title"
  | "admin.content.copy"
  | "lang.en"
  | "lang.sv"
  | "loading"
  | "home.eyebrow"
  | "home.intro"
  | "home.title"
  | "home.copy"
  | "home.primaryCta"
  | "home.secondaryCta"
  | "home.heroAside.title"
  | "home.heroAside.line1"
  | "home.heroAside.line2"
  | "home.heroAside.line3"
  | "home.metric.since.value"
  | "home.metric.since.label"
  | "home.metric.experience.value"
  | "home.metric.experience.label"
  | "home.metric.packages.value"
  | "home.metric.packages.label"
  | "home.metric.openDays.value"
  | "home.metric.openDays.label"
  | "home.values.eyebrow"
  | "home.values.title"
  | "home.values.copy"
  | "home.values.craft.title"
  | "home.values.craft.copy"
  | "home.values.products.title"
  | "home.values.products.copy"
  | "home.values.transparent.title"
  | "home.values.transparent.copy"
  | "home.values.response.title"
  | "home.values.response.copy"
  | "home.services.eyebrow"
  | "home.services.title"
  | "home.services.copy"
  | "home.services.viewAll"
  | "home.services.fromLabel"
  | "home.process.eyebrow"
  | "home.process.title"
  | "home.process.copy"
  | "home.process.s1.title"
  | "home.process.s1.copy"
  | "home.process.s2.title"
  | "home.process.s2.copy"
  | "home.process.s3.title"
  | "home.process.s3.copy"
  | "home.process.s4.title"
  | "home.process.s4.copy"
  | "home.proof.eyebrow"
  | "home.proof.title"
  | "home.proof.copy"
  | "home.proof.t1.quote"
  | "home.proof.t1.author"
  | "home.proof.t1.role"
  | "home.proof.t2.quote"
  | "home.proof.t2.author"
  | "home.proof.t2.role"
  | "home.proof.t3.quote"
  | "home.proof.t3.author"
  | "home.proof.t3.role"
  | "home.faq.eyebrow"
  | "home.faq.title"
  | "home.faq.copy"
  | "home.faq.q1.q"
  | "home.faq.q1.a"
  | "home.faq.q2.q"
  | "home.faq.q2.a"
  | "home.faq.q3.q"
  | "home.faq.q3.a"
  | "home.faq.q4.q"
  | "home.faq.q4.a"
  | "services.eyebrow"
  | "services.intro"
  | "services.title"
  | "services.copy"
  | "services.included.title"
  | "services.included.copy"
  | "services.included.item1"
  | "services.included.item2"
  | "services.included.item3"
  | "services.included.item4"
  | "services.book"
  | "services.duration"
  | "services.includes"
  | "services.notes"
  | "services.priceMatrix"
  | "services.standaloneTitle"
  | "services.standaloneCopy"
  | "services.featured"
  | "services.fromLabel"
  | "about.eyebrow"
  | "about.intro"
  | "about.title"
  | "about.lead"
  | "about.story.title"
  | "about.story.body"
  | "about.values.title"
  | "about.values.item1"
  | "about.values.item2"
  | "about.values.item3"
  | "about.values.item4"
  | "about.philosophy.title"
  | "about.philosophy.body"
  | "location.eyebrow"
  | "location.intro"
  | "location.title"
  | "location.copy"
  | "location.address"
  | "location.hours"
  | "location.phoneShortcut"
  | "location.mapUnavailable"
  | "location.directionsTitle"
  | "location.directionsCopy"
  | "contact.eyebrow"
  | "contact.intro"
  | "contact.title"
  | "contact.copy"
  | "contact.call"
  | "contact.email"
  | "contact.emailLater"
  | "contact.quickLinks"
  | "contact.viewServices"
  | "contact.visitUs"
  | "contact.whatsapp"
  | "contact.businessHours"
  | "contact.sendMessage"
  | "contact.formTitle"
  | "contact.name"
  | "contact.emailPlaceholder"
  | "contact.phonePlaceholder"
  | "contact.messagePlaceholder"
  | "contact.submit"
  | "contact.submitting"
  | "contact.success"
  | "closing.eyebrow"
  | "closing.title"
  | "closing.copy"
  | "closing.primary"
  | "closing.secondary"
  | "closing.reassure"
  | "footer.tagline"
  | "footer.explore"
  | "footer.visit"
  | "footer.reach"
  | "footer.rights";

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.about": "About",
    "nav.location": "Location",
    "nav.contact": "Contact",
    "nav.admin": "Admin",
    "nav.bookCTA": "Book a service",
    "brand.tagline": "Professional car care · Kävlinge · Since 1997",
    "admin.nav.overview": "Overview",
    "admin.nav.pricing": "Pricing",
    "admin.nav.branding": "Branding",
    "admin.nav.content": "Content",
    "admin.layout.title": "Admin",
    "admin.layout.copy": "Manage services and public content from one place.",
    "admin.layout.logout": "Log out",
    "admin.dashboard.eyebrow": "Overview",
    "admin.dashboard.title": "Admin dashboard",
    "admin.dashboard.copy": "Active services, recent inquiries, and the current health of the public website content.",
    "admin.dashboard.activeServices": "Active services",
    "admin.dashboard.totalInquiries": "Total inquiries",
    "admin.dashboard.recentInquiries": "Recent inquiries",
    "admin.dashboard.noInquiries": "No inquiries yet.",
    "admin.dashboard.manageContent": "Manage content",
    "admin.dashboard.kindContact": "contact",
    "admin.dashboard.kindCar": "service",
    "admin.login.eyebrow": "Admin login",
    "admin.login.title": "Welcome back",
    "admin.login.copy": "Sign in to manage services and the editable public content pages.",
    "admin.login.email": "Admin email",
    "admin.login.password": "Password",
    "admin.login.signIn": "Sign in",
    "admin.login.signingIn": "Signing in...",
    "admin.content.eyebrow": "Content",
    "admin.content.title": "Site content manager",
    "admin.content.copy": "Update About, Location, Contact, and homepage sections without touching code.",
    "lang.en": "EN",
    "lang.sv": "SV",
    "loading": "Loading...",
    "home.eyebrow": "Bilvård center i Kävlinge",
    "home.intro": "Introduction",
    "home.title": "Cars cared for the way they were meant to be — by the same hands, since 1997.",
    "home.copy": "A small workshop in Kävlinge built on careful preparation, professional products, and the discipline of doing one car at a time. The way good detailing has always been done.",
    "home.primaryCta": "Book a service",
    "home.secondaryCta": "View packages",
    "home.heroAside.title": "What every visit looks like",
    "home.heroAside.line1": "A clear walk-through of the scope and final price before we begin",
    "home.heroAside.line2": "Professional products chosen for Nordic conditions",
    "home.heroAside.line3": "A final walk-around so you see the finish before you leave",
    "home.metric.since.value": "1997",
    "home.metric.since.label": "Established",
    "home.metric.experience.value": "25+",
    "home.metric.experience.label": "Years of craft",
    "home.metric.packages.value": "4",
    "home.metric.packages.label": "Care packages",
    "home.metric.openDays.value": "6",
    "home.metric.openDays.label": "Days a week",
    "home.values.eyebrow": "Values",
    "home.values.title": "Why customers come back, year after year.",
    "home.values.copy": "A small workshop with a long memory. The way we work is the reason most of our customers were referred by another customer.",
    "home.values.craft.title": "Craft over volume",
    "home.values.craft.copy": "One car at a time, done properly. We would rather decline work than rush it.",
    "home.values.products.title": "Professional products",
    "home.values.products.copy": "Detailing chemistry and tools chosen for Nordic climate — not retail shelves.",
    "home.values.transparent.title": "Transparent pricing",
    "home.values.transparent.copy": "Every package is clearly scoped — you know what we do and what it costs before we begin.",
    "home.values.response.title": "Same-day reply",
    "home.values.response.copy": "Call, WhatsApp, or the form — we confirm the same business day with a clear next step.",
    "home.services.eyebrow": "Services",
    "home.services.title": "Care packages, calmly priced.",
    "home.services.copy": "Four packages and a short list of standalone services — each scoped clearly so you choose only what your car actually needs.",
    "home.services.viewAll": "See all packages and prices",
    "home.services.fromLabel": "From",
    "home.process.eyebrow": "Process",
    "home.process.title": "Four calm steps from booking to handover.",
    "home.process.copy": "No guesswork, no surprises. A process refined over twenty-five years.",
    "home.process.s1.title": "Book",
    "home.process.s1.copy": "Choose a package and a time that works — by phone, WhatsApp, or a quick form.",
    "home.process.s2.title": "Arrive",
    "home.process.s2.copy": "Drop the car off. We confirm the scope, the final price, and when it will be ready.",
    "home.process.s3.title": "Crafted care",
    "home.process.s3.copy": "Skilled preparation, precise work, and professional products applied the way they’re meant to be used.",
    "home.process.s4.title": "Drive out pristine",
    "home.process.s4.copy": "A final walk-around so you see the finish before you leave. No rush. No surprises.",
    "home.proof.eyebrow": "Customers",
    "home.proof.title": "Quiet results. Returning customers.",
    "home.proof.copy": "A workshop built the old way — one well-cared-for car at a time.",
    "home.proof.t1.quote": "Best detail I’ve ever had. The car genuinely felt newer driving out than the day I bought it.",
    "home.proof.t1.author": "Marcus L.",
    "home.proof.t1.role": "Returning customer, 4 years",
    "home.proof.t2.quote": "Calm, professional, no upselling. They recommended exactly the package my car actually needed.",
    "home.proof.t2.author": "Ingrid P.",
    "home.proof.t2.role": "Full reconditioning",
    "home.proof.t3.quote": "Ready on time, price exactly as quoted, and the paint protection is still holding up two Nordic winters later.",
    "home.proof.t3.author": "Henrik A.",
    "home.proof.t3.role": "Paint protection",
    "home.faq.eyebrow": "Good to know",
    "home.faq.title": "Questions, calmly answered.",
    "home.faq.copy": "The questions customers ask most often — so you can book with confidence.",
    "home.faq.q1.q": "How long does a full reconditioning take?",
    "home.faq.q1.a": "A full interior + exterior recondition typically takes 6 to 10 hours. We confirm timing the moment we see the car and you’ll know when it’ll be ready before we start.",
    "home.faq.q2.q": "Do I need to book in advance?",
    "home.faq.q2.a": "Yes. Quality work takes time and we hold time for each car. Book by phone or WhatsApp — we usually have a slot within the week.",
    "home.faq.q3.q": "What makes paint sealing last?",
    "home.faq.q3.a": "Thorough surface preparation. Most products fail because the surface wasn’t decontaminated first. We do the prep properly so the protection does its job. Paint sealing is recommended only for cars older than two years.",
    "home.faq.q4.q": "Why three sizes (Small / Medium / Large)?",
    "home.faq.q4.a": "Pricing scales with the actual surface and interior volume of the car. A compact takes meaningfully less time than a large estate — the size tier is how we keep pricing fair to the work.",
    "services.eyebrow": "Services",
    "services.intro": "Catalogue",
    "services.title": "Four care packages. Three sizes. One standard.",
    "services.copy": "Each package is described in full — every step we take, every detail we touch. Pricing is transparent and tiered by car size.",
    "services.included.title": "Always included",
    "services.included.copy": "Baseline standards we never skip — regardless of which package you book.",
    "services.included.item1": "Clear walk-through of the scope and final price before we begin",
    "services.included.item2": "Professional-grade products chosen for Nordic conditions",
    "services.included.item3": "Controlled, indoor environment for sensitive detailing work",
    "services.included.item4": "Post-service walk-around so you see the finish before you leave",
    "services.book": "Book this service",
    "services.duration": "Typical duration",
    "services.includes": "What’s included",
    "services.notes": "Notes",
    "services.priceMatrix": "Pricing by car size",
    "services.standaloneTitle": "À la carte",
    "services.standaloneCopy": "Single services for when you only need one specific job.",
    "services.featured": "Signature package",
    "services.fromLabel": "From",
    "about.eyebrow": "About",
    "about.intro": "Who we are",
    "about.title": "A small workshop with a long memory.",
    "about.lead": "Bilvård center i Kävlinge has been caring for cars since 1997. Our standard hasn’t changed: skilled preparation, professional products, and the time each car deserves.",
    "about.story.title": "The way we work",
    "about.story.body": "We took the long way round. We chose to specialise rather than scale, to invest in the right tools rather than the loudest marketing, and to be honest when a smaller package is the right one. Most of our customers were referred by another customer — that is the only review system we trust.",
    "about.values.title": "What customers can expect",
    "about.values.item1": "Skilled work, performed calmly",
    "about.values.item2": "Precision in every detail",
    "about.values.item3": "Transparent pricing scoped to the car",
    "about.values.item4": "Results that hold up to Nordic winters",
    "about.philosophy.title": "Presentation matters",
    "about.philosophy.body": "The workshop is designed to feel like a calm, modern garage — clean presentation, clear answers, and dependable follow-through. We believe the car you collect should feel different from the one you dropped off.",
    "location.eyebrow": "Find us",
    "location.intro": "The workshop",
    "location.title": "Visit the workshop in Kävlinge.",
    "location.copy": "Easy to find, easy to park, and a calm bay waiting when you arrive. Call ahead so we can have everything ready.",
    "location.address": "Address",
    "location.hours": "Working hours",
    "location.phoneShortcut": "Direct line",
    "location.mapUnavailable": "Map preview unavailable",
    "location.directionsTitle": "Before you arrive",
    "location.directionsCopy": "A quick call or message lets us confirm timing, prep the bay, and avoid any waiting.",
    "contact.eyebrow": "Contact",
    "contact.intro": "Reach the workshop",
    "contact.title": "Tell us about the car.",
    "contact.copy": "Ask about a package, get a recommendation, or book a time. We reply the same business day.",
    "contact.call": "Call",
    "contact.email": "Email",
    "contact.emailLater": "Email can be added later from the admin dashboard.",
    "contact.quickLinks": "Quick links",
    "contact.viewServices": "View services",
    "contact.visitUs": "Visit us",
    "contact.whatsapp": "WhatsApp",
    "contact.businessHours": "Business hours",
    "contact.sendMessage": "Send a message",
    "contact.formTitle": "Send a message",
    "contact.name": "Your name",
    "contact.emailPlaceholder": "Email address",
    "contact.phonePlaceholder": "Phone number",
    "contact.messagePlaceholder": "Tell us about the car and what you’d like cared for",
    "contact.submit": "Send message",
    "contact.submitting": "Sending...",
    "contact.success": "Your message was sent. We’ll reply the same business day.",
    "closing.eyebrow": "Next step",
    "closing.title": "Ready to book your car in?",
    "closing.copy": "Tell us the car and the care it needs. We will confirm a time, quote a clear price, and have the bay ready before you arrive.",
    "closing.primary": "Book a service",
    "closing.secondary": "Call the workshop",
    "closing.reassure": "No pressure · transparent pricing · same-day reply",
    "footer.tagline": "Professional car care in Kävlinge. Built on careful preparation, transparent pricing, and dependable follow-through since 1997.",
    "footer.explore": "Explore",
    "footer.visit": "Visit",
    "footer.reach": "Reach us",
    "footer.rights": "All rights reserved."
  },
  sv: {
    "nav.home": "Hem",
    "nav.services": "Tjänster",
    "nav.about": "Om oss",
    "nav.location": "Hitta hit",
    "nav.contact": "Kontakt",
    "nav.admin": "Admin",
    "nav.bookCTA": "Boka tid",
    "brand.tagline": "Professionell bilvård · Kävlinge · Sedan 1997",
    "admin.nav.overview": "Översikt",
    "admin.nav.pricing": "Priser",
    "admin.nav.branding": "Logotyp",
    "admin.nav.content": "Innehåll",
    "admin.layout.title": "Admin",
    "admin.layout.copy": "Hantera tjänster och publikt innehåll på ett ställe.",
    "admin.layout.logout": "Logga ut",
    "admin.dashboard.eyebrow": "Översikt",
    "admin.dashboard.title": "Adminpanel",
    "admin.dashboard.copy": "Aktiva tjänster, senaste förfrågningar och innehållet på webbplatsen.",
    "admin.dashboard.activeServices": "Aktiva tjänster",
    "admin.dashboard.totalInquiries": "Totalt antal förfrågningar",
    "admin.dashboard.recentInquiries": "Senaste förfrågningar",
    "admin.dashboard.noInquiries": "Inga förfrågningar ännu.",
    "admin.dashboard.manageContent": "Hantera innehåll",
    "admin.dashboard.kindContact": "kontakt",
    "admin.dashboard.kindCar": "tjänst",
    "admin.login.eyebrow": "Admininloggning",
    "admin.login.title": "Välkommen tillbaka",
    "admin.login.copy": "Logga in för att hantera tjänster och det redigerbara publika innehållet.",
    "admin.login.email": "Admin e-post",
    "admin.login.password": "Lösenord",
    "admin.login.signIn": "Logga in",
    "admin.login.signingIn": "Loggar in...",
    "admin.content.eyebrow": "Innehåll",
    "admin.content.title": "Innehållshantering",
    "admin.content.copy": "Uppdatera Om oss, Hitta hit, Kontakt och startsidans innehåll utan att ändra kod.",
    "lang.en": "EN",
    "lang.sv": "SV",
    "loading": "Laddar...",
    "home.eyebrow": "Bilvård center i Kävlinge",
    "home.intro": "Introduktion",
    "home.title": "Bilar vårdade som de var tänkta att vårdas — av samma händer, sedan 1997.",
    "home.copy": "En liten verkstad i Kävlinge byggd på noggrann preparering, professionella produkter och disciplinen att göra en bil i taget. Så som bra bilvård alltid har gjorts.",
    "home.primaryCta": "Boka tid",
    "home.secondaryCta": "Se paketen",
    "home.heroAside.title": "Så ser varje besök ut",
    "home.heroAside.line1": "Tydlig genomgång av omfattning och slutpris innan vi börjar",
    "home.heroAside.line2": "Professionella produkter valda för nordiska förhållanden",
    "home.heroAside.line3": "Avslutande genomgång så du ser resultatet innan du åker",
    "home.metric.since.value": "1997",
    "home.metric.since.label": "Grundat",
    "home.metric.experience.value": "25+",
    "home.metric.experience.label": "År av hantverk",
    "home.metric.packages.value": "4",
    "home.metric.packages.label": "Bilvårdspaket",
    "home.metric.openDays.value": "6",
    "home.metric.openDays.label": "Dagar i veckan",
    "home.values.eyebrow": "Värderingar",
    "home.values.title": "Varför kunder kommer tillbaka, år efter år.",
    "home.values.copy": "En liten verkstad med långt minne. Sättet vi arbetar på är anledningen till att de flesta av våra kunder kom hit på rekommendation.",
    "home.values.craft.title": "Hantverk framör volym",
    "home.values.craft.copy": "En bil i taget, gjort på rätt sätt. Vi tackar hellre nej än stressar genom arbete.",
    "home.values.products.title": "Professionella produkter",
    "home.values.products.copy": "Bilvårdskemi och verktyg valda för nordiskt klimat — inte butikshyllor.",
    "home.values.transparent.title": "Tydliga priser",
    "home.values.transparent.copy": "Varje paket är tydligt avgränsat — du vet vad vi gör och vad det kostar innan vi börjar.",
    "home.values.response.title": "Svar samma dag",
    "home.values.response.copy": "Ring, WhatsApp eller formulär — vi bekräftar samma arbetsdag med ett tydligt nästa steg.",
    "home.services.eyebrow": "Tjänster",
    "home.services.title": "Bilvårdspaket, lugnt prissatta.",
    "home.services.copy": "Fyra paket och en kort lista över enskilda tjänster — var och en tydligt avgränsad så du väljer endast det bilen verkligen behöver.",
    "home.services.viewAll": "Se alla paket och priser",
    "home.services.fromLabel": "Från",
    "home.process.eyebrow": "Process",
    "home.process.title": "Fyra lugna steg från bokning till leverans.",
    "home.process.copy": "Inga gissningar, inga överraskningar. En process finslipad under tjugofem år.",
    "home.process.s1.title": "Boka",
    "home.process.s1.copy": "Välj ett paket och en tid som passar — via telefon, WhatsApp eller formulär.",
    "home.process.s2.title": "Lämna bilen",
    "home.process.s2.copy": "Vi bekräftar omfattning, slutpris och när bilen är klar.",
    "home.process.s3.title": "Hantverk",
    "home.process.s3.copy": "Skicklig preparering, precist arbete och professionella produkter använda så som de ska.",
    "home.process.s4.title": "Kör i väg med en perfekt bil",
    "home.process.s4.copy": "En avslutande genomgång så du ser resultatet innan du åker. Ingen stress. Inga överraskningar.",
    "home.proof.eyebrow": "Kunder",
    "home.proof.title": "Tysta resultat. Återkommande kunder.",
    "home.proof.copy": "En verkstad byggd på det gamla sättet — en välvårdad bil i taget.",
    "home.proof.t1.quote": "Bästa rekonden jag har fått. Bilen kändes nyare än dagen jag köpte den.",
    "home.proof.t1.author": "Marcus L.",
    "home.proof.t1.role": "Återkommande kund, 4 år",
    "home.proof.t2.quote": "Lugn, professionell, inga mersäljningsförsök. De rekommenderade exakt det paket min bil behövde.",
    "home.proof.t2.author": "Ingrid P.",
    "home.proof.t2.role": "Helrekonditionering",
    "home.proof.t3.quote": "Klar i tid, pris som utlovat, och lackskyddet håller fortfarande två nordiska vintrar senare.",
    "home.proof.t3.author": "Henrik A.",
    "home.proof.t3.role": "Lackskydd",
    "home.faq.eyebrow": "Bra att veta",
    "home.faq.title": "Frågor, lugnt besvarade.",
    "home.faq.copy": "Frågorna kunder ställer oftast — så du kan boka med trygghet.",
    "home.faq.q1.q": "Hur lång tid tar en helrekonditionering?",
    "home.faq.q1.a": "En fullständig in- och utvändig rekond tar vanligtvis 6 till 10 timmar. Vi bekräftar tiden när vi ser bilen och du vet när den är klar innan vi börjar.",
    "home.faq.q2.q": "Behöver jag boka i förväg?",
    "home.faq.q2.a": "Ja. Kvalitetsarbete tar tid och vi avsätter tid för varje bil. Boka per telefon eller WhatsApp — vi har oftast en tid inom en vecka.",
    "home.faq.q3.q": "Vad gör att lackförseglingen håller?",
    "home.faq.q3.a": "Grundlig ytpreparering. De flesta produkter sviker för att ytan inte var dekontaminerad. Vi gör prepareringen ordentligt så skyddet gör sitt jobb. Lackförsegling rekommenderas endast om bilen är äldre än två år.",
    "home.faq.q4.q": "Varför tre storlekar (Liten / Mellan / Stor)?",
    "home.faq.q4.a": "Priset följer bilens faktiska yta och kupévolym. En liten bil tar betydligt mindre tid än en stor kombi — storleksnivån håller prissättningen rättvis mot arbetet.",
    "services.eyebrow": "Tjänster",
    "services.intro": "Katalog",
    "services.title": "Fyra paket. Tre storlekar. En standard.",
    "services.copy": "Varje paket beskrivs i sin helhet — varje steg vi tar, varje detalj vi rör. Priserna är tydliga och differentierade efter bilstorlek.",
    "services.included.title": "Det ingår alltid",
    "services.included.copy": "Grundnivån vi aldrig hoppar över — oavsett vilket paket du bokar.",
    "services.included.item1": "Tydlig genomgång av omfattning och slutpris innan vi börjar",
    "services.included.item2": "Professionella produkter valda för nordiska förhållanden",
    "services.included.item3": "Inomhusmiljö för känsligt bilvårdsarbete",
    "services.included.item4": "Avslutande genomgång så du ser resultatet innan du åker",
    "services.book": "Boka denna tjänst",
    "services.duration": "Typisk tidsåtgång",
    "services.includes": "Det här ingår",
    "services.notes": "Att notera",
    "services.priceMatrix": "Pris efter bilstorlek",
    "services.standaloneTitle": "Enskilda tjänster",
    "services.standaloneCopy": "Enskilda tjänster när du bara behöver ett specifikt jobb.",
    "services.featured": "Signaturpaket",
    "services.fromLabel": "Från",
    "about.eyebrow": "Om oss",
    "about.intro": "Vilka vi är",
    "about.title": "En liten verkstad med långt minne.",
    "about.lead": "Bilvård center i Kävlinge har vårdat bilar sedan 1997. Vår standard har inte ändrats: skicklig preparering, professionella produkter och den tid varje bil förtjänar.",
    "about.story.title": "Så arbetar vi",
    "about.story.body": "Vi tog den långa vägen. Vi valde att specialisera oss i stället för att skala, att investera i rätt verktyg i stället för högljudd marknadsföring, och att vara ärliga när ett mindre paket är det rätta. De flesta av våra kunder kom hit på rekommendation — det är det enda recensionssystem vi litar på.",
    "about.values.title": "Det här kan kunder förvänta sig",
    "about.values.item1": "Skickligt arbete, lugnt utfört",
    "about.values.item2": "Precision i varje detalj",
    "about.values.item3": "Tydliga priser anpassade efter bilen",
    "about.values.item4": "Resultat som håller för nordiska vintrar",
    "about.philosophy.title": "Helhetsintrycket betyder något",
    "about.philosophy.body": "Verkstaden är byggd för att kännas lugn, modern och pålitlig — ren presentation, tydliga svar och pålitligt genomförande. Vi anser att bilen du hämtar ska kännas annorlunda än den du lämnade.",
    "location.eyebrow": "Hitta hit",
    "location.intro": "Verkstaden",
    "location.title": "Besök verkstaden i Kävlinge.",
    "location.copy": "Lätt att hitta, lätt att parkera, och en lugn plats redo när du kommer. Ring gärna först så har vi allt förberett.",
    "location.address": "Adress",
    "location.hours": "Öppettider",
    "location.phoneShortcut": "Direktlinje",
    "location.mapUnavailable": "Kartvisning inte tillgänglig",
    "location.directionsTitle": "Innan du kommer",
    "location.directionsCopy": "Ett snabbt samtal eller meddelande låter oss bekräfta tid, förbereda platsen och undvika väntan.",
    "contact.eyebrow": "Kontakt",
    "contact.intro": "Nå verkstaden",
    "contact.title": "Berätta om bilen.",
    "contact.copy": "Fråga om ett paket, få en rekommendation eller boka en tid. Vi svarar samma arbetsdag.",
    "contact.call": "Ring",
    "contact.email": "E-post",
    "contact.emailLater": "E-post kan läggas till senare i adminpanelen.",
    "contact.quickLinks": "Snabblänkar",
    "contact.viewServices": "Se tjänster",
    "contact.visitUs": "Besök oss",
    "contact.whatsapp": "WhatsApp",
    "contact.businessHours": "Öppettider",
    "contact.sendMessage": "Skicka ett meddelande",
    "contact.formTitle": "Skicka ett meddelande",
    "contact.name": "Ditt namn",
    "contact.emailPlaceholder": "E-postadress",
    "contact.phonePlaceholder": "Telefonnummer",
    "contact.messagePlaceholder": "Berätta om bilen och vad du vill åtgärda",
    "contact.submit": "Skicka meddelande",
    "contact.submitting": "Skickar...",
    "contact.success": "Ditt meddelande skickades. Vi svarar samma arbetsdag.",
    "closing.eyebrow": "Nästa steg",
    "closing.title": "Redo att boka in bilen?",
    "closing.copy": "Berätta om bilen och vad du vill åtgärda. Vi bekräftar en tid, ger ett tydligt pris och har platsen förberedd när du kommer.",
    "closing.primary": "Boka tid",
    "closing.secondary": "Ring verkstaden",
    "closing.reassure": "Ingen press · tydliga priser · svar samma dag",
    "footer.tagline": "Professionell bilvård i Kävlinge. Byggt på noggrann preparering, tydliga priser och pålitligt genomförande sedan 1997.",
    "footer.explore": "Utforska",
    "footer.visit": "Besök",
    "footer.reach": "Nå oss",
    "footer.rights": "Alla rättigheter förbehållna."
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
    return saved === "en" ? "en" : "sv";
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

export function translateDay(day: string, language: Language) {
  if (language === "en") {
    return day;
  }

  const days: Record<string, string> = {
    Sunday: "Söndag",
    Monday: "Måndag",
    Tuesday: "Tisdag",
    Wednesday: "Onsdag",
    Thursday: "Torsdag",
    Friday: "Fredag",
    Saturday: "Lördag"
  };

  return days[day] || day;
}

export function translateHours(value: string, language: Language) {
  if (language === "en") {
    return value;
  }

  return value === "Closed" ? "Stängt" : value;
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

export function localizeService(service: Service, _language: Language) {
  return service;
}

export function localizeContent<T extends Record<string, any> | null>(
  _key: string,
  content: SiteContent<T> | null,
  _language: Language
) {
  return content;
}
