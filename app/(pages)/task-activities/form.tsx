// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, ScrollView, Button, Alert, Modal } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { query, collection, onSnapshot, getDoc, where, doc } from 'firebase/firestore';
// import { db } from '@/firebase/firestore';
// import CheckBox from '@/components/CheckBox';
// //import Picker from '@/components/Picker';
// import { Picker } from '@react-native-picker/picker';
// import { TouchableOpacity } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';


// import { StyleSheet } from 'react-native';
// import { addTask } from '@/firebase/firestore'; 
// import tw from 'twrnc'; // NativeWind (Tailwind CSS for React Native)

// // Types for Firebase documents and application state
// type Task = {
//   taskName: string;
//   taskDescription: string;
//   taskDueDate: string | Date;
//   isDone: boolean;
//   taskcomments: string;
// };




// type User = {
//   id: string;
//   name?: string;
//   role?: string;
//   tasks?: Task[];
// };

// type School = {
//   id: string;
//   name: string;
// };

// type Student = {
//   id: string;
//   email: string;
//   school: string;
// };

// const Tasks: React.FC = () => {
//   const [userData, setUserData] = useState<User | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [uid, setUID] = useState<string | undefined>();
//   const [role, setRole] = useState('');
//   const [mentorData, setMentorData] = useState<User[]>([]);
//   const [inchargeData, setInchargeData] = useState<User[]>([]);
//   const [schoolData, setSchoolData] = useState<School[]>([]);
//   const [mentorSelect, setMentorSelect] = useState('');
//   const [inchargeSelect, setInchargeSelect] = useState('');
//   const [selectedSchool, setSelectedSchool] = useState('');
//   const [studentData, setStudentData] = useState<Student[]>([]);
//   const [selectedStudent, setSelectedStudent] = useState('');
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   // const [dueDate, setDueDate] = useState('');
//   const [comments, setComments] = useState('');
//   const [tempUid, setTempUid] = useState<string | undefined>();
//   const [tempRole, setTempRole] = useState<string>('');
//   const [selectedRole, setSelectedRole] = useState('');
//   const [selectedShowing, setSelectedShowing] = useState('');
//   // const [tasks, setTasks] = useState<Task[]>([{ title: '', description: '' }]);
//   const [showTaskForm, setShowTaskForm] = useState(false); // New state to toggle task form
//   const [taskName, setTaskName] = useState('');
//   const [taskDueDate, setTaskDueDate] = useState<Date | undefined>(undefined);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//     // const [dueDate, setDueDate] = useState<Date>(new Date());



//   // Fetch auth data from AsyncStorage
//   useEffect(() => {
//     (async () => {
//       const encodedAuth = await AsyncStorage.getItem('auth');
//       if (encodedAuth) {
//         const [uid, , role] = atob(encodedAuth).split('-');
//         setTempUid(uid);
//         setUID(uid);
//         setTempRole(role);
//       }
//     })();
//   }, []);

//   // Fetch ATL users and school data
//   useEffect(() => {
//     const fetchData = async () => {
//       const atlUsersQuery = query(collection(db, 'atlUsers'));
//       const schoolsQuery = query(collection(db, 'schoolData'));

//       onSnapshot(atlUsersQuery, (snapshot) => {
//         const mentors: User[] = [];
//         const incharges: User[] = [];
//         snapshot.forEach((doc) => {
//           const data = { ...doc.data(), id: doc.id } as User;
//           if (data.role === 'mentor') {
//             mentors.push(data);
//           } else {
//             incharges.push(data);
//           }
//         });
//         setMentorData(mentors);
//         setInchargeData(incharges);
//       });

//       onSnapshot(schoolsQuery, (snapshot) => {
//         const schools: School[] = snapshot.docs.map((doc) => ({
//           ...doc.data(),
//           id: doc.id,
//         })) as School[];
//         setSchoolData(schools);
//       });
//     };

//     fetchData();
//   }, []);

//   // Fetch students when a school is selected
//   useEffect(() => {
//     if (!selectedSchool) return;
//     const studentsQuery = query(
//       collection(db, 'studentData'), 
//       where('school', '==', selectedSchool)
//     );

//     onSnapshot(studentsQuery, (snapshot) => {
//       const students: Student[] = snapshot.docs.map((doc) => ({
//         ...doc.data(),
//         id: doc.id,
//       })) as Student[];
//       setStudentData(students);
//     });
//   }, [selectedSchool]);

//   // Fetch user data when a student is selected
//   useEffect(() => {
//     if (!selectedStudent) return;
//     (async () => {
//       const studentSnap = await getDoc(doc(db, 'studentData', selectedStudent));
//       const email = studentSnap.data()?.email;
//       if (email) {
//         const userQuery = query(collection(db, 'atlUsers'), where('email', '==', email));

//         onSnapshot(userQuery, (snapshot) => {
//           snapshot.forEach((doc) => setUID(doc.id));
//         });
//       }
//     })();
//   }, [selectedStudent]);

//   // Fetch user tasks when UID changes
//   useEffect(() => {
//     if (!uid) return;
//     (async () => {
//       const userSnap = await getDoc(doc(db, 'atlUsers', uid));
//       if (userSnap.exists()) {
//         const userData = userSnap.data() as User;
//         userData.tasks = userData.tasks?.sort(
//           (a, b) => new Date(a.taskDueDate).getTime() - new Date(b.taskDueDate).getTime()
//         ) || [];
//         setUserData(userData);
//       }
//     })();
//   }, [uid]);

//   // Handle task submission
//   // const submitTask = async () => {
//   //   try {
//   //     if (!uid) {
//   //       Alert.alert("Error", "User ID is missing. Please select a student.");
//   //       return;
//   //     }
      
//   //     const taskData = {
//   //       taskName: name,
//   //       taskDescription: description,
//   //       taskDueDate: dueDate,
//   //       isDone: false,
//   //       taskComments: comments,
//   //     };

//   //     await addTask(uid, taskData); // Pass uid and taskData
//   //     Alert.alert("Success", "Task added successfully!");
//   //     setModalVisible(false); // Close modal
//   //     setName('');
//   //     setDescription('');
//   //     setDueDate('');
//   //     setComments('');
//   //   } catch (error) {
//   //     Alert.alert("Error", "Failed to add task. Please try again.");
//   //     console.error("Error adding task:", error);
//   //   }
//   // };

//   const showYours = () => {
//     setUID(tempUid);
//     setRole('');
//     setSelectedStudent('');
//     setSelectedSchool('');
//     setMentorSelect('');
//     setInchargeSelect('');
//   };

//   const handleDateChange = (event: any, selectedDate?: Date) => {
//     setShowDatePicker(false); // Close the DatePicker after a selection is made
//     if (selectedDate) {
//       setTaskDueDate(selectedDate);
//     }
//   };
//   const formatDate = (date: Date | undefined) => {
//     return date ? date.toISOString().split('T')[0] : ''; // Converts Date to "YYYY-MM-DD"
//   };
  
  
//   // const handleChange = (name: string, value: string) => {
//   //   const setters: Record<string, React.Dispatch<React.SetStateAction<string>>> = {
//   //     mentorSelect: setMentorSelect,
//   //     inchargeSelect: setInchargeSelect,
//   //     schoolSelect: setSelectedSchool,
//   //     studentSelect: setSelectedStudent,
//   //     roleSelect: setRole,
//   //   };
//   //   setters[name]?.(value);
//   // };



//   interface Task {
//     taskName: string;
//     taskDescription: string;
//     taskDueDate: string | Date;
//     taskComments: string;

//     isDone: boolean;
  
//   }
//   interface TaskData {
//     taskName: string;
//     taskDescription: string;
//     taskComments: string;
//     taskDueDate: string | Date;

//     isDone: boolean;
//   }
  

//   const [tasks, setTasks] = useState<TaskData[]>([
//     {
//       taskName: '',
//       taskDescription: '',
//       taskDueDate: new Date(),
//       taskComments: '',
//       isDone: false,
//     },
//   ]);
  
  

//   // const newTask: Task = { title: '', description: '' };
//   // setTasks([...tasks, newTask]);
  
//   // Handle adding a new task
//   // const handleAddTask = () => {
//   //   const newTask: Task = { title: '', description: '' };
//   //   setTasks([...tasks, newTask]);
//   //   };

//   // const handleChangeText = (index: number, field: keyof Task, value: string) => {
//   //   const newTasks = [...tasks];
//   //   newTasks[index][field] = value; // This line needs 'field' to match Task's keys
//   //   setTasks(newTasks);
//   // };
  
//   // Handle removing a task
//   const handleRemoveTask = (index: number) => {
//     const newTasks = tasks.filter((_, i) => i !== index);
//     setTasks(newTasks);
//   };

//   // Handle form submission
//   const handleSubmit = () => {
//     console.log('Submitted Tasks:', tasks);
//     setModalVisible(false);  // Close modal after submit
//   };

//   const submitTask = async () => {
//     try {
//       if (!uid) {
//         Alert.alert("Error", "User ID is missing. Please select a student.");
//         return;
//       }
  
//       const taskData : Task = {
//         taskName: name,
//         taskDescription: description,
//         taskDueDate: new Date(),
//         taskComments: comments,

//         isDone: false,
//       };
  
//       await addTask(uid, taskData); // Pass uid and taskData
//       Alert.alert("Success", "Task added successfully!");
      
//       // Reset and close modal
//       setShowTaskForm(false);
//       setModalVisible(false);
//       setName('');
//       setDescription('');
//       setTaskDueDate(new Date());
//       setComments('');
//     } catch (error) {
//       Alert.alert("Error", "Failed to add task. Please try again.");
//       console.error("Error adding task:", error);
//     }
//   };
  

//   return (
//     <ScrollView style={styles.container}>
//       {/* Modal for task submission */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         {/* <View style={tw`mb-4`}> */}
//         {/* <View style={tw`flex-row items-center`}>

//           <Text style={tw`text-sm font-semibold mb-2`}>Task Name</Text>
//           <TextInput
//             style={tw`border-b  border-gray-300 p-1 flex-1`}
//             placeholder=" Enter Task Name"
//             value={name}
//             onChangeText={setName}
//           />
//           </View> */}

//       </Modal>

//       {/* Button to open the modal */}
//       {/* <View style={tw`mb-5`}>

//       <Button title="Add Task" onPress={() => setModalVisible(true)} />
//       </View> */}

// <View style={styles.container}>
//       <View style={styles.buttonContainer}>
//       <View style={{ padding: 10 }}>
//   <Button title="+Add Task" onPress={() => setModalVisible(true)} />
// </View>
// <View style={{ padding: 10 }}>

//       <Button title="Shows yours" onPress={() => setModalVisible(false)} />
//       </View>

//       </View>
//       </View>
// <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.headerText}>Tasks | Digital ATL</Text>
//         <View style={styles.line} />
//       </View>
//       </View>
      



      

//           {/* <View style={styles.container}>
//       <View style={styles.buttonContainer}>
//         <Button title="+Add Task" onPress={() => setModalVisible(true)} />
//         <Button title="Shows yours" onPress={() => setModalVisible(true)} />

//       </View> */}

//       {/* Your other components go here */}

//       {/* Modal code would go here */}
//           {/* Dropdowns for Role and Showing */}
//           <View style={styles.dropdownContainer}>
//         <Text style={styles.label}>Role:</Text>
//         <Picker
//           selectedValue={selectedRole}
//           style={styles.picker}
//           onValueChange={(itemValue) => setSelectedRole(itemValue)}
//         >
//           <Picker.Item label="Select Role" value="" />
//           <Picker.Item label="mentor" value="mentor" />
//           <Picker.Item label="atl incharge" value="atl incharge" />
//           <Picker.Item label="student" value="student" />
//         </Picker>
//       </View>
//       <View style={styles.dropdownContainer}>
//         <Text style={styles.label}>Showing:</Text>
//         <Picker
//           selectedValue={selectedShowing}
//           style={styles.picker}
//           onValueChange={(itemValue) => setSelectedShowing(itemValue)}
//         >
//           {/* <Picker.Item label="Select Showing" value="" /> */}
//           <Picker.Item label="ongoing tasks" value="ongoing tasks" />
//           <Picker.Item label="completed tasks" value="completed tasks" />
//         </Picker>
//       </View>
//       <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.headerText}></Text>
//         <View style={styles.line} />
//       </View>
      
//       </View>
//       <ScrollView style={styles.container}>
      
//       {/* Button to open the modal */}
//       {/* <View style={styles.buttonContainer}>
//         <Button title="+Add Task" onPress={handleAddTask} />
//       </View> */}
      
//       {/* Modal containing task form */}
//       <Modal
//   animationType="slide"
//   transparent={true}
//   visible={modalVisible}
//   onRequestClose={() => setModalVisible(false)}
// >
//   <View style={styles.modalView}>
//     {/* {showTaskForm && ( */}
//       <>
//       {/* <View> */}
//       {/* Label */}
//       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//       {/* Label */}
//       <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
//         Name:
//       </Text>

//       {/* Input Box */}
//       <TextInput
//         style={{
//           height: 40, // Standard height for a single-line input
//           borderBottomColor: 'gray', // Underline color
//           borderBottomWidth: 1, // Underline width
//           fontSize: 16, // Font size matching the label
//           flex: 1, // Take up remaining space
//           marginLeft: 5, // Optional spacing if needed
//         }}
//         value={name}
//         onChangeText={setName}
//         // placeholder="Enter Name"
//         selectionColor="#000" // Cursor color
//         underlineColorAndroid="transparent" // Remove Android's default underline
//       />
//     </View>            <View>
//       {/* Title */}
      
//       <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 15 }}>
//   {/* Label for Description */}
//   <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
//     Description:
//   </Text>

//   {/* Textarea for Description */}
//   <TextInput
//     style={{
//       height: 100, // Height of the textarea
//       borderColor: 'gray', // Border color like in the image
//       borderWidth: 1, // Thin border
//       padding: 10, // Padding inside the textarea
//       borderRadius: 5, // Slightly rounded corners
//       marginLeft: 5,
//       textAlignVertical: 'top', // Text starts at the top
//       flex: 1, // Take up remaining space
//     }}
//     multiline
//     numberOfLines={4} // Controls how many lines are visible initially
//     value={description}
//     onChangeText={setDescription}
//     // placeholder="Task Description"
//   />
// </View>    </View>
//     <View>
//       {/* Label for Comments */}
//       <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
//   {/* Label for Task Comments */}
//   <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
//     Task Comments:
//   </Text>

//   {/* Multiline Textarea for Comments */}
//   <TextInput
//     style={{
//       height: 100, // Height similar to the "Description" field
//       borderColor: 'gray', // Border color
//       borderWidth: 1, // Border width
//       padding: 10, // Padding inside the input field
//       borderRadius: 5, // Rounded corners for the border
//       textAlignVertical: 'top', // Ensures text starts from the top of the textarea
//       flex: 1, // Take up remaining space
//       marginLeft: 5, // Optional spacing if needed
//     }}
//     multiline
//     numberOfLines={4} // Set how many lines should be visible
//     placeholder="Enter Comments"
//     value={comments}
//     onChangeText={setComments}
//   />
// </View>    </View>








//         {/* <TextInput
//           style={styles.input}
//           placeholder="Due Date"
//           value={dueDate}
//           onChangeText={setDueDate}
//         /> */}


//         {/* <TouchableOpacity
//             onPress={() => {
//               setDueDate(new Date()); // Placeholder for date picker logic
//             }}
//           >
//             <Text style={styles.dateText}>
//               Due Date: {taskData.toDateString()}
//             </Text>
//           </TouchableOpacity>
//  */}
//         <Button title="Add Task" onPress={submitTask} color="#007bff" />
//         {/* <Button title="Close" onPress={() => setModalVisible(false)} color="red" /> */}

//       </>
    
//   </View>
// </Modal>

//       {/* Rest of the screen content */}
  
  
  






















//       </ScrollView>


//     </ScrollView>






//   );
// };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //   },
// //   modalView: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     margin: 20,
// //     backgroundColor: 'white',
// //     borderRadius: 20,
// //     padding: 35,
// //     shadowColor: '#000',
// //     shadowOffset: {
// //       width: 0,
// //       height: 2,
// //     },
// //     shadowOpacity: 0.25,
// //     shadowRadius: 4,
// //     elevation: 5,
// //   },
// // });

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   taskContainer: {
//     marginBottom: 15,
//     borderBottomWidth: 1,
//     borderColor: '#ddd',
//     paddingBottom: 10,
//   },
//   inlineContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },


//   modalView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//   },
//   inputText: {
//     position: 'absolute',
//     left: 10,
//     top: 10,
//     fontSize: 16,
//   },


//   headerContainer: {
//     alignItems: 'flex-start', // Align to the left
//     marginBottom: 1, // Reduced space below header
//   },
//   dateText: {
//     color: '#007bff',
//     marginVertical: 10,
//   },

//   headerText: {
//     fontSize: 20,
//     fontWeight: 'bold', // Bold text for emphasis
//   },

//   label1: {
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   input1: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//   },

//   line: {
//     width: '100%', // Full width of the header
//     height: 2, // Height of the line
//     backgroundColor: 'black', // Color of the line
//     marginTop: 5, // Space between text and line
//   },
//   line1: {
//     height: 1, // Thickness of the line
//     backgroundColor: '#000', // Color of the line
//     position: 'absolute', // Positioned below the input
//     left: 10, // Align with the left of the label
//     right: 0, // Stretch to fill the rest of the width
//     top: 40, // Place below the input
//   },

//   dropdownContainer: {
//     marginVertical: 10, // Space between dropdowns
//   },

//   dropdownWrapper: {
//     marginVertical: 10,
//   },
//   dropdownRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-start', // Aligns items to the left

//     marginBottom: 5, // Space between each row
//   },

//   label: {
//     fontSize: 16,
//     marginBottom: 5, // Space between label and dropdown
//   },
  
//   picker: {
//     height: 40,
//     width: '25%', // Full width for the picker
//     borderColor: 'gray',
//     borderWidth: 1,
//     borderRadius: 5, // Rounded corners for the picker
//   },


//   buttonContainer: {
//     position: 'absolute',
//     top: 20, // Adjust as needed
//     right: 20, // Adjust as needed
//     zIndex: 1, // Ensure it stays on top
//     flexDirection: 'row', // Align buttons in a row
//     gap: 10, // Optional: add space between buttons

//   },
//   textArea: {
//     height: 80,
//     textAlignVertical: 'top',
//   },

//   removeButton: {
//     backgroundColor: 'red',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   removeButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   submitButtonContainer: {
//     marginTop: 20,
//     backgroundColor: 'blue',
//     padding: 15,
//     borderRadius: 5,
//   },
//   inlineInput: {
//     flex: 1, // Allows input to take remaining space
//     height: 40,
//     borderBottomColor: 'gray',
//     borderBottomWidth: 1,
//     fontSize: 16,
//     marginLeft: 0, // Ensures no left margin to eliminate space
//   },



// });



// export default Tasks;























































































































//confirm code for show

// import React, { useState, useEffect } from 'react';
// import { View, Text,  ScrollView,  Alert, Modal,Pressable } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { query, collection, onSnapshot, getDoc, where, doc } from 'firebase/firestore';
// import { db } from '@/firebase/firestore';
// import CheckBox from '@/components/CheckBox';
// //import Picker from '@/components/Picker';
// import { Picker } from '@react-native-picker/picker';
// import { TouchableOpacity } from 'react-native';
// // import DateTimePicker from '@react-native-community/datetimepicker';
// import {  StyleSheet, Platform } from 'react-native';
// import { Button } from 'react-native-paper';
// import { TextInput } from 'react-native-paper';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';

// import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
// import { format } from 'date-fns'; // Ensure date-fns is installed

// // import { StyleSheet } from 'react-native';
// import { addTask } from '@/firebase/firestore'; 
// import tw from 'twrnc'; // NativeWind (Tailwind CSS for React Native)

// // Types for Firebase documents and application state
// type Task = {
//   taskName: string;
//   taskDescription: string;
//   taskDueDate: string | Date;
//   isDone: boolean;
//   taskcomments: string;
// };




// type User = {
//   id: string;
//   name?: string;
//   role?: string;
//   tasks?: Task[];
// };

// type School = {
//   id: string;
//   name: string;
// };

// type Student = {
//   id: string;
//   email: string;
//   school: string;
// };

// const Tasks: React.FC = () => {
//   const [userData, setUserData] = useState<User | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [uid, setUID] = useState<string | undefined>();
//   const [role, setRole] = useState('');
//   const [mentorData, setMentorData] = useState<User[]>([]);
//   const [inchargeData, setInchargeData] = useState<User[]>([]);
//   const [schoolData, setSchoolData] = useState<School[]>([]);
//   const [mentorSelect, setMentorSelect] = useState('');
//   const [inchargeSelect, setInchargeSelect] = useState('');
//   const [selectedSchool, setSelectedSchool] = useState('');
//   const [studentData, setStudentData] = useState<Student[]>([]);
//   const [selectedStudent, setSelectedStudent] = useState('');
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   // const [dueDate, setDueDate] = useState('');
//   const [comments, setComments] = useState('');
//   const [tempUid, setTempUid] = useState<string | undefined>();
//   const [tempRole, setTempRole] = useState<string>('');
//   const [selectedRole, setSelectedRole] = useState('');
//   const [selectedShowing, setSelectedShowing] = useState('');
//   // const [tasks, setTasks] = useState<Task[]>([{ title: '', description: '' }]);
//   const [showTaskForm, setShowTaskForm] = useState(false); // New state to toggle task form
//   const [taskName, setTaskName] = useState('');
//   const [taskDueDate, setTaskDueDate] = useState<Date | undefined>(undefined);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//     // const [dueDate, setDueDate] = useState<Date>(new Date());
//     const [date, setDate] = useState<Date | null>(null); // Use 'null' instead of undefined
//     const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//     const [dueDate, setDueDate] = useState<Date | undefined>(undefined); // Date state
//     const [isVisible, setIsVisible] = useState(true); // State to control visibility

//   // Handle showing the date picker
//   // const showDatePickerHandler = () => setShowDatePicker(true);


//     const openModal = () => setModalVisible(true);
//     const closeModal = () => setModalVisible(false);
  
//     // const showDatePicker = () => setDatePickerVisibility(true);
//      const hideDatePicker = () => setDatePickerVisibility(false);
//     const handleConfirm = (selectedDate: Date) => {
//       setDate(selectedDate);
//       hideDatePicker();
//     };

//     const showDatePickerHandler = () => {
//       setShowDatePicker(true);
//     };

//     if (!isVisible) return null; // If not visible, don't render the component
  
  
  
  

//   // Fetch auth data from AsyncStorage
//   useEffect(() => {
//     (async () => {
//       const encodedAuth = await AsyncStorage.getItem('auth');
//       if (encodedAuth) {
//         const [uid, , role] = atob(encodedAuth).split('-');
//         setTempUid(uid);
//         setUID(uid);
//         setTempRole(role);
//       }
//     })();
//   }, []);

//   // Fetch ATL users and school data
//   useEffect(() => {
//     const fetchData = async () => {
//       const atlUsersQuery = query(collection(db, 'atlUsers'));
//       const schoolsQuery = query(collection(db, 'schoolData'));

//       onSnapshot(atlUsersQuery, (snapshot) => {
//         const mentors: User[] = [];
//         const incharges: User[] = [];
//         snapshot.forEach((doc) => {
//           const data = { ...doc.data(), id: doc.id } as User;
//           if (data.role === 'mentor') {
//             mentors.push(data);
//           } else {
//             incharges.push(data);
//           }
//         });
//         setMentorData(mentors);
//         setInchargeData(incharges);
//       });

//       onSnapshot(schoolsQuery, (snapshot) => {
//         const schools: School[] = snapshot.docs.map((doc) => ({
//           ...doc.data(),
//           id: doc.id,
//         })) as School[];
//         setSchoolData(schools);
//       });
//     };

//     fetchData();
//   }, []);

//   // Fetch students when a school is selected
//   useEffect(() => {
//     if (!selectedSchool) return;
//     const studentsQuery = query(
//       collection(db, 'studentData'), 
//       where('school', '==', selectedSchool)
//     );

//     onSnapshot(studentsQuery, (snapshot) => {
//       const students: Student[] = snapshot.docs.map((doc) => ({
//         ...doc.data(),
//         id: doc.id,
//       })) as Student[];
//       setStudentData(students);
//     });
//   }, [selectedSchool]);

//   // Fetch user data when a student is selected
//   useEffect(() => {
//     if (!selectedStudent) return;
//     (async () => {
//       const studentSnap = await getDoc(doc(db, 'studentData', selectedStudent));
//       const email = studentSnap.data()?.email;
//       if (email) {
//         const userQuery = query(collection(db, 'atlUsers'), where('email', '==', email));

//         onSnapshot(userQuery, (snapshot) => {
//           snapshot.forEach((doc) => setUID(doc.id));
//         });
//       }
//     })();
//   }, [selectedStudent]);

//   // Fetch user tasks when UID changes
//   useEffect(() => {
//     if (!uid) return;
//     (async () => {
//       const userSnap = await getDoc(doc(db, 'atlUsers', uid));
//       if (userSnap.exists()) {
//         const userData = userSnap.data() as User;
//         userData.tasks = userData.tasks?.sort(
//           (a, b) => new Date(a.taskDueDate).getTime() - new Date(b.taskDueDate).getTime()
//         ) || [];
//         setUserData(userData);
//       }
//     })();
//   }, [uid]);


//   const showYours = () => {
//     setUID(tempUid);
//     setRole('');
//     setSelectedStudent('');
//     setSelectedSchool('');
//     setMentorSelect('');
//     setInchargeSelect('');
//   };

//   const handleDateChange = (event, selectedDate) => {
//     if (event.type === 'set') { // Checkw if the date was set
//       const currentDate = selectedDate || dueDate; // Use selected date or current date
//       setDueDate(currentDate);
//     }
//     setShowDatePicker(false); // Hide the date picker after selection
//   };



//   // const handleDateChange = (event: any, selectedDate?: Date) => {
//   //   setShowDatePicker(false); // Close the DatePicker after a selection is made
//   //   if (selectedDate) {
//   //     setTaskDueDate(selectedDate);
//   //   }
//   // };
//   const formatDate = (date: Date | undefined) => {
//     return date ? date.toISOString().split('T')[0] : ''; // Converts Date to "YYYY-MM-DD"
//   };
  
  



//   interface Task {
//     taskName: string;
//     taskDescription: string;
//     taskDueDate: string | Date;
//     taskComments: string;

//     isDone: boolean;
  
//   }
//   interface TaskData {
//     taskName: string;
//     taskDescription: string;
//     taskComments: string;
//     taskDueDate: string | Date;

//     isDone: boolean;
//   }
  

//   const [tasks, setTasks] = useState<TaskData[]>([
//     {
//       taskName: '',
//       taskDescription: '',
//       taskDueDate: new Date(),
//       taskComments: '',
//       isDone: false,
//     },
//   ]);
  
  

  
//   // Handle removing a task
//   const handleRemoveTask = (index: number) => {
//     const newTasks = tasks.filter((_, i) => i !== index);
//     setTasks(newTasks);
//   };

//   // Handle form submission
//   // const handleSubmit = () => {
//   //   console.log('Submitted Tasks:', tasks);
//   //   setModalVisible(false);  // Close modal after submit
//   // };

//   const submitTask = async () => {
//     try {
//       if (!uid) {
//         Alert.alert("Error", "User ID is missing. Please select a student.");
//         return;
//       }
  
//       const taskData : Task = {
//         taskName: name,
//         taskDescription: description,
//         taskDueDate: new Date(),
//         taskComments: comments,

//         isDone: false,
//       };
  
//       await addTask(uid, taskData); // Pass uid and taskData
//       Alert.alert("Success", "Task added successfully!");
      
//       // Reset and close modal
//       setShowTaskForm(false);
//       setModalVisible(false);
//       setName('');
//       setDescription('');
//       setTaskDueDate(new Date());
//       setComments('');
//     } catch (error) {
//       Alert.alert("Error", "Failed to add task. Please try again.");
//       console.error("Error adding task:", error);
//     }
//   };


//   const onChange = (event: any, selectedDate?: Date) => {
//     if (event.type === 'set' && selectedDate) {
//       setDate(selectedDate);
//     }
//     setShowDatePicker(false);
//   };

//   const showPicker = () => {
//     setShowDatePicker(true);
//   };

//   const handleSubmit = () => {
//     console.log('Form Data:', { name, description, comments, taskDueDate });
//     // Reset form after submission
//     setName('');
//     setDescription('');
//     setComments('');
//     setTaskDueDate(new Date());
//   };
//   // const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
//   //   setShowDatePicker(false); // Close picker after selection
//   //   if (selectedDate) setDate(selectedDate); // Update date
//   // };

  


//   if (!isVisible) return null; // If not visible, don't render the component


//   return (
//     isVisible && (

//     <ScrollView style={styles.container}>
//       {/* Modal for task submission */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//       </Modal>


// <View style={styles.container}>
//       <View style={styles.buttonContainer}>
//       <View style={{ padding: 10 }}>
//       <Button 
//   mode="contained" 
//   onPress={() => setModalVisible(true)}
// >
//   +Add Task
// </Button>

// </View>
// <View style={{ padding: 10 }}>

//       <Button   mode="contained" 
//  onPress={() => setModalVisible(false)} 
//  >Shows yours</Button>
//       </View>

//       </View>
//       </View>
// <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.headerText}>Tasks | Digital ATL</Text>
//         <View style={styles.line} />
//       </View>
//       </View>
      



      


//       {/* Modal code would go here */}
//           {/* Dropdowns for Role and Showing */}
//           <View style={styles.dropdownContainer}>
//         <Text style={styles.label}>Role:</Text>
//         <Picker
//           selectedValue={selectedRole}
//           style={styles.picker}
//           onValueChange={(itemValue) => setSelectedRole(itemValue)}
//         >
//           <Picker.Item label="Select Role" value="" />
//           <Picker.Item label="mentor" value="mentor" />
//           <Picker.Item label="atl incharge" value="atl incharge" />
//           <Picker.Item label="student" value="student" />
//         </Picker>
//       </View>
//       <View style={styles.dropdownContainer}>
//         <Text style={styles.label}>Showing:</Text>
//         <Picker
//           selectedValue={selectedShowing}
//           style={styles.picker}
//           onValueChange={(itemValue) => setSelectedShowing(itemValue)}
//         >
//           {/* <Picker.Item label="Select Showing" value="" /> */}
//           <Picker.Item label="ongoing tasks" value="ongoing tasks" />
//           <Picker.Item label="completed tasks" value="completed tasks" />
//         </Picker>
//       </View>
//       <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.headerText}></Text>
//         <View style={styles.line} />
//       </View>
      
//       </View>
//       <ScrollView style={styles.container}>
      
//       <Modal
//   animationType="slide"
//   transparent={true}
//   visible={modalVisible}
//   onRequestClose={() => setModalVisible(false)}
// >

//   <View style={styles.modalView}>
//   <View style={styles.container}>
//   {/* <View style={styles.modalBackground}> */}
//   <ScrollView
//       contentContainerStyle={{
//         flexGrow: 1,
//         justifyContent: 'center',
//         padding: 20,
//       }}
//     >


//       {/* Name Input */}
//       <View
//       style={{
//         flex: 1,
//         padding: 20,
//         // backgroundColor: '#fff',
//         justifyContent: 'center',
//       }}
//     >
//       <View
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           marginBottom: 15,
//         }}
//       >
//         {/* Label */}
//         <Text
//           style={{
//             width: 80, // Adjust for consistent alignment
//             fontSize: 16,
//             fontWeight: 'bold',
//           }}
//         >
//           Name:
//         </Text>

//         {/* Input Line */}
//         <TextInput
//           value={name}
//           onChangeText={setName}
//           // placeholder="Enter task name"
//           style={{
//             flex: 1, // Takes the remaining space
//             borderBottomWidth: 1,
//             borderColor: '#000', // Darker border for visibility
//             paddingVertical: 5, // Controls vertical padding
//             marginLeft: 10, // Space between label and input
//             backgroundColor: 'transparent', // Ensure no background color

//           }}
//         />
      
//     </View>
//     </View>
//       {/* Description Input */}
//       <View
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           marginBottom: 20,
//         }}
//       >
//       {/* Description */}
//       <Text
//           style={{
//             width: 100, // Width for the label
//             fontSize: 16,
//             fontWeight: 'bold',
//             marginLeft: 10, // Space between label and input
//           }}
//         >
//           Description:
//         </Text>
//         <TextInput
//           value={description}
//           onChangeText={setDescription}
//           multiline
//           numberOfLines={4}
//           style={{
//             flex: 1, // Takes the remaining space in the row
//             borderWidth: 1,
//             borderColor: '#ccc',
//             borderRadius: 8,
//             padding: 10,
//             textAlignVertical: 'top',
//             backgroundColor: '#f8f8f8',
//             minHeight: 80, // Fixed height for the textarea
//           }}
//         />
//       </View>
//       {/* </View> */}


//       {/* Comments Input */}
//       <View
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           marginBottom: 20,
//         }}
//       >
//                 <Text
//           style={{
//             width: 100,
//             fontSize: 16,
//             fontWeight: 'bold',
//             marginLeft: 10,
//           }}
//         >
//           Comments:
//         </Text>


//       <TextInput
//           value={comments}
//           onChangeText={setComments}
//           multiline
//           numberOfLines={4}
//           style={{
//             flex: 1,
//             borderWidth: 1,
//             borderColor: '#ccc',
//             borderRadius: 8,
//             padding: 10,
//             textAlignVertical: 'top',
//             backgroundColor: '#f8f8f8',
//             minHeight: 80,
//           }}
//         />
//         </View>

//       {/* Due Date Row */}
//       <View
     
      
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           marginBottom: 20,
//         }}
//       >
//         <Text
//           style={{
//             width: 100,
//             fontSize: 16,
//             fontWeight: 'bold',
//                         marginLeft: 10, // Space between label and input

            
            
//           }}
//         >
//           Due Date:
//         </Text>
//         <TextInput
//           value={dueDate ? format(dueDate, 'dd-MM-yyyy') : ''}
//           placeholder="dd-mm-yyyy"
//           editable={false} // Disable typing
//           style={{
//             flex: 1,
//             borderBottomWidth: 1,
//             borderColor: '#000',
//             paddingVertical: 5,
//             marginLeft: 10,
//             backgroundColor: 'transparent',
//           }}
//         />
//         <TouchableOpacity
//           style={{ marginLeft: 10 }}
//           onPress={showDatePickerHandler}
//         >
//           <Text style={{ fontSize: 18 }}>📅</Text>
//         </TouchableOpacity>
//       </View>

//       {/* DateTime Picker */}
//       {showDatePicker && (
//         <DateTimePicker
//           value={dueDate || new Date()} // Default to current date
//           mode="date"
//           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//           onChange={handleDateChange}
//         />
//       )}

// </ScrollView>

//       </View>


//       {/* Submit Button */}
//       <Button mode="contained" onPress={handleSubmit} style={styles.button}>
//         Add Task
//       </Button>

//         {/* Close Button at Top Right */}
//         <TouchableOpacity 
//           style={styles.closeButton} 
//           onPress={() => setIsVisible(false)} // Close container on press
//         >
//           <Text style={styles.closeButtonText}>X</Text>
//         </TouchableOpacity>



//     </View>
    
// </Modal>

//       {/* Rest of the screen content */}
  
//   </ScrollView>
  
  


//     </ScrollView>





//     )
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     // justifyContent: 'center',

//   },
//   taskContainer: {
//     marginBottom: 15,
//     borderBottomWidth: 1,
//     borderColor: '#ddd',
//     paddingBottom: 10,
//   },
//   // modalBackground: {
//   //   flex: 1,
//   //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   //   justifyContent: 'center',
//   //   alignItems: 'center',
//   // },

//   inputContainer: {
//     marginBottom: 15, // Adds space between each container
//     padding: 10, // Adds padding inside the container
//     backgroundColor: '#f9f9f9', // Optional: Adds background color to container
//   },


//   inlineContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },


//   modalView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   button: {
//     marginTop: 16,
//   },

//   closeButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     zIndex: 1,
//   },
//   closeButtonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '',
//   },


//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 16,
//   },
//   inputText: {
//     position: 'absolute',
//     left: 10,
//     top: 10,
//     fontSize: 16,
//   },

  


//   headerContainer: {
//     alignItems: 'flex-start', // Align to the left
//     marginBottom: 1, // Reduced space below header
//   },
//   dateText: {
//     color: '#007bff',
//     marginVertical: 10,
//   },

//   headerText: {
//     fontSize: 20,
//     fontWeight: 'bold', // Bold text for emphasis
//   },

//   label1: {
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   input1: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//   },

//   line: {
//     width: '100%', // Full width of the header
//     height: 2, // Height of the line
//     backgroundColor: 'black', // Color of the line
//     marginTop: 5, // Space between text and line
//   },
//   line1: {
//     height: 1, // Thickness of the line
//     backgroundColor: '#000', // Color of the line
//     position: 'absolute', // Positioned below the input
//     left: 10, // Align with the left of the label
//     right: 0, // Stretch to fill the rest of the width
//     top: 40, // Place below the input
//   },

//   dropdownContainer: {
//     marginVertical: 10, // Space between dropdowns
//   },

//   dropdownWrapper: {
//     marginVertical: 10,
//   },
//   dropdownRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-start', // Aligns items to the left

//     marginBottom: 5, // Space between each row
//   },

//   label: {
//     fontSize: 16,
//     marginBottom: 5, // Space between label and dropdown
//   },
  
//   picker: {
//     height: 40,
//     width: '25%', // Full width for the picker
//     borderColor: 'gray',
//     borderWidth: 1,
//     borderRadius: 5, // Rounded corners for the picker
//   },


//   buttonContainer: {
//     position: 'absolute',
//     top: 20, // Adjust as needed
//     right: 20, // Adjust as needed
//     zIndex: 1, // Ensure it stays on top
//     flexDirection: 'row', // Align buttons in a row
//     gap: 10, // Optional: add space between buttons
//   },
//     dateButton: {
//     backgroundColor: '#eee',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 15,
//   },
//   // dateText: {
//   //   fontSize: 16,
//   //   color: '#333',
//   // },

//   // },
//   // textArea: {
//   //   height: 80,
//   //   textAlignVertical: 'top',
//   // },

//   // removeButton: {
//   //   backgroundColor: 'red',
//   //   padding: 10,
//   //   borderRadius: 5,
//   //   marginTop: 10,
//   // },
//   // removeButtonText: {
//   //   color: 'white',
//   //   fontWeight: 'bold',
//   //   textAlign: 'center',
//   // },
//   // submitButtonContainer: {
//   //   marginTop: 20,
//   //   backgroundColor: 'blue',
//   //   padding: 15,
//   //   borderRadius: 5,
//   // },
//   // inlineInput: {
//   //   flex: 1, // Allows input to take remaining space
//   //   height: 40,
//   //   borderBottomColor: 'gray',
//   //   borderBottomWidth: 1,
//   //   fontSize: 16,
//   //   marginLeft: 0, // Ensures no left margin to eliminate space
//   // },



// });



// export default Tasks;

























// import React, { useState, useEffect } from 'react';
// import { View, Text, ScrollView, Alert, Modal } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { query, collection, onSnapshot, getDoc, where, doc } from 'firebase/firestore';
// import { db } from '@/firebase/firestore';
// import { Picker } from '@react-native-picker/picker';
// import { TouchableOpacity } from 'react-native';
// import { StyleSheet } from 'react-native';
// import { Button, TextInput } from 'react-native-paper';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import { format } from 'date-fns';

// // Types for Firebase documents and application state
// type Task = {
//   taskName: string;
//   taskDescription: string;
//   taskDueDate: string; // Change to string
//   isDone: boolean;
//   taskComments: string;
// };

// type User = {
//   id: string; // Change to id if you're using this as the identifier
//   uid?: string; // Added uid property for mentor/incharge identification
//   name?: string;
//   role?: string;
//   tasks?: Task[];
// };

// type School = {
//   id: string;
//   name: string;
// };

// type Student = {
//   id: string;
//   email: string;
//   school: string;
// };

// interface Mentor {
//   uid: string;
//   name: string;
// }

// interface Incharge {
//   uid: string;
//   name: string;
// }

// interface Props {
//   mentorData: Mentor[];
//   inchargeData: Incharge[];
//   schoolData: School[];
//   studentData: Student[]; // Ensure studentData is defined in props
// }

// const Tasks: React.FC<Props> = ({
//   mentorData = [], // Initialize to an empty array
//   studentData = [], // Initialize to an empty array
// }) => {
//   const [userData, setUserData] = useState<User | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [uid, setUID] = useState<string | undefined>();
//   const [role, setRole] = useState('');
//   const [mentorSelect, setMentorSelect] = useState(''); // Mentor selection
//   const [selectedSchool, setSelectedSchool] = useState(''); // School selection
//   const [selectedStudent, setSelectedStudent] = useState<string>(''); // Student selection
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [comments, setComments] = useState('');
//   const [tempUid, setTempUid] = useState<string | undefined>();
//   const [tempRole, setTempRole] = useState<string>('');
//   const [showTaskForm, setShowTaskForm] = useState(false);
//   const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [inchargeData, setInchargeData] = useState<User[]>([]);
//   const [schoolData, setSchoolData] = useState<School[]>([]);

//   // Fetch auth data from AsyncStorage
//   useEffect(() => {
//     (async () => {
//       const encodedAuth = await AsyncStorage.getItem('auth');
//       if (encodedAuth) {
//         const [uid, , role] = atob(encodedAuth).split('-');
//         setTempUid(uid);
//         setUID(uid);
//         setTempRole(role);
//       }
//     })();
//   }, []);

//   // Fetch ATL users and school data
//   useEffect(() => {
//     const fetchData = async () => {
//       const atlUsersQuery = query(collection(db, 'atlUsers'));
//       const schoolsQuery = query(collection(db, 'schoolData'));

//       onSnapshot(atlUsersQuery, (snapshot) => {
//         const mentors: User[] = [];
//         const incharges: User[] = [];
//         snapshot.forEach((doc) => {
//           const data = { ...doc.data(), id: doc.id } as User;
//           if (data.role === 'mentor') {
//             mentors.push(data);
//           } else {
//             incharges.push(data);
//           }
//         });
//         setMentorSelect(mentors[0]?.uid || ''); // Set the first mentor's UID or empty string
//         setInchargeData(incharges);
//       });

//       onSnapshot(schoolsQuery, (snapshot) => {
//         const schools: School[] = snapshot.docs.map((doc) => ({
//           ...doc.data(),
//           id: doc.id,
//         })) as School[];
//         setSchoolData(schools);
//       });
//     };

//     fetchData();
//   }, []);

//   // Fetch students when a school is selected
//   useEffect(() => {
//     if (!selectedSchool) return;
//     const studentsQuery = query(
//       collection(db, 'studentData'),
//       where('school', '==', selectedSchool)
//     );

//     onSnapshot(studentsQuery, (snapshot) => {
//       const students: Student[] = snapshot.docs.map((doc) => ({
//         ...doc.data(),
//         id: doc.id,
//       })) as Student[];
//       setSelectedStudent(students[0]?.id || ''); // Set the first student's ID or empty string
//     });
//   }, [selectedSchool]);

//   // Fetch user data when a student is selected
//   useEffect(() => {
//     if (!selectedStudent) return;
//     (async () => {
//       const studentSnap = await getDoc(doc(db, 'studentData', selectedStudent));
//       const email = studentSnap.data()?.email;
//       if (email) {
//         const userQuery = query(collection(db, 'atlUsers'), where('email', '==', email));

//         onSnapshot(userQuery, (snapshot) => {
//           snapshot.forEach((doc) => setUID(doc.id));
//         });
//       }
//     })();
//   }, [selectedStudent]);

//   // Fetch user tasks when UID changes
//   useEffect(() => {
//     if (!uid) return;
//     (async () => {
//       const userSnap = await getDoc(doc(db, 'atlUsers', uid));
//       if (userSnap.exists()) {
//         const userData = userSnap.data() as User;
//         userData.tasks = userData.tasks?.sort(
//           (a, b) => new Date(a.taskDueDate).getTime() - new Date(b.taskDueDate).getTime()
//         ) || [];
//         setUserData(userData);
//         setTasks(userData.tasks); // Set tasks here
//       }
//     })();
//   }, [uid]);

//   // Function to handle date change
//   const handleDateChange = (selectedDate: Date | undefined) => {
//     if (selectedDate) {
//       setDueDate(selectedDate);
//     }
//     setShowDatePicker(false);
//   };

//   const formatDate = (date: Date | undefined) => {
//     return date ? date.toISOString().split('T')[0] : '';
//   };

//   // Handle removing a task
//   const handleRemoveTask = (index: number) => {
//     const newTasks = tasks.filter((_, i) => i !== index);
//     setTasks(newTasks);
//   };

//   // Function to add a task
//   const addTask = async (uid: string, taskData: Task) => {
//     // Implement your Firestore logic to add a task here
//   };

//   const submitTask = async () => {
//     try {
//       if (!uid) {
//         Alert.alert("Error", "User ID is missing. Please select a student.");
//         return;
//       }

//       const taskData: Task = {
//         taskName: name,
//         taskDescription: description,
//         taskDueDate: formatDate(dueDate), // Ensure this is a string
//         taskComments: comments,
//         isDone: false,
//       };

//       await addTask(uid, taskData);
//       Alert.alert("Success", "Task added successfully!");

//       setShowTaskForm(false);
//       setModalVisible(false);
//       setName('');
//       setDescription('');
//       setDueDate(undefined);
//       setComments('');
//     } catch (error) {
//       Alert.alert("Error", "Failed to add task. Please try again.");
//       console.error("Error adding task:", error);
//     }
//   };

//   // Function to show date picker
//   const showPicker = () => {
//     setShowDatePicker(true);
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView>
//         {/* Mentor Picker */}
//         <Text>Select Mentor:</Text>
//         <Picker selectedValue={mentorSelect} onValueChange={(itemValue) => setMentorSelect(itemValue)}>
//           {mentorData.length > 0 ? (
//             mentorData.map((mentor, index) => (
//               <Picker.Item key={index} label={mentor.name} value={mentor.uid} />
//             ))
//           ) : (
//             <Picker.Item label="No mentors available" value="" />
//           )}
//         </Picker>

//         {/* Students List */}
//         <Text>Select Student:</Text>
//         <Picker selectedValue={selectedStudent} onValueChange={(itemValue) => setSelectedStudent(itemValue)}>
//           {studentData.length > 0 ? (
//             studentData.map((student, index) => (
//               <Picker.Item key={index} label={student.email} value={student.id} />
//             ))
//           ) : (
//             <Picker.Item label="No students available" value="" />
//           )}
//         </Picker>

//         {/* Tasks List */}
//         <Text>Tasks:</Text>
//         {tasks.length > 0 ? (
//           tasks.map((task, index) => (
//             <View key={index} style={styles.taskContainer}>
//               <Text>{task.taskName}</Text>
//               <Button onPress={() => handleRemoveTask(index)}>Remove</Button>
//             </View>
//           ))
//         ) : (
//           <Text>No tasks available</Text>
//         )}

//         {/* Add Task Button */}
//         <TouchableOpacity onPress={() => setModalVisible(true)}>
//           <Text>Add Task</Text>
//         </TouchableOpacity>

//         {/* Task Form Modal */}
//         <Modal visible={modalVisible}>
//           <View>
//             <TextInput label="Task Name" value={name} onChangeText={setName} />
//             <TextInput label="Task Description" value={description} onChangeText={setDescription} />
//             <TextInput label="Comments" value={comments} onChangeText={setComments} />
//             <Button onPress={showPicker}>Select Due Date</Button>

//             <DateTimePickerModal
//               isVisible={showDatePicker}
//               mode="date"
//               onConfirm={handleDateChange}
//               onCancel={() => setShowDatePicker(false)}
//             />

//             <Button onPress={submitTask}>Submit Task</Button>
//           </View>
//         </Modal>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   taskContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
// });

// export default Tasks;












//confirm to show sir tomorrow 30/10/2024

// import React, { useState,useEffect } from 'react';
// import {
//   Text,
//   View,
//   TextInput,
//   Pressable,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   Modal,
//   StyleSheet,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
// import { db } from '@/firebase/firestore';
// import ReportBox from './components/Reportbox';
// import { addTask } from '@/firebase/firestore';
// import type { Task } from '@/firebase/firestore';



// // interface TaskData {
// //   taskDueDate: string;
// // }



// interface UserData {
//   uid?: string;
//   name?: string;

//   tasks?: TaskData[];
//   [key: string]: any;

// }
// interface InchargeData {
//   uid: string;
//   name: string;
// }





// interface AtlUserData {
//   id: string;
//   role: string;
//   inchargeData?: InchargeData[]; // Assuming inchargeData is part of AtlUserData
//   uid: string;
//   name:string;

//   // Add any other properties needed here
// }

// type TaskData = {
//   taskName: string;
//   taskDueDate: string;
//   taskDescription: string; 
//   taskComments: string;
//   completed: boolean;
//   id: string;
//   ref: { path: string }; // Modified to match expected type




// }

// const Tasks = async (name: string, description: string, dueDate: string, someFlag: boolean, comments: string) => {


// // const Tasks = async (name: string, description: string, dueDate: string, someFlag: boolean, comments: string) => {
// }

// function TasksComponent() {
//   const [userData, setUserData] = useState<UserData>({});
//   const [modalVisible, setModalVisible] = useState(false);
//   const [uid, setUID] = useState<string | undefined>();
//   const [role, setRole] = useState<string>('');
//   const [mentorData, setMentorData] = useState<any[]>([]);
//   const [inchargeData, setInchargeData] = useState<AtlUserData[]>([]);
//   const [schoolData, setSchoolData] = useState<any[]>([]);
//   const [mentorSelect, setMentorSelect] = useState<string>('');
//   const [inchargeSelect, setInchargeSelect] = useState<string>('');
//   const [selectedSchool, setSelectedSchool] = useState<string>('');
//   const [studentData, setStudentData] = useState<any[]>([]);
//   const [selectedStudent, setSelectedStudent] = useState<string>('');
//   const [name, setName] = useState<string>('');
//   const [description, setDescription] = useState<string>('');
//   const [dueDate, setDueDate] = useState<string>('');
//   const [showWhat, setShowWhat] = useState<string>("tasksNotDone");
//   const [comments, setComments] = useState<string>('');
//   const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
//   const [selectedRole, setSelectedRole] = useState('');
//   const [selectedShowing, setSelectedShowing] = useState('');
//   // const [userData, setUserData] = useState<UserData | undefined>(undefined);
//   const [selectedIncharge, setSelectedIncharge] = useState<string>('');
//   // const [inchargeData, setInchargeData] = useState<InchargeData[]>([]);
//   // const handlePickerChange = (value: string) => {
//   //   setSelectedIncharge(value);
//   // };
//   const [popupOpen, setPopupOpen] = useState<boolean>(false);
//   const [teamMems, setTeamMems] = useState<any[]>([]);


//   useEffect(() => {
//     const fetchInchargeData = async () => {
//       const querySnapshot = await getDocs(collection(db, 'atlUsers'));
//       const inchargeData: InchargeData[] = querySnapshot.docs.map((doc) => ({
//         uid: doc.id,      // Get the document ID
//         name: doc.data().name, // Get the name field
//     }));
//   // setInchargeData(data);
//         // Transform InchargeData to AtlUserData
//         const atlUserData: AtlUserData[] = inchargeData.map((incharge) => ({
//           id: incharge.uid,   // Map uid to id
//           role: 'atlIncharge', // Assign a default role; adjust as needed
//           uid: incharge.uid,   // Include uid in the new structure
//           name: incharge.name, // Include name in the new structure
//       }));

//       setInchargeData(atlUserData); // Set the transformed data
//   };

//   fetchInchargeData();
// }, []);


// const filteredTeamMems = teamMems.filter((teamMem) => {
//   if (selectedRole === "ATL-Incharge" && teamMem.role === "atlIncharge") {
//     return true;
//   }
//   if (selectedRole === "Mentor" && teamMem.role === "mentor") {
//     return true;
//   }
//   if (selectedRole === "Student" && teamMem.role === "student") {
//     return true;
//   }
//   return false;
// });





//   const submit = async () => {
//     setIsSubmitDisabled(true);



//     const taskformData:Task ={
//       taskName: name,
//       taskDueDate: new Date().toISOString(),
//       taskDescription:description,
//       taskComments:comments,
//  }
//  try {
//     console.log("Submitting task data:", taskformData);

//     await addTask(taskformData)
//     console.log("Task successfully added to Firestore.");


//     setTimeout(() => {
//       Alert.alert("Success", "Data added successfully!", [
//         { text: "OK", onPress: resetForm },
//       ]);
//     }, 100); // Small delay to ensure alert displays properly

//         } catch (error) {
//           Alert.alert('Process failed! Error: ' + error);
//         } finally {
//           setIsSubmitDisabled(false);
//         }
//       };

//   const resetForm = () => {
//     setModalVisible(false);
//     setName('');
//     setDescription('');
//     setDueDate('');
//     setComments('');
//   };

//   const handlePickerChange = (value: string, field: string) => {
//     handleChange(value, field);
//     switch (field) {
//       case 'roleSelect':
//         setRole(value);
//         break;
//       case 'mentorSelect':
//         setMentorSelect(value);
//         break;
//       case 'inchargeSelect':
//         setInchargeSelect(value);
//         break;
//       case 'schoolSelect':
//         setSelectedSchool(value);
//         break;
//       case 'studentSelect':
//         setSelectedStudent(value);
//         break;
//     }
//   };


//   const handlePickerChanges = (itemValue: string) => {
//     setSelectedIncharge(itemValue); // Assuming you have a state setter for this
//   };
  
//   const showYours = () => {
//     // setUID(tempUid);
//     setRole('');
//     setSelectedStudent('');
//     setSelectedSchool('');
//     setMentorSelect('');
//     setInchargeSelect('');
//   };

//   const handleChange = (name: string, value: string) => {
//     switch (name) {
//       case 'mentorSelect':
//         setMentorSelect(value);
//         setUID(value);
//         break;
//       case 'inchargeSelect':
//         setInchargeSelect(value);
//         setUID(value);
//         break;
//       case 'schoolSelect':
//         setSelectedSchool(value);
//         break;
//       case 'studentSelect':
//         setSelectedStudent(value);
//         break;
//       case 'roleSelect':
//         setRole(value);
//         break;
//     }
//   };
  

//   return (
//     <ScrollView style={{ padding: 20 }}>
//       <Modal visible={modalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text>Name:</Text>
//             <TextInput value={name} onChangeText={setName} style={styles.input} />
//             <Text>Description:</Text>
//             <TextInput value={description} onChangeText={setDescription} style={styles.input} multiline />
//             <Text>Comments:</Text>
//             <TextInput value={comments} onChangeText={setComments} style={styles.input} multiline />
//             <Text>Due Date:</Text>
//             <TextInput value={dueDate} onChangeText={setDueDate} style={styles.input} />
//             <Pressable onPress={submit} style={styles.button}>
//               <Text style={styles.buttonText}>Add Task</Text>
//             </Pressable>
//             <Pressable onPress={() => setModalVisible(false)} style={styles.button}>
//               <Text style={styles.buttonText}>Close</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//       <View style={styles.buttonContainer}>

//       <Pressable onPress={() => setModalVisible(true)} style={styles.smallButton}>
//   <Text style={styles.buttonText}>Add Task</Text>
// </Pressable>
// <Pressable onPress={showYours} style={styles.smallButton}>
//   <Text style={styles.buttonText}>Show Yours</Text>
// </Pressable>
// </View>

// <View style={styles.headerContainer}>
//   <Text style={styles.headerText}>Tasks | Digital ATL</Text>
//   <View style={styles.line} />
// </View>



// {/* Dropdowns placed after the line */}
// <View style={styles.dropdownWrapper}>
//   <View style={styles.dropdownContainer}>
//     <Text style={styles.label}>Role:</Text>
//     <Picker
//       selectedValue={selectedRole}
//       style={styles.picker}
//       onValueChange={(itemValue) => setSelectedRole(itemValue)}
//     >
//       <Picker.Item label="Select Role" value="" />
//       <Picker.Item label="ATL Incharge" value="atl incharge" />

//       <Picker.Item label="Mentor" value="mentor" />
//       <Picker.Item label="Student" value="student" />
//     </Picker>
//   </View>
//   {/* {role === 'atlIncharge' && (
//             <>
//               <Text>ATL Incharge:</Text>
//               <Picker
//                 selectedValue={selectedIncharge}
//                 onValueChange={(itemValue: string, itemIndex: number) => handlePickerChanges(itemValue)}
//                 >
//       {inchargeData.map((incharge, index) => (
//         <Picker.Item
//           key={incharge.uid} // Use a unique identifier for the key
//           label={incharge.name}
//           value={incharge.uid}
//         />
//       ))}
//     </Picker>
//             </>
//           )} */}


//                                    {/* Conditional rendering of the second dropdown based on selectedRole */}
//                                    {selectedRole === "ATL-Incharge" && (
//                                 <select name="teamAssignSelect">
//                                 <option value="">-Select Incharge-</option>
//                                 {filteredTeamMems.map((teamMem, index) => {
//                                     return (
//                                     <option key={index} value={teamMem.email}>
//                                         {teamMem.name}
//                                     </option>
//                                     );
//                                 })}
//                                 </select>
//                             )}
//                                   {selectedRole === 'Mentor' && (
//         <View>
//           <Text>--Select Mentor--</Text>
//           <Picker
//             selectedValue=""
//             // onValueChange={(value) => onTeamMemberSelect(value)}
//           >
//             <Picker.Item label="--Select Mentor--" value="" />
//             {filteredTeamMems.map((teamMem, index) => (
//               <Picker.Item key={index} label={teamMem.name} value={teamMem.email} />
//             ))}
//           </Picker>
//         </View>
//       )}
//             {selectedRole === 'Student' && (
//         <View>
//           <Text>--Select Student--</Text>
//           <Picker
//             selectedValue=""
//             // onValueChange={(value) => onTeamMemberSelect(value)}
//           >
//             <Picker.Item label="--Select Student--" value="" />
//             {filteredTeamMems.map((teamMem, index) => (
//               <Picker.Item key={index} label={teamMem.name} value={teamMem.email} />
//             ))}
//           </Picker>
//         </View>
//       )}






//   <View style={styles.dropdownContainer}>
//     <Text style={styles.label}>Showing:</Text>
//     <Picker
//         selectedValue={showWhat}
//         style={styles.picker}
//         onValueChange={(value) => setShowWhat(value)}
//     >
//       <Picker.Item label="Ongoing Tasks" value="tasksNotDone" />
//       <Picker.Item label="Completed Tasks" value="tasksDone" />
//     </Picker>
//       <View>
//         <Text>{showWhat === "tasksDone" ? "Completed Tasks" : "Ongoing Tasks"}</Text>
//         {userData?.tasks && userData.tasks.length > 0 ? (
//           userData.tasks
//             .filter(task => (showWhat === "tasksDone" ? task.completed : !task.completed))
//             .map((task) =>  (     <ReportBox key={task.id} task={{ ref: { path: task.ref } }} done={showWhat === 'tasksDone'} />
//           ))
//       ) : (
//           <TouchableOpacity>
//                   <Pressable onPress={() => setModalVisible(true)} style={styles.smallButton}>
//   <Text style={styles.buttonText}>Add Task</Text>
// </Pressable>

//           </TouchableOpacity>
//         )}
//       </View>


//   </View>
//   <View style={styles.line} />

// </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     margin: 20,
//     borderRadius: 10,
//   },
//   input: {
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//     padding: 5,
//     marginBottom: 15,
//   },
//   buttonContainer: {
//     flexDirection: 'row', // Aligns children in a row
//     position: 'absolute',
//     top: 10, // Adjust vertical positioning
//     right: 10, // Align to the right edge
//   },

//   smallButton: {
//     backgroundColor: '#26a69a',
//     paddingVertical: 6, // Smaller height
//     paddingHorizontal: 10, // Smaller width
//     borderRadius: 5,
//     marginHorizontal: 5, // Space between buttons
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   button: {
//     backgroundColor: '#26a69a',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     flex: 1, // Ensure buttons take up equal space
//     marginHorizontal: 5, // Add spacing between buttons
//   },

//   buttonText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',

//   },
//   headerContainer: {
//     marginTop: 20, // Space from the top
//     width: '100%', // Ensure it takes full width
//     paddingHorizontal: 10, // Add some padding to the sides
//   },
//   headerText: {
//     fontSize: 24, // Large text for the header
//     fontWeight: 'bold',
//     color: '#333', // Dark gray color
//     textAlign: 'left', // Align text to the left

//   },
//   line: {
//     marginTop: 5, // Space between the text and the line
//     height: 2, // Thickness of the line
//     backgroundColor: 'black', // Line color matching buttons
//     width: '100%', // Line spans full width
//   },
//   picker: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     backgroundColor: '#f5f5f5',
//   },
//   dropdownWrapper: {
//     marginTop: 10, // Spacing below the line
//     paddingHorizontal: 15, // Same horizontal padding as header
//     flexDirection: 'column', // Stack dropdowns vertically
//   },
//   dropdownContainer: {
//     marginBottom: 10, // Space between dropdowns
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5, // Space between label and dropdown
//   },




// });


// export default TasksComponent;






















// import React, { useState,useEffect } from 'react';
// import {
//   Text,
//   View,
//   TextInput,
//   Pressable,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   Modal,
//   StyleSheet,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
// import { db } from '@/firebase/firestore';
// import ReportBox from './components/Reportbox';
// import { addTask } from '@/firebase/firestore';
// import type { Task } from '@/firebase/firestore';



// // interface TaskData {
// //   taskDueDate: string;
// // }



// interface UserData {
//   uid?: string;
//   name?: string;
//   email: string;


//   tasks?: TaskData[];
//   [key: string]: any;

// }
// interface InchargeData {
//   uid: string;
//   name: string;
// }





// interface AtlUserData {
//   id: string;
//   role: string;
//   inchargeData?: InchargeData[]; // Assuming inchargeData is part of AtlUserData
//   uid: string;
//   name:string;

//   // Add any other properties needed here
// }

// type TaskData = {
//   taskName: string;
//   taskDueDate: string;
//   taskDescription: string; 
//   taskComments: string;
//   completed: boolean;
//   id: string;
//   ref: { path: string }; // Modified to match expected type




// }

// const Tasks = async (name: string, description: string, dueDate: string, someFlag: boolean, comments: string) => {


// // const Tasks = async (name: string, description: string, dueDate: string, someFlag: boolean, comments: string) => {
// }

// function TasksComponent() {
//   const [userData, setUserData] = useState<UserData>({});

//   const [modalVisible, setModalVisible] = useState(false);
//   const [uid, setUID] = useState<string | undefined>();
//   const [role, setRole] = useState<string>('');
//   const [mentorData, setMentorData] = useState<any[]>([]);
//   const [inchargeData, setInchargeData] = useState<AtlUserData[]>([]);
//   const [schoolData, setSchoolData] = useState<any[]>([]);
//   const [mentorSelect, setMentorSelect] = useState<string>('');
//   const [inchargeSelect, setInchargeSelect] = useState<string>('');
//   const [selectedSchool, setSelectedSchool] = useState<string>('');
//   const [studentData, setStudentData] = useState<any[]>([]);
//   const [selectedStudent, setSelectedStudent] = useState<string>('');
//   const [name, setName] = useState<string>('');
//   const [description, setDescription] = useState<string>('');
//   const [dueDate, setDueDate] = useState<string>('');
//   const [showWhat, setShowWhat] = useState<string>("tasksNotDone");
//   const [comments, setComments] = useState<string>('');
//   const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
//   const [selectedRole, setSelectedRole] = useState('');
//   const [selectedShowing, setSelectedShowing] = useState('');
//   // const [userData, setUserData] = useState<UserData | undefined>(undefined);
//   const [selectedIncharge, setSelectedIncharge] = useState<string>('');
//   const [altUsers, setAltUsers] = useState<UserData[]>([]);

//   // const [inchargeData, setInchargeData] = useState<InchargeData[]>([]);
//   // const handlePickerChange = (value: string) => {
//   //   setSelectedIncharge(value);
//   // };
//   const [popupOpen, setPopupOpen] = useState<boolean>(false);
//   const [teamMems, setTeamMems] = useState<any[]>([]);


//   useEffect(() => {
//     const fetchInchargeData = async () => {
//       console.log("fetchInchargeData:", fetchInchargeData);  // Logs whenever filteredTeamMems changes

//       const querySnapshot = await getDocs(collection(db, 'atlUsers'));
//       const inchargeData: InchargeData[] = querySnapshot.docs.map((doc) => ({
//         uid: doc.id,      // Get the document ID
//         name: doc.data().name, // Get the name field
//     }));
//   // setInchargeData(data);
//         // Transform InchargeData to AtlUserData
//         const atlUserData: AtlUserData[] = inchargeData.map((incharge) => ({

          
//           id: incharge.uid,   // Map uid to id
//           role: 'atlIncharge', // Assign a default role; adjust as needed
//           uid: incharge.uid,   // Include uid in the new structure
//           name: incharge.name, // Include name in the new structure
          
//       }));
//       console.log("Original ATL Users Data:", atlUserData);


//       setInchargeData(atlUserData); // Set the transformed data
//   };

//   fetchInchargeData();
// }, []);




// const filteredTeamMems = teamMems.filter((teamMem) => {
//   // console.log("Filtered Team Members:", filteredTeamMems);  // Logs whenever filteredTeamMems changes

//   if (selectedRole === "atlIncharge" && teamMem.role === "atlIncharge") {
//     return true;
//     console.log("Filtered Team Members:", filteredTeamMems); // Debug log

//   }
//   if (selectedRole === "Mentor" && teamMem.role === "mentor") {
//     return true;
//   }
//   if (selectedRole === "Student" && teamMem.role === "student") {
//     return true;
//     console.log("Filtered Team Members:", filteredTeamMems);  // Logs whenever filteredTeamMems changes

//   }
//   return false;
// });





//   const submit = async () => {
//     setIsSubmitDisabled(true);



//     const taskformData:Task ={
//       taskName: name,
//       taskDueDate: new Date().toISOString(),
//       taskDescription:description,
//       taskComments:comments,
//  }
//  try {
//     console.log("Submitting task data:", taskformData);

//     await addTask(taskformData)
//     console.log("Task successfully added to Firestore.");


//     setTimeout(() => {
//       Alert.alert("Success", "Data added successfully!", [
//         { text: "OK", onPress: resetForm },
//       ]);
//     }, 100); // Small delay to ensure alert displays properly

//         } catch (error) {
//           Alert.alert('Process failed! Error: ' + error);
//         } finally {
//           setIsSubmitDisabled(false);
//         }
//       };

//   const resetForm = () => {
//     setModalVisible(false);
//     setName('');
//     setDescription('');
//     setDueDate('');
//     setComments('');
//   };

//   const handlePickerChange = (value: string, field: string) => {
//     handleChange(value, field);
//     switch (field) {
//       case 'roleSelect':
//         setRole(value);
//         break;
//       case 'mentorSelect':
//         setMentorSelect(value);
//         break;
//       case 'inchargeSelect':
//         setInchargeSelect(value);
//         break;
//       case 'schoolSelect':
//         setSelectedSchool(value);
//         break;
//       case 'studentSelect':
//         setSelectedStudent(value);
//         break;
//     }
//   };


//   const handlePickerChanges = (itemValue: string) => {
//     setSelectedIncharge(itemValue); // Assuming you have a state setter for this
//   };
  
//   const showYours = () => {
//     // setUID(tempUid);
//     setRole('');
//     setSelectedStudent('');
//     setSelectedSchool('');
//     setMentorSelect('');
//     setInchargeSelect('');
//   };

//   const handleChange = (name: string, value: string) => {
//     switch (name) {
//       case 'mentorSelect':
//         setMentorSelect(value);
//         setUID(value);
//         break;
//       case 'inchargeSelect':
//         setInchargeSelect(value);
//         setUID(value);
//         break;
//       case 'schoolSelect':
//         setSelectedSchool(value);
//         break;
//       case 'studentSelect':
//         setSelectedStudent(value);
//         break;
//       case 'roleSelect':
//         setRole(value);
//         break;
//     }
//   };


  
  

//   return (
//     <ScrollView style={{ padding: 20 }}>
//       <Modal visible={modalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text>Name:</Text>
//             <TextInput value={name} onChangeText={setName} style={styles.input} />
//             <Text>Description:</Text>
//             <TextInput value={description} onChangeText={setDescription} style={styles.input} multiline />
//             <Text>Comments:</Text>
//             <TextInput value={comments} onChangeText={setComments} style={styles.input} multiline />
//             <Text>Due Date:</Text>
//             <TextInput value={dueDate} onChangeText={setDueDate} style={styles.input} />
//             <Pressable onPress={submit} style={styles.button}>
//               <Text style={styles.buttonText}>Add Task</Text>
//             </Pressable>
//             <Pressable onPress={() => setModalVisible(false)} style={styles.button}>
//               <Text style={styles.buttonText}>Close</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//       <View style={styles.buttonContainer}>

//       <Pressable onPress={() => setModalVisible(true)} style={styles.smallButton}>
//   <Text style={styles.buttonText}>Add Task</Text>
// </Pressable>
// <Pressable onPress={showYours} style={styles.smallButton}>
//   <Text style={styles.buttonText}>Show Yours</Text>
// </Pressable>
// </View>

// <View style={styles.headerContainer}>
//   <Text style={styles.headerText}>Tasks | Digital ATL</Text>
//   <View style={styles.line} />
// </View>



// {/* Dropdowns placed after the line */}
// <View style={styles.dropdownWrapper}>
//   <View style={styles.dropdownContainer}>
//     <Text style={styles.label}>Role:</Text>
//     <Picker
//       selectedValue={selectedRole}
//       style={styles.picker}
//       onValueChange={(itemValue) => setSelectedRole(itemValue)}
//     >
//       <Picker.Item label="Select Role" value="" />
//       <Picker.Item label="ATL Incharge" value="atl incharge" />

//       <Picker.Item label="Mentor" value="mentor" />
//       <Picker.Item label="Student" value="student" />
//     </Picker>
//   </View>

 



//   {selectedRole === "atl incharge" && (
//   <>
//     {console.log("Filtered Team Members:", altUsers)}
//     <View style={styles.dropdownContainer}>
//       <Text style={styles.label}>-Select Incharge-</Text>
//       <Picker
//         selectedValue={selectedIncharge}
//         onValueChange={(itemValue) => setSelectedIncharge(itemValue)}
//         style={styles.picker}
//       >
//         <Picker.Item label="-Select Incharge-" value="" />
//                 console.log("atlincharges", altUsers)


//         {altUsers.length > 0 ? (
//           altUsers.map((user, index) => (
            
//             <Picker.Item
//               key={index}
//               label={user.name || "Unnamed"}
//               value={user.email || ""}
//             />
//           ))
//         ) : (
//           <Picker.Item label="No Incharge Available" value="" />
//         )}
//       </Picker>
//     </View>
//   </>
// )}
// {selectedRole === "Mentor" && (
//   <View>
//     <Text>--Select Mentor--</Text>
//     <Picker
//       selectedValue=""
//       // onValueChange={(value) => onTeamMemberSelect(value)}
//     >
//       <Picker.Item label="--Select Mentor--" value="" />
//       {filteredTeamMems.map((teamMem, index) => {
//         console.log(`Rendering Mentor Option - Index: ${index}, Name: ${teamMem.name}, Email: ${teamMem.email}`);
//         return (
//           <Picker.Item key={index} label={teamMem.name} value={teamMem.email} />
//         );
//       })}
//     </Picker>
//   </View>
// )}

// {selectedRole === "Student" && (
//   <View>
//     <Text>--Select Student--</Text>
//     <Picker
//       selectedValue=""
//       // onValueChange={(value) => onTeamMemberSelect(value)}
//     >
//       <Picker.Item label="--Select Student--" value="" />
//       {filteredTeamMems.map((teamMem, index) => {
//         console.log(`Rendering Student Option - Index: ${index}, Name: ${teamMem.name}, Email: ${teamMem.email}`);
//         return (
//           <Picker.Item key={index} label={teamMem.name} value={teamMem.email} />
//         );
//       })}
//     </Picker>
//   </View>
// )}





//   <View style={styles.dropdownContainer}>
//     <Text style={styles.label}>Showing:</Text>
//     <Picker
//         selectedValue={showWhat}
//         style={styles.picker}
//         onValueChange={(value) => setShowWhat(value)}
//     >
//       <Picker.Item label="Ongoing Tasks" value="tasksNotDone" />
//       <Picker.Item label="Completed Tasks" value="tasksDone" />
//     </Picker>
//       <View>
//         <Text>{showWhat === "tasksDone" ? "Completed Tasks" : "Ongoing Tasks"}</Text>
//         {userData?.tasks && userData.tasks.length > 0 ? (
//           userData.tasks
//             .filter(task => (showWhat === "tasksDone" ? task.completed : !task.completed))
//             .map((task) =>  (     <ReportBox key={task.id} task={{ ref: { path: task.ref } }} done={showWhat === 'tasksDone'} />
//           ))
//       ) : (
//           <TouchableOpacity>
//                   <Pressable onPress={() => setModalVisible(true)} style={styles.smallButton}>
//   <Text style={styles.buttonText}>Add Task</Text>
// </Pressable>

//           </TouchableOpacity>
//         )}
//       </View>


//   </View>
//   <View style={styles.line} />

// </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     margin: 20,
//     borderRadius: 10,
//   },
//   input: {
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//     padding: 5,
//     marginBottom: 15,
//   },
//   buttonContainer: {
//     flexDirection: 'row', // Aligns children in a row
//     position: 'absolute',
//     top: 10, // Adjust vertical positioning
//     right: 10, // Align to the right edge
//   },

//   smallButton: {
//     backgroundColor: '#26a69a',
//     paddingVertical: 6, // Smaller height
//     paddingHorizontal: 10, // Smaller width
//     borderRadius: 5,
//     marginHorizontal: 5, // Space between buttons
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   button: {
//     backgroundColor: '#26a69a',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     flex: 1, // Ensure buttons take up equal space
//     marginHorizontal: 5, // Add spacing between buttons
//   },

//   buttonText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',

//   },
//   headerContainer: {
//     marginTop: 20, // Space from the top
//     width: '100%', // Ensure it takes full width
//     paddingHorizontal: 10, // Add some padding to the sides
//   },
//   headerText: {
//     fontSize: 24, // Large text for the header
//     fontWeight: 'bold',
//     color: '#333', // Dark gray color
//     textAlign: 'left', // Align text to the left

//   },
//   line: {
//     marginTop: 5, // Space between the text and the line
//     height: 2, // Thickness of the line
//     backgroundColor: 'black', // Line color matching buttons
//     width: '100%', // Line spans full width
//   },
//   picker: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     backgroundColor: '#f5f5f5',
//   },
//   dropdownWrapper: {
//     marginTop: 10, // Spacing below the line
//     paddingHorizontal: 15, // Same horizontal padding as header
//     flexDirection: 'column', // Stack dropdowns vertically
//   },
//   dropdownContainer: {
//     marginBottom: 10, // Space between dropdowns
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5, // Space between label and dropdown
//   },




// });


// export default TasksComponent;








// import React, { useState,useEffect } from 'react';
// import {
//   Text,
//   View,
//   TextInput,
//   Pressable,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   Modal,
//   StyleSheet,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { collection, doc, getDocs, onSnapshot, query, where ,Firestore,DocumentData,QueryDocumentSnapshot,} from 'firebase/firestore';
// import { db } from '@/firebase/firestore';

// import ReportBox from './components/Reportbox';
// import { addTask,taskAssign } from '@/firebase/firestore';
// import type { student, Task } from '@/firebase/firestore';



// // interface TaskData {
// //   taskDueDate: string;
// // }



// interface UserData {
//   uid?: string;
//   name?: string;
//   email: string;


//   tasks?: TaskData[];
//   [key: string]: any;
//   isCompleted: boolean;
//   ref?: string;


// }
// interface InchargeData {
//   uid: string;
//   name: string;
//   email: string;

// }
// interface StudentData {
//   uid: string;
//   name: string;
//   email: string;

// }

// // types.ts
// export interface SchoolData {
//   id: string;
//   name: string; // Add other fields as per your Firestore data structure
//   // Add any other properties as needed
// }






// interface AtlUserData {
//   id: string;
//   role: string;
//   inchargeData?: InchargeData[]; // Assuming inchargeData is part of AtlUserData
//   uid: string;
//   name:string;

//   // Add any other properties needed here
// }

// type TaskData = {
//   taskName: string;
//   taskDueDate: string;
//   taskDescription: string; 
//   taskComments: string;
//   completed: boolean;
//   id: string;
//   ref: { path: string }; // Modified to match expected type
//   role: string; // Define the type based on your data (string, enum, etc.)





// }

// const Tasks = async (name: string, description: string, dueDate: string, someFlag: boolean, comments: string) => {


// // const Tasks = async (name: string, description: string, dueDate: string, someFlag: boolean, comments: string) => {
// }

// function TasksComponent() {
//   const [userData, setUserData] = useState<UserData | null>(null); // Example initialization

//   const [modalVisible, setModalVisible] = useState(false);
//   const [uid, setUID] = useState<string | undefined>();
//   const [role, setRole] = useState<string>('');
//   const [mentorData, setMentorData] = useState<any[]>([]);
//   // const [inchargeData, setInchargeData] = useState<AtlUserData[]>([]);
//   const [schoolData, setSchoolData] = useState<any[]>([]);
//   const [mentorSelect, setMentorSelect] = useState<string>('');
//   const [inchargeSelect, setInchargeSelect] = useState<string>('');
//   const [selectedSchool, setSelectedSchool] = useState<string>('');
//   const [studentData, setStudentData] = useState<any[]>([]);
//   const [selectedStudent, setSelectedStudent] = useState<string>('');
//   const [name, setName] = useState<string>('');
//   const [description, setDescription] = useState<string>('');
//   const [dueDate, setDueDate] = useState<string>('');
//   const [showWhat, setShowWhat] = useState<string>("tasksNotDone");
//   const [comments, setComments] = useState<string>('');
//   const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
//   const [selectedRole, setSelectedRole] = useState('');
//   const [selectedShowing, setSelectedShowing] = useState('');
//   // const [userData, setUserData] = useState<UserData | undefined>(undefined);
//   const [inchargeData, setInchargeData] = useState<InchargeData[]>([]);
//   const [altUsers, setAltUsers] = useState<UserData[]>([]);
//   const [selectedIncharge, setSelectedIncharge] = useState<string>('');

//   const [teamMembers, setTeamMembers] = useState<{ id: string; email: string }[]>([]); // State to hold team members
//   const [selectedMember, setSelectedMember] = useState<string>(''); // State to store selected member


//   // const [inchargeData, setInchargeData] = useState<InchargeData[]>([]);
//   // const handlePickerChange = (value: string) => {
//   //   setSelectedIncharge(value);
//   // };
//   const [popupOpen, setPopupOpen] = useState<boolean>(false);
//   const [teamMems, setTeamMems] = useState<any[]>([]);
//   const [data, setData] = useState<Record<string, any>>({});
//   const [assignToOpen, setAssignToOpen] = useState(false);


//   // Fetch ATL incharge data from Firestore
//   useEffect(() => {
//     const fetchInchargeData = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, 'atlUsers'));

//         // Categorize data into Incharge and Mentor arrays
//         const inchargeArray: InchargeData[] = []; // Change this to InchargeData[]
//         const mentorArray: UserData[] = [];

//         querySnapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
//           const userData = doc.data() as UserData; // Cast data to UserData
//           const userEntry: InchargeData = {
//             uid: doc.id, // Ensure uid is always a string
//             name: userData.name || 'Unnamed',
//             email: userData.email || '',
//           };

//           // Push to respective arrays based on the role
//           if (userData.role === 'atlIncharge') {
//             inchargeArray.push(userEntry); // Add to InchargeArray
//           } else if (userData.role === 'mentor') {
//             mentorArray.push(userData); // Directly push userData for mentors
//           }
//         });

//         // Update state with fetched data
//         setInchargeData(inchargeArray);
//         setMentorData(mentorArray);

//         console.log('Fetched Incharge Data:', inchargeArray);
//         console.log('Fetched Mentor Data:', mentorArray);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     fetchInchargeData();
//   }, []);

//   // Fetch and listen to School data from Firestore
//   useEffect(() => {
//     const qSchool = query(collection(db, "schoolData"));
//     onSnapshot(qSchool, (snap) => {
//       const schoolArray: SchoolData[] = snap.docs.map(doc => ({
//         ...doc.data(),
//         id: doc.id // Add Firestore document ID to each school object
//       })) as SchoolData[];

//       setSchoolData(schoolArray);
//       console.log('Fetched School Data:', schoolArray);
//     });
//   }, []);

//   // Fetch Student data based on the selected school
//   useEffect(() => {
//     if (!selectedSchool) return;

//     const q = query(
//       collection(db, "studentData"),
//       where("school", "==", selectedSchool)
//     );

//     onSnapshot(q, (snap) => {
//       const studentArray: StudentData[] = snap.docs.map(doc => {
//         const data = doc.data() as Partial<StudentData>; // Use Partial to allow missing properties
//         return {
//           id: doc.id,
//           uid: data.uid ?? '', // Provide a default if uid may be missing
//           name: data.name ?? 'Unknown', // Default for missing name
//           email: data.email ?? '', // Default for missing email
//           // Add other properties with defaults as needed
//         };
//       });
  
//         setStudentData(studentArray);
//       console.log('Fetched Student Data for Selected School:', studentArray);
//     });
//   }, [selectedSchool]);


  














//   useEffect(() => {
//     const fetchStudentData = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, 'atlUsers')); // or 'students' if they are in a separate collection
  
//         const studentArray: StudentData[] = []; // Array to store student data
  
//         querySnapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
//           const studentData = doc.data() as UserData;
//           const studentEntry: StudentData = {  // Use a different name here
//             uid: doc.id,
//             name: studentData.name || 'Unnamed',
//             email: studentData.email || '',
//           };
  
//           // Check if the role is 'student' and push to studentArray
//           if (studentData.role === 'student') {
//             studentArray.push(studentEntry);
//           }
//         });
  
//         // Update state with fetched student data
//         setStudentData(studentArray);
  
//         console.log('Fetched Student Data:', studentArray);
//       } catch (error) {
//         console.error('Error fetching student data:', error);
//       }
//     };
  
//     fetchStudentData();
//   }, []);
  

// const filteredAltUsers = altUsers.filter((altUser) => {
//   if (selectedRole === "atl incharge" && altUser.role === "atl incharge") {
//     return true;
//   }
//   if (selectedRole === "Mentor" && altUser.role === "mentor") {
//     return true;
//   }
//   if (selectedRole === "Student" && altUser.role === "student") {
//     return true;
//   }
//   return false;
// });

// // Log the filtered results for debugging
// console.log("Filtered ALT Users:", filteredAltUsers);




//   const submit = async () => {
//     setIsSubmitDisabled(true);



//     const taskformData:Task ={
//       taskName: name,
//       taskDueDate: new Date().toISOString(),
//       taskDescription:description,
//       taskComments:comments,
//       completed: false, // or the desired default value
//       id: "", // provide a unique ID, e.g., generated using UUID or Firestore's auto-generated ID
//       // ref: { path: "" }, // or specify the Firestore document path if available
//       role: "" // specify the role, e.g., "Admin", "User", etc.

//  }
//  try {
//     console.log("Submitting task data:", taskformData);

//     await addTask(taskformData)
//     console.log("Task successfully added to Firestore.");


//     setTimeout(() => {
//       Alert.alert("Success", "Data added successfully!", [
//         { text: "OK", onPress: resetForm },
//       ]);
//     }, 100); // Small delay to ensure alert displays properly

//         } catch (error) {
//           Alert.alert('Process failed! Error: ' + error);
//         } finally {
//           setIsSubmitDisabled(false);
//         }
//       };

//   const resetForm = () => {
//     setModalVisible(false);
//     setName('');
//     setDescription('');
//     setDueDate('');
//     setComments('');
//   };

//   const handlePickerChange = (value: string, field: string) => {
//     handleChange(value, field);
//     switch (field) {
//       case 'roleSelect':
//         setRole(value);
//         break;
//       case 'mentorSelect':
//         setMentorSelect(value);
//         break;
//       case 'inchargeSelect':
//         setInchargeSelect(value);
//         break;
//       case 'schoolSelect':
//         setSelectedSchool(value);
//         break;
//       case 'studentSelect':
//         setSelectedStudent(value);
//         break;
//     }
//   };


//   const handlePickerChanges = (itemValue: string) => {
//     setSelectedIncharge(itemValue); // Assuming you have a state setter for this
//   };
  
//   const showYours = () => {
//     // setUID(tempUid);
//     setRole('');
//     setSelectedStudent('');
//     setSelectedSchool('');
//     setMentorSelect('');
//     setInchargeSelect('');
//   };

//   const handleChange = (name: string, value: string) => {
//     switch (name) {
//       case 'mentorSelect':
//         setMentorSelect(value);
//         setUID(value);
//         break;
//       case 'inchargeSelect':
//         setInchargeSelect(value);
//         setUID(value);
//         break;
//       case 'schoolSelect':
//         setSelectedSchool(value);
//         break;
//       case 'studentSelect':
//         setSelectedStudent(value);
//         break;
//       case 'roleSelect':
//         setRole(value);
//         break;
//     }
//   };
//   const filteredTa2sks = userData?.tasks?.filter(task =>
//     showWhat === "tasksDone" ? task.completed : !task.completed

    
//   ) || [];


//   const filteredTasks = userData?.tasks?.filter(task =>
//     (showWhat === "tasksDone" ? task.completed : !task.completed) &&
//     (selectedRole ? task.role === selectedRole : true)
//   ) || [];

// // Log to check values
// console.log("Selected showWhat:", showWhat);
// console.log("Selected role:", selectedRole);
// console.log("Filtered tasks based on showWhat and selectedRole:", filteredTasks);



  
// const markComplete = async (id: string): Promise<void> => {
//   console.log(`Marking task ${id} as complete`);
// };

// // Function to handle the edit button click
// const handleEditClick = (id: string): void => {
  
//   console.log(`Edit button clicked for task ${id}`);
// };

// // Array of team members (populate with actual data if available)
// const filteredTeamMems: string[] = [];

// // Callback for selecting a team member
// const onTeamMemberSelect = (member: string): void => {
//   console.log(`Selected team member: ${member}`);
// };

// // Callback for selecting an incharge
// const onInchargeSelect = (incharge: string): void => {
//   console.log(`Selected incharge: ${incharge}`);
// };

// const assigntask = async () => {
//   if (!selectedMember) {
//       Alert.alert('Please select a team member.');
//       return;
//   }
//   const member = teamMembers.find(mem => mem.email === selectedMember); // Find the selected member
//   if (member) {
//       await taskAssign(data.id, member.id); // Replace 'data.id' with the actual task ID
//       Alert.alert('Assigned!!');
//       setAssignToOpen(false);
//   } else {
//       Alert.alert('Member not found.');
//   }
// };



//   return (
//     <ScrollView style={{ padding: 20 }}>
//       <Modal visible={modalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text>Name:</Text>
//             <TextInput value={name} onChangeText={setName} style={styles.input} />
//             <Text>Description:</Text>
//             <TextInput value={description} onChangeText={setDescription} style={styles.input} multiline />
//             <Text>Comments:</Text>
//             <TextInput value={comments} onChangeText={setComments} style={styles.input} multiline />
//             <Text>Due Date:</Text>
//             <TextInput value={dueDate} onChangeText={setDueDate} style={styles.input} />
//             <Pressable onPress={submit} style={styles.button}>
//               <Text style={styles.buttonText}>Add Task</Text>
//             </Pressable>
//             <Pressable onPress={() => setModalVisible(false)} style={styles.button}>
//               <Text style={styles.buttonText}>Close</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//       <View style={styles.buttonContainer}>

//       <Pressable onPress={() => setModalVisible(true)} style={styles.smallButton}>
//   <Text style={styles.buttonText}>Add Task</Text>
// </Pressable>
// <Pressable onPress={showYours} style={styles.smallButton}>
//   <Text style={styles.buttonText}>Show Yours</Text>
// </Pressable>
// </View>

// <View style={styles.headerContainer}>
//   <Text style={styles.headerText}>Tasks | Digital ATL</Text>
//   <View style={styles.line} />
// </View>



// {/* Dropdowns placed after the line */}
// <View style={styles.dropdownWrapper}>
//   <View style={styles.dropdownContainer}>
//     <Text style={styles.label}>Role:</Text>
//     <Picker
//       selectedValue={selectedRole}
//       style={styles.picker}
//       onValueChange={(itemValue) => setSelectedRole(itemValue)}
//     >
//       <Picker.Item label="Select Role" value="" />
//       <Picker.Item label="ATL Incharge" value="atl incharge" />

//       <Picker.Item label="Mentor" value="mentor" />
//       <Picker.Item label="Student" value="student" />
//     </Picker>
//   </View>

 



//   {selectedRole === "atl incharge" && (

// <Picker
//     selectedValue={selectedIncharge}
//     onValueChange={(itemValue) => setSelectedIncharge(itemValue)}
//   >
//     <Picker.Item label="-Select Incharge-" value="" />
//     {inchargeData.length > 0 ? (
//       inchargeData.map((user) => (
//         <Picker.Item key={user.uid} label={user.name} value={user.email} />
//       ))
//     ) : (
//       <Picker.Item label="No Incharge Available" value="" />
//     )}
//   </Picker>

//   )}

// {selectedRole === "mentor" && (
//   <Picker
//     selectedValue={selectedIncharge}
//     onValueChange={(itemValue) => setSelectedIncharge(itemValue)}
//   >
//     <Picker.Item label="-Select mentor-" value="" />
//     {mentorData.length > 0 ? (
//       mentorData.map((user) => (
//         <Picker.Item key={user.uid} label={user.name} value={user.email} />
//       ))
//     ) : (
//       <Picker.Item label="No mentor Available" value="" />
//     )}
//   </Picker>

//   )}

// {selectedRole === "student" && (
//   <Picker
//   selectedValue={selectedIncharge}
//   onValueChange={(itemValue) => setSelectedIncharge(itemValue)}
// >
//   <Picker.Item label="-Select student-" value="" />
//   {studentData.length > 0 ? (
//     studentData.map((user) => (
//       <Picker.Item key={user.uid} label={user.name} value={user.email} />
//     ))
//   ) : (
//     <Picker.Item label="No student  Available" value="" />
//   )}
// </Picker>










// )}





//   <View style={styles.dropdownContainer}>
//     <Text style={styles.label}>Showing:</Text>
//     <Picker
//         selectedValue={showWhat}
//         style={styles.picker}
//         onValueChange={(value) => setShowWhat(value)}
//     >
//       <Picker.Item label="Ongoing Tasks" value="tasksNotDone" />
//       <Picker.Item label="Completed Tasks" value="tasksDone" />
//     </Picker>
//       <View>
//         <Text>{showWhat === "tasksDone" ? "Completed Tasks" : "Ongoing Tasks"}</Text>
//         {userData?.tasks && userData.tasks.length > 0 ? (
// userData.tasks
// .filter(filteredTasks =>
//     (showWhat === "tasksDone" ? filteredTasks.completed : !filteredTasks.completed) &&
//     (selectedRole ? filteredTasks.role === selectedRole : true)
// )
//              .map((task) =>  (    
//               <ReportBox
//               key={task.id}
//               task={{ ref: task.ref }}
//               role={task.role} // Ensure task.role exists and is a string
//               data={task} // Pass the entire task as `data`, which should be of type `TaskData`
//               markComplete={(id) => markComplete(id)} // Provide your `markComplete` function
//               handleEditClick={() => handleEditClick(task.id)} // Updated line
//               done={task.completed} // Assuming `task.completed` is a boolean
//               filteredTeamMems={[]} // Pass the appropriate array here
//               onTeamMemberSelect={(member) => console.log(member)} // Define this callback as needed
//               onInchargeSelect={(incharge) => console.log(incharge)} // Define this callback as needed
            
//              />

//           ))
//       ) : (

//           <TouchableOpacity>
//                   <Pressable onPress={() => setModalVisible(true)} style={styles.smallButton}>
//   <Text style={styles.buttonText}>Add Task</Text>
// </Pressable>

//           </TouchableOpacity>
//         )}
//       </View>


//   </View>
//   <View style={styles.line} />
  

// </View>
// <View>
// <Pressable style={styles.button} onPress={taskAssign}>
//                 <Text style={styles.buttonText}>Assign Task</Text>
//             </Pressable>
//             </View>



//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     margin: 20,
//     borderRadius: 10,
//   },
//   input: {
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//     padding: 5,
//     marginBottom: 15,
//   },
//   buttonContainer: {
//     flexDirection: 'row', // Aligns children in a row
//     position: 'absolute',
//     top: 10, // Adjust vertical positioning
//     right: 10, // Align to the right edge
//   },

//   smallButton: {
//     backgroundColor: '#26a69a',
//     paddingVertical: 6, // Smaller height
//     paddingHorizontal: 10, // Smaller width
//     borderRadius: 5,
//     marginHorizontal: 5, // Space between buttons
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   button: {
//     backgroundColor: '#26a69a',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     flex: 1, // Ensure buttons take up equal space
//     marginHorizontal: 5, // Add spacing between buttons
//   },

//   buttonText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',

//   },
//   headerContainer: {
//     marginTop: 20, // Space from the top
//     width: '100%', // Ensure it takes full width
//     paddingHorizontal: 10, // Add some padding to the sides
//   },
//   headerText: {
//     fontSize: 24, // Large text for the header
//     fontWeight: 'bold',
//     color: '#333', // Dark gray color
//     textAlign: 'left', // Align text to the left

//   },
//   line: {
//     marginTop: 5, // Space between the text and the line
//     height: 2, // Thickness of the line
//     backgroundColor: 'black', // Line color matching buttons
//     width: '100%', // Line spans full width
//   },
//   picker: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     backgroundColor: '#f5f5f5',
//   },
//   dropdownWrapper: {
//     marginTop: 10, // Spacing below the line
//     paddingHorizontal: 15, // Same horizontal padding as header
//     flexDirection: 'column', // Stack dropdowns vertically
//   },
//   dropdownContainer: {
//     marginBottom: 10, // Space between dropdowns
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5, // Space between label and dropdown
//   },




// });


// export default TasksComponent;







import React, { useState,useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Button,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, doc, getDocs, onSnapshot, query, where ,Firestore,DocumentData,QueryDocumentSnapshot,} from 'firebase/firestore';
import { db } from '@/firebase/firestore';

import ReportBox from './components/Reportbox';
import { addTask,taskAssign } from '@/firebase/firestore';
import type { student, Task } from '@/firebase/firestore';
interface UserData {
  uid?: string;
  name?: string;
  email: string;
 tasks?: TaskData[];
  [key: string]: any;
  isCompleted: boolean;
  ref?: string;
}
interface InchargeData {
  uid: string;
  name: string;
  email: string;

}
interface StudentData {
  uid: string;
  name: string;
  email: string;

}

// types.ts
export interface SchoolData {
  id: string;
  name: string; // Add other fields as per your Firestore data structure
  // Add any other properties as needed
}
interface AtlUserData {
  id: string;
  role: string;
  inchargeData?: InchargeData[]; // Assuming inchargeData is part of AtlUserData
  uid: string;
  name:string;

  // Add any other properties needed here
}

type TaskData = {
  taskName: string;
  taskDueDate: string;
  taskDescription: string; 
  taskComments: string;
  completed: boolean;
  id: string;
  ref: { path: string }; // Modified to match expected type
  role: string; // Define the type based on your data (string, enum, etc.)
}
const Tasks = async (name: string, description: string, dueDate: string, someFlag: boolean, comments: string) => {
}
function TasksComponent() {
  const [userData, setUserData] = useState<UserData | null>(null); // Example initialization
  const [modalVisible, setModalVisible] = useState(false);
  const [uid, setUID] = useState<string | undefined>();
  const [role, setRole] = useState<string>('');
  const [mentorData, setMentorData] = useState<any[]>([]);
  const [schoolData, setSchoolData] = useState<any[]>([]);
  const [mentorSelect, setMentorSelect] = useState<string>('');
  const [inchargeSelect, setInchargeSelect] = useState<string>('');
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [studentData, setStudentData] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [showWhat, setShowWhat] = useState<string>("tasksNotDone");
  const [comments, setComments] = useState<string>('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedShowing, setSelectedShowing] = useState('');
  const [inchargeData, setInchargeData] = useState<InchargeData[]>([]);
  const [altUsers, setAltUsers] = useState<UserData[]>([]);
  const [selectedIncharge, setSelectedIncharge] = useState<string>('');
  const [teamMembers, setTeamMembers] = useState<{ id: string; email: string }[]>([]); // State to hold team members
  const [selectedMember, setSelectedMember] = useState<string>(''); // State to store selected member
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'completed' | 'ongoing'>('all');
  const [showTasks, setShowTasks] = useState(false);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [teamMems, setTeamMems] = useState<any[]>([]);
  const [data, setData] = useState<Record<string, any>>({});
  const [assignToOpen, setAssignToOpen] = useState(false);


  // Fetch ATL incharge data from Firestore
  useEffect(() => {
    const fetchInchargeData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'atlUsers'));

        // Categorize data into Incharge and Mentor arrays
        const inchargeArray: InchargeData[] = []; // Change this to InchargeData[]
        const mentorArray: UserData[] = [];

        querySnapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const userData = doc.data() as UserData; // Cast data to UserData
          const userEntry: InchargeData = {
            uid: doc.id, // Ensure uid is always a string
            name: userData.name || 'Unnamed',
            email: userData.email || '',
          };

          // Push to respective arrays based on the role
          if (userData.role === 'atlIncharge') {
            inchargeArray.push(userEntry); // Add to InchargeArray
          } else if (userData.role === 'mentor') {
            mentorArray.push(userData); // Directly push userData for mentors
          }
        });

        // Update state with fetched data
        setInchargeData(inchargeArray);
        setMentorData(mentorArray);

        console.log('Fetched Incharge Data:', inchargeArray);
        console.log('Fetched Mentor Data:', mentorArray);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchInchargeData();
  }, []);

  // Fetch and listen to School data from Firestore
  useEffect(() => {
    const qSchool = query(collection(db, "schoolData"));
    onSnapshot(qSchool, (snap) => {
      const schoolArray: SchoolData[] = snap.docs.map(doc => ({
        ...doc.data(),
        id: doc.id // Add Firestore document ID to each school object
      })) as SchoolData[];

      setSchoolData(schoolArray);
      console.log('Fetched School Data:', schoolArray);
    });
  }, []);

  // Fetch Student data based on the selected school
  useEffect(() => {
    if (!selectedSchool) return;

    const q = query(
      collection(db, "studentData"),
      where("school", "==", selectedSchool)
    );

    onSnapshot(q, (snap) => {
      const studentArray: StudentData[] = snap.docs.map(doc => {
        const data = doc.data() as Partial<StudentData>; // Use Partial to allow missing properties
        return {
          id: doc.id,
          uid: data.uid ?? '', // Provide a default if uid may be missing
          name: data.name ?? 'Unknown', // Default for missing name
          email: data.email ?? '', // Default for missing email
          // Add other properties with defaults as needed
        };
      });
  
        setStudentData(studentArray);
      console.log('Fetched Student Data for Selected School:', studentArray);
    });
  }, [selectedSchool]);
// Filter tasks based on the selected status
useEffect(() => {
  const fetchStudentData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'atlUsers')); // or 'students' if they are in a separate collection

      const studentArray: StudentData[] = []; // Array to store student data

      querySnapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const studentData = doc.data() as UserData;
        const studentEntry: StudentData = {  // Use a different name here
          uid: doc.id,
          name: studentData.name || 'Unnamed',
          email: studentData.email || '',
        };

        // Check if the role is 'student' and push to studentArray
        if (studentData.role === 'student') {
          studentArray.push(studentEntry);
        }
      });

      // Log the total number of students fetched
      console.log('Total students:', studentArray.length);
      studentArray.forEach((student, index) => console.log(`Student ${index + 1}:`, student));

      // Update state with fetched student data
      setStudentData(studentArray);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  fetchStudentData();
}, []);
const filteredAltUsers = altUsers.filter((altUser) => {
  if (selectedRole === "atl incharge" && altUser.role === "atl incharge") {
    return true;
  }
  if (selectedRole === "Mentor" && altUser.role === "mentor") {
    return true;
  }
  if (selectedRole === "Student" && altUser.role === "student") {
    return true;
  }
  return false;
});

// Log the filtered results for debugging
console.log("Filtered ALT Users:", filteredAltUsers);
const submit = async () => {
    setIsSubmitDisabled(true);
const taskformData:Task ={
      taskName: name,
      taskDueDate: new Date().toISOString(),
      taskDescription:description,
      taskComments:comments,
      completed: false, // or the desired default value
      id: "", // provide a unique ID, e.g., generated using UUID or Firestore's auto-generated ID
      // ref: { path: "" }, // or specify the Firestore document path if available
      role: "" // specify the role, e.g., "Admin", "User", etc.

 }
 try {
    console.log("Submitting task data:", taskformData);

    await addTask(taskformData)
    console.log("Task successfully added to Firestore.");


    setTimeout(() => {
      Alert.alert("Success", "Data added successfully!", [
        { text: "OK", onPress: resetForm },
      ]);
    }, 100); // Small delay to ensure alert displays properly

        } catch (error) {
          Alert.alert('Process failed! Error: ' + error);
        } finally {
          setIsSubmitDisabled(false);
        }
      };

  const resetForm = () => {
    setModalVisible(false);
    setName('');
    setDescription('');
    setDueDate('');
    setComments('');
  };

  const handlePickerChange = (value: string, field: string) => {
    handleChange(value, field);
    switch (field) {
      case 'roleSelect':
        setRole(value);
        break;
      case 'mentorSelect':
        setMentorSelect(value);
        break;
      case 'inchargeSelect':
        setInchargeSelect(value);
        break;
      case 'schoolSelect':
        setSelectedSchool(value);
        break;
      case 'studentSelect':
        setSelectedStudent(value);
        break;
    }
  };


  const handlePickerChanges = (itemValue: string) => {
    setSelectedIncharge(itemValue); // Assuming you have a state setter for this
  };
  
  const showYours = () => {
    // setUID(tempUid);
    setRole('');
    setSelectedStudent('');
    setSelectedSchool('');
    setMentorSelect('');
    setInchargeSelect('');
  };

  const handleChange = (name: string, value: string) => {
    switch (name) {
      case 'mentorSelect':
        setMentorSelect(value);
        setUID(value);
        break;
      case 'inchargeSelect':
        setInchargeSelect(value);
        setUID(value);
        break;
      case 'schoolSelect':
        setSelectedSchool(value);
        break;
      case 'studentSelect':
        setSelectedStudent(value);
        break;
      case 'roleSelect':
        setRole(value);
        break;
    }
  };
  const filteredTa2sks = userData?.tasks?.filter(task =>
    showWhat === "tasksDone" ? task.completed : !task.completed

    
  ) || [];


  const filteredTasks = userData?.tasks?.filter(task =>
    (showWhat === "tasksDone" ? task.completed : !task.completed) &&
    (selectedRole ? task.role === selectedRole : true)
  ) || [];

// Log to check values
console.log("Selected showWhat:", showWhat);
console.log("Selected role:", selectedRole);
console.log("Filtered tasks based on showWhat and selectedRole:", filteredTasks);



  
const markComplete = async (id: string): Promise<void> => {
  console.log(`Marking task ${id} as complete`);
};

// Function to handle the edit button click
const handleEditClick = (id: string): void => {
  
  console.log(`Edit button clicked for task ${id}`);
};

// Array of team members (populate with actual data if available)
const filteredTeamMems: string[] = [];

// Callback for selecting a team member
const onTeamMemberSelect = (member: string): void => {
  console.log(`Selected team member: ${member}`);
};

// Callback for selecting an incharge
const onInchargeSelect = (incharge: string): void => {
  console.log(`Selected incharge: ${incharge}`);
};

const assigntask = async () => {
  if (!selectedMember) {
      Alert.alert('Please select a team member.');
      console.log("Show Tasks button clicked!"); // This will log to the console

      return;
  }
  const member = teamMembers.find(mem => mem.email === selectedMember); // Find the selected member
  if (member) {
      await taskAssign(data.id, member.id); // Replace 'data.id' with the actual task ID
      console.log("taskAssign function is being called"); // Logs the function call
      console.log("Task Details:", data); // Logs the task details (make sure `data` contains the task info)
      console.log("Assigning to member:", member); // Logs selected member details
      await taskAssign(data.id, member.id); // Replace 'data.id' with the actual task ID

      Alert.alert('Assigned!!');
      setAssignToOpen(false);
      console.log("Show Tasks button clicked!"); // This will log to the console

  } else {
      Alert.alert('Member not found.');
  }
};
const handleShowTasks = () => {
    setShowTasks(true); // Show tasks when button is clicked
  };
return (
    <ScrollView style={{ padding: 20 }}>
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Name:</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} />
            <Text>Description:</Text>
            <TextInput value={description} onChangeText={setDescription} style={styles.input} multiline />
            <Text>Comments:</Text>
            <TextInput value={comments} onChangeText={setComments} style={styles.input} multiline />
            <Text>Due Date:</Text>
            <TextInput value={dueDate} onChangeText={setDueDate} style={styles.input} />
            <Pressable onPress={submit} style={styles.button}>
              <Text style={styles.buttonText}>Add Task</Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)} style={styles.button}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={styles.buttonContainer}>

      <Pressable onPress={() => setModalVisible(true)} style={styles.smallButton}>
  <Text style={styles.buttonText}>Add Task</Text>
</Pressable>
<Pressable onPress={showYours} style={styles.smallButton}>
  <Text style={styles.buttonText}>Show Yours</Text>
</Pressable>
</View>

<View style={styles.headerContainer}>
  <Text style={styles.headerText}>Tasks | Digital ATL</Text>
  <View style={styles.line} />
</View>



{/* Dropdowns placed after the line */}
<View style={styles.dropdownWrapper}>
  <View style={styles.dropdownContainer}>
    <Text style={styles.label}>Role:</Text>
    <Picker
      selectedValue={selectedRole}
      style={styles.picker}
      onValueChange={(itemValue) => setSelectedRole(itemValue)}
    >
      <Picker.Item label="Select Role" value="" />
      <Picker.Item label="ATL Incharge" value="atl incharge" />

      <Picker.Item label="Mentor" value="mentor" />
      <Picker.Item label="Student" value="student" />
    </Picker>
  </View>

 



  {selectedRole === "atl incharge" && (

<Picker
    selectedValue={selectedIncharge}
    onValueChange={(itemValue) => setSelectedIncharge(itemValue)}
  >
    <Picker.Item label="-Select Incharge-" value="" />
    {inchargeData.length > 0 ? (
      inchargeData.map((user) => (
        <Picker.Item key={user.uid} label={user.name} value={user.email} />
      ))
    ) : (
      <Picker.Item label="No Incharge Available" value="" />
    )}
  </Picker>

  )}

{selectedRole === "mentor" && (
  <Picker
    selectedValue={selectedIncharge}
    onValueChange={(itemValue) => setSelectedIncharge(itemValue)}
  >
    <Picker.Item label="-Select mentor-" value="" />
    {mentorData.length > 0 ? (
      mentorData.map((user) => (
        <Picker.Item key={user.uid} label={user.name} value={user.email} />
      ))
    ) : (
      <Picker.Item label="No mentor Available" value="" />
    )}
  </Picker>

  )}

{selectedRole === "student" && (
  <Picker
  selectedValue={selectedIncharge}
  onValueChange={(itemValue) => setSelectedIncharge(itemValue)}
>
  <Picker.Item label="-Select student-" value="" />
  {studentData.length > 0 ? (
    studentData.map((user) => (
      <Picker.Item key={user.uid} label={user.name} value={user.email} />
    ))
  ) : (
    <Picker.Item label="No student  Available" value="" />
  )}
</Picker>
)}
<View style={styles.dropdownContainer}>
    <Text style={styles.label}>Showing:</Text>
    <Picker
        selectedValue={showWhat}
        style={styles.picker}
        onValueChange={(value) => setShowWhat(value)}
    >
      <Picker.Item label="Ongoing Tasks" value="tasksNotDone" />
      <Picker.Item label="Completed Tasks" value="tasksDone" />
    </Picker>
      <View>
        <Text>{showWhat === "tasksDone" ? "Completed Tasks" : "Ongoing Tasks"}</Text>
        {userData?.tasks && userData.tasks.length > 0 ? (
userData.tasks
.filter(filteredTasks =>
    (showWhat === "tasksDone" ? filteredTasks.completed : !filteredTasks.completed) &&
    (selectedRole ? filteredTasks.role === selectedRole : true)
)
             .map((task) =>  (    
              <ReportBox
              key={task.id}
              task={{ ref: task.ref }}
              role={task.role} // Ensure task.role exists and is a string
              data={task} // Pass the entire task as `data`, which should be of type `TaskData`
              markComplete={(id) => markComplete(id)} // Provide your `markComplete` function
              handleEditClick={() => handleEditClick(task.id)} // Updated line
              done={task.completed} // Assuming `task.completed` is a boolean
              filteredTeamMems={[]} // Pass the appropriate array here
              onTeamMemberSelect={(member) => console.log(member)} // Define this callback as needed
              onInchargeSelect={(incharge) => console.log(incharge)} // Define this callback as needed
            
             />

          ))
      ) : (

          <TouchableOpacity>
                  <Pressable onPress={() => setModalVisible(true)} style={styles.smallButton}>
  <Text style={styles.buttonText}>Add Task</Text>
</Pressable>

          </TouchableOpacity>
        )}
      </View>


  </View>
  <View style={styles.line} />
  <View style={styles.taskListContainer}>
  <Text style={styles.headerText}>Tasks for {selectedStatus === 'all' ? 'All' : selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1) + ' Tasks'}</Text>

      {/* Dropdown for selecting task status */}
      <Picker
        selectedValue={selectedStatus}
        onValueChange={(value) => {
          setSelectedStatus(value);
          setShowTasks(false); // Reset showTasks to false on status change
        }}
      >
        <Picker.Item label="All Tasks" value="all" />
        <Picker.Item label="Ongoing Tasks" value="ongoing" />
        <Picker.Item label="Completed Tasks" value="completed" />
      </Picker>

      {/* Button to show filtered tasks */}
      <Button title="Show Tasks" onPress={assigntask} />

      {/* Display filtered tasks only when showTasks is true */}
      {showTasks && (
        filteredTasks.length === 0 ? (
          <Text>No tasks available for this selection.</Text>
        ) : (
          filteredTasks.map(task => (
            <View key={task.id} style={styles.taskItem}>
              <Text>Task Name: {task.taskName}</Text>
              <Text>Description: {task.taskDescription}</Text>
              <Text>Due Date: {task.taskDueDate}</Text>
              <Text>Comments: {task.taskComments}</Text>
              <Text>Status: {task.completed ? 'Completed' : 'Ongoing'}</Text>
            </View>
          ))
        )
      )}
    </View>
</View>
</ScrollView>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  taskListContainer: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },


  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row', // Aligns children in a row
    position: 'absolute',
    top: 10, // Adjust vertical positioning
    right: 10, // Align to the right edge
  },

  smallButton: {
    backgroundColor: '#26a69a',
    paddingVertical: 6, // Smaller height
    paddingHorizontal: 10, // Smaller width
    borderRadius: 5,
    marginHorizontal: 5, // Space between buttons
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#26a69a',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1, // Ensure buttons take up equal space
    marginHorizontal: 5, // Add spacing between buttons
  },

  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',

  },
  headerContainer: {
    marginTop: 20, // Space from the top
    width: '100%', // Ensure it takes full width
    paddingHorizontal: 10, // Add some padding to the sides
  },
  headerText: {
    fontSize: 24, // Large text for the header
    fontWeight: 'bold',
    color: '#333', // Dark gray color
    textAlign: 'left', // Align text to the left

  },
  line: {
    marginTop: 5, // Space between the text and the line
    height: 2, // Thickness of the line
    backgroundColor: 'black', // Line color matching buttons
    width: '100%', // Line spans full width
  },
  picker: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
  },
  dropdownWrapper: {
    marginTop: 10, // Spacing below the line
    paddingHorizontal: 15, // Same horizontal padding as header
    flexDirection: 'column', // Stack dropdowns vertically
  },
  dropdownContainer: {
    marginBottom: 10, // Space between dropdowns
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5, // Space between label and dropdown
  },




});


export default TasksComponent;




