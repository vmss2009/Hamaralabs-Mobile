import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Pressable, Alert } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';
import { doc, getDoc } from 'firebase/firestore';
import db from '@/firebase/firestore';
import auth from '@/firebase/auth';
import type { Taskactivity, User } from "@/firebase/firestore";
import { updateTaskActivity } from "@/firebase/firestore";
import HyperText from "@/components/Textbox";

const TaskActivityReportBoxComponent = ({ activity }: { activity: Taskactivity | undefined }) => {
    const [tasks, setTasks] = useState<Taskactivity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedTask, setSelectedTask] = useState<Taskactivity | null>(null); // Track selected task

    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchTasks = async () => {
            if (!currentUser) return;

            try {
                const userDoc = doc(db, 'atlUsers', currentUser.uid);
                const userSnapshot = await getDoc(userDoc);

                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data() as User;

                    const taskDetails = await Promise.all(
                        userData.tasks?.map(async (task) => {
                            const taskSnapshot = await getDoc(task.ref);
                            return taskSnapshot.exists() ? (taskSnapshot.data() as Taskactivity) : null;
                        }) || []
                    );

                    setTasks(taskDetails.filter(task => task !== null) as Taskactivity[]);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [currentUser]);

    const toggleModal = (task: Taskactivity | null = null) => {
        setSelectedTask(task); // Set the clicked task as the selected task
        setModalVisible(!modalVisible);
    };

    const toggleStatusModal = () => setStatusModalVisible(!statusModalVisible);

    const handleStatusChange = async (status: string) => {
        setSelectedStatus(status);
        const d = new Date();
        const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        if (selectedTask) {
            selectedTask.status?.push({
                status: status,
                modifiedAt: currentDate
            });
            await updateTaskActivity(selectedTask); // Ensure updateTaskActivity is defined and imported
            toggleStatusModal();
            Alert.alert("Status Updated", `The status has been changed to: ${status}`);
        }
    };

    if (loading) {
        return <Text>Loading tasks...</Text>;
    }

    return (
        
        <View>
      <View style={tw`mb-2`}>
</View>

            {tasks.map((task, index) => (
                <TouchableOpacity
                    key={index}
                    style={tw`bg-blue-100 p-4 mb-4 rounded-lg shadow-lg border-l-4 border-blue-500`}
                    onPress={() => toggleModal(task)} // Open modal with specific task details
                >
                    <Text style={tw`text-lg font-bold text-gray-900`}>{task.taskName}</Text>
                    <Text style={tw`text-sm text-gray-500`}>Due: {task.taskDueDate}</Text>
                    <Text style={tw`text-sm text-gray-500`}>Status: {task.taskDone ? "Completed" : "Pending"}</Text>
                </TouchableOpacity>
            ))}

            {selectedTask && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => toggleModal(null)}
                >
                    <Pressable
                        style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
                        onPress={() => toggleModal(null)}
                    >
                        <Pressable
                            style={tw`bg-white p-6 rounded-lg w-11/12 relative`}
                            onPress={() => {}}
                        >
                            <TouchableOpacity
                                style={tw`absolute top-3 right-3 p-2 bg-gray-600 rounded-full shadow z-50`}
                                onPress={() => toggleModal(null)}
                            >
                                <Icon name="close" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                            <ScrollView style={tw`max-h-96`}>
                                <Text style={tw`text-3xl font-bold text-blue-900 mb-2`}>{selectedTask.taskName}</Text>
                                <Text style={tw`text-sm text-gray-500`}>Due: {selectedTask.taskDueDate}</Text>
                                <HyperText content={`Comments: ${selectedTask.taskComments}`} style={tw`text-sm text-gray-500`} />
                                <HyperText content={`Description: ${selectedTask.taskDescription}`} style={tw`text-sm text-gray-500`} />
                                <Text style={tw`text-sm text-gray-500`}>Status: {selectedTask.taskDone ? "Completed" : "Pending"}</Text>
                            </ScrollView>

                            {/* <View style={tw`mt-4 flex-row justify-around`}>
                                <TouchableOpacity style={tw`bg-blue-500 p-2 rounded-lg`} onPress={toggleStatusModal}>
                                    <Text style={tw`text-white`}>Modify status</Text>
                                </TouchableOpacity>
                            </View> */}
                        </Pressable>
                    </Pressable>
                </Modal>
            )}
        </View>
    );
};

export default TaskActivityReportBoxComponent;
