import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase/config';

export const authService = {
  register: (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  },
  
  login: (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  },
  
  logout: () => {
    return signOut(auth);
  },
  
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  }
};
