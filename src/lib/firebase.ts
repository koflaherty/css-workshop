// src/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import {
	connectAuthEmulator,
	getAuth,
	signInAnonymously,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { FIREBASE_CONFIG } from '../configuration';

const firebase = initializeApp(FIREBASE_CONFIG);
const realtimeDb = getDatabase(firebase);
const db = getFirestore(firebase);
const auth = getAuth(firebase);
const functions = getFunctions(firebase);

// Connect to Firestore and Auth emulators if running
if (import.meta.env.VITE_USE_EMULATOR === 'true') {
	connectFirestoreEmulator(db, 'localhost', 8080);
	connectAuthEmulator(auth, 'http://localhost:9099');
	connectFunctionsEmulator(functions, 'localhost', 5001);
}

const signPlayerIn = async () => {
	if (!auth.currentUser) {
		const userCredential = await signInAnonymously(auth);
		return userCredential.user;
	}
	return auth.currentUser;
};

export const signInAdmin = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}) => {
	const userCredential = await signInWithEmailAndPassword(
		auth,
		email,
		password
	);
	return userCredential.user;
};

export const logout = async () => {
	try {
		await signOut(auth);
	} catch (error) {
		console.error('Error logging out:', error);
	}
};

export { db, realtimeDb, auth, functions, signPlayerIn };
