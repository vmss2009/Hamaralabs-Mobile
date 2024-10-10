import React from 'react';
import { View, Text, TouchableOpacity, ViewComponent } from 'react-native';
import tw from 'twrnc';

const CheckBox = ({ value, onValueChange }: { value: boolean, onValueChange: (newValue: boolean) => void }) => {
    return (
        <TouchableOpacity
            onPress={() => onValueChange(!value)}
            style={tw`flex-row items-center`}
        >
            <View
                style={[
                    tw`w-6 h-6 rounded-md border-2 mr-2 justify-center items-center`,
                    value ? tw`bg-blue-500 border-blue-500` : tw`border-gray-400`
                ]}
            >
                {value && (
                    <Text style={tw`text-white`}>✔</Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

export default CheckBox;
