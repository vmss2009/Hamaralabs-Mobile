import React from 'react';
import { View, Text, Button } from 'react-native';
import tw from 'twrnc';

type StudentCardProps = {
    student: {
        id: string;
        studentName: string;
        schoolName: string;
        className: string;
    };
    onDelete: (id: string) => void;
};

const StudentCard: React.FC<StudentCardProps> = ({ student, onDelete }) => {
    return (
        <View style={tw`bg-white p-4 rounded shadow mb-4`}>
            <Text style={tw`text-lg font-bold`}>{student.studentName}</Text>
            <Text style={tw`text-gray-700`}>School: {student.schoolName}</Text>
            <Text style={tw`text-gray-700`}>Class: {student.className }</Text>
            <Button
                title="Delete"
                color="grey"
                onPress={() => onDelete(student.id)}
            />
        </View>
    );
};

export default StudentCard;
