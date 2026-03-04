import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, deleteDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const PRODUCTS = [
    {
        slug: "cannabis-leaf-extract-oil",
        name: { en: "Cannabis Leaf Extract Oil", fr: "Huile d'Extrait de Feuille de Cannabis" },
        price: 110, // Default price (10ml)
        variants: [
            {
                id: "10ml",
                name: { en: "10ml", fr: "10ml" },
                price: 110,
                sku: "CAN-OIL-PEP-10ML",
                stock: 50
            },
            {
                id: "30ml",
                name: { en: "30ml", fr: "30ml" },
                price: 214,
                sku: "CAN-OIL-PEP-30ML",
                stock: 50
            }
        ]
    }
];

const SHARED_DATA = {
    description: {
        en: "A premium cannabis formulation designed for pain relief, anxiety management, and improved sleep quality. This peppermint-flavoured extract calms nerve endings and is beneficial for sciatica, neuropathic pain, stress, and insomnia.",
        fr: "Une formulation de cannabis haut de gamme conçue pour soulager la douleur, gérer l'anxiété et améliorer la qualité du sommeil. Cet extrait aromatisé à la menthe poivrée calme les terminaisons nerveuses et est bénéfique pour la sciatique, les douleurs neuropathiques, le stress et l'insomnie."
    },
    shortDescription: {
        en: "Pure cannabis leaf extract oil with peppermint flavour for pain and stress relief.",
        fr: "Huile d'extrait pure de feuille de cannabis à la menthe poivrée pour le soulagement de la douleur et du stress."
    },
    currency: "EUR",
    images: [
        "https://sushainclinic.s3.ap-south-1.amazonaws.com/uploads/17370265001635.webp",
        "https://sushainclinic.s3.ap-south-1.amazonaws.com/uploads/1737026517374.webp",
        "https://sushainclinic.s3.ap-south-1.amazonaws.com/uploads/17370265306305.webp",
        "https://sushainclinic.s3.ap-south-1.amazonaws.com/uploads/17370265468472.webp"
    ],
    category: "Ayurvedic",
    categorySlug: "ayurvedic",
    stock: 100, // Total stock
    sku: "CAN-OIL-PEP",
    rating: 4.8,
    reviewCount: 12,
    isNew: true,
    benefits: [
        { icon: "🧠", title: { en: "Nerve Calming", fr: "Calme les Nerfs" }, description: { en: "Effectively calms nerve endings for neuropathic relief.", fr: "Calme efficacement les terminaisons nerveuses pour un soulagement neuropathique." } },
        { icon: "😴", title: { en: "Sleep Aid", fr: "Aide au Sommeil" }, description: { en: "Enhances sleep quality and helps with insomnia.", fr: "Améliore la qualité du sommeil et aide à lutter contre l'insomnie." } }
    ],
    ingredients: [
        { name: { en: "Cannabis Leaf Extract", fr: "Extrait de Feuille de Cannabis" }, description: { en: "Pure extract from high-quality cannabis leaves.", fr: "Extrait pur de feuilles de cannabis de haute qualité." } },
        { name: { en: "Peppermint Oil", fr: "Huile de Menthe Poivrée" }, description: { en: "Natural flavouring for a fresh taste.", fr: "Arôme naturel pour un goût frais." } }
    ],
    usage: {
        en: "Sublingual use: Place 2 drops below the tongue once a day or as directed by a physician.",
        fr: "Utilisation sublinguale : Placer 2 gouttes sous la langue une fois par jour ou selon les directives d'un médecin."
    },
    certifications: ["GACP Certified", "Lab Tested"],
    tags: ["cannabis", "oil", "ayurvedic", "pain relief"],
    faq: [
        { question: { en: "Is it safe?", fr: "Est-ce sûr ?" }, answer: { en: "Yes, it is lab-tested and certified for safety.", fr: "Oui, il est testé en laboratoire et certifié pour la sécurité." } }
    ]
};

async function upload() {
    console.log("🚀 Starting authenticated upload...");

    try {
        await signInWithEmailAndPassword(auth, "admin@sutravedic.com", "Admin@2026");
        console.log("🔓 Authenticated as admin.");
    } catch (err) {
        console.error("❌ Auth failed:", err.message);
        return;
    }

    // 1. Ensure Category exists
    const catRef = doc(db, "categories", "ayurvedic");
    await setDoc(catRef, {
        slug: "ayurvedic",
        name: { en: "Ayurvedic", fr: "Ayurvédique" },
        description: { en: "Traditional herbal remedies for holistic wellness.", fr: "Remèdes traditionnels à base de plantes pour un bien-être holistique." },
        image: SHARED_DATA.images[0],
        productCount: 1 // Now it's just one product
    }, { merge: true });
    console.log("✅ Category checked/created.");

    // 2. Upload Products
    for (const p of PRODUCTS) {
        const prodRef = doc(db, "products", p.slug);
        await setDoc(prodRef, {
            ...SHARED_DATA,
            id: p.slug,
            slug: p.slug,
            name: p.name,
            price: p.price,
            variants: p.variants
        }, { merge: true });
        console.log(`✅ Product uploaded: ${p.slug}`);
    }

    // 3. Cleanup old products
    const oldProducts = ["cannabis-leaf-extract-oil-10ml", "cannabis-leaf-extract-oil-30ml", "esspnao"];
    for (const oldSlug of oldProducts) {
        await deleteDoc(doc(db, "products", oldSlug));
        console.log(`🗑️ Deleted old product: ${oldSlug}`);
    }

    console.log("✨ All done!");
}

upload().catch(console.error);
