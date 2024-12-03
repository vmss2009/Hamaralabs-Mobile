import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { Audio, ResizeMode, Video } from 'expo-av';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Ionicons } from '@expo/vector-icons'; // Expo icons for the play button
import tw from 'twrnc';

const MediaViewer = ({ fileName, fileUrl }: { fileName: string, fileUrl?: string }) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const playPauseAudio = async () => {
        if (!fileUrl) {
            console.error("No audio URL provided.");
            return;
        }

        try {
            // Try to fetch the file to see if it's accessible
            const response = await fetch(fileUrl);
            if (!response.ok) {
                console.error(`Failed to fetch the file: ${response.statusText}`);
                return;
            }

            if (sound === null) {
                const { sound } = await Audio.Sound.createAsync(
                    { uri: fileUrl },
                    { shouldPlay: true },
                    onPlaybackStatusUpdate
                );
                setSound(sound);
                setIsPlaying(true);
            } else {
                if (isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                } else {
                    await sound.playAsync();
                    setIsPlaying(true);
                }
            }
        } catch (error) {
            console.error("Error playing audio:", error);
        }
    };

    const onPlaybackStatusUpdate = (status: any) => {
        if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false); // Reset play button when audio finishes
        }
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    if (!fileName || !fileUrl) return null;

    const fileExtension = fileUrl ? fileUrl.split('.').pop()?.toLowerCase() : '';
    const isVideo = fileExtension && fileExtension.includes("mp4");
    const isAudio = fileExtension && fileExtension.includes("mp3");
    const isPhoto = fileExtension && (fileExtension.includes("png") || fileExtension.includes("jpg") || fileExtension.includes("jpeg"));

    return (
        <View style={tw`p-4 bg-gray-200 rounded-lg my-2`}>
            <Text style={tw`text-lg font-bold mb-2`}>{fileName}</Text>
            {isVideo && (
                <Video
                    source={{ uri: fileUrl }}
                    style={tw`w-full h-50 rounded-lg`}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                />
            )}
            {isAudio && (
                <View style={tw`p-4 bg-gray-100 rounded-lg flex-row items-center`}>
                    <TouchableOpacity onPress={playPauseAudio} style={tw`p-2`}>
                        <Ionicons
                            name={isPlaying ? "pause" : "play"}
                            size={30}
                            color="black"
                        />
                    </TouchableOpacity>
                </View>
            )}
            {isPhoto && (
                <>
                    <TouchableOpacity onPress={toggleModal}>
                        <Image
                            source={{ uri: fileUrl }}
                            style={tw`w-full h-50 rounded-lg`}
                        />
                    </TouchableOpacity>
                    <Modal
                        visible={isModalVisible}
                        transparent={true}
                        onRequestClose={toggleModal}
                    >
                        <TouchableOpacity onPress={toggleModal} style={tw`absolute top-10 right-5 p-2 bg-white rounded-lg z-10`}>
                            <Text style={tw`text-black text-xl font-bold`}>✕</Text>
                        </TouchableOpacity>
                        <ImageViewer
                            imageUrls={[{ url: fileUrl }]}
                            enableSwipeDown={true}
                            onSwipeDown={toggleModal}
                            renderIndicator={() => <View />} // Hide the indicator
                        />
                    </Modal>
                </>
            )}
        </View>
    );
};

export default MediaViewer;
