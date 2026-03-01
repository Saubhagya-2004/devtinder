import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function RequestsScreen() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [actionIds, setActionIds] = useState([]);

    const fetchRequests = useCallback(async () => {
        try {
            const res = await axiosInstance.get("/user/requests/recived");
            setRequests(res.data.data || []);
        } catch (err) {
            setRequests([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchRequests(); }, []);

    const onRefresh = () => { setRefreshing(true); fetchRequests(); };

    const handleAction = async (requestId, status) => {
        setActionIds((prev) => [...prev, requestId]);
        try {
            await axiosInstance.post(`/request/review/${status}/${requestId}`);
            setRequests((prev) => prev.filter((r) => r._id !== requestId));
        } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "Action failed.");
        } finally {
            setActionIds((prev) => prev.filter((id) => id !== requestId));
        }
    };

    const renderItem = ({ item }) => {
        const sender = item.senderId;
        const isActing = actionIds.includes(item._id);
        const photoUrl =
            sender.profile ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(sender.firstName + "+" + sender.lastName)}&background=9333ea&color=fff&size=200`;

        return (
            <View className="flex-row items-center mx-4 mb-3 bg-white/5 rounded-2xl p-4 border border-white/10">
                <Image source={{ uri: photoUrl }} className="w-14 h-14 rounded-full" />
                <View className="flex-1 ml-3">
                    <Text className="text-white font-semibold text-base">
                        {sender.firstName} {sender.lastName}
                    </Text>
                    {sender.profile?.profession && (
                        <Text className="text-purple-400 text-xs mt-0.5">
                            {sender.profile.profession}
                        </Text>
                    )}
                    <Text className="text-gray-500 text-xs mt-1">
                        Wants to connect with you
                    </Text>
                </View>
                {isActing ? (
                    <ActivityIndicator size="small" color="#a855f7" />
                ) : (
                    <View className="flex-row gap-2">
                        <TouchableOpacity
                            onPress={() => handleAction(item._id, "rejected")}
                            className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/40 items-center justify-center"
                        >
                            <Ionicons name="close" size={18} color="#ef4444" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleAction(item._id, "accepted")}
                            className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/40 items-center justify-center"
                        >
                            <Ionicons name="checkmark" size={18} color="#22c55e" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
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
                <Text className="text-white text-2xl font-bold">Connection Requests</Text>
                <Text className="text-gray-400 text-sm">
                    {requests.length} pending request{requests.length !== 1 ? "s" : ""}
                </Text>
            </LinearGradient>

            {requests.length === 0 ? (
                <View className="flex-1 items-center justify-center px-8">
                    <Text className="text-5xl mb-4">📬</Text>
                    <Text className="text-white text-xl font-bold text-center">No pending requests</Text>
                    <Text className="text-gray-400 text-center mt-2">
                        When developers like your profile, their requests will appear here.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={requests}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#a855f7" />
                    }
                    contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
                />
            )}
        </View>
    );
}
