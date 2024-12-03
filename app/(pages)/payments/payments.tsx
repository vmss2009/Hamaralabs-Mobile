import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import {useRouter} from "expo-router";

const Payments = () => {
    const router = useRouter();

    return (
        <View style={tw`flex-1 bg-gray-100 p-4`}>
            {/* Header with Back Button and Centered Text */}
            <View style={tw`flex-row items-center justify-center mt-2`}>
                <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace("/")} style={tw`absolute left-4`}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={tw`text-lg font-bold text-gray-800`}>Payments</Text>
                <TouchableOpacity onPress={() => router.replace("/")} style={tw`absolute right-4`}>
                    <Ionicons name="home" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Payments;