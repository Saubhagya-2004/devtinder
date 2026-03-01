import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { SOCKET_URL } from "../../constants/api";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function ChatScreen() {
    const { userId, name } = useLocalSearchParams();
    const { user } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const socketRef = useRef(null);
    const flatListRef = useRef(null);
    const targetName = name ? decodeURIComponent(name).replace(/\+/g, " ") : "Developer";

    useEffect(() => {
        setupChat();
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const setupChat = async () => {
        await loadMessages();
        await connectSocket();
    };

    const loadMessages = async () => {
        try {
            const res = await axiosInstance.get(`/chat/${userId}`);
            const rawMessages = res.data.messages || [];
            const normalized = rawMessages.map((m) => ({
                _id: m._id,
                text: m.text,
                senderId: m.senderId?._id || m.senderId,
                senderName: m.senderId?.firstName
                    ? `${m.senderId.firstName} ${m.senderId.lastName}`
                    : "",
                createdAt: m.createdAt,
            }));
            setMessages(normalized);
        } catch (err) {
            console.log("Chat load error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const connectSocket = async () => {
        const token = await AsyncStorage.getItem("token");
        const socket = io(SOCKET_URL, {
            transports: ["websocket"],
            auth: { token },
        });
        socketRef.current = socket;

        socket.on("connect", () => {
            socket.emit("joinChat", {
                firstName: user?.firstName,
                userId: user?._id,
                targetuserId: userId,
            });
        });

        socket.on("messageRecived", ({ firstName, textmsg }) => {
            const isMe = firstName === user?.firstName;
            const newMsg = {
                _id: Date.now().toString(),
                text: textmsg,
                senderId: isMe ? user?._id : userId,
                senderName: firstName,
                createdAt: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, newMsg]);
            flatListRef.current?.scrollToEnd({ animated: true });
        });

        socket.on("messageError", ({ error }) => {
            console.log("Socket error:", error);
        });
    };

    const sendMessage = () => {
        if (!text.trim() || !socketRef.current) return;
        const msg = text.trim();
        setText("");
        setSending(true);
        socketRef.current.emit("sendMessage", {
            firstName: user?.firstName,
            userId: user?._id,
            targetuserId: userId,
            textmsg: msg,
        });
        setSending(false);
    };

    const renderMessage = ({ item }) => {
        const isMe = item.senderId === user?._id || item.senderId?.toString() === user?._id?.toString();
        return (
            <View className={`flex-row mb-2 px-4 ${isMe ? "justify-end" : "justify-start"}`}>
                <View
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${isMe
                            ? "bg-purple-600 rounded-br-sm"
                            : "bg-white/10 border border-white/10 rounded-bl-sm"
                        }`}
                >
                    {!isMe && item.senderName && (
                        <Text className="text-purple-300 text-xs mb-0.5 font-medium">
                            {item.senderName}
                        </Text>
                    )}
                    <Text className="text-white text-sm leading-5">{item.text}</Text>
                    <Text className={`text-xs mt-1 ${isMe ? "text-purple-200" : "text-gray-500"}`}>
                        {item.createdAt
                            ? new Date(item.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : ""}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0f0f1a]">
            {/* Header */}
            <LinearGradient colors={["#1a0533", "#0f0f1a"]} className="px-4 pt-4 pb-3">
                <View className="flex-row items-center gap-3">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={22} color="#a78bfa" />
                    </TouchableOpacity>
                    <View className="w-9 h-9 rounded-full bg-purple-600 items-center justify-center">
                        <Text className="text-white font-bold text-sm">
                            {targetName.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-semibold text-base">{targetName}</Text>
                        <Text className="text-green-400 text-xs">Connected</Text>
                    </View>
                </View>
            </LinearGradient>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#a855f7" />
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
                        renderItem={renderMessage}
                        contentContainerStyle={{ paddingVertical: 12 }}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center py-20">
                                <Text className="text-4xl mb-3">💬</Text>
                                <Text className="text-gray-400 text-center">
                                    Start the conversation!{"\n"}Say hello to {targetName}.
                                </Text>
                            </View>
                        }
                    />
                )}

                {/* Input */}
                <View className="flex-row items-end px-4 py-3 border-t border-white/10 gap-3 bg-[#0f0f1a]">
                    <TextInput
                        className="flex-1 bg-white/10 rounded-2xl px-4 py-3 text-white border border-white/10 max-h-24"
                        placeholder="Type a message..."
                        placeholderTextColor="#4b5563"
                        value={text}
                        onChangeText={setText}
                        multiline
                        onSubmitEditing={sendMessage}
                        blurOnSubmit={false}
                    />
                    <TouchableOpacity
                        onPress={sendMessage}
                        disabled={!text.trim() || sending}
                        className="w-11 h-11 rounded-full bg-purple-600 items-center justify-center"
                        style={{ opacity: !text.trim() ? 0.5 : 1 }}
                    >
                        <Ionicons name="send" size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
