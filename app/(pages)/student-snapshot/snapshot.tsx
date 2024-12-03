import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { collection, query, where, getDocs, doc, onSnapshot } from 'firebase/firestore';
import tw from 'twrnc';
import db from '@/firebase/firestore';
import CompetitionReportBoxComponent from './components/CompetitionCard';
import CourseReportBoxComponent from './components/CoursesCard';
import TinkeringActivityReportBoxComponent from './components/TinkeringActivityCard';
import SessionReportBoxComponent from './components/SessionCard';
import type { Student, Competition, Course, TinkeringActivity, Session } from '@/firebase/firestore';
import auth from '@/firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import Picker from '@/components/Picker';
import { useRouter } from "expo-router";

const SnapshotPage = () => {
    const router = useRouter();
    const user = auth.currentUser;
    const [student, setStudent] = useState<Student>();
    const [selectedTab, setSelectedTab] = useState<string>('taData');
    const [data, setData] = useState<Competition[] | Course[] | TinkeringActivity[] | Session[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudent = async () => {
            if (user?.email) {
                try {
                    const studentCollection = collection(db, 'studentData');
                    const studentQuery = query(studentCollection, where('email', '==', user.email));
                    const querySnapshot = await getDocs(studentQuery);
                    if (!querySnapshot.empty) {
                        const studentDoc = querySnapshot.docs[0];
                        setStudent({ ...studentDoc.data(), id: studentDoc.id } as Student);
                    }
                } catch (err) {
                    setError('Failed to fetch student data');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchStudent();
    }, [user]);

    useEffect(() => {
        if (student === undefined) return;
        setLoading(true);
        const studentDoc = doc(db, 'studentData', student?.id || "");
        const dataCollection = collection(studentDoc, selectedTab);
        const unsubscribe = onSnapshot(dataCollection, (snapshot) => {
            const dataList = snapshot.docs.map(doc => ({
                id: doc.id,
                path: doc.ref.path,
                ...doc.data(),
            })) as Competition[] | Course[] | TinkeringActivity[] | Session[];
            const temp = dataList[0] as Competition;
            setData(dataList);
            setLoading(false);
        }, (err) => {
            setError('Failed to fetch data');
            setLoading(false);
        });

        return () => unsubscribe();
    }, [selectedTab, student]);

    const tabs = [
        { label: 'Competitions', value: 'competitionData' },
        { label: 'Courses', value: 'coursesData' },
        { label: 'Tinkering Activities', value: 'taData' },
        { label: 'Sessions', value: 'sessionData' }
    ];

    return (
        <View style={tw`flex-1 bg-gray-100 p-4`}>
            {/* Header with Back Button and Centered Text */}
            <View style={tw`flex-row items-center justify-center mt-2`}>
                <TouchableOpacity onPress={() => {router.canGoBack() ? router.back() : router.replace("/")}} style={tw`absolute left-4`}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={tw`text-lg font-bold text-gray-800`}>Snapshot</Text>
                <TouchableOpacity onPress={() => router.replace("/")} style={tw`absolute right-4`}>
                    <Ionicons name="home" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <Picker
                selectedValue={selectedTab}
                onValueChange={(itemValue) => setSelectedTab(itemValue)}
                style={tw`border border-gray-300 rounded-lg p-3 text-lg bg-white mb-2 mt-2`}
                data={tabs}
                placeholder="Select Tab"
            />

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={tw`text-center text-gray-600`}>{error}</Text>
            ) : data.length === 0 ? (
                <Text style={tw`text-center text-gray-600`}>Sorry, no data found</Text>
            ) : (
                <ScrollView>
                    {selectedTab === 'competitionData' && data.map((item, index) => (
                        <CompetitionReportBoxComponent key={index} competition={item as Competition} />
                    ))}
                    {selectedTab === 'coursesData' && data.map((item, index) => (
                        <CourseReportBoxComponent key={index} course={item as Course} />
                    ))}
                    {selectedTab === 'taData' && data.map((item, index) => (
                        <TinkeringActivityReportBoxComponent key={index} activity={item as TinkeringActivity} />
                    ))}
                    {selectedTab === 'sessionData' && data.map((item, index) => (
                        <SessionReportBoxComponent key={index} session={item as Session} />
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

export default SnapshotPage;