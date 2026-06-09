import React from 'react';
import { Text, TextProps } from './Themed';
import { Platform } from 'react-native';

export function MonoText(props: TextProps) {
  return (
    <Text
      {...props}
      style={[
        props.style,
        { 
          fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
          fontWeight: '700' 
        }
      ]}
    />
  );
}