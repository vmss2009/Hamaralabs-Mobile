import React from 'react';
import { Text } from 'react-native';
import Hyperlink from 'react-native-hyperlink';
import { Linking } from 'react-native';
import tw from 'twrnc'; // Assuming you are using Tailwind for styling

const HyperText = ({ content, style }: { content: string, style: any }) => {
    return (
        <Hyperlink onPress={(url) => Linking.openURL(url)} linkStyle={tw`text-blue-500 underline`}>
            <Text style={style}>
                {content}
            </Text>
        </Hyperlink>
    );
};

export default HyperText;