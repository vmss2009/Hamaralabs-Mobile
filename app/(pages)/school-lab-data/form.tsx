import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Button, Alert } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import CheckBox from '@react-native-community/checkbox';
import CheckBox from '@/components/CheckBox';
import Picker from "@/components/Picker";
import tw from 'twrnc'; // NativeWind (Tailwind CSS for React Native)
import { StatusBar } from 'expo-status-bar';
import { addSchool } from '@/firebase/firestore';

const indianProvinces = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
    'Chandigarh', 'Dadra and Nagar Haveli', 'Delhi', 'Jammu and Kashmir', 'Lakshadweep', 'Puducherry',
    'Ladakh'
];

const LabForm = () => {
    const [LabName, setLabName] = useState('');
    const [address, setAddress] = useState({ addressLine1: '', city: '', state: '', pincode: '', country: "India" });
    const [inCharge, setInCharge] = useState({ firstName: '', lastName: '', email: '', whatsappNumber: '' });
    const [principal, setPrincipal] = useState({ firstName: '', lastName: '', email: '', whatsappNumber: '' });
    const [correspondent, setCorrespondent] = useState({ firstName: '', lastName: '', email: '', whatsappNumber: '' });
    const [isSameAsPrincipal, setIsSameAsPrincipal] = useState(false);
    const [syllabi, setSyllabi] = useState({ ICSE: false, CBSE: false, IGCSE: false, State: false, IB: false });
    const [isATL, setIsATL] = useState(false);
    const [isPaidSubscription, setIsPaidSubscription] = useState(false);
    const [website, setWebsite] = useState('');

    const [socialMediaLinks, setSocialMediaLinks] = useState([""]);

    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    // Function to handle adding new social media link fields
    const addSocialMediaLink = () => {
        setSocialMediaLinks([...socialMediaLinks, '']);
    };

    // Function to handle removing a social media link field
    const removeSocialMediaLink = (index: number) => {
        const newLinks = [...socialMediaLinks];
        newLinks.splice(index, 1);
        setSocialMediaLinks(newLinks);
    };

    // Function to handle updating the values of the social media links
    const updateSocialMediaLink = (index: number, field: string, value: string) => {
        const newLinks: string[] = [...socialMediaLinks];
        newLinks[index] = value;
        setSocialMediaLinks(newLinks);
    };


    const handleSubmit = async () => {
        setIsSubmitDisabled(true);

        const formData = {
            name: LabName,
            address,
            atlIncharge: inCharge,
            principal,
            correspondent: isSameAsPrincipal ? principal : correspondent,
            syllabus: {
                icse: syllabi.ICSE,
                cbse: syllabi.CBSE,
                igcse: syllabi.IGCSE,
                ib: syllabi.IB,
                state: syllabi.State
            },
            isATL,
            paidSubscription: isPaidSubscription,
            webSite: website,
            socialMediaLink: socialMediaLinks,
            date: Date().toString()
        };

        await addSchool(formData)
            .then(() => {
                Alert.alert("Data added successfully!")
                resetForm();
            })
            .catch(err => {
                Alert.alert("Process failed! Error: " + err);
            });

        setIsSubmitDisabled(false);
    };

    const resetForm = () => {
        setLabName('');
        setAddress({ addressLine1: '', city: '', state: '', pincode: '', country: "India" });
        setInCharge({ firstName: '', lastName: '', email: '', whatsappNumber: '' });
        setPrincipal({ firstName: '', lastName: '', email: '', whatsappNumber: '' });
        setCorrespondent({ firstName: '', lastName: '', email: '', whatsappNumber: '' });
        setIsSameAsPrincipal(false);
        setSyllabi({ ICSE: false, CBSE: false, IGCSE: false, State: false, IB: false });
        setIsATL(false);
        setIsPaidSubscription(false);
        setWebsite('');
    };


    return (
        <ScrollView style={tw`flex-1 p-6 bg-gray-50`}>
            {/* Title */}
            <Text style={tw`text-3xl font-bold text-center mb-8`}>Lab Form</Text>

            {/* Lab Name */}
            <View style={tw`mb-4`}>
                <Text style={tw`text-lg font-semibold mb-2`}>Lab Name</Text>
                <TextInput
                    style={tw`border border-gray-300 rounded-lg p-3 text-lg bg-white focus:border-gray-900`}
                    placeholder="Enter Lab Name"
                    value={LabName}
                    onChangeText={setLabName}
                />
            </View>

            {/* Address */}
            <View style={tw`mb-6`}>
                <Text style={tw`text-lg font-semibold mb-2`}>Address</Text>
                <TextInput
                    style={tw`border border-gray-300 rounded-lg p-3 text-lg bg-white mb-2`}
                    placeholder="Address Line 1"
                    value={address.addressLine1}
                    onChangeText={(text) => setAddress({ ...address, addressLine1: text })}
                />
                <TextInput
                    style={tw`border border-gray-300 rounded-lg p-3 text-lg bg-white mb-2`}
                    placeholder="District"
                    value={address.city}
                    onChangeText={(text) => setAddress({ ...address, city: text })}
                />
                <Picker
                    selectedValue={address.state}
                    onValueChange={(itemValue) => setAddress({ ...address, state: itemValue })}
                    style={tw`border border-gray-300 rounded-lg p-3 text-lg bg-white mb-2`}
                    data={indianProvinces}
                    placeholder="Select State / Province / Union Territory">
                    {/* <Picker.Item label="Select Province/State" value="" />
                    {indianProvinces.map((state, index) => (
                        <Picker.Item key={index} label={state} value={state} />
                    ))} */}
                </Picker>
                <TextInput
                    style={tw`border border-gray-300 rounded-lg p-3 text-lg bg-white`}
                    placeholder="Pincode"
                    keyboardType="numeric"
                    value={address.pincode}
                    onChangeText={(text) => setAddress({ ...address, pincode: text })}
                />
            </View>

            {/* In-Charge */}
            <View style={tw`mb-6`}>
                <Text style={tw`text-lg font-semibold mb-2`}>In-Charge</Text>
                <TextInput
                    style={tw`border border-gray-300 rounded-lg p-3 text-lg bg-white mb-2`}
                    placeholder="First Name"
                    value={inCharge.firstName}
                    onChangeText={(text) => setInCharge({ ...inCharge, firstName: text })}
                />
                <TextInput
                    style={tw`border border-gray-300 rounded-lg p-3 text-lg bg-white mb-2`}
                    placeholder="Last Name"
                    value={inCharge.lastName}
                    onChangeText={(text) => setInCharge({ ...inCharge, lastName: text })}
                />
                <TextInput
                    style={tw`border border-gray-300 rounded-lg p-3 text-lg bg-white mb-2`}
                    placeholder="Email"
                    keyboardType="email-address"
                    value={inCharge.email}
                    onChangeText={(text) => setInCharge({ ...inCharge, email: text })}
                />
                <TextInput
                    style={tw`border border-gray-300 rounded-lg p-3 text-lg bg-white`}
                    placeholder="Whatsapp Contact"
                    keyboardType="phone-pad"
                    value={inCharge.whatsappNumber}
                    onChangeText={(text) => setInCharge({ ...inCharge, whatsappNumber: text })}
                />
            </View>

            {/* Principal */}
            <View style={tw`mb-6`}>
                <Text style={tw`text-lg font-semibold mb-2`}>Principal</Text>
                <TextInput
                    style={tw`border border-gray-300 rounded-lg p-3 text-lg bg-white mb-2`}
                    placeholder="First Name"
                    value={principal.firstName}
                    onChangeText={(text) => setPrincipal({ ...principal, firstName: text })}
                />
                <TextInput
                    style={tw`border border-gray-300 rounded-lg p-3 text-lg bg-white mb-2`}
                    placeholder="Last Name"
                    value={principal.lastName}
                    onChangeText={(text) => setPrincipal({ ...principal, lastName: text })}
                />
                <TextInput
                    style={tw`border border-gray-300 rounded-lg p-3 text-lg bg-white mb-2`}
                    placeholder="Email"
                    keyboardType="email-address"
                    value={principal.email}
                    onChangeText={(text) => setPrincipal({ ...principal, email: text })}
                />
                <TextInput
                    style={tw`border border-gray-300 rounded-lg p-3 text-lg bg-white`}
                    placeholder="Whatsapp Contact"
                    keyboardType="phone-pad"
                    value={principal.whatsappNumber}
                    onChangeText={(text) => setPrincipal({ ...principal, whatsappNumber: text })}
                />
            </View>

            {/* Correspondent */}
            <View style={tw`mb-6`}>
                <Text style={tw`text-lg font-semibold mb-2`}>Correspondent</Text>
                <View style={tw`flex-row items-center mb-2`}>
                    <CheckBox
                        value={isSameAsPrincipal}
                        onValueChange={setIsSameAsPrincipal}
                    />
                    <Text style={tw`ml-2 text-lg`}>Is Same as Principal?</Text>
                </View>
                {!isSameAsPrincipal && (
                    <>
                        <TextInput
                            style={tw`border border-gray-300 rounded-lg p-3 text-lg bg-white mb-2`}
                            placeholder="First Name"
                            value={correspondent.firstName}
                            onChangeText={(text) => setCorrespondent({ ...correspondent, firstName: text })}
                        />
                        <TextInput
                            style={tw`border border-gray-300 rounded-lg p-3 text-lg bg-white mb-2`}
                            placeholder="Last Name"
                            value={correspondent.lastName}
                            onChangeText={(text) => setCorrespondent({ ...correspondent, lastName: text })}
                        />
                        <TextInput
                            style={tw`border border-gray-300 rounded-lg p-3 text-lg bg-white mb-2`}
                            placeholder="Email"
                            keyboardType="email-address"
                            value={correspondent.email}
                            onChangeText={(text) => setCorrespondent({ ...correspondent, email: text })}
                        />
                        <TextInput
                            style={tw`border border-gray-300 rounded-lg p-3 text-lg bg-white`}
                            placeholder="Whatsapp Contact"
                            keyboardType="phone-pad"
                            value={correspondent.whatsappNumber}
                            onChangeText={(text) => setCorrespondent({ ...correspondent, whatsappNumber: text })}
                        />
                    </>
                )}
            </View>

            {/*School Syllabus */}
            <View style={tw`mb-6`}>
                <Text style={tw`text-lg font-semibold mb-2`}>School Syllabus</Text>
                {['ICSE', 'CBSE', 'IGCSE', 'State', 'IB', 'Undergraduation', 'Post Graduation'].map((syllabus) => (
                    <View key={syllabus} style={tw`flex-row items-center mb-2`}>
                        <CheckBox
                            value={syllabi[syllabus as keyof typeof syllabi]}
                            onValueChange={(newValue) =>
                                setSyllabi((prev) => ({ ...prev, [syllabus]: newValue }))
                            }
                        />
                        <Text style={tw`ml-2 text-lg`}>{syllabus}</Text>
                    </View>
                ))}
            </View>

            {/* Website */}
            <View style={tw`mb-6`}>
                <Text style={tw`text-lg font-semibold mb-2`}>Website</Text>
                <TextInput
                    style={tw`border border-gray-300 rounded-lg p-3 text-lg bg-white`}
                    placeholder="Lab Website"
                    value={website}
                    onChangeText={setWebsite}
                    keyboardType="url"
                />
            </View>

            <View style={tw`mb-6`}>
                <Text style={tw`text-xl font-semibold mb-4`}>Social Media Links</Text>
                {socialMediaLinks.map((link, index) => (
                    <View key={index} style={tw`mb-4 p-4 bg-white rounded-lg shadow-md`}>
                        <Text style={tw`text-lg font-semibold mb-2`}>Link {index + 1}</Text>
                        {/* URL Input */}
                        <TextInput
                            keyboardType="url"
                            style={[
                                tw`border p-3 rounded-lg text-base mb-3`,
                            ]}
                            placeholder="Social Media URL here..."
                            value={link}
                            onChangeText={(text) => updateSocialMediaLink(index, 'url', text)}
                        />

                        {/* Remove Button */}
                        <View style={{ width: 200 }}>
                            <Button
                                title="Remove"
                                onPress={() => removeSocialMediaLink(index)}
                                color="#d92341"
                            />
                        </View>
                    </View>
                ))}

                {/* Add Another Link Button */}
                <View style={{ width: 200 }}>
                    <Button
                        title="+ Add Another Social Media Link"
                        onPress={addSocialMediaLink}
                        color="#52d174"
                    />
                </View>
            </View>


            {/* ATL */}
            <View style={tw`mb-6`}>
                <View style={tw`flex-row items-center mb-2`}>
                    <CheckBox value={isATL} onValueChange={setIsATL} />
                    <Text style={tw`ml-2 text-lg`}>Is ATL?</Text>
                </View>
            </View>

            {/* Paid Subscription */}
            <View style={tw`mb-6`}>
                <View style={tw`flex-row items-center mb-2`}>
                    <CheckBox value={isPaidSubscription} onValueChange={setIsPaidSubscription} />
                    <Text style={tw`ml-2 text-lg`}>Is Paid Subscription?</Text>
                </View>
            </View>

            {/* Submit Button */}
            <View style={tw`mb-5`}>
                <Button title="Submit" disabled={isSubmitDisabled} onPress={handleSubmit} color="#4CAF50" />
            </View>
            <View style={tw`mb-10`}>
                <Button title="Reset" onPress={resetForm} color="#FCA5A5" />
            </View>
            <StatusBar style='dark' />
        </ScrollView>
    );
};

export default LabForm;