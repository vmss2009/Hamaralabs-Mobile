import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, Dimensions } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';
import type { School } from '@/firebase/firestore';

const SchoolCard = ({ school }: { school: School }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [openSection, setOpenSection] = useState<string | null>(null); // Track which section is open

    // Toggle the modal visibility
    const toggleModal = () => {
        setModalVisible(!modalVisible);
        setOpenSection(null); // Close all sections when modal is closed
    };

    // Toggle dropdown for a section
    const toggleDropdown = (section: string) => {
        setOpenSection(prevSection => (prevSection === section ? null : section)); // Open/close the clicked section
    };

    return (
        <View>
            <TouchableOpacity
                style={tw`bg-blue-100 p-4 mb-4 rounded-lg shadow-lg border-l-4 border-blue-500`}
                onPress={toggleModal}
            >
                <Text style={tw`text-lg font-bold text-blue-900`}>{school.name}</Text>
                <Text style={tw`text-xs text-blue-700`}>
                    Location: {school.address.city}, {school.address.state} - {school.address.pincode}
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
                        onPress={() => { }}
                    >
                        <TouchableOpacity
                            style={tw`absolute top-3 right-3 p-2 bg-gray-600 rounded-full shadow`}
                            onPress={toggleModal}
                        >
                            <Icon name="close" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        <Text style={tw`text-3xl font-bold text-blue-900 mb-2`}>{school.name}</Text>
                        <Text style={tw`text-lg my-4 text-gray-700 font-bold`}>Syllabus:
                            {school.syllabus.icse ? " ICSE, " : ""}
                            {school.syllabus.igcse ? " IGCSE, " : ""}
                            {school.syllabus.cbse ? " CBSE, " : ""}
                            {school.syllabus.state ? " State, " : ""}
                            {school.syllabus.ib ? " IB " : ""}
                        </Text>
                        <Text style={tw`text-lg mb-4 text-gray-700 font-bold`}>Is ATL? {school.isATL ? <Text style={tw`text-green-600`}>Yes</Text> : <Text style={tw`text-red-400`}>No</Text>}</Text>
                        <Text style={tw`text-lg mb-4 text-gray-700 font-bold`}>Is Paid Subscription? {school.paidSubscription ? <Text style={tw`text-green-600`}>Yes</Text> : <Text style={tw`text-red-400`}>No</Text>}</Text>
                        {/* Address Section */}
                        <TouchableOpacity onPress={() => toggleDropdown('address')} style={tw`flex-row justify-between items-center`}>
                            <Text style={tw`text-xl text-blue-600 font-bold`}>Address</Text>
                            <Icon name={openSection === 'address' ? 'chevron-up' : 'chevron-down'} size={20} color="gray" />
                        </TouchableOpacity>
                        {openSection === 'address' && (
                            <View style={tw`pl-7`}>
                                <Text style={tw`text-lg text-gray-700`}>Line 1: {school.address.addressLine1}</Text>
                                <Text style={tw`text-lg text-gray-700`}>District: {school.address.city} - {school.address.pincode}</Text>
                                <Text style={tw`text-lg text-gray-700`}>Province: {school.address.state}</Text>
                            </View>
                        )}

                        {/* Principal Details Section */}
                        <TouchableOpacity onPress={() => toggleDropdown('principal')} style={tw`flex-row justify-between items-center mt-4`}>
                            <Text style={tw`text-xl text-blue-600 font-bold`}>Principal Details</Text>
                            <Icon name={openSection === 'principal' ? 'chevron-up' : 'chevron-down'} size={20} color="gray" />
                        </TouchableOpacity>
                        {openSection === 'principal' && (
                            <View style={tw`pl-7`}>
                                <Text style={tw`text-lg text-gray-700`}>Name: {school.principal.firstName} {school.principal.lastName}</Text>
                                <Text style={tw`text-lg text-gray-700`}>E-Mail: {school.principal.email}</Text>
                                <Text style={tw`text-lg text-gray-700`}>Whatsapp Contact: {school.principal.whatsappNumber}</Text>
                            </View>
                        )}

                        {/* In-Charge Details Section */}
                        <TouchableOpacity onPress={() => toggleDropdown('incharge')} style={tw`flex-row justify-between items-center mt-4`}>
                            <Text style={tw`text-xl text-blue-600 font-bold`}>In-Charge Details</Text>
                            <Icon name={openSection === 'incharge' ? 'chevron-up' : 'chevron-down'} size={20} color="gray" />
                        </TouchableOpacity>
                        {openSection === 'incharge' && (
                            <View style={tw`pl-7`}>
                                <Text style={tw`text-lg text-gray-700`}>Name: {school.atlIncharge.firstName} {school.atlIncharge.lastName}</Text>
                                <Text style={tw`text-lg text-gray-700`}>E-Mail: {school.atlIncharge.email}</Text>
                                <Text style={tw`text-lg text-gray-700`}>Whatsapp Contact: {school.atlIncharge.whatsappNumber}</Text>
                            </View>
                        )}

                        {/* Correspondent Details Section */}
                        {school.correspondent && (
                            <>
                                <TouchableOpacity onPress={() => toggleDropdown('correspondent')} style={tw`flex-row justify-between items-center mt-4`}>
                                    <Text style={tw`text-xl text-blue-600 font-bold`}>Correspondent Details</Text>
                                    <Icon name={openSection === 'correspondent' ? 'chevron-up' : 'chevron-down'} size={20} color="gray" />
                                </TouchableOpacity>
                                {openSection === 'correspondent' && (
                                    <View style={tw`pl-7`}>
                                        <Text style={tw`text-lg text-gray-700`}>Name: {school.correspondent?.firstName} {school.correspondent?.lastName}</Text>
                                        <Text style={tw`text-lg text-gray-700`}>E-Mail: {school.correspondent?.email}</Text>
                                        <Text style={tw`text-lg text-gray-700`}>Whatsapp Contact: {school.correspondent?.whatsappNumber}</Text>
                                    </View>
                                )}
                            </>
                        )}
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

export default SchoolCard;
