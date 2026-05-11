import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

export const createExpenseService = () => {
  const collectionName = 'expenses';

  return {
    add: async (userId, data) => {
      return addDoc(collection(db, collectionName), {
        ...data,
        userId,
        createdAt: new Date().toISOString()
      });
    },

    getAll: async (userId) => {
      const q = query(
        collection(db, collectionName),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return docs.sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    update: async (id, data) => {
      const docRef = doc(db, collectionName, id);
      return updateDoc(docRef, data);
    },

    remove: async (id) => {
      const docRef = doc(db, collectionName, id);
      return deleteDoc(docRef);
    }
  };
};

export const expenseService = createExpenseService();
