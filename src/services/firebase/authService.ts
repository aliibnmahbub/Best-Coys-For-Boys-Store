import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import type { UserProfile } from '../../types';

// ইউজারের ফায়ারবেস প্রোফাইল এবং ফায়ারস্টোর ডাটাবেজ একীভূত করার হেল্পার ফাংশন
export const getUserProfile = async (uid: string, firebaseUser?: FirebaseUser): Promise<UserProfile | null> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    } else if (firebaseUser) {
      // যদি কোনো কারণে ফায়ারস্টোরে ডাটা না থাকে, তবে একটি ডিফল্ট প্রোফাইল তৈরি করে দেওয়া
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: 'customer', // ডিফল্ট রোল কাস্টমার
        createdAt: Date.now(),
      };
      await setDoc(userDocRef, newProfile);
      return newProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// নতুন কাস্টমার রেজিস্ট্রেশন
export const registerUser = async (email: string, password: string, name: string): Promise<UserProfile> => {
  try {
    // ১. ফায়ারবেজ অথেনটিকেশনে ইউজার তৈরি
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ২. ইউজারের নাম আপডেট করা
    await updateProfile(user, { displayName: name });

    // ৩. ইউজারের ডাটা ফায়ারস্টোর ডাটাবেজে (users কালেকশনে) সেভ করা
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: null,
      role: 'customer', // নতুন রেজিস্টার হওয়া সবাই কাস্টমার
      createdAt: Date.now(),
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    return userProfile;
  } catch (error: any) {
    console.error("Registration Error:", error);
    throw new Error(error.message || "Failed to register. Please try again.");
  }
};

// কাস্টমার লগইন
export const loginUser = async (email: string, password: string): Promise<UserProfile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getUserProfile(userCredential.user.uid, userCredential.user);
    
    if (!profile) {
      throw new Error("User profile not found in database.");
    }
    
    return profile;
  } catch (error: any) {
    console.error("Login Error:", error);
    throw new Error("Invalid email or password.");
  }
};

// কাস্টমার লগআউট
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
    throw new Error("Failed to logout. Please try again.");
  }
};