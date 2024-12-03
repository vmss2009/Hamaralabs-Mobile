import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useRouter } from "expo-router";
import auth from '@/firebase/auth';
import { User } from "@/firebase/firestore";
import { getFirestore, doc, getDoc, DocumentReference } from "firebase/firestore";
import app from "@/firebase/app";

const db = getFirestore(app);

const DashboardPage = () => {
    const router = useRouter();
    const user = auth.currentUser;
    const [chats, setChats] = useState<User["chats"]>([]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const userDoc = doc(db, "atlUsers", user.uid);
                    const userSnapshot = await getDoc(userDoc);
                    if (userSnapshot.exists()) {
                        const userData = userSnapshot.data() as User;
                        setChats(userData.chats || []);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();
    }, [user]);

    const handleChatPress = (chatRef: DocumentReference) => {
        router.push({
            pathname: '/(pages)/chat/chat',
            params: { chatRef: chatRef.path }
        });
    };

    return (
        <View style={tw`flex-1 bg-gray-100 p-4`}>
            {/* Header with Back Button and Centered Text */}
            <View style={tw`flex-row items-center justify-center mt-2`}>
                <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace("/")} style={tw`absolute left-4`}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={tw`text-lg font-bold text-gray-800`}>Dashboard</Text>
                <TouchableOpacity onPress={() => router.replace("/")} style={tw`absolute right-4`}>
                    <Ionicons name="home" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Chat Groups */}
            <ScrollView style={tw`mt-4`}>
                {chats && chats.length > 0 ? (
                    chats.map((chat, index) => (
                        <TouchableOpacity key={index} onPress={() => handleChatPress(chat.ref)} style={tw`bg-white p-4 mb-4 rounded-lg shadow-lg`}>
                            <Text style={tw`text-lg font-bold text-blue-900`}>{chat.groupName}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={tw`text-center text-gray-700`}>No chat groups available</Text>
                )}
            </ScrollView>
        </View>
    );
};

export default DashboardPage;
