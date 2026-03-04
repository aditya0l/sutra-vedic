import 'dotenv/config';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDoc, doc } from "firebase/firestore";

const app = initializeApp({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});
const db = getFirestore(app);

async function run() {
  const payload = {
    items: [
       { "productId": "kairbossom", "quantity": 1 }
    ],
    shippingAddress: {
      firstName: "Test",
      lastName: "User",
      address: "123 Test St",
      city: "Paris",
      state: "Île-de-France",
      zipCode: "75001",
      country: "FR",
      phone: "+33600000000"
    },
    email: "test@sutravedic.fr",
    locale: "fr"
  };

        let totalAmount = 0;
        const enrichedItems = [];
        for (const item of payload.items) {
            const productDoc = await getDoc(doc(db, 'products', item.productId));
            if (productDoc.exists()) {
                const productData = productDoc.data();
                let price = productData.price;
                totalAmount += (price * item.quantity);
                
                enrichedItems.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: price,
                    productSnapshot: {
                        name: productData.name,
                        category: productData.category
                    }
                });
            }
        }

        const newOrder = {
            userId: null,
            guestName: payload.firstName + ' ' + payload.lastName,
            email: payload.email,
            shippingAddress: payload.shippingAddress,
            locale: payload.locale || 'en',
            items: enrichedItems,
            totalAmount,
            status: 'pending_payment',
            createdAt: new Date().toISOString(),
        };

        const removeUndefinedDeep = (obj) => {
            if (Array.isArray(obj)) {
                return obj.map(removeUndefinedDeep).filter(v => v !== undefined);
            } else if (obj !== null && typeof obj === 'object') {
                return Object.fromEntries(
                    Object.entries(obj)
                        .map(([k, v]) => [k, removeUndefinedDeep(v)])
                        .filter(([_, v]) => v !== undefined)
                );
            }
            return obj;
        };

        const cleanOrder = removeUndefinedDeep(newOrder);
        const docRef = await addDoc(collection(db, 'orders'), cleanOrder);
        console.log("Mock check out created:", docRef.id);
}
run();
