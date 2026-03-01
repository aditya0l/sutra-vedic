import { Product, Category, Review } from '@/types';

export const categories: Category[] = [
    {
        id: 'cat-1',
        slug: 'huiles-ayurvediques',
        name: { fr: 'Huiles Ayurvédiques', en: 'Ayurvedic Oils' },
        description: {
            fr: 'Huiles thérapeutiques traditionnelles pour le corps et l\'esprit',
            en: 'Traditional therapeutic oils for body and mind'
        },
        image: '/images/categories/oils.jpg',
        productCount: 2
    },
    {
        id: 'cat-2',
        slug: 'cures-bien-etre',
        name: { fr: 'Cures & Coffrets Bien-être', en: 'Wellness Combos & Sets' },
        description: {
            fr: 'Sélection de coffrets complets pour une approche holistique',
            en: 'Selection of complete sets for a holistic approach'
        },
        image: '/images/categories/supplements.jpg',
        productCount: 1
    },
    {
        id: 'cat-3',
        slug: 'soins-specialises',
        name: { fr: 'Soins Spécialisés', en: 'Specialized Care' },
        description: {
            fr: 'Formulations ciblées pour des besoins spécifiques',
            en: 'Targeted formulations for specific needs'
        },
        image: '/images/categories/immunity.jpg',
        productCount: 1
    }
];

export const products: Product[] = [
    {
        id: 'prod-3',
        slug: 'shesha-ayurveda-pain-combo',
        name: {
            fr: 'Combo de Guérison & Soulagement de la Douleur Ayurvédique',
            en: 'Ayurvedic Pain Relief & Healing Combo'
        },
        description: {
            fr: 'Un kit de thérapie complet comprenant 4 articles qui associe les huiles ayurvédiques traditionnelles du Kerala à un pochon de chauffage aux herbes (Kizhi) pour une guérison des tissus profonds et un soulagement de la douleur. Idéal pour les douleurs dorsales, l\'arthrite et la récupération sportive.',
            en: 'A comprehensive 4-item therapy kit that combines traditional Kerala Ayurvedic oils with a herbal heating potli (Kizhi) for deep tissue healing and pain relief. Excellent for back pain, arthritis, and sports recovery.'
        },
        shortDescription: {
            fr: 'Thérapie complète à 4 articles pour le soulagement des douleurs musculaires et articulaires.',
            en: 'Complete 4-item therapy for muscle and joint pain relief.'
        },
        price: 189,
        currency: 'EUR',
        images: ['/images/products/shesha.jpg'],
        category: 'Cures & Coffrets Bien-être',
        categorySlug: 'cures-bien-etre',
        stock: 15,
        sku: 'SHESHA-PC-189',
        rating: 4.9,
        reviewCount: 42,
        isBestseller: true,
        benefits: [
            { icon: '💆', title: { fr: 'Soulagement Multi-Action', en: 'Multi-Action Relief' }, description: { fr: 'Réduit l\'inflammation et la douleur', en: 'Reduces inflammation and pain' } },
            { icon: '🔥', title: { fr: 'Thermothérapie', en: 'Heat Therapy' }, description: { fr: 'Pochon Kizhi pour une chaleur bienfaisante', en: 'Kizhi potli for healing heat' } }
        ],
        ingredients: [
            { name: { fr: 'Murivenna & Karpooradi', en: 'Murivenna & Karpooradi' }, description: { fr: 'Huiles médicinales puissantes', en: 'Powerful medicated oils' } },
            { name: { fr: 'Kolakulathadi Kizhi', en: 'Kolakulathadi Kizhi' }, description: { fr: 'Pochon aux herbes chauffant', en: 'Herbal heating potli' } }
        ],
        usage: {
            fr: 'Appliquer l\'huile spécifique sur la zone affectée. Chauffer le pochon Kizhi sur une poêle tiède et appliquer en tapotant doucement sur les zones douloureuses.',
            en: 'Apply specific oil to the affected area. Heat the Kizhi potli on a warm pan and apply with gentle dabbing motions on painful areas.'
        },
        certifications: ['Kerala Ayurveda Authentic', 'Traditional Healing'],
        tags: ['pain relief', 'combo', 'healing', 'kizhi'],
        faq: []
    },
    {
        id: 'prod-2',
        slug: 'kairbossom-massage-oil',
        name: {
            fr: 'Huile de Massage Ayurvédique Kairbossom',
            en: 'Kairbossom Ayurvedic Breast Massage Oil'
        },
        description: {
            fr: 'Une huile ayurvédique naturelle formulée pour tonifier, raffermir et nourrir les tissus. Elle se concentre sur le renforcement des muscles sous-jacents et l\'amélioration de l\'élasticité de la peau grâce à des herbes comme le Kharayashti.',
            en: 'A natural Ayurvedic oil formulated to tone, firm, and nourish the tissues. It focuses on strengthening the underlying muscles and improving skin elasticity with rejuvenative herbs like Kharayashti.'
        },
        shortDescription: {
            fr: 'Huile raffermissante et tonifiante pour la vitalité des tissus.',
            en: 'Firming and toning oil for tissue vitality.'
        },
        price: 214,
        currency: 'EUR',
        images: ['/images/products/kairali.jpg'],
        category: 'Huiles Ayurvédiques',
        categorySlug: 'huiles-ayurvediques',
        stock: 50,
        sku: 'KAIR-O-214',
        rating: 4.7,
        reviewCount: 28,
        isNew: true,
        benefits: [
            { icon: '✨', title: { fr: 'Raffermissant', en: 'Firming' }, description: { fr: 'Améliore l\'élasticité de la peau', en: 'Improves skin elasticity' } },
            { icon: '🌿', title: { fr: 'Rajeunissant', en: 'Rejuvenating' }, description: { fr: 'Herbes botaniques pures', en: 'Pure botanical herbs' } }
        ],
        ingredients: [
            { name: { fr: 'Sida Cordifolia', en: 'Sida Cordifolia' }, description: { fr: 'Herbe Kharayashti pour le tonus', en: 'Kharayashti herb for tone' } },
            { name: { fr: 'Huiles Médicinales', en: 'Medicated Oils' }, description: { fr: 'Base de Kairali traditionnelle', en: 'Traditional Kairali base' } }
        ],
        usage: {
            fr: 'Appliquer une petite quantité et masser doucement en mouvements circulaires jusqu\'à absorption complète (une à deux fois par jour).',
            en: 'Apply a small amount and massage gently in circular motions until fully absorbed (once or twice daily).'
        },
        certifications: ['GMP Certified', 'Ayurvedic'],
        tags: ['massage oil', 'firming', 'wellness', 'kairali'],
        faq: []
    },
    {
        id: 'prod-1',
        slug: 'cannabis-leaf-extract-oil',
        name: {
            fr: 'Huile d\'Extrait de Feuille de Cannabis (Menthe)',
            en: 'Cannabis Leaf Extract Oil (Peppermint)'
        },
        description: {
            fr: 'Une formulation ayurvédique thérapeutique puissante issue d\'extraits de cannabis purs. Conçue pour gérer les douleurs chroniques (sciatique, arthrite) et favoriser le bien-être mental (sommeil, stress). Disponible en 30ml (249€) et 10ml (110€).',
            en: 'A powerful therapeutic Ayurvedic formulation derived from pure cannabis extracts. Designed to manage chronic pain (sciatica, arthritis) and promote mental wellness (sleep, stress). Available in 30ml (249€) and 10ml (110€).'
        },
        shortDescription: {
            fr: 'Extrait concentré pour le soulagement des douleurs chroniques et de l\'insomnie.',
            en: 'Concentrated extract for chronic pain and insomnia relief.'
        },
        price: 249,
        currency: 'EUR',
        images: ['/images/products/sushain.jpg'],
        category: 'Soins Spécialisés',
        categorySlug: 'soins-specialises',
        stock: 20,
        sku: 'MED-C-249',
        rating: 4.8,
        reviewCount: 35,
        benefits: [
            { icon: '🌿', title: { fr: 'Gestion de la Douleur', en: 'Pain Management' }, description: { fr: 'Efficace pour les douleurs articulaires et nerveuses', en: 'Effective for joint and nerve pain' } },
            { icon: '🧠', title: { fr: 'Soutien Mental', en: 'Mental Wellness' }, description: { fr: 'Calme le stress et l\'anxiété', en: 'Calms stress and anxiety' } }
        ],
        ingredients: [
            { name: { fr: 'Extrait de Cannabis', en: 'Cannabis Extract' }, description: { fr: 'Pur et de qualité médicinale', en: 'Pure medicinal grade' } },
            { name: { fr: 'Huile de Menthe', en: 'Peppermint Oil' }, description: { fr: 'Saveur agréable pour l\'usage sublingual', en: 'Pleasant flavor for sublingual use' } }
        ],
        usage: {
            fr: '2 gouttes une fois par jour par voie sublinguale (sous la langue), ou selon l\'avis d\'un professionnel.',
            en: '2 drops once a day sublingually (under the tongue), or as directed by a professional.'
        },
        certifications: ['Medicann Quality', 'Ayurvedic Formula'],
        tags: ['cannabis', 'extract', 'peppermint', 'wellness'],
        faq: []
    }
];

export const reviews: Review[] = [
    {
        id: 'rev-1',
        userName: 'Aarav Sharma',
        rating: 5,
        comment: {
            fr: 'Le combo de Shesha est magique pour mes douleurs de dos après le sport. Très efficace !',
            en: 'Shesha\'s combo is magic for my back pain after sports. Very effective!'
        },
        date: '2025-01-15',
        productId: 'prod-1',
        verified: true
    },
    {
        id: 'rev-2',
        userName: 'Priya Patel',
        rating: 5,
        comment: {
            fr: 'L\'huile Kairbossom est très agréable, on sent la qualité des ingrédients Kairali.',
            en: 'Kairbossom oil is very pleasant, you can feel the quality of Kairali ingredients.'
        },
        date: '2025-02-03',
        productId: 'prod-2',
        verified: true
    },
    {
        id: 'rev-3',
        userName: 'Rohan Gupta',
        rating: 5,
        comment: {
            fr: 'L\'huile de cannabis Medicann m\'aide énormément au quotidien. Le goût menthe est un vrai plus.',
            en: 'Medicann cannabis oil helps me a lot daily. The mint taste is a real plus.'
        },
        date: '2025-02-14',
        productId: 'prod-3',
        verified: true
    }
];
