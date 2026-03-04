import 'dotenv/config';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, limit, orderBy, query } from "firebase/firestore";

const app = initializeApp({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});
const db = getFirestore(app);

async function run() {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(1));
  const snap = await getDocs(q);
  console.log(JSON.stringify(snap.docs[0].data(), null, 2));
}
run();
