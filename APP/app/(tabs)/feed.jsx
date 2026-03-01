import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    Alert,
    Animated,
    PanResponder,
} from "react-native";
import { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const CARD_W = SCREEN_W - 32;
const SWIPE_THRESHOLD = SCREEN_W * 0.28;

function UserCard({ user, onSwipeLeft, onSwipeRight, isTop }) {
    const pan = useRef(new Animated.ValueXY()).current;
    const rotate = pan.x.interpolate({
        inputRange: [-SCREEN_W / 2, 0, SCREEN_W / 2],
        outputRange: ["-15deg", "0deg", "15deg"],
        extrapolate: "clamp",
    });
    const likeOpacity = pan.x.interpolate({
        inputRange: [0, SCREEN_W / 5],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });
    const nopeOpacity = pan.x.interpolate({
        inputRange: [-SCREEN_W / 5, 0],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => isTop,
            onMoveShouldSetPanResponder: () => isTop,
            onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
                useNativeDriver: false,
            }),
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    Animated.timing(pan, {
                        toValue: { x: SCREEN_W + 100, y: gesture.dy },
                        duration: 300,
                        useNativeDriver: false,
                    }).start(() => onSwipeRight());
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    Animated.timing(pan, {
                        toValue: { x: -SCREEN_W - 100, y: gesture.dy },
                        duration: 300,
                        useNativeDriver: false,
                    }).start(() => onSwipeLeft());
                } else {
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    const cardStyle = {
        transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
        position: "absolute",
        width: CARD_W,
        zIndex: isTop ? 10 : 5,
    };

    const photoUrl =
        user.profile ||
        "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(`${user.firstName}+${user.lastName}`) +
        "&background=9333ea&color=fff&size=400";

    return (
        <Animated.View style={cardStyle} {...panResponder.panHandlers}>
            <View className="rounded-3xl overflow-hidden" style={{ height: SCREEN_H * 0.62 }}>
                <Image
                    source={{ uri: photoUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
                {/* LIKE Badge */}
                <Animated.View
                    className="absolute top-10 left-6 bg-green-500 border-4 border-green-500 rounded-xl px-4 py-2"
                    style={{ opacity: likeOpacity, transform: [{ rotate: "-20deg" }] }}
                >
                    <Text className="text-white font-black text-2xl">LIKE</Text>
                </Animated.View>
                {/* NOPE Badge */}
                <Animated.View
                    className="absolute top-10 right-6 bg-red-500 border-4 border-red-500 rounded-xl px-4 py-2"
                    style={{ opacity: nopeOpacity, transform: [{ rotate: "20deg" }] }}
                >
                    <Text className="text-white font-black text-2xl">NOPE</Text>
                </Animated.View>
                {/* Info Overlay */}
                <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.95)"]}
                    className="absolute bottom-0 left-0 right-0 p-5"
                >
                    <Text className="text-white text-2xl font-bold">
                        {user.firstName} {user.lastName}, {user.age}
                    </Text>
                    {user.profession && (
                        <Text className="text-purple-300 text-sm font-medium mt-0.5">
                            {user.profession}
                        </Text>
                    )}
                    {user.Bio && (
                        <Text className="text-gray-300 text-sm mt-1" numberOfLines={2}>
                            {user.Bio}
                        </Text>
                    )}
                    {user.skills?.length > 0 && (
                        <View className="flex-row flex-wrap gap-1.5 mt-2">
                            {user.skills.slice(0, 4).map((skill, i) => (
                                <View key={i} className="bg-purple-600/70 rounded-full px-2.5 py-0.5">
                                    <Text className="text-white text-xs">{skill}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </LinearGradient>
            </View>
        </Animated.View>
    );
}

export default function FeedScreen() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [empty, setEmpty] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchFeed = useCallback(async (pageNum = 1) => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/feed?page=${pageNum}&limit=10`);
            const newUsers = res.data.data || [];
            if (newUsers.length === 0) {
                setEmpty(true);
            } else {
                setUsers((prev) => (pageNum === 1 ? newUsers : [...prev, ...newUsers]));
                setEmpty(false);
            }
        } catch (err) {
            console.log("Feed error:", err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFeed(1);
    }, []);

    const handleSwipe = async (type) => {
        if (users.length === 0 || actionLoading) return;
        const target = users[users.length - 1];
        setActionLoading(true);
        try {
            await axiosInstance.post(`/request/send/${type}/${target._id}`);
        } catch (err) {
            console.log("Swipe error:", err.response?.data?.message);
        } finally {
            setActionLoading(false);
            setUsers((prev) => prev.slice(0, -1));
            // Load more when running low
            if (users.length <= 2) {
                setPage((p) => {
                    const next = p + 1;
                    fetchFeed(next);
                    return next;
                });
            }
        }
    };

    if (loading && users.length === 0) {
        return (
            <View className="flex-1 bg-[#0f0f1a] items-center justify-center">
                <ActivityIndicator size="large" color="#a855f7" />
                <Text className="text-gray-400 mt-4">Finding developers...</Text>
            </View>
        );
    }

    if (empty || users.length === 0) {
        return (
            <View className="flex-1 bg-[#0f0f1a] items-center justify-center px-8">
                <Text className="text-6xl mb-4">🎉</Text>
                <Text className="text-white text-2xl font-bold text-center">
                    You're all caught up!
                </Text>
                <Text className="text-gray-400 text-center mt-2">
                    No more developers to discover right now.
                </Text>
                <TouchableOpacity
                    onPress={() => { setPage(1); fetchFeed(1); }}
                    className="mt-6 bg-purple-600 px-8 py-3.5 rounded-2xl"
                >
                    <Text className="text-white font-bold">Refresh Feed</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#0f0f1a]">
            {/* Header */}
            <LinearGradient
                colors={["#1a0533", "#0f0f1a"]}
                className="pt-14 pb-4 px-6"
            >
                <Text className="text-white text-2xl font-bold">
                    Discover 🔥
                </Text>
                <Text className="text-gray-400 text-sm">
                    Swipe right to connect, left to pass
                </Text>
            </LinearGradient>

            {/* Card Stack */}
            <View className="flex-1 items-center justify-center px-4">
                <View style={{ width: CARD_W, height: SCREEN_H * 0.62 }}>
                    {users.slice(-3).map((u, i, arr) => (
                        <UserCard
                            key={u._id}
                            user={u}
                            isTop={i === arr.length - 1}
                            onSwipeRight={() => handleSwipe("interested")}
                            onSwipeLeft={() => handleSwipe("ignored")}
                        />
                    ))}
                </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-center items-center gap-6 pb-6 pt-2">
                <TouchableOpacity
                    onPress={() => handleSwipe("ignored")}
                    disabled={actionLoading}
                    className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/50 items-center justify-center"
                >
                    <Ionicons name="close" size={28} color="#ef4444" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleSwipe("interested")}
                    disabled={actionLoading}
                    className="w-20 h-20 rounded-full bg-purple-600 items-center justify-center shadow-lg"
                >
                    <Ionicons name="heart" size={32} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { setPage(1); fetchFeed(1); }}
                    className="w-16 h-16 rounded-full bg-yellow-500/20 border border-yellow-500/50 items-center justify-center"
                >
                    <Ionicons name="star" size={24} color="#eab308" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
