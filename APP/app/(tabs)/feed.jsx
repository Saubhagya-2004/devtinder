import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    Animated,
    PanResponder,
    useRef,
    Alert,
} from "react-native";
import { useState, useEffect, useRef as useRefRN, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const CARD_W = SCREEN_W - 32;
const SWIPE_THRESHOLD = SCREEN_W * 0.28;

function UserCard({ user, onSwipeLeft, onSwipeRight, isTop }) {
    const pan = useRefRN(new Animated.ValueXY()).current;

    // KEY FIX: track latest isTop in a ref so the PanResponder closure always has fresh value
    const isTopRef = useRefRN(isTop);
    useEffect(() => {
        isTopRef.current = isTop;
    }, [isTop]);

    // Derived animated values
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

    // Swipe out helpers (called by buttons too)
    const swipeRight = useCallback(() => {
        Animated.timing(pan, {
            toValue: { x: SCREEN_W + 100, y: 0 },
            duration: 280,
            useNativeDriver: false,
        }).start(() => {
            pan.setValue({ x: 0, y: 0 });
            onSwipeRight();
        });
    }, []);

    const swipeLeft = useCallback(() => {
        Animated.timing(pan, {
            toValue: { x: -SCREEN_W - 100, y: 0 },
            duration: 280,
            useNativeDriver: false,
        }).start(() => {
            pan.setValue({ x: 0, y: 0 });
            onSwipeLeft();
        });
    }, []);

    const panResponder = useRefRN(
        PanResponder.create({
            // Read from ref, not closure, so this always has the current isTop value
            onStartShouldSetPanResponder: () => isTopRef.current,
            onMoveShouldSetPanResponder: (_, gesture) =>
                isTopRef.current && (Math.abs(gesture.dx) > 5 || Math.abs(gesture.dy) > 5),

            onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
                useNativeDriver: false,
            }),

            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    Animated.timing(pan, {
                        toValue: { x: SCREEN_W + 100, y: gesture.dy },
                        duration: 280,
                        useNativeDriver: false,
                    }).start(() => {
                        pan.setValue({ x: 0, y: 0 });
                        onSwipeRight();
                    });
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    Animated.timing(pan, {
                        toValue: { x: -SCREEN_W - 100, y: gesture.dy },
                        duration: 280,
                        useNativeDriver: false,
                    }).start(() => {
                        pan.setValue({ x: 0, y: 0 });
                        onSwipeLeft();
                    });
                } else {
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        friction: 6,
                        useNativeDriver: false,
                    }).start();
                }
            },

            onPanResponderTerminationRequest: () => false,
        })
    ).current;

    const photoUrl =
        user.profile ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            `${user.firstName}+${user.lastName}`
        )}&background=9333ea&color=fff&size=400`;

    return (
        <Animated.View
            style={{
                transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
                position: "absolute",
                width: CARD_W,
                zIndex: isTop ? 10 : 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 10,
            }}
            {...panResponder.panHandlers}
        >
            <View
                style={{
                    borderRadius: 24,
                    overflow: "hidden",
                    height: SCREEN_H * 0.6,
                }}
            >
                <Image
                    source={{ uri: photoUrl }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                />

                {/* LIKE Badge */}
                <Animated.View
                    style={{
                        position: "absolute",
                        top: 40,
                        left: 24,
                        opacity: likeOpacity,
                        transform: [{ rotate: "-20deg" }],
                        backgroundColor: "#22c55e",
                        borderRadius: 10,
                        paddingHorizontal: 14,
                        paddingVertical: 6,
                        borderWidth: 3,
                        borderColor: "#22c55e",
                    }}
                >
                    <Text style={{ color: "white", fontWeight: "900", fontSize: 24 }}>
                        LIKE
                    </Text>
                </Animated.View>

                {/* NOPE Badge */}
                <Animated.View
                    style={{
                        position: "absolute",
                        top: 40,
                        right: 24,
                        opacity: nopeOpacity,
                        transform: [{ rotate: "20deg" }],
                        backgroundColor: "#ef4444",
                        borderRadius: 10,
                        paddingHorizontal: 14,
                        paddingVertical: 6,
                        borderWidth: 3,
                        borderColor: "#ef4444",
                    }}
                >
                    <Text style={{ color: "white", fontWeight: "900", fontSize: 24 }}>
                        NOPE
                    </Text>
                </Animated.View>

                {/* Info Gradient Overlay */}
                <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.95)"]}
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: 20,
                    }}
                >
                    <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
                        {user.firstName} {user.lastName}
                        {user.age ? `, ${user.age}` : ""}
                    </Text>
                    {user.profession ? (
                        <Text style={{ color: "#c084fc", fontSize: 13, marginTop: 2 }}>
                            {user.profession}
                        </Text>
                    ) : null}
                    {user.Bio ? (
                        <Text
                            style={{ color: "#d1d5db", fontSize: 13, marginTop: 4 }}
                            numberOfLines={2}
                        >
                            {user.Bio}
                        </Text>
                    ) : null}
                    {user.skills?.length > 0 && (
                        <View
                            style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: 6,
                                marginTop: 8,
                            }}
                        >
                            {user.skills.slice(0, 4).map((skill, i) => (
                                <View
                                    key={i}
                                    style={{
                                        backgroundColor: "rgba(147,51,234,0.7)",
                                        borderRadius: 999,
                                        paddingHorizontal: 10,
                                        paddingVertical: 3,
                                    }}
                                >
                                    <Text style={{ color: "white", fontSize: 11 }}>{skill}</Text>
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
                setUsers((prev) =>
                    pageNum === 1 ? newUsers : [...prev, ...newUsers]
                );
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
        // Remove card immediately for instant feel
        setUsers((prev) => prev.slice(0, -1));
        try {
            await axiosInstance.post(`/request/send/${type}/${target._id}`);
        } catch (err) {
            console.log("Swipe API error:", err.response?.data?.message || err.message);
        } finally {
            setActionLoading(false);
        }
        // Load more when running low
        if (users.length <= 3) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchFeed(nextPage);
        }
    };

    if (loading && users.length === 0) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#0f0f1a",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <ActivityIndicator size="large" color="#a855f7" />
                <Text style={{ color: "#9ca3af", marginTop: 16 }}>
                    Finding developers...
                </Text>
            </View>
        );
    }

    if (empty || users.length === 0) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#0f0f1a",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 32,
                }}
            >
                <Text style={{ fontSize: 60, marginBottom: 16 }}>🎉</Text>
                <Text
                    style={{
                        color: "white",
                        fontSize: 22,
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                >
                    You've seen everyone!
                </Text>
                <Text
                    style={{ color: "#9ca3af", textAlign: "center", marginTop: 8 }}
                >
                    No more developers right now. Check back later.
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        setPage(1);
                        fetchFeed(1);
                    }}
                    style={{
                        marginTop: 24,
                        backgroundColor: "#9333ea",
                        paddingHorizontal: 32,
                        paddingVertical: 14,
                        borderRadius: 16,
                    }}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                        Refresh Feed
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#0f0f1a" }}>
            {/* Header */}
            <LinearGradient
                colors={["#1a0533", "#0f0f1a"]}
                style={{ paddingTop: 56, paddingBottom: 16, paddingHorizontal: 24 }}
            >
                <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
                    Discover 🔥
                </Text>
                <Text style={{ color: "#9ca3af", fontSize: 13 }}>
                    Swipe right to connect · left to pass
                </Text>
            </LinearGradient>

            {/* Card Stack */}
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <View style={{ width: CARD_W, height: SCREEN_H * 0.6 }}>
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
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 24,
                    paddingBottom: 24,
                    paddingTop: 8,
                }}
            >
                {/* Pass */}
                <TouchableOpacity
                    onPress={() => handleSwipe("ignored")}
                    disabled={actionLoading}
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        backgroundColor: "rgba(239,68,68,0.15)",
                        borderWidth: 1.5,
                        borderColor: "rgba(239,68,68,0.4)",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Ionicons name="close" size={28} color="#ef4444" />
                </TouchableOpacity>

                {/* Like */}
                <TouchableOpacity
                    onPress={() => handleSwipe("interested")}
                    disabled={actionLoading}
                    style={{
                        width: 76,
                        height: 76,
                        borderRadius: 38,
                        backgroundColor: "#9333ea",
                        alignItems: "center",
                        justifyContent: "center",
                        shadowColor: "#9333ea",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.5,
                        shadowRadius: 8,
                        elevation: 8,
                    }}
                >
                    <Ionicons name="heart" size={32} color="white" />
                </TouchableOpacity>

                {/* Refresh */}
                <TouchableOpacity
                    onPress={() => {
                        setPage(1);
                        fetchFeed(1);
                    }}
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        backgroundColor: "rgba(234,179,8,0.15)",
                        borderWidth: 1.5,
                        borderColor: "rgba(234,179,8,0.4)",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Ionicons name="refresh" size={24} color="#eab308" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
