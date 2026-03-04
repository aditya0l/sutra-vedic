import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

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
        price: 110,
        category: "Ayurvedic",
        categorySlug: "ayurvedic",
        shortDescription: {
            en: "Pure cannabis leaf extract oil with peppermint flavour for pain and stress relief.",
            fr: "Huile d'extrait pure de feuille de cannabis à la menthe poivrée pour le soulagement de la douleur et du stress."
        },
        description: {
            en: "A premium cannabis formulation designed for pain relief, anxiety management, and improved sleep quality. This peppermint-flavoured extract calms nerve endings and is beneficial for sciatica, neuropathic pain, stress, and insomnia.",
            fr: "Une formulation de cannabis haut de gamme conçue pour soulager la douleur, gérer l'anxiété et améliorer la qualité du sommeil. Cet extrait aromatisé à la menthe poivrée calme les terminaisons nerveuses et est bénéfique pour la sciatique, les douleurs neuropathiques, le stress et l'insomnie."
        },
        images: [
            "https://sushainclinic.s3.ap-south-1.amazonaws.com/uploads/17370265001635.webp",
            "https://sushainclinic.s3.ap-south-1.amazonaws.com/uploads/1737026517374.webp",
            "https://sushainclinic.s3.ap-south-1.amazonaws.com/uploads/17370265306305.webp",
            "https://sushainclinic.s3.ap-south-1.amazonaws.com/uploads/17370265468472.webp"
        ],
        variants: [
            { id: "10ml", name: { en: "10ml", fr: "10ml" }, price: 110, sku: "CAN-OIL-PEP-10ML", stock: 50 },
            { id: "30ml", name: { en: "30ml", fr: "30ml" }, price: 214, sku: "CAN-OIL-PEP-30ML", stock: 50 }
        ],
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
        }
    },
    {
        slug: "kairbossom-ayurvedic-breast-massage-oil",
        name: { en: "Kairbossom Ayurvedic Breast Massage Oil", fr: "Huile de Massage Mammaire Ayurvédique Kairbossom" },
        price: 214,
        category: "Ayurvedic",
        categorySlug: "ayurvedic",
        shortDescription: {
            en: "Ayurvedic formulation for maintaining overall health of breasts, strengthening and toning tissues.",
            fr: "Formulation ayurvédique pour maintenir la santé globale des seins, renforcer et tonifier les tissus."
        },
        description: {
            en: "Kairbossom is a breast massage oil made from ayurvedic herbs and natural extracts which strengthens and tones the breast muscles. It nourishes the breasts and rejuvenates the fat cells so as to boost the pectoral ligaments which define the breast shape and makes them stronger and elastic.",
            fr: "Kairbossom est une huile de massage mammaire composée d'herbes ayurvédiques et d'extraits naturels qui renforce et tonifie les muscles mammaires. Elle nourrit les seins et rajeunit les cellules adipeuses afin de renforcer les ligaments pectoraux qui définissent la forme des seins et les rendent plus forts et élastiques."
        },
        images: [
            "https://www.kairaliproducts.in/cdn/shop/files/ayurvedic-breast-massage-oil-for-toning-firming-and-nourishing-the-breast-naturally-kairbossom-1525182.png?v=1761595530&width=1920"
        ],
        variants: [
            { id: "100ml", name: { en: "100ml", fr: "100ml" }, price: 214, sku: "KAIR-BOSSOM-100ML", stock: 50 }
        ],
        benefits: [
            { icon: "✨", title: { en: "Tones Breasts", fr: "Tonifie les Seins" }, description: { en: "Strengthens and tones the breast muscles naturally.", fr: "Renforce et tonifie naturellement les muscles mammaires." } },
            { icon: "💧", title: { en: "Nourishing", fr: "Nourrissant" }, description: { en: "Heals itches and dryness while building up collagen.", fr: "Guérit les démangeaisons et la sécheresse tout en renforçant le collagène." } }
        ],
        ingredients: [
            { name: { en: "Priyangu", fr: "Priyangu" }, description: { en: "Callicarpa macrophylla", fr: "Callicarpa macrophylla" } },
            { name: { en: "Shatgrandhi", fr: "Shatgrandhi" }, description: { en: "Acorus calamus", fr: "Acorus calamus" } }
        ],
        usage: {
            en: "Warm the oil, apply 5-10 ml on breasts in circular and upward motion. Retain for 15 minutes and wash off with lukewarm water. Best results when applied daily.",
            fr: "Chauffer l'huile, appliquer 5-10 ml sur les seins en mouvements circulaires et ascendants. Laisser agir 15 minutes et rincer à l'eau tiède. Meilleurs résultats en application quotidienne."
        }
    },
    {
        slug: "pain-relieving-healing-combo",
        name: { en: "Shesha Ayurveda Pain Relieving & Healing Combo", fr: "Combo de Soulagement de la Douleur et Guérison Shesha Ayurveda" },
        price: 189,
        category: "Ayurvedic",
        categorySlug: "ayurvedic",
        shortDescription: {
            en: "Complete Ayurvedic pain relief combo with Murivenna, Kottamchukkadi, Karpooradi oils & Kizhi potli.",
            fr: "Combo complet de soulagement de la douleur ayurvédique avec les huiles Murivenna, Kottamchukkadi, Karpooradi et le potli Kizhi."
        },
        description: {
            en: "Complete Ayurvedic pain relief combo with Murivenna, Kottamchukkadi, Karpooradi oils & Kizhi potli. Natural relief for joint pain, muscle aches & inflammation. Perfect gift for parents.",
            fr: "Combo complet de soulagement de la douleur ayurvédique avec les huiles Murivenna, Kottamchukkadi, Karpooradi et le potli Kizhi. Soulagement naturel des douleurs articulaires, musculaires et de l'inflammation. Cadeau parfait pour les parents."
        },
        images: [
            "https://sheshaayurveda.com/cdn/shop/files/pain-relief-healing-combo-01.png"
        ],
        variants: [
            { id: "combo", name: { en: "Full Combo", fr: "Combo Complet" }, price: 189, sku: "SHESHA-PAIN-COMBO", stock: 30 }
        ],
        benefits: [
            { icon: "🦴", title: { en: "Pain Relief", fr: "Soulagement de la Douleur" }, description: { en: "Addresses joint pain, muscle aches, and body stiffness.", fr: "Traite les douleurs articulaires, les courbatures et la raideur corporelle." } },
            { icon: "🔥", title: { en: "Reduces Inflammation", fr: "Réduit l'Inflammation" }, description: { en: "Natural anti-inflammatory herbs soothe swollen joints.", fr: "Des herbes anti-inflammatoires naturelles apaisent les articulations enflées." } }
        ],
        usage: {
            en: "Apply oil on affected area and gently massage with a warm Kizhi potli for 15-20 minutes. Wipe off excess oil with a warm towel.",
            fr: "Appliquez l'huile sur la zone affectée et massez doucement avec un potli Kizhi chaud pendant 15 à 20 minutes. Essuyez l'excès d'huile avec une serviette chaude."
        }
    }
];

const SHARED_DEFAULTS = {
    currency: "EUR",
    stock: 100,
    rating: 4.8,
    reviewCount: 15,
    isNew: true,
    certifications: ["GACP Certified", "Lab Tested"],
    tags: ["ayurvedic", "natural", "health"],
    faq: [
        { question: { en: "Is it safe?", fr: "Est-ce sûr ?" }, answer: { en: "Yes, it is lab-tested and certified for safety.", fr: "Oui, il est testé en laboratoire et certifié pour la sécurité." } }
    ]
};

async function upload() {
    console.log("🚀 Starting authenticated upload...");

    try {
        await signInWithEmailAndPassword(auth, "contact@sutravedic.fr", "Admin@2026");
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
        image: PRODUCTS[0].images[0],
        productCount: PRODUCTS.length
    }, { merge: true });
    console.log("✅ Category checked/created.");

    // 2. Upload Products
    for (const p of PRODUCTS) {
        const prodRef = doc(db, "products", p.slug);
        await setDoc(prodRef, {
            ...SHARED_DEFAULTS,
            ...p,
            id: p.slug,
        }, { merge: true });
        console.log(`✅ Product uploaded: ${p.slug}`);
    }

    // 3. Cleanup old products
    const oldProducts = ["cannabis-leaf-extract-oil-10ml", "cannabis-leaf-extract-oil-30ml", "esspnao", "espano"];
    for (const oldSlug of oldProducts) {
        await deleteDoc(doc(db, "products", oldSlug));
        console.log(`🗑️ Deleted old product: ${oldSlug}`);
    }

    // 4. Investigation: List all products and delete anything matching 'esp' or 'ess'
    console.log("🔍 Investigating remaining products...");
    const querySnapshot = await getDocs(collection(db, "products"));
    for (const d of querySnapshot.docs) {
        const id = d.id;
        console.log(`📌 Found product ID: ${id}`);
        if (id.includes("esp") || id.includes("ess") || id.includes("espano") || id.includes("esspnao")) {
            if (!PRODUCTS.find(p => p.slug === id)) {
                await deleteDoc(doc(db, "products", id));
                console.log(`🗑️ Dynamically deleted lingering product: ${id}`);
            }
        }
    }

    console.log("✨ All done!");
}

upload().catch(console.error);
