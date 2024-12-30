import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Picker from '@/components/Picker';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';
import { TinkeringActivity, updateTinkeringActivity } from '@/firebase/firestore';
import HyperText from '@/components/Textbox';

const TinkeringActivityReportBoxComponent = ({ activity }: { activity: TinkeringActivity }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    activity.status ? activity.status[activity.status.length - 1].status : ''
  );

  const toggleModal = () => setModalVisible(!modalVisible);
  const toggleStatusModal = () => setStatusModalVisible(!statusModalVisible);

  const handleStatusChange = async (status: string) => {
    setSelectedStatus(status);
    const d = new Date();
    const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    activity.status?.push({
      status,
      modifiedAt: currentDate,
    });
    await updateTinkeringActivity(activity);
    toggleStatusModal();
    Alert.alert('Status Updated', `The status has been changed to: ${status}`);
  };

  const statusOptions = [
    'On Hold',
    'Mentor Needed',
    'Started Completing',
    'Ongoing',
    'Nearly Completed',
    'In Review',
    'Review Completed',
    'TA Completed',
  ];
    // Determine background color based on status
    const isCompleted = selectedStatus === 'TA Completed';
    const backgroundColor = isCompleted ? 'rgb(204,255,204)' : 'rgb(224,242,255)'; // Green if completed, light blue otherwise
  

  return (
    <View>
      <View style={tw`mb-2`}>
</View>

      <Pressable
        // style={tw`bg-blue-100 p-4 mb-4 rounded-lg shadow-lg border-l-4 border-blue-500`}
        style={[
          tw`p-4 mb-4 rounded-lg shadow-lg border-l-4`,
          { backgroundColor, borderColor: isCompleted ? 'rgb(102,204,102)' : 'rgb(59,130,246)' },
        ]}

        onPress={toggleModal}
      >
        {/* <Text style={tw`text-s font-bold text-blue-900`}>{activity.taName}</Text> */}
        <Text style={tw`text-lg font-bold text-blue-900 leading-none`}>
  {(activity.taName || '').trim().replace(/\s+/g, ' ')}
</Text>
        {/* <HyperText style={tw`text-sm text-gray-700`} content={activity.intro} />
        <Text style={tw`text-sm text-gray-700`}>Subject: {activity.subject}</Text> */}
         <Text style={tw`text-sm text-gray-700`}>
          Status:{' '}
          {activity.status
            ? `${activity.status[activity.status.length - 1].status} - ${activity.status[activity.status.length - 1].modifiedAt}`
            : ''}
        </Text> 
      </Pressable>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
      <KeyboardAvoidingView
    style={tw`flex-1`}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
  >
          <View style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center`}>

          <View style={tw`bg-white p-6 rounded-lg w-11/12 relative`}>
          <Pressable
              style={tw`absolute top-3 right-3 p-2 bg-gray-600 rounded-full shadow z-50`}
              onPress={toggleModal}
            >
              <Icon name="close" size={12} color="#FFFFFF" />
            </Pressable>
            <ScrollView
          contentContainerStyle={tw`p-4`}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          scrollEventThrottle={16}
        >  
                        {/* <Text style={tw`text-3xl font-bold textDecorationLine: 'underline' text-blue-900 mb-4`}>Tinkering Activity</Text> */}
                        <View>
      <Text style={{ fontSize: 12, color: 'darkblue', textDecorationLine: 'underline', fontWeight: 'bold' }}>
        Tinkering Activity:
      </Text>
    </View>
    {/* <View>
      <Text style={{ fontSize: 32, color: 'darkblue', textDecorationLine: 'underline', fontWeight: 'bold' }}>
        TINKERING ACTIVITY
      </Text>
    </View> */}
            
        {/* <Text style={tw`text-3xl font-bold text-blue-900 mb-2`}>{activity.taName}</Text> */}

              <Text style={tw`text-3xl font-bold text-blue-900 mb-2`}>{activity.taName}</Text>
              <Text style={tw`text-lg mb-4 text-gray-700`}>
              <Text style={tw`font-bold`}>Introduction:</Text> {activity.intro}

                </Text> 
              {/* <Text style={tw`text-lg my-4 text-gray-700`}>Subject: {activity.subject}</Text>
              <Text style={tw`text-lg my-4 text-gray-700`}>Topic: {activity.topic}</Text>
              <Text style={tw`text-lg my-4 text-gray-700`}>Sub-Topic: {activity.subTopic}</Text> */}

              
<Text style={tw`text-lg mb-4 text-gray-700`}>
  <Text style={tw`font-bold`}>Goals:</Text> {activity.goals && activity.goals.join(', ')}
</Text>
<Text style={tw`text-lg mb-4 text-gray-700`}>
  <Text style={tw`font-bold`}>Materials:</Text> {activity.materials && activity.materials.join(', ')}
</Text>

<Text style={tw`text-lg mb-4 text-gray-700`}>
  <Text style={tw`font-bold`}>Instructions:</Text> {activity.instructions && activity.instructions.join(', ')}
</Text>

<Text style={tw`text-lg mb-4 text-gray-700`}>
  <Text style={tw`font-bold`}>Tips:</Text> {activity.tips && activity.tips.join(', ')}
</Text>

<Text style={tw`text-lg mb-4 text-gray-700`}>
  <Text style={tw`font-bold`}>Status:</Text>
</Text>
{activity.status &&
  activity.status.map((statusItem, index) => (
    <Text key={index} style={tw`text-lg text-gray-700`}>
      {statusItem.status} - {statusItem.modifiedAt}
    </Text>
  ))}
            </ScrollView>
          </View>
          </View>

        </KeyboardAvoidingView>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={statusModalVisible}
        onRequestClose={toggleStatusModal}
      >
        <KeyboardAvoidingView
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
                    <View style={tw`bg-white p-6 rounded-lg w-11/12 relative`}>

          {/* <Pressable
            style={tw`bg-white p-6 rounded-lg w-11/12 relative`}
            onPress={() => {}}
          > */}
            <Pressable
              style={tw`absolute top-3 right-3 p-2 bg-gray-600 rounded-full shadow z-50`}
              onPress={toggleStatusModal}
            >
              <Icon name="close" size={12} color="#FFFFFF" />
            </Pressable>
            <Text style={tw`text-2xl font-bold text-blue-900 mb-4`}>Select Status</Text>
            <Picker
              selectedValue={selectedStatus}
              onValueChange={(itemValue) => handleStatusChange(itemValue)}
              data={statusOptions.map((status) => ({ label: status, value: status }))}
              style={tw`w-full`}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default TinkeringActivityReportBoxComponent;
