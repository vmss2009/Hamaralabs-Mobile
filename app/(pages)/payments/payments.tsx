import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker"; // For the dropdown
import { StyleSheet } from 'react-native';
import auth from '@/firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import db from "@/firebase/firestore";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import PaymentReportBox from './PaymentsReportBox';
import { useRouter } from "expo-router";

import type { Student} from '@/firebase/firestore';
// // type PaymentData = {
// //   docId: string;
// //   type: string;
// //   paymentInfo: {
// //     status: string;
// //     amount: number;
// //     merchantTransactionId: string;
// //   };
// //   [key: string]: any; // For additional dynamic fields

// //   taID: string;
// //   taName: string;
// //   showWhat: "currentPayments" | "paymentsHistory";
// //   setLoading: (loading: boolean) => void;
// //   id: string;



// // };


type PaymentData = {
  docId: string;
  type: string;
  paymentInfo: {
    status: string;
    amount: number;
    merchantTransactionId: string;
  };
  taID: string;
  taName: string;
  showWhat: "currentPayments" | "paymentsHistory";
  setLoading: (loading: boolean) => void;
  id: string;
  // Add these fields
  merchantTransactionId: string;
  amount: number;
  doc: any;
  status: string;
  timestamp: string;
};


type PurchaseHistoryData = {
  merchantTransactionId: string;
  amount: string;
  type: string;
  doc: any;
  status: string;
  timestamp: string;

  taID: string;
  taName: string;
  paymentInfo: {
    amount: number;
    status: string;
  };

};


const Payments = () => {
  const [paymentsData, setPaymentsData] = useState<PaymentData[]>([]);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryData[]>([]);
  const [showWhat, setShowWhat] = useState<'currentPayments' | 'paymentsHistory'>('currentPayments');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const router = useRouter();

  const user = auth.currentUser;

  // Fetch student data dynamically
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.email) {
          setError('User not logged in.');
          return;
        }

        console.log("Fetching data for email:", user.email);

        // Query to fetch student data
        const studentCollection = collection(db, 'studentData');
        const studentQuery = query(studentCollection, where('email', '==', user.email));
        const studentSnapshot = await getDocs(studentQuery);

        if (!studentSnapshot.empty) {
          const studentDoc = studentSnapshot.docs[0];
          setStudent({ ...studentDoc.data(), id: studentDoc.id } as Student);

          // Fetch TA data for this student
          const studentId = studentDoc.id;
          const taQuery = query(
            collection(db, 'studentData', studentId, 'taData'),
            where('paymentInfo.status', '==', 'pending')
          );
          const taQuerySnapshot = await getDocs(taQuery);

          const allDataArray: PaymentData[] = [];
          taQuerySnapshot.forEach((taSnap) => {
            if (taSnap.data().paymentRequired) {
              const temp = taSnap.data() as PaymentData;
              temp.docId = taSnap.id;
              temp.type = 'tinkeringActivity';
              allDataArray.push(temp);
              console.log(allDataArray)
            }
          });

          setPaymentsData(allDataArray);

          // Fetch purchase history
          const userDocRef = doc(db, 'atlUsers', studentId); // Change collection if needed
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists() && userDoc.data()?.purchases) {
            const purchaseHistoryTemp = userDoc.data()?.purchases as PurchaseHistoryData[];
            setPurchaseHistory(purchaseHistoryTemp);
          }
        } else {
          setError('No student data found.');
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-center mt-2`}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace("/")}
          style={tw`absolute left-4`}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-gray-800`}>Payments | Digital ATL</Text>
        <TouchableOpacity onPress={() => router.replace("/")} style={tw`absolute right-4`}>
          <Ionicons name="home" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.container}>
        {/* <Text style={styles.title}>Payments | Digital ATL</Text> */}
        <Text style={styles.title}>Showing:</Text>

        <Picker
          selectedValue={showWhat}
          onValueChange={(value) => setShowWhat(value as 'currentPayments' | 'paymentsHistory')}
          style={styles.picker}
        >
          <Picker.Item label="Current Payments" value="currentPayments" />
          <Picker.Item label="Payments History" value="paymentsHistory" />
        </Picker>

        {showWhat === 'currentPayments' ? (
          <CurrentPayments paymentsData={paymentsData} />
        ) : (
          <PaymentsHistory purchaseHistory={purchaseHistory} />
        )}
      </View>
    </View>
  );
};

const CurrentPayments: React.FC<{ paymentsData: PaymentData[] }> = ({ paymentsData }) => {
  return (
    <FlatList
      data={paymentsData}
      keyExtractor={(item) => item.docId}
      renderItem={({ item }) => (
        <PaymentReportBox
          data={item}
          showWhat="currentPayments"
          id={item.docId}
          setLoading={() => {}}
          taID={item.taID}
          taName={item.taName}
          paymentInfo={item.paymentInfo}
        />
      )}
    />
  );
};

const PaymentsHistory: React.FC<{ purchaseHistory: PurchaseHistoryData[] }> = ({ purchaseHistory }) => {
  return (
    <FlatList
      data={purchaseHistory}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <PaymentReportBox
          data={item}
          showWhat="paymentsHistory"
          id={item.merchantTransactionId}
          setLoading={() => {}}
          taID={item.taID}
          taName={item.taName}
          paymentInfo={item.paymentInfo}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    height: 40,
    color: "#000",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Payments;

