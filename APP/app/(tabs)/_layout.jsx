import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

function TabIcon({ name, label, focused }) {
    return (
        <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 4, minWidth: 72 }}>
            <Ionicons name={name} size={22} color={focused ? "#a855f7" : "#4b5563"} />
            <Text
                numberOfLines={1}
                style={{
                    color: focused ? "#a855f7" : "#4b5563",
                    fontSize: 10,
                    marginTop: 2,
                    textAlign: "center",
                }}
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
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name={focused ? "flame" : "flame-outline"} label="Discover" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="connections"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name={focused ? "people" : "people-outline"} label="Network" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="requests"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name={focused ? "notifications" : "notifications-outline"} label="Requests" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name={focused ? "person" : "person-outline"} label="Profile" focused={focused} />
                    ),
                }}
            />
        </Tabs>
    );
}
