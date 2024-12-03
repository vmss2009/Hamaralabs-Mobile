import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import auth from '@/firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import db from '@/firebase/firestore';
import tw from "twrnc";

const Index = () => {
    const router = useRouter();
    
    const [user, setUser] = useState<any>();
    const [userRole, setUserRole] = useState<any>("");

    useEffect(() => {
        onAuthStateChanged(auth, async (newUser) => {
            setUser(newUser);
            if (newUser) {
                const ref = doc(db, "atlUsers", newUser.uid);
                onSnapshot(ref, async (docSnap) => {
                    if (docSnap.exists()) {
                        let data = docSnap.data();
                     if (data && data.role !== undefined) {
                            let role = data.role;
                            setUserRole(role);
                        } else {
                            console.error('Role is undefined or does not exist in the document');
                        }
                    } else {
                        console.error('Document does not exist');
                    }
                });
            } else {
                router.replace("/login")
            }
        });        
    }, []);

    return (
        <View style={styles.container}>
            {
                user ?
                <View style={{ marginTop: 15 }}>
                    <Text style={tw`text-xl font-extrabold mb-6`}>Welcome, {user.email}!</Text>
                    <Text style={tw`text-lg font-semibold mb-10`}>You are {userRole && userRole}.</Text>

                    <View style={tw`mb-5`}>
                        <Button title="student snapshot" onPress={() => router.replace("/student-snapshot/snapshot")} />
                    </View>
                    <View style={tw`mb-5`}>
                        <Button title="payments" onPress={() => router.replace("/(pages)/payments/payments")} />
                    </View>




                    <View>
                        <Button title="Logout" onPress={() => auth.signOut()} />
                    </View>
                </View> :  <View style={{ marginTop: 15 }}><Text>You aren't logged in! The app is glitched please re-open!</Text></View>
            }
        </View>
    );
};

// Styling the components
const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        fontSize: 18,
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
});

export default Index;
