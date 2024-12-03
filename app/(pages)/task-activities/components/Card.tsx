import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, Pressable } from "react-native";
import tw from "twrnc"; // Using tailwind for styling
import Icon from "react-native-vector-icons/Ionicons"; // Ensure react-native-vector-icons is installed

const TaskCard: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskComments, setTaskComments] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");

  // Function to toggle modal visibility
  const toggleModal = () => {
    console.log("Toggling modal"); // Debugging
    setModalVisible(!modalVisible);
  };

  // Function to handle task submission
  const submitTask = () => {
    console.log("Submitting Task", {
      taskName,
      taskDescription,
      taskComments,
      taskDueDate,
    });
    toggleModal(); // Close modal after submitting
  };

  return (
    <View style={tw`p-4`}>
      {/* Button to open modal */}
      <TouchableOpacity
        style={tw`bg-blue-500 p-3 rounded-lg`}
        onPress={toggleModal}
      >
        <Text style={tw`text-white font-bold text-center`}>+ Add Task</Text>
      </TouchableOpacity>

      {/* Modal for adding task */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        {/* Overlay for modal background */}
        <Pressable
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
          onPress={toggleModal} // Close modal when background is pressed
        >
          {/* Modal content */}
          <View style={tw`bg-white p-6 rounded-lg w-11/12`}>
            {/* Close button */}
            <TouchableOpacity
              style={tw`absolute top-3 right-3 p-2 bg-gray-600 rounded-full shadow`}
              onPress={toggleModal}
            >
              <Icon name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Task Form */}
            <Text style={tw`text-xl font-bold mb-4`}>Add New Task</Text>

            <Text>Name:</Text>
            <TextInput
              style={tw`border p-2 mb-4`}
              placeholder="Enter task name"
              value={taskName}
              onChangeText={setTaskName}
            //   autoCompleteType="off"
            />

            <Text>Description:</Text>
            <TextInput
              style={tw`border p-2 mb-4`}
              placeholder="Enter task description"
              value={taskDescription}
              onChangeText={setTaskDescription}
              multiline
              numberOfLines={4}
            />

            <Text>Comments:</Text>
            <TextInput
              style={tw`border p-2 mb-4`}
              placeholder="Enter comments"
              value={taskComments}
              onChangeText={setTaskComments}
              multiline
              numberOfLines={4}
            />

            <Text>Due Date:</Text>
            <TextInput
              style={tw`border p-2 mb-4`}
              placeholder="YYYY-MM-DD"
              value={taskDueDate}
              onChangeText={setTaskDueDate}
            />

            {/* Button to Add Task */}
            <TouchableOpacity
              style={tw`bg-green-500 p-3 rounded-lg`}
              onPress={submitTask} // Submit task when button is pressed
            >
              <Text style={tw`text-white font-bold text-center`}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Test Button to check touch response */}
      <TouchableOpacity 
        style={tw`mt-4 bg-red-500 p-3 rounded-lg`} 
        onPress={() => console.log("Test button pressed")}
      >
        <Text style={tw`text-white font-bold text-center`}>Test Touch Response</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskCard;
