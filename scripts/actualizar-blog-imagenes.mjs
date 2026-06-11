/**
 * actualizar-blog-imagenes.mjs
 * Updates blog posts with their cover images
 */
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDBhWaGpqYgeaAc1el64rB58cpjGvYMQ6Y",
  authDomain: "cuidar-mdp.firebaseapp.com",
  projectId: "cuidar-mdp",
  storageBucket: "cuidar-mdp.firebasestorage.app",
  messagingSenderId: "255599759087",
  appId: "1:255599759087:web:21cfa21a71317a7835151a",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

await signInWithEmailAndPassword(auth, 'proyectos@residencialosalerces.com', process.env.FIREBASE_ADMIN_PASSWORD);
console.log('✅ Autenticado\n');

const updates = [
  { slug: 'guia-completa-elegir-residencia-geriatrica-mar-del-plata', img: '/images/blog/guia-completa-elegir-residencia-geriatrica-mar-del-plata.png' },
  { slug: 'como-contratar-cuidador-domiciliario-mar-del-plata', img: '/images/blog/como-contratar-cuidador-domiciliario-mar-del-plata.png' },
  { slug: 'diferencias-residencia-geriatrica-centro-de-dia-cuidador', img: '/images/blog/diferencias-residencia-geriatrica-centro-de-dia-cuidador.png' },
  { slug: '10-senales-adulto-mayor-necesita-ayuda-profesional', img: '/images/blog/10-senales-adulto-mayor-necesita-ayuda-profesional.png' },
  { slug: 'derechos-adultos-mayores-residencias-argentina', img: '/images/blog/derechos-adultos-mayores-residencias-argentina.png' },
  { slug: 'como-preparar-ingreso-residencia-geriatrica', img: '/images/blog/como-preparar-ingreso-residencia-geriatrica.png' },
];

for (const { slug, img } of updates) {
  await updateDoc(doc(db, 'blog', slug), { imagenPortada: img, updatedAt: serverTimestamp() });
  console.log(`✅ ${slug}`);
}

console.log(`\n🎉 ${updates.length} posts actualizados con imágenes`);
process.exit(0);
