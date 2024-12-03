// import React, { useEffect, useState, useRef } from "react";
// // import { Bars } from "react-loader-spinner";
// import axios from "axios";
// import { DocumentData, DocumentReference, getDoc } from "firebase/firestore";
// import Receipt from "./Receipt";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { View,  Modal,
//   Text, Button, StyleSheet, TouchableOpacity,
//   TouchableWithoutFeedback, } from "react-native";

//   import { Linking } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Alert } from 'react-native';




// type PaymentData = {
//   docId: string;
//   type: string;
//   paymentInfo: {
//     status: string;
//     amount: number;
//     merchantTransactionId: string;
//   };
//   taID: string;
//   taName: string;
//   showWhat: "currentPayments" | "paymentsHistory";
//   setLoading: (loading: boolean) => void;
//   id: string;
//   merchantTransactionId: string;
//   amount: number;
//   doc: any;
//   status: string;
//   timestamp: string;
// };

// type PurchaseHistoryData = {
//   merchantTransactionId: string;
//   amount: string;
//   type: string;
//   doc: any;
//   status: string;
//   timestamp: string;
//   taID: string;
//   taName: string;
//   paymentInfo: {
//     amount: number;
//     status: string;
//   };
// };

// interface PaymentReportBoxProps {
//   data: PaymentData | PurchaseHistoryData;
//   showWhat: "currentPayments" | "paymentsHistory";
//   id: string;
//   setLoading: (loading: boolean) => void;
//   taID: string;
//   taName: string;
//   paymentInfo: {
//     amount: number;
//     status: string;
//   };
// }

// interface ReferralResponse {
//   error?: boolean;
//   message?: string;
//   discount?: any;  // Define a more specific type based on the API response
// }



// interface Discount {
//   code: string;
//   appliesTo: string[];
//   discountType: "price" | "percent";
//   discount: number;
// }

// const PaymentReportBox: React.FC<PaymentReportBoxProps> = (props) => {
//   const [displayValue, setDisplayValue] = useState<"none" | "block">("none");
//   const [loading, setLoading] = useState(false);
//   const receiptRef = useRef<HTMLDivElement | null>(null);
//   const [discount, setDiscount] = useState<Discount>({
//     code: "NONE",
//     appliesTo: [],
//     discountType: "price",
//     discount: 0,
//   });
//   const [tinkeringActivityData, setTinkeringActivityData] = useState<DocumentData | null>(null);
//   const [tinkeringActivityAmount, setTinkeringActivityAmount] = useState(0);
//   const [isVisible, setIsVisible] = useState(false);
//   const [referralCode, setReferralCode] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [referalCode, setReferalCode] = useState("");
//   const [inputValue, setInputValue] = useState("");

//   const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // To toggle modal visibility


//   const labelName: Record<string, string> = {
//     tinkeringActivity: "Tinkering Activity",
//     onBoarding: "Onboarding Hamaralabs",
//   };


//   // const handleMouseOver = () => setDisplayValue("block");
//   // const handleMouseOut = () => setDisplayValue("none");


//   useEffect(() => {
//     if (props.showWhat === "currentPayments" && props.data.type === "tinkeringActivity") {
//       setTinkeringActivityAmount(props.data.paymentInfo.amount);
//     }
//   }, [props]);


//   useEffect(() => {
//     if (props.showWhat === "currentPayments") {
//       if (props.data.type === "tinkeringActivity") {
//         setTinkeringActivityAmount(props.data.paymentInfo.amount);
//       }
//     } else if (props.showWhat === "paymentsHistory" && props.data.doc) {
//       (async () => {
//         const taData = await getDoc(props.data.doc!);
//         if (taData?.data()) {
//           setTinkeringActivityData(taData);
//       } else {
//           setTinkeringActivityData(null); // Or handle the undefined case as needed
//       }
//             })();
//     }
//   }, [props]);

//   const handleCheckout = () => {
//     const discountedValue = tinkeringActivityAmount; // Add discount logic if necessary
//     const merchantTransactionId = `MT7850${Date.now()}`;
//     const redirectUrl = `yourapp://payments?amount=${discountedValue}&docId=${props.data.taID}`;
  
//     const paymentUrl = `https://hamaralabs.com/payment/checkout?amount=${discountedValue}&merchantTransactionId=${merchantTransactionId}&redirectUrl=${encodeURIComponent(
//       redirectUrl
//     )}`;
  
//     Linking.openURL(paymentUrl).catch((err) =>
//       console.error('Failed to open URL:', err)
//     );
//   };
//     if (loading) {
//     return <div>Loading...</div>;
//   }
//   const testAlert = () => {
//     Alert.alert("Test Alert", "This is a test message.");
//   };
  

// // // Function to handle the referral code logic
// // const handleReferalCodes = async () => {
// //   const promptRepsonse = prompt("Enter referral code: "); // Use prompt here

// //   if (promptRepsonse !== "" && promptRepsonse !== undefined && promptRepsonse !== null) {
// //     setLoading(true);
// //     try {
// //       const response = await axios.get<ReferralResponse>(
// //         `https://us-central1-hamaralabs-prod.cloudfunctions.net/paymentIntegration/referal-code?code=${promptRepsonse.trim()}`
// //       );
      
// //       // Now TypeScript knows the structure of response.data
// //       if (response.data?.error) {
// //         setLoading(false);
// //         console.log("Invalid Referral Code!");
// //       } else {
// //         setLoading(false);
// //         console.log("Applied referral code.");
// //         // Example: You can set discount or other response data here
// //         console.log("Discount Data:", response.data.discount);
// //       }
// //     } catch (error) {
// //       console.error("An error occurred:", error);
// //       setLoading(false);
// //       console.log("An error occurred. Please try again.");
// //     }
// //   } else {
// //     console.log("Please enter a referral code.");
// //   }
// // };





// const handleReferalCodes = async () => {
//   if (referralCode.trim() === '') {
//     // Show alert for invalid referral code input
//     Alert.alert('Please enter a valid referral code.', '', [
//       { text: 'OK', onPress: () => setModalVisible(true) }, // Show the modal after alert is dismissed
//     ]);
//     return;
//   }

//   setLoading(true);
//   try {
//     const response = await axios.get<ReferralResponse>(
//       `https://us-central1-hamaralabs-prod.cloudfunctions.net/paymentIntegration/referal-code?code=${referralCode.trim()}`
//     );

//     if (response.data?.error) {
//       setLoading(false);
//       Alert.alert('Invalid Referral Code', 'The referral code is invalid.');
//     } else {
//       setLoading(false);
//       Alert.alert('Referral Code Applied', `Discount Data: ${response.data.discount}`);
//     }
//   } catch (error) {
//     setLoading(false);
//     console.error('An error occurred:', error);
//     Alert.alert('Error', 'An error occurred. Please try again.');
//   }
// };







//   const downloadPDF = () => {
//     // if (receiptRef.current) {
//     //   const pdf = new jsPDF();
//     //   pdf.html(receiptRef.current, {
//     //     callback: (doc) => {
//     //       doc.save("receipt.pdf");
//     //     },
//     //     x: 10,
//     //     y: 10,
//     //   });
//     // }
//   };

//   async function handleTinkeringActivityCheckout() {
//     props.setLoading(true);
//     const currentTimestamp = new Date().getTime();
//     const merchantTransactionId = `MT7850${currentTimestamp}`;
//     const merchantUserId = `MUI797${currentTimestamp}`;

//     const discountedValue =
//       discount.discount !== 0 && discount.appliesTo.includes("tinkeringActivity")
//         ? discount.discountType === "price"
//           ? tinkeringActivityAmount - discount.discount
//           : tinkeringActivityAmount - tinkeringActivityAmount * (discount.discount / 100)
//         : tinkeringActivityAmount;

//     const redirectUrl = `http://localhost:3000/payments?amount=${discountedValue}&docId=${props.data.taID}&merchantTransactionId=${merchantTransactionId}&merchantId=${merchantUserId}`;
//     window.location.href = `https://hamaralabs.com/payment/checkout?amount=${discountedValue}&merchantTransactionId=${merchantTransactionId}&merchantUserId=${merchantUserId}&redirectUrl=${encodeURIComponent(
//       redirectUrl
//     )}`;
//   }

//   if (loading) {
//     return (
//       <div style={{ height: "85%", display: "flex", alignItems: "center", justifyContent: "center" }}>
//         {/* <Bars height="80" width="80" color="black" ariaLabel="loading" /> */}
//       </div>
//     );
//   }

//   if (props.showWhat === "currentPayments" && props.data.type === "tinkeringActivity") {
//     return (
//       <View
//        style={styles.paymentReportBox}
//        >
//       <Text style={styles.heading}>{props.taName}</Text>
//       <Text><Text style={styles.label}>TA ID:</Text> {props.taID}</Text>
//       <Text><Text style={styles.label}>TA Status:</Text> {props.paymentInfo.status}</Text>
//       <Text><Text style={styles.label}>Price::</Text> {props.paymentInfo.amount}</Text>
//       <View style={styles.buttonContainer}>
//         <Button title="Referral Code" onPress={handleReferalCodes} />
//         <Button title="Pay Now" onPress={handleCheckout} />
//         {/* <Button title="Test Alert" onPress={testAlert} /> */}

//       </View>
//       </View>
//     )}
// };


// const styles = StyleSheet.create({
//   centered: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   paymentReportBox: {
//     padding: 20,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     margin: 10,
//     backgroundColor: "#f9f9f9",
//   },
//   heading: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   label: {
//     fontWeight: "bold",
//   },
//   buttonContainer: {
//     marginTop: 20,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
// });


// export default PaymentReportBox;












import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { DocumentData, getDoc } from "firebase/firestore";
import { View, Modal, Text, Button, StyleSheet, Alert, TextInput } from "react-native";
import { Linking } from "react-native";

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

interface PaymentReportBoxProps {
  data: PaymentData | PurchaseHistoryData;
  showWhat: "currentPayments" | "paymentsHistory";
    id: string;
  setLoading: (loading: boolean) => void;
  taID: string;
  taName: string;
  paymentInfo: {
    amount: number;
    status: string;
  };
}



interface ReferralResponse {
  error?: boolean;
  message?: string;
  discount?: any;
}

interface Discount {
  code: string;
  appliesTo: string[];
  discountType: "price" | "percent";
  discount: number;
}


const PaymentReportBox: React.FC<PaymentReportBoxProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [tinkeringActivityAmount, setTinkeringActivityAmount] = useState(0);
  const [referralCode, setReferralCode] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (props.showWhat === "currentPayments" && props.data.type === "tinkeringActivity") {
      setTinkeringActivityAmount(props.data.paymentInfo.amount);
    }
  }, [props]);

  const handleReferalCodes = async () => {
    if (referralCode.trim() === "") {
      Alert.alert("Error", "Please enter a valid referral code.", [
        { text: "OK", onPress: () => setModalVisible(true) },
      ]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get<ReferralResponse>(
        `https://us-central1-hamaralabs-prod.cloudfunctions.net/paymentIntegration/referal-code?code=${referralCode.trim()}`
      );

      setLoading(false);
      if (response.data?.error) {
        Alert.alert("Invalid Referral Code", "The referral code is invalid.");
      } else {
        Alert.alert("Referral Code Applied", `Discount: ${response.data.discount}`);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "An error occurred while applying the referral code.");
    }
  };

  const handleCheckout = () => {
    const discountedValue = tinkeringActivityAmount; // Add discount logic if needed
    const merchantTransactionId = `MT7850${Date.now()}`;
    const redirectUrl = `yourapp://payments?amount=${discountedValue}&docId=${props.data.taID}`;

    const paymentUrl = `https://hamaralabs.com/payment/checkout?amount=${discountedValue}&merchantTransactionId=${merchantTransactionId}&redirectUrl=${encodeURIComponent(
      redirectUrl
    )}`;

    Linking.openURL(paymentUrl).catch((err) => console.error("Failed to open URL:", err));
  };

  return (
    <View style={styles.paymentReportBox}>
      <Text style={styles.heading}>{props.data.taName}</Text>
      <Text>
        <Text style={styles.label}>TA ID:</Text> {props.data.taID}
      </Text>
      <Text>
        <Text style={styles.label}>TA Status:</Text> {props.data.paymentInfo.status}
      </Text>
      <Text>
        <Text style={styles.label}>Price:</Text> {props.data.paymentInfo.amount}
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Referral Code" onPress={() => setModalVisible(true)} />
        <Button title="Pay Now" onPress={handleCheckout} />
      </View>

      {/* Referral Code Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Enter Referral Code</Text>
            <TextInput
              style={styles.input}
              value={referralCode}
              onChangeText={setReferralCode}
              placeholder="Enter code here"
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Apply" onPress={handleReferalCodes} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  paymentReportBox: {
    padding: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    margin: 10,
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default PaymentReportBox;






