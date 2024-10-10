import auth from '@/firebase/auth';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { View, Text, TextInput, Linking, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import tw from 'twrnc';

const Login = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isFocusedEmail, setIsFocusedEmail] = useState(false);
    const [isFocusedPassword, setIsFocusedPassword] = useState(false);
    const [isButtonPressed, setIsButtonPressed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in both fields');
            return;
        }

        await signInWithEmailAndPassword(auth, email, password)
        .then(async () => {
            await Alert.alert('Login Successful', `Welcome ${email}!`);
            router.replace("/");
        })
        .catch(err => {
            Alert.alert('Login Failed!', `Login with ${email} failed! Error: `+err.code);
        });
    };

    return (
        <KeyboardAvoidingView
            style={tw`flex-1 bg-gray-100`}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={tw`flex-1 justify-center items-center`}
                keyboardShouldPersistTaps="handled"
            >
                <View style={tw`w-full max-w-md px-4`}>
                    <View style={tw`mb-10`}>
                        <Text style={tw`text-4xl font-bold text-center text-gray-900`}>Login</Text>
                    </View>

                    {/* Email Input */}
                    <View style={tw`mb-6`}>
                        <Text style={tw`text-gray-800 mb-2`}>Email</Text>
                        <TextInput
                            style={tw.style(
                                `bg-white border p-4 rounded-md text-gray-800`,
                                isFocusedEmail ? `border-blue-500` : `border-gray-300`
                            )}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            value={email}
                            onFocus={() => setIsFocusedEmail(true)}
                            onBlur={() => setIsFocusedEmail(false)}
                            onChangeText={setEmail}
                        />
                    </View>

                    {/* Password Input */}
                    <View style={tw`mb-6`}>
                        <Text style={tw`text-gray-800 mb-2`}>Password</Text>
                        <TextInput
                            style={tw.style(
                                `bg-white border p-4 rounded-md text-gray-800`,
                                isFocusedPassword ? `border-blue-500` : `border-gray-300`
                            )}
                            placeholder="Enter your password"
                            secureTextEntry={!showPassword}
                            value={password}
                            onFocus={() => setIsFocusedPassword(true)}
                            onBlur={() => setIsFocusedPassword(false)}
                            onChangeText={setPassword}
                        />

                        {/* Show/Hide Password Button */}
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={tw`ml-2 p-2`}
                        >
                            <Text style={tw`text-blue-500 text-center font-semibold`}>
                                {`Click to ${showPassword ? 'Hide Password' : 'Show Password'}`}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Sign Up Link */}
                    <View style={tw`mb-4 flex-row justify-center`}>
                        <Text style={tw`text-gray-600`}>Forgot password? </Text>
                        <TouchableOpacity onPress={() => {
                            Linking.openURL("https://app.hamaralabs.com/auth/reset-password")
                        }}>
                            <Text style={tw`text-blue-500 font-semibold`}>Reset it here</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity
                        style={tw.style(
                            `bg-blue-500 rounded-md p-4`,
                            isButtonPressed ? `bg-blue-600` : ``
                        )}
                        onPressIn={() => setIsButtonPressed(true)}
                        onPressOut={() => setIsButtonPressed(false)}
                        onPress={handleLogin}
                        activeOpacity={0.7}
                    >
                        <Text style={tw`text-center text-white text-lg font-semibold`}>Login</Text>
                    </TouchableOpacity>

                    <StatusBar style="dark" />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Login;
