import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import Picker from '@/components/Picker';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';
import { TinkeringActivity, updateTinkeringActivity } from '@/firebase/firestore';
import HyperText from "@/components/Textbox";

const TinkeringActivityReportBoxComponent = ({ activity }: { activity: TinkeringActivity }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(activity.status ? activity.status[activity.status.length - 1].status : '');

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
        activity.status?.push({
            status: status,
            modifiedAt: currentDate
        });
        await updateTinkeringActivity(activity);
        toggleStatusModal();
        Alert.alert("Status Updated", `The status has been changed to: ${status}`);
    };

    const statusOptions = [
        'On Hold', 'Mentor Needed', 'Started Completing', 'Ongoing',
        'Nearly Completed', 'In Review', 'Review Completed', 'TA Completed'
    ];

    return (
        <View>
            <TouchableOpacity
                style={tw`bg-blue-100 p-4 mb-4 rounded-lg shadow-lg border-l-4 border-blue-500`}
                onPress={toggleModal}
            >
                <Text style={tw`text-lg font-bold text-blue-900`}>{activity.taName}</Text>
                <HyperText style={tw`text-sm text-gray-700`} content={activity.intro}></HyperText>
                <Text style={tw`text-sm text-gray-700`}>Subject: {activity.subject}</Text>
                <Text style={tw`text-sm text-gray-700`}>Status: {activity.status !== undefined ? activity.status[activity.status.length - 1].status + " - " + activity.status[activity.status.length - 1].modifiedAt : ""}</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={toggleModal}
            >
                <Pressable
                    style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
                    onPress={toggleModal}
                >
                    <Pressable
                        style={tw`bg-white p-6 rounded-lg w-11/12 relative`}
                        onPress={() => { }}
                    >
                        <TouchableOpacity
                            style={tw`absolute top-3 right-3 p-2 bg-gray-600 rounded-full shadow z-50`}
                            onPress={toggleModal}
                        >
                            <Icon name="close" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        <ScrollView style={tw`max-h-96`}>
                            <Text style={tw`text-3xl font-bold text-blue-900 mb-2`}>{activity.taName}</Text>
                            <HyperText style={tw`text-lg my-4 text-gray-700`} content={`Introduction: ${activity.intro}`}></HyperText>
                            <Text style={tw`text-lg my-4 text-gray-700`}>Subject: {activity.subject}</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>Topic: {activity.topic}</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>Sub-Topic: {activity.subTopic}</Text>
                            <HyperText style={tw`text-lg my-4 text-gray-700`} content={`Goals: ${activity.goals && activity.goals.join(", ")}`}></HyperText>
                            <HyperText style={tw`text-lg my-4 text-gray-700`} content={`Materials: ${activity.materials && activity.materials.join(", ")}`}></HyperText>
                            <HyperText style={tw`text-lg my-4 text-gray-700`} content={`Instructions: ${activity.instructions && activity.instructions.join(", ")}`}></HyperText>
                            <HyperText style={tw`text-lg my-4 text-gray-700`} content={`Tips: ${activity.tips && activity.tips.join(", ")}`}></HyperText>
                            <HyperText style={tw`text-lg my-4 text-gray-700`} content={`Extensions: ${activity.extensions && activity.extensions.join(", ")}`}></HyperText>
                            <HyperText style={tw`text-lg my-4 text-gray-700`} content={`Resources: ${activity.resources && activity.resources.join(", ")}`}></HyperText>
                            <Text style={tw`text-lg my-4 text-gray-700`}>Status:</Text>
                            {activity.status && activity.status.map((statusItem, index) => (
                                <Text key={index} style={tw`text-lg text-gray-700`}>
                                    {statusItem.status} - {statusItem.modifiedAt}
                                </Text>
                            ))}
                        </ScrollView>

                        <View style={tw`mt-4 flex-row justify-around`}>
                            <TouchableOpacity style={tw`bg-blue-500 p-2 rounded-lg`} onPress={toggleStatusModal}>
                                <Text style={tw`text-white`}>Modify status</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={statusModalVisible}
                onRequestClose={toggleStatusModal}
            >
                <Pressable
                    style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
                    onPress={toggleStatusModal}
                >
                    <Pressable
                        style={tw`bg-white p-6 rounded-lg w-11/12 relative`}
                        onPress={() => { }}
                    >
                        <TouchableOpacity
                            style={tw`absolute top-3 right-3 p-2 bg-gray-600 rounded-full shadow z-50`}
                            onPress={toggleStatusModal}
                        >
                            <Icon name="close" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        <Text style={tw`text-2xl font-bold text-blue-900 mb-4`}>Select Status</Text>
                        <Picker
                            selectedValue={selectedStatus}
                            onValueChange={(itemValue) => handleStatusChange(itemValue)}
                            data={statusOptions.map(status => ({ label: status, value: status }))}
                            style={tw`w-full`}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

export default TinkeringActivityReportBoxComponent;