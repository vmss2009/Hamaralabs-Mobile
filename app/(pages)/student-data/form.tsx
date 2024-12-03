// student-data/Form.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import db from '@/firebase/firestore'; // Import your Firestore configuration
import { addDoc, collection } from '@firebase/firestore';
import tw from 'twrnc';

const StudentForm = () => {
    const [studentName, setStudentName] = useState('');
    const [schoolName, setSchoolName] = useState('');
    const [className, setClassName] = useState('');

    const handleSubmit = async () => {
        if (!studentName || !schoolName || !className) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        try {
            await addDoc(collection(db, 'studentData'), {
                studentName,
                schoolName,
                className,
            });
            Alert.alert('Success', 'Student data submitted successfully.');
            // Clear the input fields after submission
            setStudentName('');
            setSchoolName('');
            setClassName('');
        } catch (error) {
            console.error('Error adding document: ', error);
            Alert.alert('Error', 'There was an error submitting the data.');
        }
    };

    return (
        <View style={tw`p-4 bg-white rounded shadow`}>
            <Text style={tw`text-lg font-bold mb-2`}>Student Form</Text>
            <TextInput
                style={tw`border border-gray-300 rounded p-2 mb-4`}
                placeholder="Student Name"
                value={studentName}
                onChangeText={setStudentName}
            />
            <TextInput
                style={tw`border border-gray-300 rounded p-2 mb-4`}
                placeholder="School Name"
                value={schoolName}
                onChangeText={setSchoolName}
            />
            <TextInput
                style={tw`border border-gray-300 rounded p-2 mb-4`}
                placeholder="Class"
                value={className}
                onChangeText={setClassName}
            />
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
};

export default StudentForm;
