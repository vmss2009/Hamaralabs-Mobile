// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Modal, Pressable, ScrollView, Alert } from 'react-native';
// import tw from 'twrnc';
// import Icon from 'react-native-vector-icons/Ionicons';
// import Picker from '@/components/Picker';
// import type { Course } from '@/firebase/firestore';
// import { updateCourse } from '@/firebase/firestore';
// import HyperText from "@/components/Textbox";

// const CourseReportBoxComponent = ({ course }: { course: Course }) => {
//     const [modalVisible, setModalVisible] = useState(false);
//     const [statusModalVisible, setStatusModalVisible] = useState(false);
//     const [selectedStatus, setSelectedStatus] = useState(course.status ? course.status[course.status.length - 1].status : '');

//     const toggleModal = () => {
//         setModalVisible(!modalVisible);
//     };

//     const toggleStatusModal = () => {
//         setStatusModalVisible(!statusModalVisible);
//     };

//     const handleStatusChange = async (status: string) => {
//         setSelectedStatus(status);
//         const d = new Date();
//         const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
//         course.status?.push({
//             status: status,
//             modifiedAt: currentDate
//         });
//         await updateCourse(course);
//         toggleStatusModal();
//         Alert.alert("Status Updated", `The status has been changed to: ${status}`);
//     };

//     const statusOptions = [
//         'On Hold', 'Mentor Needed', 'Started Completing', 'Ongoing',
//         'Nearly Completed', 'In Review', 'Review Completed', 'Course Completed'
//     ];

//     return (
//         <View>
//             <TouchableOpacity
//                 style={tw`bg-blue-100 p-4 mb-4 rounded-lg shadow-lg border-l-4 border-blue-500`}
//                 onPress={toggleModal}
//             >
//                 <Text style={tw`text-lg font-bold text-blue-900`}>{course.courseName}</Text>
//                 <HyperText style={tw`text-sm text-gray-700`} content={course.description}></HyperText>
//                 <Text style={tw`text-sm text-gray-700`}>Organized By: {course.organizedBy}</Text>
//                 <Text style={tw`text-sm text-gray-700`}>Status: {course.status !== undefined ? course.status[course.status.length - 1].status + " - " + course.status[course.status.length - 1].modifiedAt : ""}</Text>
//             </TouchableOpacity>

//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={modalVisible}
//                 onRequestClose={toggleModal}
//             >
//                 <Pressable
//                     style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
//                     onPress={toggleModal}
//                 >
//                     <Pressable
//                         style={tw`bg-white p-6 rounded-lg w-11/12 relative`}
//                         onPress={() => { }}
//                     >
//                         <TouchableOpacity
//                             style={tw`absolute top-3 right-3 p-2 bg-gray-600 rounded-full shadow z-50`}
//                             onPress={toggleModal}
//                         >
//                             <Icon name="close" size={24} color="#FFFFFF" />
//                         </TouchableOpacity>

//                         <ScrollView style={tw`max-h-96`}>
//                             <Text style={tw`text-3xl font-bold text-blue-900 mb-2`}>{course.courseName}</Text>
//                             <Text style={tw`text-lg my-4 text-gray-700`}>Application Start Date: {course.applicationStartDate}</Text>
//                             <Text style={tw`text-lg my-4 text-gray-700`}>Application End Date: {course.applicationEndDate}</Text>
//                             <Text style={tw`text-lg my-4 text-gray-700`}>Course Start Date: {course.crsStartDate}</Text>
//                             <Text style={tw`text-lg my-4 text-gray-700`}>Course End Date: {course.crsEndDate}</Text>
//                             <Text style={tw`text-lg my-4 text-gray-700`}>Classes From: {course.classesFrom}</Text>
//                             <Text style={tw`text-lg my-4 text-gray-700`}>Classes To: {course.classesTo}</Text>
//                             <HyperText style={tw`text-lg my-4 text-gray-700`} content={`Reference Link: ${course.refLink}`}></HyperText>
//                             <HyperText style={tw`text-lg my-4 text-gray-700`} content={`Course Tags: ${course.courseTag && course.courseTag.join(", ")}`}></HyperText>
//                             <HyperText style={tw`text-lg my-4 text-gray-700`} content={`Requirements: ${course.requirements && course.requirements.join(", ")}`}></HyperText>
//                             <Text style={tw`text-lg my-4 text-gray-700`}>Status:</Text>
//                             {course.status && course.status.map((statusItem, index) => (
//                                 <Text key={index} style={tw`text-lg text-gray-700`}>
//                                     {statusItem.status} - {statusItem.modifiedAt}
//                                 </Text>
//                             ))}
//                         </ScrollView>

//                         {/* <View style={tw`mt-4 flex-row justify-around`}>
//                             <TouchableOpacity style={tw`bg-blue-500 p-2 rounded-lg`} onPress={toggleStatusModal}>
//                                 <Text style={tw`text-white`}>Modify status</Text>
//                             </TouchableOpacity>
//                         </View> */}
//                     </Pressable>
//                 </Pressable>
//             </Modal>

//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={statusModalVisible}
//                 onRequestClose={toggleStatusModal}
//             >
//                 <Pressable
//                     style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
//                     onPress={toggleStatusModal}
//                 >
//                     <Pressable
//                         style={tw`bg-white p-6 rounded-lg w-11/12 relative`}
//                         onPress={() => { }}
//                     >
//                         <TouchableOpacity
//                             style={tw`absolute top-3 right-3 p-2 bg-gray-600 rounded-full shadow z-50`}
//                             onPress={toggleStatusModal}
//                         >
//                             <Icon name="close" size={24} color="#FFFFFF" />
//                         </TouchableOpacity>

//                         <Text style={tw`text-2xl font-bold text-blue-900 mb-4`}>Select Status</Text>
//                         <Picker
//                             selectedValue={selectedStatus}
//                             onValueChange={(itemValue) => handleStatusChange(itemValue)}
//                             data={statusOptions.map(status => ({ label: status, value: status }))}
//                             style={tw`w-full`}
//                         />
//                     </Pressable>
//                 </Pressable>
//             </Modal>
//         </View>
//     );
// };

// export default CourseReportBoxComponent;



















import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, ScrollView, Alert,  KeyboardAvoidingView,
    Platform,
   } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';
import Picker from '@/components/Picker';
import type { Course } from '@/firebase/firestore';
import { updateCourse } from '@/firebase/firestore';
import HyperText from "@/components/Textbox";

const CourseReportBoxComponent = ({ course }: { course: Course }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(course.status ? course.status[course.status.length - 1].status : '');

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const toggleStatusModal = () => {
        setStatusModalVisible(!statusModalVisible);
    };

    const handleStatusChange = async (status: string) => {
        setSelectedStatus(status);
        const d = new Date();
        const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        course.status?.push({
            status: status,
            modifiedAt: currentDate
        });
        await updateCourse(course);
        toggleStatusModal();
        Alert.alert("Status Updated", `The status has been changed to: ${status}`);
    };

    const statusOptions = [
        'On Hold', 'Mentor Needed', 'Started Completing', 'Ongoing',
        'Nearly Completed', 'In Review', 'Review Completed', 'Course Completed'
    ];

    return (
        <View>
            <Pressable
                style={tw`bg-blue-100 p-4 mb-4 rounded-lg shadow-lg border-l-4 border-blue-500`}
                onPress={toggleModal}
            >
                <Text style={tw`text-lg font-bold text-blue-900`}>{course.courseName}</Text>
                <HyperText style={tw`text-sm text-gray-700`} content={course.description}></HyperText>
                <Text style={tw`text-sm text-gray-700`}>Organized By: {course.organizedBy}</Text>
                <Text style={tw`text-sm text-gray-700`}>Status: {course.status !== undefined ? course.status[course.status.length - 1].status + " - " + course.status[course.status.length - 1].modifiedAt : ""}</Text>
            </Pressable>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={toggleModal}
            >
      <KeyboardAvoidingView
    style={tw`flex-1`}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} >
                  <View style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center`}>

                  <View style={tw`bg-white p-6 rounded-lg w-11/12 relative`}>
                  <Pressable
              style={tw`absolute top-3 right-3 p-2 bg-gray-600 rounded-full shadow z-50`}
              onPress={toggleModal}>
                            <Icon name="close" size={24} color="#FFFFFF" />
                        </Pressable>

                        <ScrollView
          contentContainerStyle={tw`p-4`}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          scrollEventThrottle={16}
        >
                            <Text style={tw`text-3xl font-bold text-blue-900 mb-2`}>{course.courseName}</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>Application Start Date: {course.applicationStartDate}</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>Application End Date: {course.applicationEndDate}</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>Course Start Date: {course.crsStartDate}</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>Course End Date: {course.crsEndDate}</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>Classes From: {course.classesFrom}</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>Classes To: {course.classesTo}</Text>
                            <HyperText style={tw`text-lg my-4 text-gray-700`} content={`Reference Link: ${course.refLink}`}></HyperText>
                            <HyperText style={tw`text-lg my-4 text-gray-700`} content={`Course Tags: ${course.courseTag && course.courseTag.join(", ")}`}></HyperText>
                            <HyperText style={tw`text-lg my-4 text-gray-700`} content={`Requirements: ${course.requirements && course.requirements.join(", ")}`}></HyperText>
                            <Text style={tw`text-lg my-4 text-gray-700`}>Status:</Text>
                            {course.status && course.status.map((statusItem, index) => (
                                <Text key={index} style={tw`text-lg text-gray-700`}>
                                    {statusItem.status} - {statusItem.modifiedAt}
                                </Text>
                            ))}
                        </ScrollView>

                        {/* <View style={tw`mt-4 flex-row justify-around`}>
                            <TouchableOpacity style={tw`bg-blue-500 p-2 rounded-lg`} onPress={toggleStatusModal}>
                                <Text style={tw`text-white`}>Modify status</Text>
                            </TouchableOpacity>
                        </View> */}
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

            <Pressable
              style={tw`absolute top-3 right-3 p-2 bg-gray-600 rounded-full shadow z-50`}
              onPress={toggleStatusModal}
            >
                            <Icon name="close" size={24} color="#FFFFFF" />
                        </Pressable>

                        <Text style={tw`text-2xl font-bold text-blue-900 mb-4`}>Select Status</Text>
                        <Picker
                            selectedValue={selectedStatus}
                            onValueChange={(itemValue) => handleStatusChange(itemValue)}
                            data={statusOptions.map(status => ({ label: status, value: status }))}
                            style={tw`w-full`}
                        />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
    );
};

export default CourseReportBoxComponent;