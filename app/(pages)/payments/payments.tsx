// import React from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import tw from 'twrnc';
// import {useRouter} from "expo-router";

// const Payments = () => {
//     const router = useRouter();

//     return (
//         <View style={tw`flex-1 bg-gray-100 p-4`}>
//             {/* Header with Back Button and Centered Text */}
//             <View style={tw`flex-row items-center justify-center mt-2`}>
//                 <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace("/")} style={tw`absolute left-4`}>
//                     <Ionicons name="arrow-back" size={24} color="black" />
//                 </TouchableOpacity>
//                 <Text style={tw`text-lg font-bold text-gray-800`}>Payments</Text>
//                 <TouchableOpacity onPress={() => router.replace("/")} style={tw`absolute right-4`}>
//                     <Ionicons name="home" size={24} color="black" />
//                 </TouchableOpacity>


                
//             </View>
//         </View>
//     );
// };

// export default Payments;





// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { Picker } from '@react-native-picker/picker'; // For the dropdown
// import { Ionicons } from '@expo/vector-icons';
// import tw from 'twrnc';
// import { useRouter } from "expo-router";

// const Payments = () => {
//     const router = useRouter();
//     const [selectedOption, setSelectedOption] = useState("Payments History");

//     return (
//         <View style={tw`flex-1 bg-gray-100`}>
//             {/* Header Section */}
//             <View style={tw`flex-row items-center justify-center p-4 border-b border-gray-300`}>
//                 <TouchableOpacity
//                     onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
//                     style={tw`absolute left-4`}
//                 >
//                     <Ionicons name="arrow-back" size={24} color="black" />
//                 </TouchableOpacity>
//                 <Text style={tw`text-lg font-bold text-gray-800`}>Payments</Text>
//                 <TouchableOpacity
//                     onPress={() => router.replace("/")}
//                     style={tw`absolute right-4`}
//                 >
//                     <Ionicons name="home" size={24} color="black" />
//                 </TouchableOpacity>
//             </View>

//             {/* Title Section */}
//             <View style={tw`p-4 border-b border-gray-300`}>
//                 <Text style={tw`text-sm text-gray-600`}>Payments | Digital ATL</Text>
//             </View>

//             {/* Dropdown Section */}
//             <View style={tw`flex-row items-center p-4`}>
//                 <Text style={tw`text-sm text-gray-700 mr-2`}>Showing</Text>
//                 {/* Dropdown with shorter width */}
//                 <View style={[tw`border border-gray-300 rounded`, { width: 200 }]}>
//                 <Picker
//                         selectedValue={selectedOption}
//                         onValueChange={(itemValue) => setSelectedOption(itemValue)}
//                         style={tw`text-gray-800`}
//                     >
//                         <Picker.Item label="Current Payments" value="Current Payments" />
//                         <Picker.Item label="Payments History" value="Payments History" />
//                     </Picker>
//                 </View>
//             </View>
//         </View>
//     );
// };

// export default Payments;











// import React, { useState, useEffect } from "react";
// import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
// import { Picker } from "@react-native-picker/picker"; // For the dropdown
// import { Ionicons } from "@expo/vector-icons";
// import tw from "twrnc";
// import { useRouter } from "expo-router";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import db from "@/firebase/firestore";

// const Payments = ({ email }: { email: string }) => {
//   const router = useRouter();
//   const [selectedOption, setSelectedOption] = useState("Payments History");
//   const [paymentsData, setPaymentsData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch payments data
//   const fetchPayments = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const userQuery = query(collection(db, "atlUsers"), where("email", "==", email));
//       console.log("Fetching student data for email:", email);

//       const userSnapshot = await getDocs(userQuery);
//       console.log("Student snapshot size:", userSnapshot.size);


//       const allPayments: any[] = [];
//       for (const snap of userSnapshot.docs) {
//         const studentId = snap.id;
//         console.log("Processing studentId:", studentId);


//         const activityQuery = query(
//           collection(db, "studentData", studentId, "taData"),
//           where("paymentInfo.status", "==", "pending")
//         );

//         const activitySnapshot = await getDocs(activityQuery);
//         console.log("Activity snapshot size:", activitySnapshot.size);

//         activitySnapshot.forEach((activity) => {
//           const data = activity.data();
//           console.log("Activity data:", data);

//           if (data.paymentRequired) {
//             allPayments.push({
//               merchantTransactionId: data.paymentInfo?.merchantTransactionId || "N/A",
//               amount: data.paymentInfo?.amount || 0,
//               status: data.paymentInfo?.status || "unknown",
//               type: "tinkeringActivity",
//               docId: activity.id,
//             });
//           }
//         });
//       }

//       setPaymentsData(allPayments);
//       console.log("Payments data:", allPayments);

//     } catch (err) {
//       console.error(err);
//       setError("Failed to load payments.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPayments();
//   }, [email]);

//   return (
//     <View style={tw`flex-1 bg-gray-100`}>
//       {/* Header Section */}
//       <View style={tw`flex-row items-center justify-center p-4 border-b border-gray-300`}>
//         <TouchableOpacity
//           onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
//           style={tw`absolute left-4`}
//         >
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={tw`text-lg font-bold text-gray-800`}>Payments</Text>
//         <TouchableOpacity onPress={() => router.replace("/")} style={tw`absolute right-4`}>
//           <Ionicons name="home" size={24} color="black" />
//         </TouchableOpacity>
//       </View>

//       {/* Title Section */}
//       <View style={tw`p-4 border-b border-gray-300`}>
//         <Text style={tw`text-sm text-gray-600`}>Payments | Digital ATL</Text>
//       </View>

//       {/* Dropdown Section */}
//       <View style={tw`flex-row items-center p-4`}>
//         <Text style={tw`text-sm text-gray-700 mr-2`}>Showing</Text>
//         <View style={[tw`border border-gray-300 rounded`, { width: 200 }]}>
//           <Picker
//             selectedValue={selectedOption}
//             onValueChange={(itemValue) => setSelectedOption(itemValue)}
//             style={tw`text-gray-800`}
//           >
//             <Picker.Item label="Current Payments" value="Current Payments" />
//             <Picker.Item label="Payments History" value="Payments History" />
//           </Picker>
//         </View>
//       </View>

//       {/* Data Display Section */}
//       <View style={tw`flex-1 p-4`}>
//         {loading ? (
//           <ActivityIndicator size="large" color="#0000ff" />
//         ) : error ? (
//           <Text style={tw`text-red-500 text-center`}>{error}</Text>
//         ) : (
//           <FlatList
//             data={paymentsData}
//             keyExtractor={(item) => item.docId}
//             renderItem={({ item }) => (
//               <View style={tw`p-4 bg-white rounded mb-4 shadow`}>
//                 <Text style={tw`text-sm text-gray-800`}>
//                   <Text style={tw`font-bold`}>Transaction ID: </Text>
//                   {item.merchantTransactionId}
//                 </Text>
//                 <Text style={tw`text-sm text-gray-800`}>
//                   <Text style={tw`font-bold`}>Amount: </Text>${item.amount}
//                 </Text>
//                 <Text style={tw`text-sm text-gray-800`}>
//                   <Text style={tw`font-bold`}>Status: </Text>
//                   {item.status}
//                 </Text>
//                 <Text style={tw`text-sm text-gray-800`}>
//                   <Text style={tw`font-bold`}>Type: </Text>
//                   {item.type}
//                 </Text>
//               </View>
//             )}
//           />
//         )}
//       </View>
//     </View>
//   );
// };

// export default Payments;




// import React, { useState, useEffect } from "react";
// import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
// import { Picker } from "@react-native-picker/picker"; // For the dropdown
// import { Ionicons } from "@expo/vector-icons";
// import tw from "twrnc";
// import { useRouter } from "expo-router";
// import { collection, query, where, getDocs, doc,getDoc } from "firebase/firestore";
// import db from "@/firebase/firestore";

// const Payments = ({ email }: { email: string }) => {
//   const router = useRouter();
//   const [selectedOption, setSelectedOption] = useState("Payments History");
//   const [paymentsData, setPaymentsData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const fetchPayments = async () => {
//     setLoading(true);
//     setError(null);


//   try {
//     console.log("Fetching student data for email:", email);

//     // Step 1: Find the student document by email field
//     const studentsRef = collection(db, "studentData");
//     const q = query(studentsRef, where("email", "==", email)); // Assuming 'email' is a field in each student document
//     const studentSnapshots = await getDocs(q);

//     if (!studentSnapshots.empty) {
//       console.log("Student document found");

//       const studentDoc = studentSnapshots.docs[0]; // Assuming one student document matches
//       const studentId = studentDoc.id;

//       // Step 2: Fetch 'taData' subcollection
//       const taDataRef = collection(db, `studentData/${studentId}/taData`);
//       const taDataSnapshot = await getDocs(taDataRef);

//       console.log("taData snapshot size:", taDataSnapshot.size);

//       const allPayments: any[] = [];
//       taDataSnapshot.forEach((activity) => {
//         const data = activity.data();
//         console.log("Activity data:", data);

//         if (data.paymentRequired) {
//           allPayments.push({
//             merchantTransactionId: data.paymentInfo?.merchantTransactionId || "N/A",
//             amount: data.paymentInfo?.amount || 0,
//             status: data.paymentInfo?.status || "unknown",
//             type: "tinkeringActivity",
//             docId: activity.id,
//           });
//         }
//       });

//       setPaymentsData(allPayments);
//       console.log("Payments data:", allPayments);
//     } else {
//       console.error("No student found with this email:", email);
//       setError("No student found with this email.");
//     }
//   } catch (err) {
//     console.error("Error fetching payments:", err);
//     setError("Failed to load payments.");
//   } finally {
//     setLoading(false);
//   }
// };

// useEffect(() => {
//   if (email) {
//     fetchPayments();
//   }
// }, [email]);


//   return (
//     <View style={tw`flex-1 bg-gray-100`}>
//       {/* Header Section */}
//       <View style={tw`flex-row items-center justify-center p-4 border-b border-gray-300`}>
//         <TouchableOpacity
//           onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
//           style={tw`absolute left-4`}
//         >
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={tw`text-lg font-bold text-gray-800`}>Payments</Text>
//         <TouchableOpacity onPress={() => router.replace("/")} style={tw`absolute right-4`}>
//           <Ionicons name="home" size={24} color="black" />
//         </TouchableOpacity>
//       </View>

//       {/* Title Section */}
//       <View style={tw`p-4 border-b border-gray-300`}>
//         <Text style={tw`text-sm text-gray-600`}>Payments | Digital ATL</Text>
//       </View>

//       {/* Dropdown Section */}
//       <View style={tw`flex-row items-center p-4`}>
//         <Text style={tw`text-sm text-gray-700 mr-2`}>Showing</Text>
//         <View style={[tw`border border-gray-300 rounded`, { width: 200 }]}>
//           <Picker
//             selectedValue={selectedOption}
//             onValueChange={(itemValue) => setSelectedOption(itemValue)}
//             style={tw`text-gray-800`}
//           >
//             <Picker.Item label="Current Payments" value="Current Payments" />
//             <Picker.Item label="Payments History" value="Payments History" />
//           </Picker>
//         </View>
//       </View>

//       {/* Data Display Section */}
//       <View style={tw`flex-1 p-4`}>
//         {loading ? (
//           <ActivityIndicator size="large" color="#0000ff" />
//         ) : error ? (
//           <Text style={tw`text-red-500 text-center`}>{error}</Text>
//         ) : (
//           <FlatList
//             data={paymentsData}
//             keyExtractor={(item) => item.docId}
//             renderItem={({ item }) => (
//               <View style={tw`p-4 bg-white rounded mb-4 shadow`}>
//                 <Text style={tw`text-sm text-gray-800`}>
//                   <Text style={tw`font-bold`}>Transaction ID: </Text>
//                   {item.merchantTransactionId}
//                 </Text>
//                 <Text style={tw`text-sm text-gray-800`}>
//                   <Text style={tw`font-bold`}>Amount: </Text>${item.amount}
//                 </Text>
//                 <Text style={tw`text-sm text-gray-800`}>
//                   <Text style={tw`font-bold`}>Status: </Text>
//                   {item.status}
//                 </Text>
//                 <Text style={tw`text-sm text-gray-800`}>
//                   <Text style={tw`font-bold`}>Type: </Text>
//                   {item.type}
//                 </Text>
//               </View>
//             )}
//           />
//         )}
//       </View>
//     </View>
//   );
// };

// export default Payments;






// import React from 'react';

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker"; // For the dropdown
import { StyleSheet } from 'react-native';
import auth from '@/firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';


// import { Ionicons } from "@expo/vector-icons";
// import tw from "twrnc";
// import { useRouter } from "expo-router";
// import { collection, query, where, getDocs, doc,getDoc } from "firebase/firestore";
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
import type { Student, Competition, Course, Session, Taskactivity,TinkeringActivity } from '@/firebase/firestore';


// type PaymentData = {
//   docId: string;
//   type: string;
//   paymentInfo: {
//     status: string;
//     amount: number;
//     merchantTransactionId: string;
//   };
//   [key: string]: any; // For additional dynamic fields

//   taID: string;
//   taName: string;
//   showWhat: "currentPayments" | "paymentsHistory";
//   setLoading: (loading: boolean) => void;
//   id: string;



// };


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
    <View style={styles.container}>

      <Text style={styles.title}>Payments | Digital ATL</Text>
      
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
    // height: 50,
    // width: '20%',
    // marginBottom: 20,
    // borderWidth: 1,
    // borderColor: '#ddd',

    // flex: 1,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },




});

export default Payments;


