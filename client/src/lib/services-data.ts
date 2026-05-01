import type { Language } from "./i18n";

type Bilingual = { en: string; sv: string };
type BilingualList = { en: string[]; sv: string[] };

export type SizeKey = "small" | "medium" | "large";

export type ServicePackage = {
  slug: string;
  number: string;
  title: Bilingual;
  tagline: Bilingual;
  description: Bilingual;
  inclusions: BilingualList;
  sizes: Record<SizeKey, number>;
  addons?: Array<{ label: Bilingual; price: number }>;
  notes?: Bilingual;
  duration: Bilingual;
  featured?: boolean;
};

export type StandaloneService = {
  slug: string;
  title: Bilingual;
  price: number;
  description: Bilingual;
};

export const SIZE_LABELS: Record<SizeKey, Bilingual> = {
  small: { en: "Small", sv: "Liten" },
  medium: { en: "Medium", sv: "Mellan" },
  large: { en: "Large", sv: "Stor" }
};

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    slug: "helrekonditionering",
    number: "01",
    title: { en: "Full reconditioning", sv: "Helrekonditionering" },
    tagline: {
      en: "The complete restoration. Inside, outside, every seam.",
      sv: "Den kompletta återställningen. Invändigt, utvändigt, varje skrymsle."
    },
    description: {
      en: "Our most comprehensive package — every surface of the car restored to a showroom standard, in one calm, methodical session.",
      sv: "Vårt mest omfattande paket — varje yta av bilen återställd till showroom-skick, i ett lugnt och metodiskt arbete."
    },
    inclusions: {
      en: [
        "Full wash including body, engine bay, wheels, trunk, cabin, and every crevice — door seals, hinges, fuel-cap recess",
        "Hand polish of the entire car to remove scratches, tar, asphalt, and bonded contaminants from the paint",
        "Wax and polish for a deep, lasting finish",
        "Full interior detail — vacuum, deep clean, and conditioning of every contact surface",
        "Cleaning of all rubber and vinyl details, inside and outside",
        "Window polish and final body polish for a flawless final finish"
      ],
      sv: [
        "Hel tvätt inkluderande kaross, motor, fälgar, bagageutrymme, kupé och alla skrymslen som dörrlister, gångjärn med mera",
        "Polering av hela bilen för borttagning av repor, tjära, asfalt och all smuts som sitter fast på lacken",
        "Vaxning och polering för en djup och hållbar finish",
        "Städning och total rengöring av bilen invändigt",
        "Rengöring av alla gummi- och vinyldetaljer invändigt och utvändigt",
        "Fönsterputs och slutpolering av hela bilen"
      ]
    },
    sizes: { small: 1600, medium: 1800, large: 2400 },
    notes: {
      en: "Stone-chip touch-up: please bring paint that matches the original colour of the car.",
      sv: "Vid färgförbättring av stenskott måste kunden ta med sig färg som matchar bilens originalfärg."
    },
    duration: { en: "6–10 h", sv: "6–10 tim" },
    featured: true
  },
  {
    slug: "lackforsegling",
    number: "02",
    title: { en: "Paint sealing & protection", sv: "Lackförsegling / Lackskydd" },
    tagline: {
      en: "Long-lasting protection that begins with proper preparation.",
      sv: "Långvarigt skydd som börjar med ordentlig preparering."
    },
    description: {
      en: "We polish the entire car to remove scratches, tar, asphalt, and bonded contaminants. Then we apply a paint sealant — only after the surface is genuinely ready.",
      sv: "Vi polerar hela bilen för borttagning av repor, tjära, asfalt och all smuts som sitter fast på lacken, därefter lackförseglar vi bilen."
    },
    inclusions: {
      en: [
        "Full surface decontamination and machine polish",
        "Application of a professional paint sealant for durable protection",
        "Window polish and final body polish",
        "Visual walk-around so you see the finish before you leave"
      ],
      sv: [
        "Fullständig dekontaminering och maskinell polering",
        "Applicering av professionell lackförsegling för långvarigt skydd",
        "Fönsterputs och slutpolering",
        "Avslutande genomgång så du ser resultatet innan du åker"
      ]
    },
    sizes: { small: 2800, medium: 2900, large: 3000 },
    addons: [
      {
        label: { en: "Annual check-up & touch-ups", sv: "Årskontroll och förbättringar" },
        price: 1400
      }
    ],
    notes: {
      en: "Paint sealing is recommended only for cars older than two years.",
      sv: "Lackförsegling rekommenderas endast om bilen är äldre än två år."
    },
    duration: { en: "4–6 h", sv: "4–6 tim" }
  },
  {
    slug: "utvandig-rekonditionering",
    number: "03",
    title: { en: "Exterior reconditioning", sv: "Utvändig rekonditionering" },
    tagline: {
      en: "A new exterior — without touching the cabin.",
      sv: "En ny yta utvändigt — utan att röra kupén."
    },
    description: {
      en: "Everything that lives outside the cabin, restored: paint, wheels, trim, glass.",
      sv: "Allt som syns på utsidan återställs — lack, fälgar, lister och glas."
    },
    inclusions: {
      en: [
        "Full wash including body, wheels, trunk, and every crevice — door seals, hinges, fuel cap",
        "Polish of the entire car to remove scratches, dirt, asphalt, and tar",
        "Wax and polish",
        "Cleaning of all exterior rubber and vinyl details",
        "Window polish and final body polish"
      ],
      sv: [
        "Hel tvätt inkluderande kaross, fälgar, bagageutrymme och alla skrymslen som dörrlister, gångjärn med mera",
        "Polering av hela bilen för borttagning av repor, smuts, asfalt och tjära",
        "Vaxning och polering",
        "Rengöring av alla gummi- och vinyldetaljer utvändigt",
        "Fönsterputs och slutpolering av hela bilen"
      ]
    },
    sizes: { small: 1000, medium: 1200, large: 1400 },
    notes: {
      en: "Stone-chip touch-up: please bring paint that matches the original colour of the car.",
      sv: "Vid färgförbättring av stenskott måste kunden ta med sig färg som matchar bilens originalfärg."
    },
    duration: { en: "3–5 h", sv: "3–5 tim" }
  },
  {
    slug: "invandig-rekonditionering",
    number: "04",
    title: { en: "Interior reconditioning", sv: "Invändig rekonditionering" },
    tagline: {
      en: "A cabin returned to fresh, clean, and well kept.",
      sv: "En kupé tillbaka till fräscht, rent och välskött."
    },
    description: {
      en: "A focused interior detail — every contact surface cleaned and conditioned.",
      sv: "En fokuserad invändig rekond — varje kontaktyta rengjord och skött."
    },
    inclusions: {
      en: [
        "Car wash and cleaning between the doors",
        "Full interior cleaning and detailing",
        "Cleaning of all interior rubber and vinyl details",
        "Window polish"
      ],
      sv: [
        "Biltvätt och rengöring mellan dörrar",
        "Städning och total rengöring av bilen invändigt",
        "Rengöring av alla gummi- och vinyldetaljer invändigt",
        "Fönsterputs"
      ]
    },
    sizes: { small: 800, medium: 1000, large: 1200 },
    duration: { en: "1.5–2.5 h", sv: "1,5–2,5 tim" }
  }
];

export const STANDALONE_SERVICES: StandaloneService[] = [
  {
    slug: "biltvatt",
    title: { en: "Car wash", sv: "Biltvätt" },
    price: 200,
    description: {
      en: "A thorough exterior wash — body, wheels, glass.",
      sv: "En noggrann utvändig tvätt — kaross, fälgar, glas."
    }
  },
  {
    slug: "heltvatt-stadning",
    title: { en: "Full wash + interior cleaning", sv: "Heltvätt plus städning" },
    price: 400,
    description: {
      en: "Complete exterior wash combined with a careful interior clean.",
      sv: "Komplett utvändig tvätt kombinerat med en noggrann invändig städning."
    }
  },
  {
    slug: "motortvatt",
    title: { en: "Engine wash", sv: "Motortvätt" },
    price: 500,
    description: {
      en: "Engine bay cleaned with controlled chemistry — no shortcuts on sensitive components.",
      sv: "Motorrum rengörs med kontrollerad kemi — inga genvägar på känsliga komponenter."
    }
  },
  {
    slug: "kladseltvatt",
    title: { en: "Upholstery cleaning", sv: "Klädseltvätt" },
    price: 600,
    description: {
      en: "Deep extraction cleaning of fabric seats and upholstery.",
      sv: "Djuprengöring av tygsäten och klädsel."
    }
  }
];

export function formatPrice(value: number, language: Language) {
  if (language === "sv") {
    return `${value.toLocaleString("sv-SE")} kr`;
  }
  return `${value.toLocaleString("en-US")} kr`;
}
