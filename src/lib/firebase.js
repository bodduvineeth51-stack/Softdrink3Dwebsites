/**
 * Firebase configuration for RiDoy contact form.
 *
 * Add your Firebase project credentials to a .env file at the project root:
 *
 *   VITE_FIREBASE_API_KEY=...
 *   VITE_FIREBASE_AUTH_DOMAIN=...
 *   VITE_FIREBASE_PROJECT_ID=...
 *   VITE_FIREBASE_STORAGE_BUCKET=...
 *   VITE_FIREBASE_MESSAGING_SENDER_ID=...
 *   VITE_FIREBASE_APP_ID=...
 *
 * If no projectId is found, `db` is exported as null and the form falls back
 * to a simulated success (useful for development without Firebase).
 */
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const cfg = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

export let db = null

if (cfg.projectId) {
  try {
    const app = getApps().length ? getApps()[0] : initializeApp(cfg)
    db = getFirestore(app)
  } catch (e) {
    console.warn('[RiDoy] Firebase init failed — contact form will run without persistence.', e)
  }
}
