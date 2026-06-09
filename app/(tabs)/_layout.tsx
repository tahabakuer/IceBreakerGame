import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { FLIPSIDE_THEME } from '@/constants/theme';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: FLIPSIDE_THEME.colors.textPrimary,
        tabBarInactiveTintColor: FLIPSIDE_THEME.colors.textMuted,
        
        // Brutalist alt bar
        tabBarStyle: {
          backgroundColor: FLIPSIDE_THEME.colors.background,
          borderTopWidth: 1,
          borderColor: FLIPSIDE_THEME.colors.borderDark,
          height: 64,
          paddingBottom: 10,
        },
        
        // Header kapalı (Custom UI'mız zaten GameTable içerisinde)
        headerShown: false,
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'TABLE',
          tabBarIcon: ({ color }) => <TabBarIcon name="gamepad" color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="two"
        options={{
          title: 'ANALYTICS',
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
        }}
      />
    </Tabs>
  );
}