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
import axiosInstance from "../../utils/axiosInstance";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const GENDER_OPTIONS = ["Male", "Female", "Others"];

export default function SignupScreen() {
    const router = useRouter();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        age: "",
        gender: "Male",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

    const handleSignup = async () => {
        const { firstName, lastName, email, password, age, gender } = form;
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !age.trim()) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }
        if (parseInt(age) < 18 || parseInt(age) > 100) {
            Alert.alert("Error", "Age must be between 18 and 100.");
            return;
        }
        setLoading(true);
        try {
            await axiosInstance.post("/signup", {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim().toLowerCase(),
                password,
                age: parseInt(age),
                gender,
            });
            // Navigate to login after success — auto-login requires backend redeploy
            Alert.alert(
                "Account Created! 🎉",
                "Your account is ready. Please log in with your credentials.",
                [{ text: "Go to Login", onPress: () => router.replace("/(auth)/login") }]
            );
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Signup failed.";
            // If it's a duplicate key error but user wasn't shown before, guide them
            if (msg.includes("duplicate") || msg.includes("E11000")) {
                Alert.alert("Already Registered", "This email already exists. Please log in instead.", [
                    { text: "Login", onPress: () => router.replace("/(auth)/login") },
                    { text: "Cancel", style: "cancel" },
                ]);
            } else {
                Alert.alert("Signup Failed", msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-[#0f0f1a]">
            <LinearGradient
                colors={["#1a0533", "#0f0f1a"]}
                className="absolute top-0 left-0 right-0"
                style={{ height: 200 }}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Back */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mt-14 ml-6 mb-2 flex-row items-center"
                    >
                        <Ionicons name="arrow-back" size={22} color="#a78bfa" />
                        <Text className="text-purple-400 ml-1 text-base">Back</Text>
                    </TouchableOpacity>

                    {/* Header */}
                    <View className="px-6 mb-6">
                        <Text className="text-white text-3xl font-bold">
                            Join DevTinder
                        </Text>
                        <Text className="text-gray-400 mt-1">
                            Connect with top developers
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="mx-6 bg-white/5 rounded-3xl p-6 border border-white/10">
                        {/* Name Row */}
                        <View className="flex-row gap-3 mb-4">
                            <View className="flex-1">
                                <Text className="text-purple-300 text-xs mb-1.5 font-medium">First Name *</Text>
                                <TextInput
                                    className="bg-white/10 rounded-xl px-4 py-3.5 text-white border border-white/10"
                                    placeholder="John"
                                    placeholderTextColor="#4b5563"
                                    value={form.firstName}
                                    onChangeText={(v) => update("firstName", v)}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-purple-300 text-xs mb-1.5 font-medium">Last Name *</Text>
                                <TextInput
                                    className="bg-white/10 rounded-xl px-4 py-3.5 text-white border border-white/10"
                                    placeholder="Doe"
                                    placeholderTextColor="#4b5563"
                                    value={form.lastName}
                                    onChangeText={(v) => update("lastName", v)}
                                />
                            </View>
                        </View>

                        {/* Email */}
                        <View className="mb-4">
                            <Text className="text-purple-300 text-xs mb-1.5 font-medium">Email *</Text>
                            <View className="flex-row items-center bg-white/10 rounded-xl px-4 border border-white/10">
                                <Ionicons name="mail-outline" size={16} color="#a78bfa" />
                                <TextInput
                                    className="flex-1 text-white py-3.5 px-2"
                                    placeholder="developer@example.com"
                                    placeholderTextColor="#4b5563"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={form.email}
                                    onChangeText={(v) => update("email", v)}
                                />
                            </View>
                        </View>

                        {/* Password */}
                        <View className="mb-4">
                            <Text className="text-purple-300 text-xs mb-1.5 font-medium">Password *</Text>
                            <View className="flex-row items-center bg-white/10 rounded-xl px-4 border border-white/10">
                                <Ionicons name="lock-closed-outline" size={16} color="#a78bfa" />
                                <TextInput
                                    className="flex-1 text-white py-3.5 px-2"
                                    placeholder="e.g. MyPass@123"
                                    placeholderTextColor="#4b5563"
                                    secureTextEntry={!showPassword}
                                    value={form.password}
                                    onChangeText={(v) => update("password", v)}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={16}
                                        color="#a78bfa"
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text className="text-gray-500 text-xs mt-1 ml-1">
                                Min 8 chars · Uppercase · Number · Symbol (e.g. Test@1234)
                            </Text>
                        </View>

                        {/* Age & Gender Row */}
                        <View className="flex-row gap-3 mb-5">
                            <View className="w-24">
                                <Text className="text-purple-300 text-xs mb-1.5 font-medium">Age *</Text>
                                <TextInput
                                    className="bg-white/10 rounded-xl px-4 py-3.5 text-white border border-white/10"
                                    placeholder="25"
                                    placeholderTextColor="#4b5563"
                                    keyboardType="numeric"
                                    maxLength={3}
                                    value={form.age}
                                    onChangeText={(v) => update("age", v)}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-purple-300 text-xs mb-1.5 font-medium">Gender *</Text>
                                <View className="flex-row gap-2">
                                    {GENDER_OPTIONS.map((g) => (
                                        <TouchableOpacity
                                            key={g}
                                            onPress={() => update("gender", g)}
                                            className={`flex-1 py-3.5 rounded-xl items-center border ${form.gender === g
                                                ? "bg-purple-600 border-purple-600"
                                                : "bg-white/10 border-white/10"
                                                }`}
                                        >
                                            <Text
                                                className={`text-xs font-medium ${form.gender === g ? "text-white" : "text-gray-400"
                                                    }`}
                                            >
                                                {g}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        {/* Create Account Button */}
                        <TouchableOpacity onPress={handleSignup} disabled={loading} activeOpacity={0.85}>
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
                                        Create Account
                                    </Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Login link */}
                        <TouchableOpacity
                            onPress={() => router.replace("/(auth)/login")}
                            className="mt-4 items-center"
                        >
                            <Text className="text-gray-400">
                                Already have an account?{" "}
                                <Text className="text-purple-400 font-semibold">Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View className="pb-10" />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
