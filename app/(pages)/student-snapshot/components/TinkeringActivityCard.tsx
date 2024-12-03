// import React, { useState } from 'react';
// import {
//   Modal,
//   Pressable,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import Picker from '@/components/Picker';
// import tw from 'twrnc';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { TinkeringActivity, updateTinkeringActivity } from '@/firebase/firestore';
// import HyperText from '@/components/Textbox';

// const TinkeringActivityReportBoxComponent = ({ activity }: { activity: TinkeringActivity }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [statusModalVisible, setStatusModalVisible] = useState(false);
//   const [selectedStatus, setSelectedStatus] = useState(
//     activity.status ? activity.status[activity.status.length - 1].status : ''
//   );

//   const toggleModal = () => setModalVisible(!modalVisible);
//   const toggleStatusModal = () => setStatusModalVisible(!statusModalVisible);

//   const handleStatusChange = async (status: string) => {
//     setSelectedStatus(status);
//     const d = new Date();
//     const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
//     activity.status?.push({
//       status,
//       modifiedAt: currentDate,
//     });
//     await updateTinkeringActivity(activity);
//     toggleStatusModal();
//     Alert.alert('Status Updated', `The status has been changed to: ${status}`);
//   };

//   const statusOptions = [
//     'On Hold',
//     'Mentor Needed',
//     'Started Completing',
//     'Ongoing',
//     'Nearly Completed',
//     'In Review',
//     'Review Completed',
//     'TA Completed',
//   ];

//   return (
//     <View>
//       <Pressable
//         style={tw`bg-blue-100 p-4 mb-4 rounded-lg shadow-lg border-l-4 border-blue-500`}
//         onPress={toggleModal}
//       >
//         <Text style={tw`text-lg font-bold text-blue-900`}>{activity.taName}</Text>
//         <HyperText style={tw`text-sm text-gray-700`} content={activity.intro} />
//         <Text style={tw`text-sm text-gray-700`}>Subject: {activity.subject}</Text>
//         <Text style={tw`text-sm text-gray-700`}>
//           Status:{' '}
//           {activity.status
//             ? `${activity.status[activity.status.length - 1].status} - ${activity.status[activity.status.length - 1].modifiedAt}`
//             : ''}
//         </Text>
//       </Pressable>

//       <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
//         <KeyboardAvoidingView
//           style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         >
//           <Pressable
//             style={tw`bg-white p-6 rounded-lg w-11/12 relative`}
//             onPress={() => {}}
//           >
//             <Pressable
//               style={tw`absolute top-3 right-3 p-2 bg-gray-600 rounded-full shadow z-50`}
//               onPress={toggleModal}
//             >
//               <Icon name="close" size={12} color="#FFFFFF" />
//             </Pressable>
//             <ScrollView
//               style={{ maxHeight: 400 }} // Adjust for better responsiveness
//               contentContainerStyle={{ paddingBottom: 20 }}
//               nestedScrollEnabled
//               keyboardShouldPersistTaps="handled"
//               scrollEventThrottle={16} // Smooth scrolling optimization
//               showsVerticalScrollIndicator={false} // Optional: hides scroll indicator
//               decelerationRate="fast" // Smooth deceleration
            
//             >
//               <Text style={tw`text-3xl font-bold text-blue-900 mb-2`}>{activity.taName}</Text>
//               <HyperText style={tw`text-lg my-4 text-gray-700`} content={`Introduction: ${activity.intro}`} />
//               <Text style={tw`text-lg my-4 text-gray-700`}>Subject: {activity.subject}</Text>
//               <Text style={tw`text-lg my-4 text-gray-700`}>Topic: {activity.topic}</Text>
//               <Text style={tw`text-lg my-4 text-gray-700`}>Sub-Topic: {activity.subTopic}</Text>
//               <HyperText
//                 style={tw`text-lg my-4 text-gray-700`}
//                 content={`Goals: ${activity.goals && activity.goals.join(', ')}`}
//               />
//               <HyperText
//                 style={tw`text-lg my-4 text-gray-700`}
//                 content={`Materials: ${activity.materials && activity.materials.join(', ')}`}
//               />
//               <HyperText
//                 style={tw`text-lg my-4 text-gray-700`}
//                 content={`Instructions: ${activity.instructions && activity.instructions.join(', ')}`}
//               />
//               <HyperText
//                 style={tw`text-lg my-4 text-gray-700`}
//                 content={`Tips: ${activity.tips && activity.tips.join(', ')}`}
//               />
//               <Text style={tw`text-lg my-4 text-gray-700`}>Status:</Text>
//               {activity.status &&
//                 activity.status.map((statusItem, index) => (
//                   <Text key={index} style={tw`text-lg text-gray-700`}>
//                     {statusItem.status} - {statusItem.modifiedAt}
//                   </Text>
//                 ))}
//             </ScrollView>
//           </Pressable>
//         </KeyboardAvoidingView>
//       </Modal>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={statusModalVisible}
//         onRequestClose={toggleStatusModal}
//       >
//         <KeyboardAvoidingView
//           style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         >
//           <Pressable
//             style={tw`bg-white p-6 rounded-lg w-11/12 relative`}
//             onPress={() => {}}
//           >
//             <TouchableOpacity
//               style={tw`absolute top-3 right-3 p-2 bg-gray-600 rounded-full shadow z-50`}
//               onPress={toggleStatusModal}
//             >
//               <Icon name="close" size={12} color="#FFFFFF" />
//             </TouchableOpacity>
//             <Text style={tw`text-2xl font-bold text-blue-900 mb-4`}>Select Status</Text>
//             <Picker
//               selectedValue={selectedStatus}
//               onValueChange={(itemValue) => handleStatusChange(itemValue)}
//               data={statusOptions.map((status) => ({ label: status, value: status }))}
//               style={tw`w-full`}
//             />
//           </Pressable>
//         </KeyboardAvoidingView>
//       </Modal>
//     </View>
//   );
// };

// export default TinkeringActivityReportBoxComponent;










































// import React, { useState, useRef } from 'react';
// import { Modal, Pressable, Text, TouchableOpacity, View, Alert, KeyboardAvoidingView, Platform, Animated,ScrollView } from 'react-native';
// import Picker from '@/components/Picker';
// import tw from 'twrnc';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { TinkeringActivity, updateTinkeringActivity } from '@/firebase/firestore';
// import HyperText from '@/components/Textbox';

// const TinkeringActivityReportBoxComponent = ({ activity }: { activity: TinkeringActivity }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [statusModalVisible, setStatusModalVisible] = useState(false);
//   const [selectedStatus, setSelectedStatus] = useState(
//     activity.status ? activity.status[activity.status.length - 1].status : ''
//   );
//   const scrollViewRef = useRef<ScrollView>(null);

//   const toggleModal = () => setModalVisible(!modalVisible);
//   const toggleStatusModal = () => setStatusModalVisible(!statusModalVisible);

//   const handleStatusChange = async (status: string) => {
//     setSelectedStatus(status);
//     const d = new Date();
//     const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
//     activity.status?.push({
//       status,
//       modifiedAt: currentDate,
//     });
//     await updateTinkeringActivity(activity);
//     toggleStatusModal();
//     Alert.alert('Status Updated', `The status has been changed to: ${status}`);
//   };

//   const statusOptions = [
//     'On Hold',
//     'Mentor Needed',
//     'Started Completing',
//     'Ongoing',
//     'Nearly Completed',
//     'In Review',
//     'Review Completed',
//     'TA Completed',
//   ];

//   // Auto-scroll logic
//   const autoScroll = (scrollTimes: number, delay: number) => {
//     let scrollCount = 0;
//     const scrollInterval = setInterval(() => {
//       if (scrollCount >= scrollTimes) {
//         clearInterval(scrollInterval);
//         return;
//       }
//       scrollViewRef.current?.scrollTo({ y: (scrollCount + 1) * 100, animated: true });
//       scrollCount += 1;
//     }, delay);
//   };


//   return (
//     <View>
//       <Pressable
//         style={tw`bg-blue-100 p-4 mb-4 rounded-lg shadow-lg border-l-4 border-blue-500`}
//         onPress={toggleModal}
//       >
//         <Text style={tw`text-lg font-bold text-blue-900`}>{activity.taName}</Text>
//         <HyperText style={tw`text-sm text-gray-700`} content={activity.intro} />
//         <Text style={tw`text-sm text-gray-700`}>Subject: {activity.subject}</Text>
//         <Text style={tw`text-sm text-gray-700`}>
//           Status:{' '}
//           {activity.status
//             ? `${activity.status[activity.status.length - 1].status} - ${activity.status[activity.status.length - 1].modifiedAt}`
//             : ''}
//         </Text>
//       </Pressable>

//       <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
//         <KeyboardAvoidingView
//           style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         >
//           <Pressable
//             style={tw`bg-white p-6 rounded-lg w-11/12 relative`}
//             onPress={() => {}}
//           >
//             <Pressable
//               style={tw`absolute top-3 right-3 p-2 bg-gray-600 rounded-full shadow z-50`}
//               onPress={toggleModal}
//             >
//               <Icon name="close" size={12} color="#FFFFFF" />
//             </Pressable>
//             <Animated.ScrollView
//               ref={scrollViewRef} // Correctly pass the ref
//               style={{ maxHeight: 400 }}
//               contentContainerStyle={{ paddingBottom: 20 }}
//               nestedScrollEnabled
//               keyboardShouldPersistTaps="handled"
//             >
//               <Text style={tw`text-3xl font-bold text-blue-900 mb-2`}>{activity.taName}</Text>
//               <HyperText style={tw`text-lg my-4 text-gray-700`} content={`Introduction: ${activity.intro}`} />
//               <Text style={tw`text-lg my-4 text-gray-700`}>Subject: {activity.subject}</Text>
//               <Text style={tw`text-lg my-4 text-gray-700`}>Topic: {activity.topic}</Text>
//               <Text style={tw`text-lg my-4 text-gray-700`}>Sub-Topic: {activity.subTopic}</Text>
//               <HyperText
//                 style={tw`text-lg my-4 text-gray-700`}
//                 content={`Goals: ${activity.goals && activity.goals.join(', ')}`}
//               />
//               <HyperText
//                 style={tw`text-lg my-4 text-gray-700`}
//                 content={`Materials: ${activity.materials && activity.materials.join(', ')}`}
//               />
//               <HyperText
//                 style={tw`text-lg my-4 text-gray-700`}
//                 content={`Instructions: ${activity.instructions && activity.instructions.join(', ')}`}
//               />
//               <HyperText
//                 style={tw`text-lg my-4 text-gray-700`}
//                 content={`Tips: ${activity.tips && activity.tips.join(', ')}`}
//               />
//               <Text style={tw`text-lg my-4 text-gray-700`}>Status:</Text>
//               {activity.status &&
//                 activity.status.map((statusItem, index) => (
//                   <Text key={index} style={tw`text-lg text-gray-700`}>
//                     {statusItem.status} - {statusItem.modifiedAt}
//                   </Text>
//                 ))}
//             </Animated.ScrollView>
//             <TouchableOpacity
//               style={tw`mt-4 p-3 bg-blue-500 rounded-lg`}
//               onPress={() => autoScroll(10, 1000)} // Trigger auto-scroll with 10 steps and 1-second delay
//             >
//               <Text style={tw`text-white text-center`}>Start Auto-Scroll</Text>
//             </TouchableOpacity>
//           </Pressable>
//         </KeyboardAvoidingView>
//       </Modal>
//     </View>
//   );
// };

// export default TinkeringActivityReportBoxComponent;




























//working afer 20 swip

// import React, { useState } from 'react';
// import {
//   Modal,
//   Pressable,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import Picker from '@/components/Picker';
// import tw from 'twrnc';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { TinkeringActivity, updateTinkeringActivity } from '@/firebase/firestore';
// import HyperText from '@/components/Textbox';

// const TinkeringActivityReportBoxComponent = ({ activity }: { activity: TinkeringActivity }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [statusModalVisible, setStatusModalVisible] = useState(false);
//   const [selectedStatus, setSelectedStatus] = useState(
//     activity.status ? activity.status[activity.status.length - 1].status : ''
//   );

//   const toggleModal = () => setModalVisible(!modalVisible);
//   const toggleStatusModal = () => setStatusModalVisible(!statusModalVisible);

//   const handleStatusChange = async (status: string) => {
//     setSelectedStatus(status);
//     const d = new Date();
//     const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
//     activity.status?.push({
//       status,
//       modifiedAt: currentDate,
//     });
//     await updateTinkeringActivity(activity);
//     toggleStatusModal();
//     Alert.alert('Status Updated', `The status has been changed to: ${status}`);
//   };

//   const statusOptions = [
//     'On Hold',
//     'Mentor Needed',
//     'Started Completing',
//     'Ongoing',
//     'Nearly Completed',
//     'In Review',
//     'Review Completed',
//     'TA Completed',
//   ];

//   return (
//     <View>
//       <Pressable
//         style={tw`bg-blue-100 p-4 mb-4 rounded-lg shadow-lg border-l-4 border-blue-500`}
//         onPress={toggleModal}
//       >
//         <Text style={tw`text-lg font-bold text-blue-900`}>{activity.taName}</Text>
//         <HyperText style={tw`text-sm text-gray-700`} content={activity.intro} />
//         <Text style={tw`text-sm text-gray-700`}>Subject: {activity.subject}</Text>
//         <Text style={tw`text-sm text-gray-700`}>
//           Status:{' '}
//           {activity.status
//             ? `${activity.status[activity.status.length - 1].status} - ${activity.status[activity.status.length - 1].modifiedAt}`
//             : ''}
//         </Text>
//       </Pressable>

//       <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
//       <KeyboardAvoidingView
//     style={tw`flex-1`}
//     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
//   >
//         <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>

//         <Pressable style={tw`bg-white p-6 rounded-lg w-11/12 relative`}>
//         <Pressable
//               style={tw`absolute top-3 right-3 p-2 bg-gray-600 rounded-full shadow z-50`}
//               onPress={toggleModal}
//             >
//               <Icon name="close" size={12} color="#FFFFFF" />
//             </Pressable>
//             <ScrollView
//           contentContainerStyle={tw`p-4`}
//           nestedScrollEnabled
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//           scrollEventThrottle={16}
//         >
//               <Text style={tw`text-3xl font-bold text-blue-900 mb-2`}>{activity.taName}</Text>
//               <HyperText style={tw`text-lg my-4 text-gray-700`} content={`Introduction: ${activity.intro}`} />
//               <Text style={tw`text-lg my-4 text-gray-700`}>Subject: {activity.subject}</Text>
//               <Text style={tw`text-lg my-4 text-gray-700`}>Topic: {activity.topic}</Text>
//               <Text style={tw`text-lg my-4 text-gray-700`}>Sub-Topic: {activity.subTopic}</Text>
//               <HyperText
//                 style={tw`text-lg my-4 text-gray-700`}
//                 content={`Goals: ${activity.goals && activity.goals.join(', ')}`}
//               />
//               <HyperText
//                 style={tw`text-lg my-4 text-gray-700`}
//                 content={`Materials: ${activity.materials && activity.materials.join(', ')}`}
//               />
//               <HyperText
//                 style={tw`text-lg my-4 text-gray-700`}
//                 content={`Instructions: ${activity.instructions && activity.instructions.join(', ')}`}
//               />
//               <HyperText
//                 style={tw`text-lg my-4 text-gray-700`}
//                 content={`Tips: ${activity.tips && activity.tips.join(', ')}`}
//               />
//               <Text style={tw`text-lg my-4 text-gray-700`}>Status:</Text>
//               {activity.status &&
//                 activity.status.map((statusItem, index) => (
//                   <Text key={index} style={tw`text-lg text-gray-700`}>
//                     {statusItem.status} - {statusItem.modifiedAt}
//                   </Text>
//                 ))}
//             </ScrollView>
//           </Pressable>
//           </View>

//         </KeyboardAvoidingView>
//       </Modal>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={statusModalVisible}
//         onRequestClose={toggleStatusModal}
//       >
//         <KeyboardAvoidingView
//           style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         >
//           <Pressable
//             style={tw`bg-white p-6 rounded-lg w-11/12 relative`}
//             onPress={() => {}}
//           >
//             <TouchableOpacity
//               style={tw`absolute top-3 right-3 p-2 bg-gray-600 rounded-full shadow z-50`}
//               onPress={toggleStatusModal}
//             >
//               <Icon name="close" size={12} color="#FFFFFF" />
//             </TouchableOpacity>
//             <Text style={tw`text-2xl font-bold text-blue-900 mb-4`}>Select Status</Text>
//             <Picker
//               selectedValue={selectedStatus}
//               onValueChange={(itemValue) => handleStatusChange(itemValue)}
//               data={statusOptions.map((status) => ({ label: status, value: status }))}
//               style={tw`w-full`}
//             />
//           </Pressable>
//         </KeyboardAvoidingView>
//       </Modal>
//     </View>
//   );
// };

// export default TinkeringActivityReportBoxComponent;



























import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Picker from '@/components/Picker';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';
import { TinkeringActivity, updateTinkeringActivity } from '@/firebase/firestore';
import HyperText from '@/components/Textbox';

const TinkeringActivityReportBoxComponent = ({ activity }: { activity: TinkeringActivity }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    activity.status ? activity.status[activity.status.length - 1].status : ''
  );

  const toggleModal = () => setModalVisible(!modalVisible);
  const toggleStatusModal = () => setStatusModalVisible(!statusModalVisible);

  const handleStatusChange = async (status: string) => {
    setSelectedStatus(status);
    const d = new Date();
    const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    activity.status?.push({
      status,
      modifiedAt: currentDate,
    });
    await updateTinkeringActivity(activity);
    toggleStatusModal();
    Alert.alert('Status Updated', `The status has been changed to: ${status}`);
  };

  const statusOptions = [
    'On Hold',
    'Mentor Needed',
    'Started Completing',
    'Ongoing',
    'Nearly Completed',
    'In Review',
    'Review Completed',
    'TA Completed',
  ];

  return (
    <View>
      <Pressable
        style={tw`bg-blue-100 p-4 mb-4 rounded-lg shadow-lg border-l-4 border-blue-500`}
        onPress={toggleModal}
      >
        <Text style={tw`text-lg font-bold text-blue-900`}>{activity.taName}</Text>
        <HyperText style={tw`text-sm text-gray-700`} content={activity.intro} />
        <Text style={tw`text-sm text-gray-700`}>Subject: {activity.subject}</Text>
        <Text style={tw`text-sm text-gray-700`}>
          Status:{' '}
          {activity.status
            ? `${activity.status[activity.status.length - 1].status} - ${activity.status[activity.status.length - 1].modifiedAt}`
            : ''}
        </Text>
      </Pressable>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
      <KeyboardAvoidingView
    style={tw`flex-1`}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
  >
          <View style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center`}>

          <View style={tw`bg-white p-6 rounded-lg w-11/12 relative`}>
          <Pressable
              style={tw`absolute top-3 right-3 p-2 bg-gray-600 rounded-full shadow z-50`}
              onPress={toggleModal}
            >
              <Icon name="close" size={12} color="#FFFFFF" />
            </Pressable>
            <ScrollView
          contentContainerStyle={tw`p-4`}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          scrollEventThrottle={16}
        >
              <Text style={tw`text-3xl font-bold text-blue-900 mb-2`}>{activity.taName}</Text>
              <HyperText style={tw`text-lg my-4 text-gray-700`} content={`Introduction: ${activity.intro}`} />
              <Text style={tw`text-lg my-4 text-gray-700`}>Subject: {activity.subject}</Text>
              <Text style={tw`text-lg my-4 text-gray-700`}>Topic: {activity.topic}</Text>
              <Text style={tw`text-lg my-4 text-gray-700`}>Sub-Topic: {activity.subTopic}</Text>
              <HyperText
                style={tw`text-lg my-4 text-gray-700`}
                content={`Goals: ${activity.goals && activity.goals.join(', ')}`}
              />
              <HyperText
                style={tw`text-lg my-4 text-gray-700`}
                content={`Materials: ${activity.materials && activity.materials.join(', ')}`}
              />
              <HyperText
                style={tw`text-lg my-4 text-gray-700`}
                content={`Instructions: ${activity.instructions && activity.instructions.join(', ')}`}
              />
              <HyperText
                style={tw`text-lg my-4 text-gray-700`}
                content={`Tips: ${activity.tips && activity.tips.join(', ')}`}
              />
              <Text style={tw`text-lg my-4 text-gray-700`}>Status:</Text>
              {activity.status &&
                activity.status.map((statusItem, index) => (
                  <Text key={index} style={tw`text-lg text-gray-700`}>
                    {statusItem.status} - {statusItem.modifiedAt}
                  </Text>
                ))}
            </ScrollView>
          </View>
          </View>

        </KeyboardAvoidingView>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={statusModalVisible}
        onRequestClose={toggleStatusModal}
      >
        <KeyboardAvoidingView
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
                    <View style={tw`bg-white p-6 rounded-lg w-11/12 relative`}>

          {/* <Pressable
            style={tw`bg-white p-6 rounded-lg w-11/12 relative`}
            onPress={() => {}}
          > */}
            <Pressable
              style={tw`absolute top-3 right-3 p-2 bg-gray-600 rounded-full shadow z-50`}
              onPress={toggleStatusModal}
            >
              <Icon name="close" size={12} color="#FFFFFF" />
            </Pressable>
            <Text style={tw`text-2xl font-bold text-blue-900 mb-4`}>Select Status</Text>
            <Picker
              selectedValue={selectedStatus}
              onValueChange={(itemValue) => handleStatusChange(itemValue)}
              data={statusOptions.map((status) => ({ label: status, value: status }))}
              style={tw`w-full`}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default TinkeringActivityReportBoxComponent;































