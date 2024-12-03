import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import db from '@/firebase/firestore';
import StudentCard from '../student-data/components/card'; // Adjust path if needed
import tw from 'twrnc';

const StudentReport = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'studentData'), (snapshot) => {
            const studentList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log("Fetched students:", studentList); // Debugging log
            setStudents(studentList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        setRefreshing(false);
    };

    const handleDelete = async (id: string) => {
        console.log("Delete button pressed for ID:", id); // Debugging log
        Alert.alert(
            'Delete Student',
            'Are you sure you want to delete this student?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK',
                    onPress: async () => {
                        try {
                            const studentDoc = doc(db, 'studentData', id);
                            await deleteDoc(studentDoc);
                            console.log("Successfully deleted:", id); // Success log
                            setStudents((prevStudents) => prevStudents.filter((student) => student.id !== id));
                            Alert.alert('Success', 'Student data deleted successfully.');
                        } catch (error) {
                            console.error('Error deleting document:', error); // Error log
                            Alert.alert('Error', 'There was an error deleting the student data.');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={tw`flex-1 bg-gray-200 p-4`}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={students}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <StudentCard student={item} onDelete={handleDelete} />}
                    ListEmptyComponent={
                        <Text style={tw`text-center text-lg text-gray-700`}>
                            No student data available.
                        </Text>
                    }
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0000ff']} />
                    }
                />
            )}
        </View>
    );
};

export default StudentReport;
