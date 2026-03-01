import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import axiosInstance from "../../utils/axiosInstance";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function ConnectionsScreen() {
    const router = useRouter();
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchConnections = useCallback(async () => {
        try {
            const res = await axiosInstance.get("/user/connections");
            setConnections(res.data.data || []);
        } catch (err) {
            setConnections([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchConnections(); }, []);

    const onRefresh = () => { setRefreshing(true); fetchConnections(); };

    const renderItem = ({ item }) => {
        const photoUrl =
            item.profile ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(item.firstName + "+" + item.lastName)}&background=9333ea&color=fff&size=200`;

        return (
            <TouchableOpacity
                onPress={() => router.push(`/chat/${item._id}?name=${item.firstName}+${item.lastName}`)}
                activeOpacity={0.8}
                className="flex-row items-center mx-4 mb-3 bg-white/5 rounded-2xl p-4 border border-white/10"
            >
                <Image
                    source={{ uri: photoUrl }}
                    className="w-14 h-14 rounded-full"
                />
                <View className="flex-1 ml-3">
                    <Text className="text-white font-semibold text-base">
                        {item.firstName} {item.lastName}
                    </Text>
                    {item.profession && (
                        <Text className="text-purple-400 text-xs mt-0.5">{item.profession}</Text>
                    )}
                    {item.Bio && (
                        <Text className="text-gray-500 text-xs mt-0.5" numberOfLines={1}>
                            {item.Bio}
                        </Text>
                    )}
                    {item.skills?.length > 0 && (
                        <View className="flex-row gap-1 mt-1.5 flex-wrap">
                            {item.skills.slice(0, 3).map((s, i) => (
                                <View key={i} className="bg-purple-900/50 rounded-full px-2 py-0.5">
                                    <Text className="text-purple-300 text-xs">{s}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
                <View className="bg-purple-600 rounded-full p-2">
                    <Ionicons name="chatbubble" size={16} color="white" />
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View className="flex-1 bg-[#0f0f1a] items-center justify-center">
                <ActivityIndicator size="large" color="#a855f7" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#0f0f1a]">
            <LinearGradient colors={["#1a0533", "#0f0f1a"]} className="pt-14 pb-4 px-6">
                <Text className="text-white text-2xl font-bold">My Network</Text>
                <Text className="text-gray-400 text-sm">
                    {connections.length} connection{connections.length !== 1 ? "s" : ""}
                </Text>
            </LinearGradient>

            {connections.length === 0 ? (
                <View className="flex-1 items-center justify-center px-8">
                    <Text className="text-5xl mb-4">🤝</Text>
                    <Text className="text-white text-xl font-bold text-center">No connections yet</Text>
                    <Text className="text-gray-400 text-center mt-2">
                        Start swiping on the feed to connect with developers!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={connections}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#a855f7"
                        />
                    }
                    contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
                />
            )}
        </View>
    );
}
