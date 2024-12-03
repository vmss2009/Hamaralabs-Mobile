import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';
import type { School } from '@/firebase/firestore';

const SchoolCard = ({ school }: { school: School }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState<string | null>(null);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
        setSelectedTab(null); // Reset the selected tab when the modal closes
    };

    const renderContent = () => {
        try {
            switch (selectedTab) {
                case 'lab':
                    return (
                        <View style={tw`p-4`}>
                            <Text style={tw`text-lg font-bold text-blue-600`}>Lab Information</Text>
                            <Text style={tw`text-gray-700`}>Address: {school.address?.addressLine1 || 'N/A'}</Text>
                            <Text style={tw`text-gray-700`}>City: {school.address?.city || 'N/A'}</Text>
                            <Text style={tw`text-gray-700`}>State: {school.address?.state || 'N/A'}</Text>
                            <Text style={tw`text-gray-700`}>Pincode: {school.address?.pincode || 'N/A'}</Text>
                        </View>
                    );
                case 'principal':
                    return (
                        <View style={tw`p-4`}>
                            <Text style={tw`text-lg font-bold text-blue-600`}>Principal Details</Text>
                            <Text style={tw`text-gray-700`}>
                                Name: {school.principal?.firstName || 'N/A'} {school.principal?.lastName || 'N/A'}
                            </Text>
                            <Text style={tw`text-gray-700`}>E-Mail: {school.principal?.email || 'N/A'}</Text>
                            <Text style={tw`text-gray-700`}>
                                Whatsapp: {school.principal?.whatsappNumber || 'N/A'}
                            </Text>
                        </View>
                    );
                case 'incharge':
                    return (
                        <View style={tw`p-4`}>
                            <Text style={tw`text-lg font-bold text-blue-600`}>In-Charge Details</Text>
                            <Text style={tw`text-gray-700`}>
                                Name: {school.atlIncharge?.firstName || 'N/A'} {school.atlIncharge?.lastName || 'N/A'}
                            </Text>
                            <Text style={tw`text-gray-700`}>E-Mail: {school.atlIncharge?.email || 'N/A'}</Text>
                            <Text style={tw`text-gray-700`}>
                                Whatsapp: {school.atlIncharge?.whatsappNumber || 'N/A'}
                            </Text>
                        </View>
                    );
                default:
                    return (
                        <Text style={tw`text-center text-gray-500 mt-4`}>
                            Select a section to view details.
                        </Text>
                    );
            }
        } catch (error) {
            console.error('Error in renderContent:', error);
            return <Text style={tw`text-red-600`}>Error loading content.</Text>;
        }
    };

    return (
        <View>
            <TouchableOpacity
                style={tw`bg-white p-4 mb-4 rounded-lg shadow-lg border-l-4 border-blue-500`}
                onPress={toggleModal}
            >
                <Text style={tw`text-lg font-bold text-blue-900`}>{school.name || 'N/A'}</Text>
                <Text style={tw`text-md text-blue-700`}>
                    Location: {school.address?.city || 'N/A'}, {school.address?.state || 'N/A'} -{' '}
                    {school.address?.pincode || 'N/A'}
                </Text>
                <Text style={tw`text-md text-blue-800`}>
                    Principal: {school.principal?.firstName || 'N/A'} {school.principal?.lastName || 'N/A'}, {school.principal?.email || 'N/A'} - {school.principal?.whatsappNumber || 'N/A'}
                </Text>
                <Text style={tw`text-md text-blue-800`}>
                    Incharge: {school.atlIncharge?.firstName || 'N/A'} {school.atlIncharge?.lastName || 'N/A'}, {school.atlIncharge?.email || 'N/A'}, {school.atlIncharge?.whatsappNumber || 'N/A'}
                </Text>
                <Text style={tw`text-xs text-blue-700`}>
                    Correspondent: {school.correspondent?.firstName || 'N/A'} {school.correspondent?.lastName || 'N/A'}, {school.correspondent?.email || 'N/A'} - {school.correspondent?.whatsappNumber || 'N/A'}
                </Text>
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
                        onPress={() => {}}
                    >
                        <TouchableOpacity
                            style={tw`absolute top-3 right-3 p-2 bg-gray-600 rounded-full shadow`}
                            onPress={toggleModal}
                        >
                            <Icon name="close" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        <Text style={tw`text-3xl font-bold text-blue-900 mb-2`}>{school.name || 'N/A'}</Text>

                        {/* Tab Menu */}
                        <View style={tw`flex-row justify-around mt-4`}>
                            <TouchableOpacity
                                onPress={() => setSelectedTab('lab')}
                                style={[tw`flex-1 items-center p-2`, selectedTab === 'lab' && tw`border-b-2 border-blue-500`]}
                            >
                                <Text style={tw`text-blue-600 font-bold`}>Lab Info</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setSelectedTab('principal')}
                                style={[tw`flex-1 items-center p-2`, selectedTab === 'principal' && tw`border-b-2 border-blue-500`]}
                            >
                                <Text style={tw`text-blue-600 font-bold`}>Principal</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setSelectedTab('incharge')}
                                style={[tw`flex-1 items-center p-2`, selectedTab === 'incharge' && tw`border-b-2 border-blue-500`]}
                            >
                                <Text style={tw`text-blue-600 font-bold`}>In-Charge</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Content Section */}
                        <View style={tw`mt-4`}>{renderContent()}</View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

export default SchoolCard;
