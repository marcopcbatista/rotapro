import { useState, useEffect } from 'react';
import { auth, db, storage } from '../services/firebase';
import { 
  collection, addDoc, onSnapshot, query, where, orderBy, 
  updateDoc, doc, deleteDoc, serverTimestamp, setDoc, writeBatch 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export function useDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [user, setUser] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  const FREE_LIMIT = 10;

  // ─── Auth Listener ────────────────────────────
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setDeliveries([]);
        setIsPro(false);
        setLoading(false);
      } else {
        // Garantir que o doc do user existe no Firestore
        try {
          const userRef = doc(db, 'users', u.uid);
          await setDoc(userRef, {
            email: u.email,
            lastLogin: serverTimestamp()
          }, { merge: true });
        } catch (err) {
          console.error("Erro ao atualizar perfil:", err);
        }
      }
    });
    return () => unsubAuth();
  }, []);

  // ─── Deliveries Listener + Pro Status ────────────────────────────
  useEffect(() => {
    if (!user) return;

    // Listener de entregas em tempo real
    const deliveriesQuery = query(
      collection(db, 'deliveries'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubDeliveries = onSnapshot(deliveriesQuery, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setDeliveries(docs);
      setLoading(false);
    }, (err) => {
      console.error("Erro ao ouvir entregas:", err);
      setLoading(false);
    });

    // Listener do status PRO em tempo real
    const userRef = doc(db, 'users', user.uid);
    const unsubUser = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.data();
        setIsPro(userData.isPaid === true);
      } else {
        setIsPro(false);
      }
    }, (err) => {
      console.error("Erro ao verificar status PRO:", err);
      setIsPro(false);
    });

    return () => {
      unsubDeliveries();
      unsubUser();
    };
  }, [user]);

  // ─── Actions ────────────────────────────
  const addDelivery = async (address, phone = '') => {
    if (!user) return { success: false, message: 'Faça login para adicionar entregas' };
    
    if (!isPro && deliveries.length >= FREE_LIMIT) {
      return { 
        success: false, 
        message: `Limite do plano grátis atingido (${FREE_LIMIT} entregas). Assine o PRO para ilimitado!`
      };
    }

    try {
      await addDoc(collection(db, 'deliveries'), {
        userId: user.uid,
        address: address.trim(),
        phone: phone.trim(),
        status: 'pending',
        createdAt: serverTimestamp(),
        deliveredAt: null
      });
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Erro ao salvar no banco' };
    }
  };

  const markAsDelivered = async (id, file = null) => {
    try {
      let proofUrl = null;
      
      // Upload proof photo if provided
      if (file && user) {
        const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
        const storageRef = ref(storage, `proofs/${user.uid}/${id}_${Date.now()}.${fileExt}`);
        await uploadBytes(storageRef, file);
        proofUrl = await getDownloadURL(storageRef);
      }

      const deliveryRef = doc(db, 'deliveries', id);
      const updateData = {
        status: 'delivered',
        deliveredAt: new Date().toISOString()
      };
      
      if (proofUrl) {
        updateData.proofUrl = proofUrl;
      }
      
      await updateDoc(deliveryRef, updateData);
      return { success: true, proofUrl };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Erro ao salvar comprovante' };
    }
  };

  const removeDelivery = async (id) => {
    try {
      await deleteDoc(doc(db, 'deliveries', id));
    } catch (err) {
      console.error(err);
    }
  };

  // Stats
  const pendingCount = deliveries.filter(d => d.status === 'pending').length;
  const deliveredCount = deliveries.filter(d => d.status === 'delivered').length;
  const progressPercent = deliveries.length > 0 ? (deliveredCount / deliveries.length) * 100 : 0;

  const clearCircuit = async (onlyDelivered = false) => {
    if (!user) return;
    try {
      const batch = writeBatch(db);
      const toDelete = onlyDelivered 
        ? deliveries.filter(d => d.status === 'delivered')
        : deliveries;
        
      toDelete.forEach(d => {
        batch.delete(doc(db, 'deliveries', d.id));
      });
      
      await batch.commit();
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Erro ao limpar entregas' };
    }
  };

  return {
    deliveries,
    user,
    isPro,
    loading,
    addDelivery,
    markAsDelivered,
    removeDelivery,
    clearCircuit,
    FREE_LIMIT,
    pendingCount,
    deliveredCount,
    progressPercent
  };
}
