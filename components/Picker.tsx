import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput, Dimensions, TouchableWithoutFeedback } from 'react-native';
import tw from 'twrnc';

const { height: screenHeight } = Dimensions.get('window');

const CustomPicker = ({ selectedValue, onValueChange, data, placeholder, style }: {
    selectedValue: string,
    onValueChange: (itemValue: string) => void,
    data: string[],
    placeholder?: string,
    style?: any,
}) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleItemPress = (itemValue: string) => {
        onValueChange(itemValue);
        setModalVisible(false);
    };

    const filteredData = data.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()));

    useEffect(() => {
        setSearchQuery("");
    }, [isModalVisible]);

    return (
        <View>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={[tw`border border-gray-300 rounded-lg p-3 bg-white mb-2`, style]}
            >
                <Text style={tw`text-lg ${selectedValue ? "text-gray-950" : "text-neutral-500"}`}>
                    {selectedValue || placeholder || "Select an option"}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={tw`flex-1 justify-center items-center bg-black/50`}>
                        <View
                            style={[
                                tw`bg-white rounded-lg p-4 w-10/12`,
                                { maxHeight: screenHeight * 0.65 } // 50% of the screen height
                            ]}
                        >
                            {/* Search Bar */}
                            <TextInput
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder="Search..."
                                style={tw`border border-gray-300 rounded-lg p-2 mb-3 text-lg`}
                            />

                            <FlatList
                                data={filteredData}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => handleItemPress(item)}
                                        style={tw`p-3 border-b border-gray-200`}
                                    >
                                        <Text style={tw`text-lg`}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <View style={tw`p-3`}>
                                        <Text>No options found.</Text>
                                    </View>
                                }
                            />
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={tw`mt-4 p-3 bg-gray-300 rounded-lg`}
                            >
                                <Text style={tw`text-lg text-center`}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default CustomPicker;
