import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
        setLoading(true);
        try {
            await login(email.trim().toLowerCase(), password);
            router.replace("/(tabs)/feed");
        } catch (err) {
            Alert.alert(
                "Login Failed",
                err.response?.data?.message || err.message || "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-[#0f0f1a]">
            <LinearGradient
                colors={["#1a0533", "#0f0f1a", "#0f0f1a"]}
                className="absolute inset-0 top-0 left-0 right-0"
                style={{ height: 300 }}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View className="items-center pt-20 pb-10 px-6">
                        <View className="w-20 h-20 rounded-3xl bg-purple-600 items-center justify-center mb-4 shadow-lg">
                            <Text className="text-4xl">💻</Text>
                        </View>
                        <Text className="text-white text-4xl font-bold tracking-tight">
                            DevTinder
                        </Text>
                        <Text className="text-purple-400 text-base mt-2">
                            Connect with developers worldwide
                        </Text>
                    </View>

                    {/* Form Card */}
                    <View className="mx-6 bg-white/5 rounded-3xl p-6 border border-white/10">
                        <Text className="text-white text-2xl font-bold mb-6">
                            Welcome back 👋
                        </Text>

                        {/* Email */}
                        <View className="mb-4">
                            <Text className="text-purple-300 text-sm mb-2 font-medium">
                                Email Address
                            </Text>
                            <View className="flex-row items-center bg-white/10 rounded-xl px-4 border border-white/10">
                                <Ionicons name="mail-outline" size={18} color="#a78bfa" />
                                <TextInput
                                    className="flex-1 text-white py-3.5 px-3 text-base"
                                    placeholder="developer@example.com"
                                    placeholderTextColor="#4b5563"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        {/* Password */}
                        <View className="mb-2">
                            <Text className="text-purple-300 text-sm mb-2 font-medium">
                                Password
                            </Text>
                            <View className="flex-row items-center bg-white/10 rounded-xl px-4 border border-white/10">
                                <Ionicons name="lock-closed-outline" size={18} color="#a78bfa" />
                                <TextInput
                                    className="flex-1 text-white py-3.5 px-3 text-base"
                                    placeholder="Enter your password"
                                    placeholderTextColor="#4b5563"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={18}
                                        color="#a78bfa"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity
                            onPress={() => router.push("/(auth)/forgot-password")}
                            className="self-end mb-6"
                        >
                            <Text className="text-purple-400 text-sm">Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            <LinearGradient
                                colors={["#9333ea", "#7c3aed"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="rounded-xl py-4 items-center"
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-bold text-base">
                                        Sign In
                                    </Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View className="flex-row items-center my-6">
                            <View className="flex-1 h-px bg-white/10" />
                            <Text className="text-gray-500 mx-3 text-sm">
                                Don't have an account?
                            </Text>
                            <View className="flex-1 h-px bg-white/10" />
                        </View>

                        {/* Signup Link */}
                        <TouchableOpacity
                            onPress={() => router.push("/(auth)/signup")}
                            className="border border-purple-500/50 rounded-xl py-3.5 items-center"
                        >
                            <Text className="text-purple-400 font-semibold text-base">
                                Create Account
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="pb-10" />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
