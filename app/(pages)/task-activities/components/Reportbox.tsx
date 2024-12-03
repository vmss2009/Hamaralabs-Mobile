// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Button,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   TouchableWithoutFeedback,
//   Linking,
// } from 'react-native';
// import { query, onSnapshot, doc, setDoc, collection, getDocs,DocumentData, QuerySnapshot } from 'firebase/firestore';
// import {deleteTask, taskAssign } from '@/firebase/firestore';
// import Popup from '../../components/Popup';
// import db from '@/firebase/firestore';
// // import Picker from "@/components/Picker";
// import { Picker } from '@react-native-picker/picker';



// interface Props {
//   task: any;
//   done: boolean;
// }

// interface TaskData {
//   id?: string;
//   taskName?: string;
//   taskDescription?: string;
//   taskDueDate?: string;
//   taskDone?: boolean;
//   assignedTo?: any;
//   taskComments?: string;
// }

// const ReportBox: React.FC<Props> = ({ task, done }) => {
//   const [data, setData] = useState<TaskData>({});
//   const [displayValue, setDisplayValue] = useState('none');
//   const [teamMems, setTeamMems] = useState<any[]>([]);
//   const [assignToOpen, setAssignToOpen] = useState(false);
//   const [assignedTo, setAssignedTo] = useState('');
//   const [commentWords, setCommentWords] = useState<string[]>([]);
//   const [descriptionWords, setDescriptionWords] = useState<string[]>([]);
//   const [selectedRole, setSelectedRole] = useState('ATL-Incharge'); // Default selection

//   const email = atob(localStorage.auth).split('-')[1];
//   const role = atob(localStorage.auth).split('-')[2];

//   useEffect(() => {
//     const taskId = task.ref.path.replace('tasksData/', '');
//     const q = collection(db, 'tasksData');

//     const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
//       querySnapshot.forEach((doc) => {
//         const tempData = doc.data() as TaskData;
//         tempData.id = doc.id; // Assigning the id to the tempData object
//         setData(tempData);
//         setCommentWords(tempData.taskComments?.split(' ') || []);
//         setDescriptionWords(tempData.taskDescription?.split(' ') || []);

//         if (tempData.assignedTo) {
//           const assignedQuery = query(tempData.assignedTo);
//           onSnapshot(assignedQuery, (snap) => {
//             setAssignedTo(snap.data()?.name || '');
//         });
//       }}
//     });

//     return () => unsubscribe();
//   }, [task]);

//   const handleMouseOver = () => setDisplayValue('block');
//   const handleMouseOut = () => setDisplayValue('none');

//   const handleDelete = async () => {
//     if (window.confirm('You are about to delete a task')) {
//       try {
//         const uid = 'yourUid'; // Obtain the UID from context, props, or state as needed

//         await deleteTask(data.id!, uid); // Pass both id and uid
//         Alert.alert('Task has been deleted.');
//         window.location.reload();
//       } catch (error) {
//         Alert.alert('An error has occurred. Please try again later.');
//       }
//     }
//   };

//   const markComplete = async () => {
//     const docId = task.ref.path.replace('tasksData/', '');
//     await setDoc(doc(db, 'tasksData', docId), { taskDone: true }, { merge: true });
//   };

  

//   const handleEditClick = () => {
//     window.location.href = `/tasks/edit/${data.id}`;
//   };

//   const handleAssignToClick = () => setAssignToOpen(true);

//   const assign = async () => {
//     const member = (document.querySelector(`select[name="teamAssignSelect"]`) as HTMLSelectElement).value;
//     const ref = collection(db, 'atlUsers');
//     const docs = await getDocs(ref);

//     docs.forEach(async (docSnap) => {
//       if (docSnap.data().email === member) {
//         await taskAssign(data.id!, docSnap.id);
//         Alert.alert('Assigned!');
//         setAssignToOpen(false);
//       }
//     });
//   };

//   useEffect(() => {
//     if (role === 'admin') {
//       const q = query(collection(db, 'atlUsers'));
//       const unsubscribe = onSnapshot(q, (snaps) => {
//         const data: any[] = [];
//         snaps.forEach((snap) => {
//           const temp = snap.data();
//           temp.name = `${temp.name}`;
//           temp.docId = snap.id;
//           data.push(temp);
//         });
//         setTeamMems(data);
//       });

//       return () => unsubscribe();
//     }
//   }, []);

//   const filteredTeamMems = teamMems.filter((teamMem) => {
//     if (selectedRole === 'ATL-Incharge' && teamMem.role === 'atlIncharge') return true;
//     if (selectedRole === 'Mentor' && teamMem.role === 'mentor') return true;
//     if (selectedRole === 'Student' && teamMem.role === 'student') return true;
//     return false;
//   });

//   const handleMarkNotCompleted = async () => {
//     await setDoc(doc(db, 'tasksData', data.id!), { taskDone: false }, { merge: true });
//   };

//   const URL_REGEX =
//     /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;

//   if (done && data.taskDone) {
//     return (
//       <TouchableWithoutFeedback onPressIn={handleMouseOver} onPressOut={handleMouseOut}>

//       <View style={styles.box}
// >
//         <Text style={styles.taskName}>{data.taskName}</Text>
//         <Text style={styles.text}>Description: {data.taskDescription}</Text>
//         <Text style={styles.text}>Due Date: {data.taskDueDate}</Text>
//         {data.assignedTo && <Text style={styles.text}>Assigned To: {assignedTo}</Text>}
//         <View style={[styles.buttonsContainer, {  display: 'flex' }]}>
//           {!data.taskDone && (
//             <>
//               <Button title="Complete" onPress={markComplete} />
//               <Button title="Edit" onPress={handleEditClick} />
//             </>
//           )}
//           {data.taskDone && <Button title="Mark Not Completed" onPress={handleMarkNotCompleted} />}
//           <Button title="Delete" onPress={handleDelete} color="red" />
//         </View>
        
//       </View>
//       </TouchableWithoutFeedback>

//     );
//   } else if (!done && !data.taskDone) {
//     return (
//       <View style={styles.box}>
//         <Popup visible={assignToOpen} onClose={() => setAssignToOpen(false)}>
//           <Picker
//             selectedValue={selectedRole}
//             onValueChange={(itemValue) => setSelectedRole(itemValue)}
//           >
//             <Picker.Item label="--Select--" value="" />
//             <Picker.Item label="ATL-Incharge" value="ATL-Incharge" />
//             <Picker.Item label="Mentor" value="Mentor" />
//             <Picker.Item label="Student" value="Student" />
//           </Picker>

//           {filteredTeamMems.map((teamMem, index) => (
//             <Picker.Item key={index} label={teamMem.name} value={teamMem.email} />
//           ))}

//           <Button title="Assign" onPress={assign} />
//         </Popup>

//         <Text style={styles.taskName}>{data.taskName}</Text>
//         <Text style={styles.text}>Description: {descriptionWords.join(' ')}</Text>
//         <Text style={styles.text}>Due Date: {data.taskDueDate}</Text>
//         <Text style={styles.text}>Comments: {commentWords.join(' ')}</Text>
//         {data.assignedTo && <Text style={styles.text}>Assigned To: {assignedTo}</Text>}

//         <View style={[styles.buttonsContainer, { display: 'flex' }]}>
//           <Button title="Assign To" onPress={handleAssignToClick} />
//           <Button title="Complete" onPress={markComplete} />
//           <Button title="Edit" onPress={handleEditClick} />
//           <Button title="Delete" onPress={handleDelete} color="red" />
//         </View>
        
//       </View>

//     );
//   }

//   return null;
// };

// const styles = StyleSheet.create({
//   box: { padding: 10, margin: 10, backgroundColor: '#f0f0f0' },
//   taskName: { fontSize: 20, fontWeight: 'bold' },
//   text: { marginVertical: 5 },
//   buttonsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
// });

// export default ReportBox;



import React, { useState,useEffect } from 'react';
import {
    View,
    Text,
    Button,
    Alert,
    StyleSheet,
    Modal,
    Pressable,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { FlatList } from 'react-native';
import { Linking } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons'; // Assuming you're using Expo for FontAwesome icons; otherwise, adjust import


import {
    query,
    onSnapshot,
    doc,
    setDoc,
    collection,
    getDocs,
    DocumentData,
    DocumentReference,
    DocumentSnapshot,
} from "firebase/firestore";
import {db,deleteTask, taskAssign } from "@/firebase/firestore";
// import Popup from "../../components/Popup";

interface ReportBoxProps {
  task: {
    ref: { path: string };
  };
  role: string;
  
  data: TaskData;
  markComplete: (id: string) => Promise<void>;
  handleEditClick: () => void;
  done: boolean;
  filteredTeamMems: string[];
  onTeamMemberSelect: (member: string) => void;
  onInchargeSelect: (incharge: string) => void;
}


interface TaskItemProps {
  task: { ref: { path: string } };
  done: boolean;
}



// type Props = {
//   selectedRole: string;
//   filteredTeamMems: TeamMember[];
// };


interface Task {
  ref: {
    path: string;
  };
}
interface TeamMember {
  email: string;
  name: string;
  role: string;

}
interface UserData {
  docId: string;
  name: string;
  role: string;
  email:string;
  // Include other fields from your Firestore documents as needed
}


interface TaskData {
  id: string;
  taskName: string;
  taskDescription: string;
  taskDueDate: string;
  assignedTo?: string;
  role: string; // Define the type based on your data (string, enum, etc.)
  completed: boolean;

}
interface Props {
  done: boolean;
  data: {
      taskDone: boolean;
      taskName: string;
      taskDueDate: string;
      assignedTo: string | null;
  };
  filteredTeamMems: { email: string; name: string }[];
  descriptionWords: string[];
  commentWords: string[];
  handleAssignToClick: () => void;
  markComplete: () => void;
  handleEditClick: () => void;
  handleDelete: () => void;
  assign: () => void;
}





const ReportBox: React.FC<ReportBoxProps> = ({ task }) => {
  const [data, setData] = useState<any | null>(null); // Explicitly setting data type to allow null
  const [commentWords, setCommentWords] = useState<string[]>([]);
  const [descriptionWords, setDescriptionWords] = useState<string[]>([]);
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [displayValue, setDisplayValue] = useState<"none" | "block" | "flex">("none");
  const navigation = useNavigation();
  const [assignToOpen, setAssignToOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Add this line to manage modal visibility
  const [selectedMember, setSelectedMember] = useState<string>(''); // State to store selected member
  const [teamMembers, setTeamMembers] = useState<{ id: string; email: string }[]>([]); // State to hold team members
  const [teamMems, setTeamMems] = useState<UserData[]>([]);
  const [done, setDone] = useState<boolean>(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [showElement, setShowElement] = useState<boolean>(false);

  const [role, setRole] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const handleMouseOver = () => setDisplayValue('flex');
  const handleMouseOut = () => setDisplayValue('none');

  useEffect(() => {
    const taskRef = doc(db, "tasksData", task.ref.path.replace("tasksData/", ""));
    
    const unsubscribeTask = onSnapshot(taskRef, (docSnap) => {
        if (docSnap.exists()) {
            const fetchedData = docSnap.data() as DocumentData & { id: string };
            fetchedData.id = docSnap.id;
            setData(fetchedData);

            // Split comments and description into words
            setCommentWords(fetchedData.taskComments?.split(" ") || []);
            setDescriptionWords(fetchedData.taskDescription?.split(" ") || []);

            // Check if `assignedTo` field is set and fetch assigned person's details
            if (fetchedData.assignedTo) {
                const assignedToRef = fetchedData.assignedTo;
                const unsubscribeAssigned = onSnapshot(assignedToRef, (snap: DocumentSnapshot<DocumentData>) => {
                    if (snap.exists()) {
                        setAssignedTo(snap.data()?.name || "");
                    }
                });

                // Clean up assignedTo snapshot listener
                return () => unsubscribeAssigned();
            }
        }
    });

    // Clean up the task snapshot listener
    return () => unsubscribeTask();
}, [task]);


const handlePressIn = () => {
  setDisplayValue("block");
};

const handlePressOut = () => {
  setDisplayValue("none");
};
const handleEditClick = () => {
  setEditModalOpen(true); // Open the edit modal or trigger any action you want
};

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Deletion',
      'You are about to delete a task',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await deleteTask(data.id);
              Alert.alert('Task has been deleted.');
            } catch (error) {
              Alert.alert('An error occurred. Please try again later.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const markComplete = async () => {
    try {
      const docId = task.ref.path.replace('tasksData/', '');
      const docRef = doc(db, 'tasksData', docId);
      await setDoc(docRef, { taskDone: true }, { merge: true });
      Alert.alert('Task marked as complete.');
    } catch (error) {
      Alert.alert('Error marking task as complete.');
    }
  };



  const fetchTeamMembers = async () => {
    const ref = collection(db, 'atlUsers');
    const docs = await getDocs(ref);
    const members = docs.docs.map(doc => ({ id: doc.id, email: doc.data().email }));
    setTeamMembers(members);
};

const handleAssignToClick = () => {
    fetchTeamMembers(); // Fetch members when opening the modal
    setAssignToOpen(true);
};

const assigntask = async () => {
    if (!selectedMember) {
        Alert.alert('Please select a team member.');
        return;
    }
    const member = teamMembers.find(mem => mem.email === selectedMember); // Find the selected member
    if (member) {
        await taskAssign(data.id, member.id); // Replace 'data.id' with the actual task ID
        Alert.alert('Assigned!!');
        setAssignToOpen(false);
    } else {
        Alert.alert('Member not found.');
    }
};




  useEffect(() => {
    if (role === 'admin') {
      console.log(role);
      const q = query(collection(db, 'atlUsers'));
        const unsubscribe = onSnapshot(q, (snaps) => {
            const data: UserData[] = [];
            snaps.forEach((snap) => {
                const temp = snap.data() as UserData; // Type assertion for Firestore data
                console.log(temp.role === 'student');
                temp.docId = snap.id; // Add document ID to the user data
                data.push(temp);
            });
            setTeamMems(data); // Update state with fetched data
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }
}, [role]); // Depend on `role` to rerun the effect if it changes



      // Filter teamMems based on selected role
      const filteredTeamMems = teamMems.filter((teamMem) => {
        if (selectedRole === "ATL-Incharge" && teamMem.role === "atlIncharge") {
          return true;
        }
        if (selectedRole === "Mentor" && teamMem.role === "mentor") {
          return true;
        }
        if (selectedRole === "Student" && teamMem.role === "student") {
          return true;
        }
        return false;
      });

// interface ReportBoxProps {
//   role: string; // Define type according to your application logic
//   data: TaskData; // Assuming TaskData is your data structure type
//   markComplete: (id: string) => Promise<void>; // Adjust according to your markComplete function
//   handleEditClick: () => void; // Adjust to the right signature
//   done: boolean; // This should match your application logic
//   filteredTeamMems: string[]; // Adjust according to your application logic
//   onTeamMemberSelect: (member: string) => void; // Function type for selecting a team member
//   onInchargeSelect: (incharge: string) => void; // Function type for selecting an incharge
// }





  const handleMarkNotCompleted = async () => {
    try {
        if (data.id) {
            await markComplete;
            console.log(`Task with ID ${data.id} marked as not completed.`);
        } else {
            console.warn("No task ID found to mark as not completed.");
        }
    } catch (error) {
        console.error(`Error marking task with ID ${data.id} as not completed:`, error);
    }
};
const assign = async (): Promise<void> => {
  try {
      const ref = collection(db, "atlUsers");
      const docs = await getDocs(ref);
      let memberAssigned = false;

      docs.forEach(async (doc) => {
          if (doc.data().email === selectedMember) {
              await taskAssign(data.id, doc.id);
              Alert.alert("Success", "Task assigned successfully!");
              memberAssigned = true;
              setAssignToOpen(false);
          }
      });

      if (!memberAssigned) {
          Alert.alert("Error", "No matching member found.");
      }
  } catch (err) {
      console.error("Error assigning task:", err);
      Alert.alert("Error", "There was an error assigning the task.");
  }
};

const URL_REGEX =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;

    if (done && data.taskDone) {
      return (
          <View style={[styles.box, { paddingTop: 0 }]} onTouchStart={handleMouseOver} onTouchEnd={handleMouseOut}>
              <Text style={styles.name}>{data.taskName}</Text>
              <View style={styles.boxContainer} onTouchStart={handleMouseOver}>
                  <Text>Description: <Text style={styles.bold}>{data.taskDescription}</Text></Text>
              </View>
              <View style={styles.boxContainer} onTouchStart={handleMouseOver}>
                  <Text>Due Date: <Text style={styles.bold}>{data.taskDueDate}</Text></Text>
              </View>
              {data.assignedTo && (
                  <View style={styles.boxContainer} onTouchStart={handleMouseOver}>
                      <Text>Assigned To: <Text style={styles.bold}>{data.assign}</Text></Text>
                  </View>
              )}
//       <View style={styles.box}>
{!data.taskDone && (
                      <>
                          <TouchableOpacity style={styles.button} onPress={markComplete}>
                              <FontAwesome name="check" size={20} color="green" />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.button} onPress={handleEditClick}>
                              <FontAwesome name="pencil" size={20} color="blue" />
                          </TouchableOpacity>
                      </>
                  )}
                  {data.taskDone && (
                      <TouchableOpacity style={styles.button}  onPress={handleMarkNotCompleted}>
<FontAwesome name="times" size={20} color="red" />
</TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.button} onPress={handleDelete}>
                      <FontAwesome name="trash" size={20} color="black" />
                  </TouchableOpacity>
              </View>
          </View>
      );
  

}else if(done === false && !data.taskDone) {
  return (
    <View style={styles.box}>
        <View style={styles.popupContainer}>
            <Text>Assign to:</Text>
            <Picker selectedValue={selectedRole} onValueChange={(itemValue) => setSelectedRole(itemValue)}>
                <Picker.Item label="--Select--" value="" />
                <Picker.Item label="ATL-Incharge" value="ATL-Incharge" />
                <Picker.Item label="Mentor" value="Mentor" />
                <Picker.Item label="Student" value="Student" />
            </Picker>

            {/* Conditional rendering of the second dropdown based on selectedRole */}
            {selectedRole === "ATL-Incharge" && (
                <Picker selectedValue={assignedTo} onValueChange={(itemValue) => setAssignedTo(itemValue)}>
                    <Picker.Item label="-Select Incharge-" value="" />
                    {filteredTeamMems.map((teamMem, index) => (
                        <Picker.Item key={index} label={teamMem.name} value={teamMem.email} />
                    ))}
                </Picker>
            )}

            {selectedRole === "Mentor" && (
                <Picker selectedValue={assignedTo} onValueChange={(itemValue) => setAssignedTo(itemValue)}>
                    <Picker.Item label="--Select Mentor--" value="" />
                    {filteredTeamMems.map((teamMem, index) => (
                        <Picker.Item key={index} label={teamMem.name} value={teamMem.email} />
                    ))}
                </Picker>
            )}

            {selectedRole === "Student" && (
                <Picker selectedValue={assignedTo} onValueChange={(itemValue) => setAssignedTo(itemValue)}>
                    <Picker.Item label="--Select Student--" value="" />
                    {filteredTeamMems.map((teamMem, index) => (
                        <Picker.Item key={index} label={teamMem.name} value={teamMem.email} />
                    ))}
                </Picker>
            )}
            <Button title="Assign" onPress={assign} />
        </View>
        <Text style={styles.taskName}>{data.taskName}</Text>
        <Text>Description: <Text style={styles.bold}>{data.description}</Text></Text>
        <Text>Due Date: <Text style={styles.bold}>{data.taskDueDate}</Text></Text>
        <Text>Comments: <Text style={styles.bold}>{data.commentText}</Text></Text>
        {data.assignedTo && (
            <Text>Assigned To: <Text style={styles.bold}>{assignedTo}</Text></Text>
        )}
        {/* <View style={{ display: displayValue }}> */}
        <View style={{ display: showElement ? 'flex' : 'none' }}>

            {!data.taskDone && (
                                <View style={styles.buttonContainer}>
                
                    <Button title="Assign To" onPress={handleAssignToClick} />
                    <Button title="Complete" onPress={markComplete} />
                    <Button title="Edit" onPress={handleEditClick} />
                </View>
            )}
            <Button title="Delete" onPress={handleDelete} />
        </View>
    </View>
);
} else {
return "";
}
};




const styles = StyleSheet.create({
  box: {
      padding: 10,
      borderWidth: 1,
      borderRadius: 8,
      marginVertical: 8,
      borderColor: 'grey',
      margin: 10,

  },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },

  popupContainer: {
    fontSize: 20,
    padding: 10,
},

  name: {
      fontSize: 18,
      fontWeight: 'bold',
  },
  boxContainer: {
      marginVertical: 4,
  },
  bold: {
      fontWeight: 'bold',
  },
  buttonsContainer: {
      flexDirection: 'row',
      marginTop: 8,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
},
taskName: {
  fontSize: 20,
  marginVertical: 5,
},

link: {
  color: 'blue',
},


});


export default ReportBox;
//   return (
//     <View style={styles.box}>
//       <Text style={styles.taskName}>{data.taskName}</Text>
//       <Text>Description: {data.taskDescription}</Text>
//       <Text>Due Date: {data.taskDueDate}</Text>
//       <Text>Assigned To: {assignedTo || 'Not Assigned'}</Text>

//       <View style={styles.buttonsContainer}>
//         {!data.taskDone && (
//           <>
//             <Pressable onPress={markComplete} style={styles.button}>
//               <Text>Complete</Text>
//             </Pressable>
//             <Pressable
//               onPress={() => {
//                 // Add your edit logic
//               }}
//               style={styles.button}
//             >
//               <Text>Edit</Text>
//             </Pressable>
//           </>
//         )}
//         <Pressable onPress={handleDelete} style={styles.button}>
//           <Text>Delete</Text>
//         </Pressable>
//         <Pressable onPress={() => setModalVisible(true)} style={styles.button}>
//           <Text>Assign To</Text>
//         </Pressable>
//       </View>

//       <Modal visible={modalVisible} transparent={true} animationType="slide">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text>Assign to:</Text>
//             <Picker
//               selectedValue={selectedRole}
//               onValueChange={setSelectedRole}
//             >
//               <Picker.Item label="ATL-Incharge" value="ATL-Incharge" />
//               <Picker.Item label="Mentor" value="Mentor" />
//               <Picker.Item label="Student" value="Student" />
//             </Picker>

//             {selectedRole === "ATL-Incharge" && (
//               <View>
//                 <Text>-Select Incharge-</Text>
//                 <Picker
//                   selectedValue={selectedIncharge}
//                   onValueChange={handleInchargeChange}
//                 >
//                   <Picker.Item label="-Select Incharge-" value="" />
//                   {filteredTeamMems.map((teamMem, index) => (
//                     <Picker.Item key={index} label={teamMem.name} value={teamMem.email} />
//                   ))}
//                 </Picker>
//               </View>
//             )}

//             {selectedRole === 'Mentor' && (
//               <View>
//                 <Text>--Select Mentor--</Text>
//                 <Picker
//                   selectedValue=""
//                   // onValueChange={(value) => onTeamMemberSelect(value)}
//                 >
//                   <Picker.Item label="--Select Mentor--" value="" />
//                   {filteredTeamMems.map((teamMem, index) => (
//                     <Picker.Item key={index} label={teamMem.name} value={teamMem.email} />
//                   ))}
//                 </Picker>
//               </View>
//             )}

//             {selectedRole === 'Student' && (
//               <View>
//                 <Text>--Select Student--</Text>
//                 <Picker
//                   selectedValue=""
//                   // onValueChange={(value) => onTeamMemberSelect(value)}
//                 >
//                   <Picker.Item label="--Select Student--" value="" />
//                   {filteredTeamMems.map((teamMem, index) => (
//                     <Picker.Item key={index} label={teamMem.name} value={teamMem.email} />
//                   ))}
//                 </Picker>
//               </View>
//             )}

//             <Button title="Close" onPress={() => setModalVisible(false)} />
//           </View>
//         </View>
//       </Modal>

//       <View style={styles.box}>
//         <Text>Description: </Text>
//         <Text style={styles.boldText}>
//           {descriptionWords.map((word, index) =>
//             word.match(/https?:\/\/\S+/) ? (
//               <Text key={index} style={styles.link} onPress={() => Linking.openURL(word)}>
//                 {word}
//               </Text>
//             ) : (
//               <Text key={index}>{word} </Text>
//             )
//           )}
//         </Text>
//         <Text>Due Date: <Text style={styles.boldText}>{data.taskDueDate}</Text></Text>
//         <Text>Comments: </Text>
//         <Text style={styles.boldText}>
//           {commentWords.map((word, index) =>
//             word.match(/https?:\/\/\S+/) ? (
//               <Text key={index} style={styles.link} onPress={() => Linking.openURL(word)}>
//                 {word}
//               </Text>
//             ) : (
//               <Text key={index}>{word} </Text>
//             )
//           )}
//         </Text>
//         {assignedTo ? <Text>Assigned To: <Text style={styles.boldText}>{assignedTo}</Text></Text> : null}
//       </View>
//     </View>
//   );
// };

//     // Update state when a team member is selected
// const handleTeamMemberSelect = (value: string) => {
//   setAssignedTo(value); // Set selected member to assignedTo
//   console.log('Selected Team Member:', value);
// };


// const handleInchargeChange = (value: string) => {
//   console.log('Incharge Selected:', value);
//   setSelectedIncharge(value);
//   onInchargeSelect(value);
// };

// const assignTask = async () => {
//   try {
//     const docRef = doc(db, 'atlUsers', assignedTo);
//     await taskAssign(data.id, docRef.id);
//     setAssignedTo(assignedTo);
//     Alert.alert('Assigned successfully!');
//     setModalVisible(false);
//   } catch (error) {
//     Alert.alert('Error assigning task.');
//   }
// };

