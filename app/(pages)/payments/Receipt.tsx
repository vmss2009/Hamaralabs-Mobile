import React, { forwardRef } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { useState,useEffect } from 'react';
import {getFirestore, collection,query, where, updateDoc,onSnapshot, DocumentReference, doc,getDocs,getDoc} from "firebase/firestore";
import db from '@/firebase/firestore';
import { Alert } from 'react-native';

interface Item {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface ReceiptData {
  date: string;
  merchantTransactionId: string;
  transactionId?: string;
  paidBy: string;
  paymentMethod?: string;
  items: Item[];
  amount: number;
  notes: string;
  amountPaid?:number;
  taID?:string;

}

interface ReceiptProps {
  receiptData: ReceiptData;  // Directly using ReceiptData type
}

const Receipt = forwardRef<ScrollView, ReceiptProps>((props, ref) => {
  const { receiptData } = props;
  const HamaralabsImage = require('./HL Sticker.png'); // Ensure the image is in the same folder.
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  console.log(receiptData); // Check if receiptData is populated correctly
  const formatDate = (timestamp: any) => {
    if (timestamp) {
      return timestamp.toDate().toLocaleDateString(); // Converts Firebase timestamp to readable format
    }
    return 'N/A';
  };

  if (!receiptData) {
    return <Text>Loading...</Text>; // Show loading text while fetching data
  }

  const updatePaymentDetails = async (taID: string, discountedValue: number, merchantTransactionId: string) => {
    try {
      // Step 1: Get all students
      const studentQuerySnapshot = await getDocs(collection(db, "studentData"));
      
      // Step 2: Loop through student documents to check for a matching taID
      for (const studentDoc of studentQuerySnapshot.docs) {
        const studentId = studentDoc.id;
  
        // Step 3: Check the "taData" subcollection for the student with the matching taID
        const tdDataQuery = query(
          collection(db, "studentData", studentId, "taData"),
          where("taID", "==", taID)
        );
        
        const tdDataSnapshot = await getDocs(tdDataQuery);
        
        if (!tdDataSnapshot.empty) {
          // Match found, proceed with updating the document
          const taDoc = tdDataSnapshot.docs[0]; // Assuming one matching document per student
          const paymentDocRef = doc(db, "studentData", studentId, "taData", taDoc.id);
          
          // Step 4: Update the matched document
          await updateDoc(paymentDocRef, {
            paymentStatus: "Successful",
            transactionId: merchantTransactionId,
            amountPaid: discountedValue,
            paymentDate: new Date().toISOString(),
            taID:Number,
          });
  
          console.log("Payment details updated for student:", studentId);
          break; // Exit the loop after updating the first match
        }
      }
    } catch (error) {
      console.error("Error updating payment details:", error);
    }
  };
  
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    // Trigger the payment update once receiptData is loaded
    const handlePaymentUpdate = async () => {
      if (receiptData && receiptData.amountPaid) {
        try {
          // Update payment details with data from receipt
          await updatePaymentDetails( receiptData.date,receiptData.amountPaid,receiptData.merchantTransactionId);
          setIsUpdated(true);
          console.log("Payment details updated successfully.");
        } catch (error) {
          Alert.alert("Error", "Failed to update payment details.");
          console.error("Error updating payment details:", error);
        }
      }
    };

    // Only trigger if receiptData has relevant data
    if (receiptData?.taID && !isUpdated) {
      handlePaymentUpdate();
    }
  }, [receiptData, isUpdated]); // Run effect when receiptData changes


  return (
    <ScrollView ref={ref} style={styles.container}>
      <View style={styles.header}>
        <Image source={HamaralabsImage} style={styles.logo} />
        <Text style={styles.title}>Payment Receipt</Text>
        <Text style={styles.company}>SketchEA IT Consultants Pvt Ltd.</Text>
        <Text style={styles.address}>#38-37-63, Bhaskar Gardens, Marripalem, Visakhapatnam</Text>
        <Text style={styles.address}>Andhra Pradesh, PIN Code - 530018</Text>
      </View>

      <View style={styles.section}>
      <Text style={styles.label}>
  Date: <Text style={styles.value}>{receiptData?.date ? formatDate(receiptData.date) : 'N/A'}</Text>
</Text>
        <Text style={styles.label}>
          Merchant Transaction Id: <Text style={styles.value}>{receiptData.merchantTransactionId}</Text>
        </Text>
        {receiptData.transactionId && (
          <Text style={styles.label}>
            Transaction Id: <Text style={styles.value}>{receiptData.transactionId}</Text>
          </Text>
        )}
        <Text style={styles.label}>
          Paid By: <Text style={styles.value}>{receiptData.paidBy}</Text>
        </Text>
        {receiptData.paymentMethod && (
          <Text style={styles.label}>
            Payment Method: <Text style={styles.value}>{receiptData.paymentMethod}</Text>
          </Text>
        )}
      </View>

      <View style={styles.itemsSection}>
        <Text style={styles.subtitle}>Items</Text>
        <FlatList
          data={receiptData.items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>{item.description}</Text>
              <Text style={styles.itemText}>{item.quantity}</Text>
              <Text style={styles.itemText}>₹{item.price}</Text>
              <Text style={styles.itemText}>₹{item.total}</Text>
            </View>
          )}
          ListHeaderComponent={() => (
            <View style={styles.itemHeaderRow}>
              <Text style={styles.itemHeader}>Description</Text>
              <Text style={styles.itemHeader}>Quantity</Text>
              <Text style={styles.itemHeader}>Price</Text>
              <Text style={styles.itemHeader}>Total</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.totalSection}>
        <Text style={styles.label}>
          Total Amount: <Text style={styles.value}>₹{receiptData.amount}</Text>
        </Text>
      </View>

      <View style={styles.notesSection}>
        <Text style={styles.label}>
          Notes: <Text style={styles.value}>{receiptData.notes}</Text>
        </Text>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  company: {
    fontSize: 16,
    fontWeight: '600',
  },
  address: {
    fontSize: 14,
    color: '#555',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '600',
  },
  value: {
    fontWeight: '400',
  },
  itemsSection: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  itemHeader: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  totalSection: {
    marginBottom: 16,
  },
  notesSection: {
    marginBottom: 16,
  },
});

export default Receipt;
