import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot, getDoc, updateDoc, arrayUnion, arrayRemove, DocumentReference } from 'firebase/firestore';
import db from '@/firebase/firestore';
import auth from '@/firebase/auth';
import MediaViewer from './components/MediaViewer';
import type { ChatData, User } from "@/firebase/firestore";

const ChatPage = () => {
    const router = useRouter();
    const { chatRef } = useLocalSearchParams();
    const [chatData, setChatData] = useState<ChatData | null>(null);
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [senderNames, setSenderNames] = useState<Map<string, string>>(new Map());
    const [selectedMessages, setSelectedMessages] = useState<Set<number>>(new Set());
    const [selectionMode, setSelectionMode] = useState<boolean>(false);

    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!chatRef) return;
        const chatDoc = doc(db, chatRef as string);

        const unsubscribe = onSnapshot(chatDoc, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data() as ChatData;
                setChatData(data);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching chat:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [chatRef]);

    const fetchSenderNames = async (senderRefs: DocumentReference[]) => {
        const names = new Map<string, string>();
        await Promise.all(senderRefs.map(async (senderRef) => {
            const senderDoc = await getDoc(senderRef);
            if (senderDoc.exists()) {
                const senderData = senderDoc.data() as User;
                names.set(senderRef.id, senderData.name);
            } else {
                names.set(senderRef.id, "Unknown Sender");
            }
        }));
        setSenderNames(names);
    };

    useEffect(() => {
        if (chatData) {
            fetchSenderNames(chatData.messages.map(msg => msg.senderRef));
        }
    }, [chatData]);

    const formatDate = (timeStamp: number) => {
        const date = new Date(timeStamp);

        // Getting the date
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();

        // Construct the formatted date string
        const formattedDate = `${day}-${month}-${year}`;

        return formattedDate;
    };

    // formatting time to hh:mm AM/PM
    const formatTime = (timeStamp: number) => {
        const date = new Date(timeStamp);
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const meridiemString = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        const formattedTime = `${hours}:${minutes} ${meridiemString}`;

        return formattedTime;
    };

    const sendMessage = async () => {
        if (!message || message === "" || !chatData || !currentUser) return;

        const chatRefDoc = doc(db, chatRef as string);
        try {
            await updateDoc(chatRefDoc, {
                messages: arrayUnion({
                    content: message,
                    date: formatDate(Date.now()),
                    senderRef: doc(db, 'atlUsers', currentUser.uid),
                    time: formatTime(Date.now()),
                })
            });
            setMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handlePress = (index: number) => {
        if (selectionMode && chatData?.messages[index].senderRef.id === currentUser?.uid) {
            setSelectedMessages(prevSelected => {
                const newSelected = new Set(prevSelected);
                if (newSelected.has(index)) {
                    newSelected.delete(index);
                } else {
                    newSelected.add(index);
                }
                if (newSelected.size === 0) {
                    setSelectionMode(false);
                }
                return newSelected;
            });
        }
    };

    const handleLongPress = (index: number) => {
        if (chatData?.messages[index].senderRef.id === currentUser?.uid) {
            setSelectionMode(true);
            setSelectedMessages(prevSelected => {
                const newSelected = new Set(prevSelected);
                if (newSelected.has(index)) {
                    newSelected.delete(index);
                } else {
                    newSelected.add(index);
                }
                if (newSelected.size === 0) {
                    setSelectionMode(false);
                }
                return newSelected;
            });
        }
    };

    const deleteSelectedMessages = async () => {
        if (!chatData || !currentUser) return;

        const updatedMessages = chatData.messages.filter((_, index) => !selectedMessages.has(index));

        const chatRefDoc = doc(db, chatRef as string);
        try {
            await updateDoc(chatRefDoc, { messages: updatedMessages });
            setSelectedMessages(new Set());
            setSelectionMode(false);
        } catch (error) {
            console.error("Error deleting messages:", error);
        }
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={tw`flex-1 bg-gray-100 p-4`}>
            {/* Header */}
            <View style={tw`flex-row items-center justify-center mt-2`}>
                <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace("/")} style={tw`absolute left-4`}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={tw`text-lg font-bold text-gray-800`}>Chat</Text>
                <TouchableOpacity onPress={() => router.replace("/")} style={tw`absolute right-4`}>
                    <Ionicons name="home" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Chat Messages */}
            <ScrollView style={tw`mt-4`}>
                {chatData?.messages.map((msg, index) => {
                    const isSender = msg.senderRef.id === currentUser?.uid;
                    const isSelected = selectedMessages.has(index);
                    const showDateHeader = index === 0 || chatData.messages[index - 1].date !== msg.date;

                    return (
                        <View key={index}>
                            {showDateHeader && (
                                <View style={tw`bg-gray-300 py-1 px-4 rounded-md my-2 mx-auto`}>
                                    <Text style={tw`text-sm text-gray-700 font-semibold`}>
                                        {msg.date}
                                    </Text>
                                </View>
                            )}
                            <TouchableOpacity
                                onPress={() => handlePress(index)}
                                onLongPress={() => handleLongPress(index)}
                                style={[
                                    tw`p-4 mb-2 rounded-lg shadow`,
                                    isSender ? tw`bg-blue-100 self-end` : tw`bg-white self-start`,
                                    isSelected && tw`border-2 border-blue-500`
                                ]}
                            >
                                <Text style={tw`text-sm text-gray-600`}>{senderNames.get(msg.senderRef.id) || "Loading..."}</Text>
                                <Text style={tw`text-lg`}>{msg.content}</Text>
                                {msg.fileName && msg.fileURL && (
                                    <MediaViewer fileName={msg.fileName} fileUrl={msg.fileURL} />
                                )}
                                <Text style={tw`text-xs text-gray-500`}>Sent at: {msg.time}</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>

            {/* Delete Selected Messages Bar */}
            {selectionMode && (
                <View style={tw`flex-row items-center justify-between p-4 bg-gray-200`}>
                    <TouchableOpacity onPress={() => {
                        setSelectedMessages(new Set());
                        setSelectionMode(false);
                    }}>
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={tw`text-lg text-left flex-1 ml-2`}>{selectedMessages.size}</Text>
                    <TouchableOpacity onPress={deleteSelectedMessages}>
                        <Ionicons name="trash" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            )}

            {/* Message Input */}
            <View style={tw`flex-row items-center mt-4`}>
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type a message"
                    style={tw`flex-1 border border-gray-300 rounded-lg p-2`}
                />
                <TouchableOpacity onPress={sendMessage} style={tw`ml-2`}>
                    <Ionicons name="send" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChatPage;
