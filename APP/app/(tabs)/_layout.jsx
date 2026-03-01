import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

function TabIcon({ name, label, focused, color }) {
    return (
        <View className="items-center justify-center pt-1">
            <Ionicons name={name} size={22} color={focused ? "#a855f7" : "#4b5563"} />
            <Text
                className="text-xs mt-0.5"
                style={{ color: focused ? "#a855f7" : "#4b5563" }}
            >
                {label}
            </Text>
        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#0f0f1a",
                    borderTopColor: "#1f1f2e",
                    borderTopWidth: 1,
                    height: 70,
                    paddingBottom: 8,
                },
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="feed"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon name={focused ? "flame" : "flame-outline"} label="Discover" focused={focused} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="connections"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon name={focused ? "people" : "people-outline"} label="Network" focused={focused} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="requests"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon name={focused ? "notifications" : "notifications-outline"} label="Requests" focused={focused} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon name={focused ? "person" : "person-outline"} label="Profile" focused={focused} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
