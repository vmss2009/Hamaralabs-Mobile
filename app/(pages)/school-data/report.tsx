import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl, Text, TextInput } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import tw from 'twrnc';
import SchoolCard from './components/Card';
import db from '@/firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import CustomPicker from "@/components/Picker"; // Import CustomPicker component

const SchoolListPage = () => {
    const [schools, setSchools] = useState<any[]>([]);
    const [filteredSchools, setFilteredSchools] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('name'); // Default search field is 'name'

    const searchFields = [
        'name', 'address.city', 'address.state', 'principal.firstName', 'principal.lastName',
        'principal.email', 'principal.whatsappNumber', 'atlIncharge.firstName', 
        'atlIncharge.lastName', 'atlIncharge.email', 'atlIncharge.whatsappNumber',
        'correspondent.firstName', 'correspondent.lastName', 'correspondent.email',
        'correspondent.whatsappNumber'
    ]; // Define the fields for the picker
    const formattedSearchFields = searchFields.map(field => ({
        label: field.replace(/\./g, ' ').replace(/\b\w/g, char => char.toUpperCase()), // Format label for better readability
        value: field
    }));
    
    

    useEffect(() => {
        fetchSchools();
    }, []);

    useEffect(() => {
        filterSchools();
    }, [searchTerm, searchField, schools]);

    const fetchSchools = () => {
        const schoolCollection = collection(db, 'schoolData');

        const unsubscribe = onSnapshot(
            schoolCollection,
            (snapshot) => {
                const schoolList: any = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setSchools(schoolList);
                setFilteredSchools(schoolList);
                setLoading(false);
                setRefreshing(false);
            },
            (error) => {
                console.error('Error fetching schools: ', error);
                setLoading(false);
                setRefreshing(false);
            }
        );

        return () => unsubscribe();
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchSchools();
    };

    const filterSchools = () => {
        if (searchTerm === '') {
            setFilteredSchools(schools); // Reset to full list if search term is empty
        } else {
            const lowerSearchTerm = searchTerm.toLowerCase();

            // Filtering based on the selected search field
            const filtered = schools.filter((school) => {
                let fieldValue;

                if (searchField.includes('.')) {
                    const keys = searchField.split('.');
                    fieldValue = keys.reduce((obj, key) => obj[key], school);
                } else {
                    fieldValue = school[searchField];
                }

                return fieldValue?.toString().toLowerCase().includes(lowerSearchTerm);
            });

            setFilteredSchools(filtered);
        }
    };

    return (
        <View style={tw`flex-1 bg-gray-200 p-4`}> {/* Adjusted padding */}
            <View style={tw`mb-4`}>
                <Text style={tw`text-lg font-bold text-gray-900 mb-2`}>Search Lab</Text>

                {/* Search Field Selection using CustomPicker */}
                <CustomPicker
                    selectedValue={searchField}
                    onValueChange={setSearchField}
                    data={formattedSearchFields} // Use the formatted array here
                    placeholder="Select Search Field"
                    style={tw`mb-2 border border-white`} // Changed border color to white
                />

                {/* Search Input */}
                <TextInput
                    style={tw`border border-white rounded p-3 bg-white mb-4`} // Adjusted padding and color
                    placeholder={`Search by ${searchField}`}
                    placeholderTextColor="gray" // Adjust placeholder text color
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#ffffff" /> // Changed loader color to white
            ) : (
                <FlatList
                    data={filteredSchools}
                    keyExtractor={(item: any) => item.id}
                    renderItem={({ item }) => <SchoolCard school={item} />}
                    ListEmptyComponent={
                        <Text style={tw`text-center text-lg text-gray-700`}>
                            No Labs available
                        </Text>
                    }
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ffffff']} /> // Changed refresh control color to white
                    }
                />
            )}

            <StatusBar style="dark" />
        </View>
    );
};

export default SchoolListPage;
