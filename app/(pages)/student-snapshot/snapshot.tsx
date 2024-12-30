import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView,StyleSheet, ActivityIndicator,SafeAreaView,StatusBar } from 'react-native';
import { collection, query, where, getDocs, doc, onSnapshot } from 'firebase/firestore';
import tw from 'twrnc';
import db from '@/firebase/firestore';
import CompetitionReportBoxComponent from './components/CompetitionCard';
import CourseReportBoxComponent from './components/CoursesCard';
import TaskActivityReportBoxComponent from './components/Taskscard';
import TinkeringReportBoxComponent from './components/TinkeringActivityCard';

import SessionReportBoxComponent from './components/SessionCard';
import type { Student, Competition, Course, Session, Taskactivity,TinkeringActivity } from '@/firebase/firestore';
import auth from '@/firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

const SnapshotPage = () => {
    const router = useRouter();
    const user = auth.currentUser;
    const [student, setStudent] = useState<Student>();
    const [selectedTab, setSelectedTab] = useState<string>('taData');
    const [data, setData] = useState<TinkeringActivity[] | Competition[] | Course[] | Taskactivity[] | Session[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudent = async () => {
            if (user?.email) {
                console.log("User email:", user.email);

                try {
                    const studentCollection = collection(db, 'studentData');
                    const studentQuery = query(studentCollection, where('email', '==', user.email));
                    const querySnapshot = await getDocs(studentQuery);
                    if (!querySnapshot.empty) {
                        const studentDoc = querySnapshot.docs[0];
                        setStudent({ ...studentDoc.data(), id: studentDoc.id } as Student);
                        console.log("Fetched student data:", studentDoc);

                    }
                } catch (err) {
                    console.error("Failed to fetch student data:", err);

                    setError('Failed to fetch student data');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchStudent();
    }, [user]);

    useEffect(() => {
        console.log("Selected Tab:", selectedTab);

        setError(null);  // Reset error state on tab change
        if (!student?.id) return;
    
        setLoading(true);
    
        // Adjusting Firestore path for the subcollection
        const studentDocRef = doc(db, 'studentData', student.id);
        const dataCollectionRef = collection(studentDocRef, selectedTab);
    
        const unsubscribe = onSnapshot(
            dataCollectionRef,
            (snapshot) => {
                const dataList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    path: doc.ref.path,
                    ...doc.data(),
                })) as Taskactivity[] | Competition[] | Course[] | TinkeringActivity[] | Session[];
                // console.log(Fetched data for ${selectedTab}:, dataList);
                // console.log('Fetched tasks:', dataList);


                setData(dataList);
                setLoading(false);
            },
            (err) => {
                setError('Failed to fetch data');
                setLoading(false);
            }
        );
    
        return () => unsubscribe();
    }, [selectedTab, student]);
    

    const tabs = [
        { label: 'Tinkering Activities', value: 'taData' },
        { label: 'Tasks', value: 'tasksData' },
        { label: 'Competitions', value: 'competitionData' },
        { label: 'Courses', value: 'coursesData' },
        { label: 'Sessions', value: 'sessionData' },
    ];
    const renderData = () => {
        if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
        if (error) return <Text style={tw`text-center text-gray-600`}>{error}</Text>;
        if (data.length === 0) return <Text style={tw`text-center text-gray-600`}>No data available</Text>;

    return (
        <ScrollView>
                    {selectedTab === 'taData' && data.map((item, index) => (
                        <TinkeringReportBoxComponent key={index} activity={item as TinkeringActivity} />
                    ))}


                     {selectedTab === 'tasksData' && data.map((item, index) => (
                        <TaskActivityReportBoxComponent key={index} activity={item as Taskactivity} />
                    ))}

                    {selectedTab === 'competitionData' && data.map((item, index) => (
                        <CompetitionReportBoxComponent key={index} competition={item as Competition} />
                    ))}
                    {selectedTab === 'coursesData' && data.map((item, index) => (
                        <CourseReportBoxComponent key={index} course={item as Course} />
                    ))}
                    {selectedTab === 'sessionData' && data.map((item, index) => (
                        <SessionReportBoxComponent key={index} session={item as Session} />
                    ))}
                                </ScrollView>

                    );
                    };




                    return (
                        // <SafeAreaView style={tw`flex-1 bg-gray-100`}>
                        <SafeAreaView style={styles.safeArea}>

                        <StatusBar
                            translucent={true}
                            backgroundColor="transparent"
                            barStyle="dark-content"
                            hidden={false}
                        />
            
                        <View style={tw`flex-1 bg-gray-100 p-0`}>
                            {/* Header with Back Button and Centered Text */}
                            <View style={tw`flex-row items-center justify-center mt-0`}>
                                <TouchableOpacity onPress={() => {router.canGoBack() ? router.back() : router.replace("/")}} style={tw`absolute left-4`}>
                                    <Ionicons name="arrow-back" size={24} color="black" />
                                </TouchableOpacity>
                                <Text style={tw`text-lg font-bold text-gray-800`}>Snapshot</Text>
                                <TouchableOpacity onPress={() => router.replace("/")} style={tw`absolute right-4`}>
                                    <Ionicons name="home" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                                {/* tab session */}

                                <View style={tw`flex-row border-b-2 border-gray-300 mt-4`}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                {tabs.map((tab) => (
        <TouchableOpacity
            key={tab.value}
            onPress={() => setSelectedTab(tab.value)}
            style={[
                tw`py-1 px-2`, // Adjusted padding for more space on smaller screens
                selectedTab === tab.value ? tw`border-b-4 border-blue-500` : null
            ]}
        >
                    <Text
                        style={[
                            tw`text-center text-xs font-medium`,
                            selectedTab === tab.value ? tw`text-blue-500` : tw`text-gray-600`
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
                                            </ScrollView>

        </View>
                            {/* Data Section */}
                            {renderData()}
                        </View>  
                        </SafeAreaView>
                  );
                };

                const styles = StyleSheet.create({
                    safeArea: {
                        flex: 1,
                        backgroundColor: '#f0f0f0', // Matches StatusBar background color
                    },
                    container: {
                        flex: 1,
                        paddingHorizontal: 20,
                        paddingTop: 10, // Adjust this to reduce the gap
                    },
                    header: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginBottom: 10, // Adjust to tweak spacing from the content
                    },
                });
                
                

                
                export default SnapshotPage;

