import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import Picker from '@/components/Picker';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';
import { Competition, updateCompetition } from '@/firebase/firestore';
import HyperText from "@/components/Textbox";

const CompetitionReportBoxComponent = ({ competition }: { competition: Competition }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(competition.status ? competition.status[competition.status.length - 1].status : '');
    const { eligibility, paymentDetails, status } = competition;

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
        competition.status?.push({
            status: status,
            modifiedAt: currentDate
        });
        await updateCompetition(competition);
        toggleStatusModal();
        Alert.alert("Status Updated", `The status has been changed to: ${status}`);
    };

    const statusOptions = [
        'On Hold', 'Mentor Needed', 'Started Completing', 'Ongoing',
        'Nearly Completed', 'In Review', 'Review Completed', 'Competition Completed'
    ];

    return (
        <View>
            <TouchableOpacity
                style={tw`bg-blue-100 p-4 mb-4 rounded-lg shadow-lg border-l-4 border-blue-500`}
                onPress={toggleModal}
            >
                <Text style={tw`text-lg font-bold text-blue-900`}>{competition.name}</Text>
                <HyperText style={tw`text-sm text-gray-700`} content={competition.description}></HyperText>
                <Text style={tw`text-sm text-gray-700`}>Status: {competition.status !== undefined ? competition.status[competition.status.length - 1].status + " - " + competition.status[competition.status.length - 1].modifiedAt : ""}</Text>
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
                            <Text style={tw`text-3xl font-bold text-blue-900 mb-2`}>{competition.name}</Text>
                            <HyperText style={tw`text-lg my-4 text-gray-700`} content={`Description: ${competition.description}`}></HyperText>
                            <Text style={tw`text-lg my-4 text-gray-700`}>Organized By: {competition.organizedBy}</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>Application Start Date: {competition.applicationStartDate}</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>Application End Date: {competition.applicationEndDate}</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>Competition Start Date: {competition.competitionStartDate}</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>Competition End Date: {competition.competitionEndDate}</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>Eligibility:</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>- ATL Schools: {eligibility && eligibility.atlSchools ? 'Yes' : 'No'}</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>- Classes From: {eligibility && eligibility.classesFrom}</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>- Individual: {eligibility && eligibility.individual ? 'Yes' : 'No'}</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>- Non-ATL Schools: {eligibility && eligibility.nonAtlSchools ? 'Yes' : 'No'}</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>- Team: {eligibility && eligibility.team ? 'Yes' : 'No'}</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>Payment Details:</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>- Fee: {paymentDetails && paymentDetails.fee}</Text>
                            <Text style={tw`text-lg my-4 text-gray-700`}>- Type: {paymentDetails && paymentDetails.type}</Text>
                            <HyperText style={tw`text-lg my-4 text-gray-700`} content={`Reference Links: ${competition.refLink && competition.refLink.join(", ")}`}></HyperText>
                            <HyperText style={tw`text-lg my-4 text-gray-700`} content={`Requirements: ${competition.requirements && competition.requirements.join(", ")}`}></HyperText>
                            <Text style={tw`text-lg my-4 text-gray-700`}>Status:</Text>
                            {status && status.map((statusItem, index) => (
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

export default CompetitionReportBoxComponent;