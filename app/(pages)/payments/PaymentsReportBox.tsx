import React, { useEffect, useState,useRef } from "react";
import axios from "axios";
import {
  View,
  Modal,
  Text,
  Button,
  StyleSheet,

  TextInput,
  PermissionsAndroid,
} from "react-native";
import PdfLib from 'react-native-pdf-lib';
import { writeFile, DocumentDirectoryPath } from 'react-native-fs'; // We can use fs just for file saving, no need for RNFS in PDF generation

import { Linking } from "react-native";
// import RNHTMLtoPDF from "react-native-html-to-pdf";
// import Share from "react-native-share";
import Receipt from './Receipt';
import {getFirestore, collection,query, where, updateDoc,onSnapshot, DocumentReference, doc,getDocs,getDoc} from "firebase/firestore";

import db from '@/firebase/firestore';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { Alert } from 'react-native';

// import HLSticker from './HL Sticker.png';
import { useNavigation } from '@react-navigation/native';
// import RNFS from "react-native-fs";
import firestore from '@react-native-firebase/firestore';

import PDFLib from 'react-native-pdf-lib'; // Use default import


// import { PDFDocument, PDFPage,} from 'react-native-pdf-lib';

import {  Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions'; // Use if needed for permissions

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as Sharing from 'expo-sharing';



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
      merchantTransactionId?: string;

  };
};

interface ReceiptItem {
  description: string;
  total: number;
  quantity: number;
  price: number;

}

interface ReceiptData {
  date: string;
  transactionId?: string; // Optional field
  paidBy: string;
  amount: number;
  items: ReceiptItem[];
  notes: string;
  paymentMethod?: string;
  merchantTransactionId: string;



}





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
  discount?: number;
  discountType?: "price" | "percent"; // Added discountType as an optional property
}

type PaymentInfo = {
  documentId: string; // Firestore Document ID
  newStatus: string;  // The new payment status (e.g., "success", "failed")
};



interface Discount {
  code: string;
  appliesTo: string[];
  discountType: "price" | "percent";
  discount: number;
}

const PaymentReportBox: React.FC<PaymentReportBoxProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [tinkeringActivityAmount, setTinkeringActivityAmount] = useState(
    props.data.paymentInfo.amount
  );
  const [referralCode, setReferralCode] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [discount, setDiscount] = useState<Discount>({
    code: "NONE",
    appliesTo: [],
    discountType: "price",
    discount: 0,
  });
  const [paymentSuccessful, setPaymentSuccessful] = useState(false); // New state
  const navigation = useNavigation(); // Access navigation
  // const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData>({
    date: "",
    transactionId: "",
    paidBy: "",
    amount: 0,
    items: [],
    notes: "",
    merchantTransactionId: "",
});

  const [showReceipt, setShowReceipt] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState(props.data?.paymentInfo?.status || 'Pending');
  const [amountPaid, setAmountPaid] = useState<number | null>(null);

  useEffect(() => {
    const fetchAmountPaid = async () => {
      try {
        setLoading(true);
        const studentQuerySnapshot = await getDocs(collection(db, "studentData"));

        let matchedStudentId: string | null = null;
        let matchedDocId: string | null = null;

        // Loop through student documents to find a matching taID in "taData"
        for (const studentDoc of studentQuerySnapshot.docs) {
          const studentId = studentDoc.id;

          console.log("Checking taData subcollection for student:", studentId);

          const taDataQuery = query(
            collection(db, "studentData", studentId, "taData"),
            where("taID", "==", props.data.taID)
          );

          const taDataSnapshot = await getDocs(taDataQuery);

          if (!taDataSnapshot.empty) {
            const taDoc = taDataSnapshot.docs[0]; // Assuming one matching document per student
            matchedStudentId = studentId;
            matchedDocId = taDoc.id;
            break;
          }
        }

        // If a match is found, fetch the "amountPaid" field
        if (matchedStudentId && matchedDocId) {
          console.log("Match found:", matchedStudentId, matchedDocId);

          const paymentDocRef = doc(db, "studentData", matchedStudentId, "taData", matchedDocId);
          const paymentDocSnap = await getDoc(paymentDocRef);

          if (paymentDocSnap.exists()) {
            const paymentData = paymentDocSnap.data();
            setAmountPaid(paymentData.amountPaid || "N/A");
          } else {
            console.log("No payment data found.");
          }
        } else {
          console.error("No matching taID found for any student.");
          Alert.alert("Error", "No matching taID found for any student.");
        }
      } catch (err) {
        console.error("Error fetching amountPaid:", err);
        Alert.alert("Error", "Something went wrong while fetching the data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAmountPaid();
  }, [props.data.taID]);
// Simulate immediate UI feedback
useEffect(() => {
  if (props.data?.paymentInfo?.status) {
    setPaymentStatus(props.data.paymentInfo.status);
  }
}, [props.data?.paymentInfo?.status]);




// const handleDownload = async () => {
//   console.log('Handle download triggered...');

//   if (!receiptData) {
//     Alert.alert('Error', 'No receipt data available.');
//     console.log('No receipt data available.');

//     return;
//   }

//     setShowReceipt(true);
//   console.log('Downloading receipt...');

//   await downloadPDF(receiptData); // Pass receiptData after checking it's not null
//   setLoading(false);
//   console.log('Download completed.');

// };


  const handleDownload = async () => {
    console.log("Handle download triggered...");

    if (!receiptData) {
      Alert.alert("Error", "No receipt data available.");
      console.log("No receipt data available.");
      return;
    }

    setShowReceipt(true);
    console.log("Downloading receipt...");

    try {
      // Call the downloadPDF function and pass the receiptData after checking it's not null
      await downloadPDF(receiptData);
      setLoading(false);  // Hide loading spinner once done
      console.log("Download completed.");
    } catch (error) {
      setLoading(false);
      console.error("Download failed:", error);
      Alert.alert("Error", "Failed to download the receipt.");
    }
  };




useEffect(() => {
  if (paymentSuccessful) {
      if (!props.data) {
          console.error("props.data is undefined. Cannot create receipt data.");
          return;
      }

      if (!props.data.paymentInfo) {
          console.error("props.data.paymentInfo is undefined. Check the payment data structure.");
          return;
      }

      console.log("Creating receipt data...");
      const newReceiptData: ReceiptData = {
          date: new Date().toISOString(),
          transactionId: props.data.paymentInfo.merchantTransactionId || "N/A",
          paidBy: "User", // Replace with actual payer
          amount: tinkeringActivityAmount,
          items: [], // Populate as required
          notes: "Payment was successful.",
          merchantTransactionId: props.data.paymentInfo.merchantTransactionId || "N/A",
      };

      console.log("Generated Receipt Data:", newReceiptData);
      setReceiptData(newReceiptData);
  } else {
      console.warn("Payment not successful. Receipt data will not be generated.");
  }
}, [paymentSuccessful, props.data]);

  useEffect(() => {
    // Navigate to the desired page when payment is successful
    if (paymentSuccessful) {
      Alert.alert(
        "Payment Successful",
        "Your payment was processed successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  }, [paymentSuccessful,navigation]);

  useEffect(() => {
    console.log('Receipt Data Updated:', receiptData);
  }, [receiptData]);
  

  useEffect(() => {
    if (
      props.showWhat === "currentPayments" &&
      props.data.type === "tinkeringActivity"
    ) {
      setTinkeringActivityAmount(props.data.paymentInfo.amount);
    }
  }, [props]);

  useEffect(() => {
    console.log("Discount updated:", discount);
    console.log("Tinkering Activity Amount updated:", tinkeringActivityAmount);
  }, [discount, tinkeringActivityAmount]);
  

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
        const discountValue = response.data.discount || 0;
        const discountType = response.data.discountType || "price"; // Default to "price" if undefined
        const originalAmount = props.data.paymentInfo.amount;
  
        let discountedAmount = originalAmount;
  
        // Ensure discount doesn't result in negative price
        if (discountType === "price") {
          discountedAmount = Math.max(originalAmount - discountValue, 0);
        } else if (discountType === "percent") {
          const percentageDiscount = (originalAmount * discountValue) / 100;
          discountedAmount = Math.max(originalAmount - percentageDiscount, 0);
        }
  
        // Update discount state
        const newDiscount: Discount = {
          code: referralCode.trim(),
          appliesTo: ["tinkeringActivity"],
          discountType, // From API response
          discount: discountValue,
        };
  
        setDiscount(newDiscount);
        setTinkeringActivityAmount(discountedAmount);
  
        // Update UI with alert showing the applied discount
        Alert.alert(
          "Referral Code Applied",
          `Discount Applied: ${discountType === "percent" ? `${discountValue}%` : discountValue}\nFinal Price: ${discountedAmount}`
        );
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "An error occurred while applying the referral code.");
    }
  };


  const dynamicallyUpdatePaymentStatus = async (
    studentId: string,
    taId: string,
    newStatus: string
  ) => {
    try {
      // Full path to the document
      const docRef = doc(db, "studentData", studentId, "taData", taId);
  
      // Update the status field in paymentInfo
      await updateDoc(docRef, {
        "paymentInfo.status": newStatus,
      });
  
      console.log(`Updated paymentInfo.status to "${newStatus}" for document "${taId}".`);
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };
    // Automatically invoke the function (Example invocation)

  
  
  
      

    const handleCheckout = async () => {
      const discountedValue = tinkeringActivityAmount;
      const merchantTransactionId = `MT7850${Date.now()}`; // Unique transaction ID
      const redirectUrl = `yourapp://payments?amount=${discountedValue}&docId=${props.data.taID}`;
    
      const paymentUrl = `https://hamaralabs.com/payment/checkout?amount=${discountedValue}&merchantTransactionId=${merchantTransactionId}&redirectUrl=${encodeURIComponent(redirectUrl)}`;
      console.log("Opening payment gateway URL:", paymentUrl);
    
      try {
        await Linking.openURL(paymentUrl);
    
        setTimeout(async () => {
          console.log("Querying for taID:", props.data.taID);
    
          const studentQuerySnapshot = await getDocs(collection(db, "studentData"));
    
          let matchedStudentId: string | null = null;
          let matchedDocId: string | null = null;
    
          // Loop through student documents to find a matching taID in "tdData"
          for (const studentDoc of studentQuerySnapshot.docs) {
            const studentId = studentDoc.id;
    
            console.log("Checking tdData subcollection for student:", studentId);
    
            const tdDataQuery = query(
              collection(db, "studentData", studentId, "taData"),
              where("taID", "==", props.data.taID)
            );
    
            const tdDataSnapshot = await getDocs(tdDataQuery);
    
            if (!tdDataSnapshot.empty) {
              const taDoc = tdDataSnapshot.docs[0]; // Assuming one matching document per student
              matchedStudentId = studentId;
              matchedDocId = taDoc.id;
              break;
            }
          }
    
          if (matchedStudentId && matchedDocId) {
            console.log("Match found:", matchedStudentId, matchedDocId);
    
            const paymentDocRef = doc(db, "studentData", matchedStudentId, "taData", matchedDocId);
    
            // Update the existing document
            await updateDoc(paymentDocRef, {
              paymentStatus: "Successful",
              transactionId: merchantTransactionId,
              amountPaid: discountedValue,
              paymentDate: new Date().toISOString(),
            });
    
            console.log("Payment updated successfully!");
            console.log("About to show alert");

            Alert.alert("Payment Success", "Your payment has been processed successfully.", [
              { text: "OK", onPress: () => console.log("Alert closed") },
            ]);
                  } else {
            console.error("No matching taID found for any student.");
            Alert.alert("Payment Error", "No matching taID found for any student.");
          }
        }, 3000); // Simulated delay
      } catch (err) {
        console.error("Failed to process payment:", err);
        Alert.alert("Payment Failed", "Something went wrong with the payment.");
      }
    };
          // Request storage permission for Android
          const requestStoragePermission = async (): Promise<boolean> => {
            if (Platform.OS === 'android') {
              const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
              return status === 'granted';
            }
            return true; // Assume permission for non-Android platforms
          };
          
          const downloadPDF = async (data: ReceiptData) => {
            console.log('Starting PDF download...');
          
            try {
              console.log('Generating PDF with the following data:', data);
          
              const { date, transactionId, merchantTransactionId, amount, paidBy, items } = data;

                  // Load the custom font from the file system
    const fontPath = `${FileSystem.documentDirectory}Roboto-Regular.ttf`;

    // Ensure font file is available
    const fontBase64 = await FileSystem.readAsStringAsync(fontPath, {
      encoding: FileSystem.EncodingType.Base64,
    });

          
              // Create a new PDF document
              const pdfDocument = await PDFDocument.create();
              const page = pdfDocument.addPage([600, 800]);
              // Embed the custom font
    const fontBytes = Buffer.from(fontBase64, 'base64');
    const customFont = await pdfDocument.embedFont(fontBytes);

              // Add text to the page
    // Add receipt details
    page.drawText('Receipt', { x: 20, y: 750, size: 16, font: customFont, color: rgb(0, 0, 0) });
    page.drawText(`Date: ${date}`, { x: 20, y: 730, size: 12, font: customFont });
    page.drawText(`Transaction ID: ${transactionId || 'N/A'}`, { x: 20, y: 710, size: 12, font: customFont });
    page.drawText(`Merchant Transaction ID: ${merchantTransactionId || 'N/A'}`, { x: 20, y: 690, size: 12, font: customFont });
    page.drawText(`TA ID: ${props.data.taID || 'N/A'}`, { x: 20, y: 670, size: 12, font: customFont });
    page.drawText(`Amount: ₹${amount}`, { x: 20, y: 650, size: 12, font: customFont });
    page.drawText(`Paid By: ${paidBy}`, { x: 20, y: 630, size: 12, font: customFont });

    let yPosition = 630;
    page.drawText('Items:', { x: 20, y: yPosition, size: 12, font: customFont });
    yPosition -= 20;

    items.forEach((item) => {
      const itemDetails = `${item.description} - Qty: ${item.quantity}, Price: ₹${item.price}, Total: ₹${item.total}`;
      page.drawText(itemDetails, { x: 20, y: yPosition, size: 10, font: customFont });
      yPosition -= 20;
    });

    // Save the PDF
    const pdfBytes = await pdfDocument.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64');
    const filePath = `${FileSystem.documentDirectory}Receipt.pdf`;

    await FileSystem.writeAsStringAsync(filePath, pdfBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    Alert.alert('PDF Downloaded', `Receipt saved at: ${filePath}`);

              // Step 3: Update Firestore Payment Details


              if (!props.data.taID) {
  console.warn('TA ID is missing');
  Alert.alert('Error', 'TA ID is missing');
  return;
}

              const studentQuerySnapshot = await getDocs(collection(db, "studentData"));
              const discountedValue = tinkeringActivityAmount;
              console.log('Student Data Retrieved:', studentQuerySnapshot.docs.length);

              let matchedStudentId: string | null = null;
              let matchedDocId: string | null = null;
      
              // Loop through student documents to find a matching taID in "taData"
              for (const studentDoc of studentQuerySnapshot.docs) {
                const studentId = studentDoc.id;
      
                console.log("Checking taData subcollection for student:", studentId);
      
                const taDataQuery = query(
                  collection(db, "studentData", studentId, "taData"),
                  where("taID", "==", props.data.taID)
                );
      
                const taDataSnapshot = await getDocs(taDataQuery);
                console.log("Found TA Data:", taDataSnapshot.empty);

                if (!taDataSnapshot.empty) {
                  const taDoc = taDataSnapshot.docs[0]; // Assuming one matching document per student
                  matchedStudentId = studentId;
                  matchedDocId = taDoc.id;
                  break;
                }
              }
              if (!matchedStudentId || !matchedDocId) {
                console.warn('No matching TA data found');
                Alert.alert('Error', 'No matching TA data found');
                return;
              }
              
              
    if (transactionId) {
      const paymentDocRef = doc(
        db,
        "studentData",
        matchedStudentId as string,
        "taData",
        matchedDocId as string
      );
      
            // const paymentDocSnap = 

      await updateDoc( paymentDocRef,{
        paymentDate: new Date().toISOString(),
        taID: props.data.taID,
        paidBy: paidBy,
        transactionId: transactionId,
        merchantTransactionId: props.data.merchantTransactionId,
        paymentStatus: "Successful",
        amountPaid: discountedValue,


      });

      console.log('Firestore payment details updated successfully');
      Alert.alert('Firestore Updated', 'Payment details updated successfully.');
    } else {
      console.warn('Transaction ID is missing. Cannot update Firestore.');
      Alert.alert('Warning', 'Transaction ID is missing. Update failed.');
    }

              // Optional: Share the PDF
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(filePath);
              } else {
                console.log('Sharing not available on this device.');
              }
            } catch (error) {
              console.error('Error generating PDF:', error);
              Alert.alert('Error', 'Failed to generate receipt PDF.');
            }
          };
              return (
    <View style={styles.paymentReportBox}>
      <Text style={styles.heading}>{props.data.taName}</Text>
      <Text>
        <Text style={styles.label}>TA ID:</Text> {props.data.taID}
      </Text>
      <Text style={styles.label}>TA Status:</Text>
      <Text
  style={
    props.data?.paymentInfo?.status?.toUpperCase() === 'COMPLETED'
      ? styles.completed
      : styles.pending
  }
>
  {props.data?.paymentInfo?.status 
    ? props.data.paymentInfo.status.charAt(0).toUpperCase() + props.data.paymentInfo.status.slice(1).toLowerCase() 
    : 'Status unavailable'}
</Text>
      <Text>
        <Text style={styles.label}>Original Price:</Text>{" "}
        {props.data.paymentInfo.amount}
      </Text>
      {/* <Button
  title="Download Receipt"
  onPress={() => {
    // Call your downloadPDF function with the receiptData
    downloadPDF(ReceiptData);
  }}
/> */}
{/* <Button
  title="Download Receipt"
  onPress={() => downloadPDF} // Pass receiptData explicitly
/>
 */}

{/* <Receipt ref={scrollViewRef} receiptData={receiptData} /> */}

{/* Button to download receipt */}
{/* <Button
  title={loading ? 'Downloading...' : 'Download Receipt'}
  onPress={handleDownload}
  disabled={loading}
/> */}

{/* <View style={styles.receiptContainer}>
  <Receipt ReceiptProps={handleDownload} />
</View>
 */}
    {/* <View style={styles.receiptContainer}> */}
      {/* Button for download */}
      <Button title="Download Receipt" onPress={handleDownload} />

      {/* Receipt component - conditionally rendered */}
      {showReceipt && receiptData && <Receipt receiptData={receiptData} />}
    {/* </View> */}



{amountPaid !== null && (
        <Text style={styles.label}>
          Amount Paid: <Text style={styles.value}>₹{amountPaid}</Text>
        </Text>
      )}




      {discount.discount > 0 && (
        <>
          {/* <Text style={styles.discountText}>
            <Text style={styles.label}>Discount:</Text>{discount.discount}
          </Text> */}
          <Text style={styles.finalPriceText}>
            <Text style={styles.label}>Final Price:</Text>{" "}
            {tinkeringActivityAmount}
          </Text>
        </>
      )}
            {paymentSuccessful && ( // Conditional rendering for success message
        <>
        <Text style={styles.successMessage}>PAYMENT SUCCESSFUL</Text>
      
      </>
    )}

      <View style={styles.buttonContainer}>
        <Button title="Referral Code" onPress={() => setModalVisible(true)} />
        <Button title="Pay Now" onPress={handleCheckout} />
      </View>

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
  discountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    marginTop: 10,
  },
  finalPriceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "blue",
    marginTop: 10,
  },
  successMessage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    marginTop: 10,
  },
  completed: {
    color: 'green', // Example color for completed status
    fontWeight: 'bold',
  },
  pending: {
    color: 'orange', // Example color for pending status
    fontWeight: 'normal',
  },
  value: {
    fontWeight: '400',
    color: '#333',
  },
  receiptContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },



});

export default PaymentReportBox;
