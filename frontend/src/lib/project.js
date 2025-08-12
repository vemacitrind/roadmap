import { collection, addDoc, serverTimestamp, query, where, onSnapshot, getDocs, getDoc, updateDoc, doc,increment } from "firebase/firestore";
import { db } from "@/firebase/config"; // your firebase config import
import axios from "axios";
import { toast } from "sonner";
import { to } from "react-spring";

export const addProject = async (projectData) => {
  try {
    const projectsCol = collection(db, "projects");

    const data = {
      title: projectData.title,
      description: projectData.description,
      status: projectData.status || "completed",
      link: projectData.link || null,
      driveLinks: Array.isArray(projectData.driveLinks)
        ? projectData.driveLinks
        : [projectData.driveLinks],
      images: projectData.images || [],
      technologies: projectData.technologies || [],
      price: projectData.price || 0,
      is_available: projectData.is_available !== undefined ? projectData.is_available : true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      uid: projectData.uid,
    };

    const docRef = await addDoc(projectsCol, data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
}

export const listenToUserProjects = (uid, callback) => {
  if (!uid) return () => { };

  const projectsRef = collection(db, "projects");
  const q = query(projectsRef, where("uid", "==", uid), where("is_available", "==", true));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const projectsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(projectsData);
    },
    (error) => {
      console.error("Error fetching user projects:", error);
      callback([]);
    }
  );

  return unsubscribe;
};

export const allProjects = async (callback) => {
  try {
    let q = collection(db, "projects");
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(data);
  } catch (err) {
    console.error("❌ Failed to fetch projects:", err);
    callback([]);
  }
};

export const purchase = async (project, uid) => {
  try {
    if (!project || !uid) throw new Error("Missing project or uid");

    const purchaseData = {
      project_id: project.id,
      project_title: project.title || "",
      project_drive_link: project.driveLinks?.[0] || "",
      project_price: project.price || 0,
      seller_title: project.seller_title || "Your project has been purchased!",
      seller_desc: project.seller_desc || "A user has purchased your project.",
      buyer_title: project.buyer_title || "Purchase successful!",
      buyer_desc: project.buyer_desc || "You have successfully purchased the project.",
      buyer_uid: uid,
      timestamp: serverTimestamp()
    };

    const sellerSnap = await getDoc(doc(db, "users", project.uid));
    if (sellerSnap.exists()) {
      purchaseData.seller_email = sellerSnap.data().email || "";
      purchaseData.seller_name = sellerSnap.data().name || "";
    }

    // Fetch buyer details
    const buyerSnap = await getDoc(doc(db, "users", uid));
    if (buyerSnap.exists()) {
      purchaseData.buyer_email = buyerSnap.data().email || "";
      purchaseData.buyer_name = buyerSnap.data().name || "";
    }

    // Send email
    await axios.post("http://localhost:5000/send-purchase-email", purchaseData);

    const saleEntry = {
      project_id: project.id,
      buyer_id: uid,
      price: project.price || 0,
      timestamp: serverTimestamp()
    };

    const salesRef = collection(db, "users", project.uid, "sales");

    await addDoc(salesRef, saleEntry);


    return purchaseData;
  } catch (error) {
    console.error("Error in purchase:", error);
    return null;
  }
};

export const getTotalSales = (callback, user) => {
  if (!user || !user.uid) {
    console.warn("getTotalSales: user not logged in");
    callback(0);
    return () => {}; // noop unsubscribe
  }

  let totalSales = 0;
  let totalWithdrawals = 0;

  const salesRef = collection(db, "users", user.uid, "sales");
  const userRef = doc(db, "users", user.uid);

  const unsubscribeSales = onSnapshot(
    salesRef,
    (snapshot) => {
      totalSales = 0;
      snapshot.forEach((d) => {
        const data = d.data();
        const priceField = data.totalPrice ?? data.price;
        const price = Number(priceField) || 0;
        totalSales += price;
      });
      const available = Math.max(totalSales - (totalWithdrawals || 0), 0);
      callback(available);
    },
    (err) => {
      console.error("getTotalSales - sales listener error:", err);
      callback(0);
    }
  );

  const unsubscribeUser = onSnapshot(
    userRef,
    (snap) => {
      const ud = snap.exists() ? snap.data() : {};
      totalWithdrawals = Number(ud.totalWithdrawals ?? ud.totalwithdrawals ?? 0) || 0;
      const available = Math.max(totalSales - totalWithdrawals, 0);
      callback(available);
    },
    (err) => {
      console.error("getTotalSales - user listener error:", err);
      callback(0);
    }
  );

  return () => {
    try {
      unsubscribeSales();
    } catch (e) {}
    try {
      unsubscribeUser();
    } catch (e) {}
  };
};


export async function handleWithdraw(uid,totalEarnings, withdrawAmount) {
  if (!withdrawAmount || isNaN(withdrawAmount)) {
    toast.warning("Please enter a valid amount.");
    return;
  }

  if (withdrawAmount < 100) {
    toast.warning("Minimum withdrawal amount is ₹100.");
    return;
  }

  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      toast.error("User not found.");
      return;
    }

    const data = snap.data();
    const totalWithdrawals = data.totalWithdrawals || 0;
    const availableBalance = totalEarnings - totalWithdrawals;

    if (withdrawAmount > availableBalance) {
      toast.error("Not enough balance to withdraw.");
      return;
    }

    await updateDoc(userRef, {
      totalWithdrawals: increment(withdrawAmount),
    });

    toast.success(`₹${withdrawAmount} withdrawn successfully!`);
  } catch (error) {
    console.error("Withdrawal error:", error);
    toast.error("Something went wrong. Please try again.");
  }
}