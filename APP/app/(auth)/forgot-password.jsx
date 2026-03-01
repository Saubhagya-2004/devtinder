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
import axiosInstance from "../../utils/axiosInstance";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

// Step 1: Email → Step 2: OTP → Step 3: New Password
export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [otpHint, setOtpHint] = useState(""); // stores OTP from server response (dev mode)
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Step 1: Send OTP to email
    const handleSendOtp = async () => {
        if (!email.trim()) {
            Alert.alert("Error", "Please enter your email address.");
            return;
        }
        setLoading(true);
        try {
            const res = await axiosInstance.post("/forgot-password", {
                email: email.trim().toLowerCase(),
            });
            const msg = res.data.message || "";
            // Backend returns OTP in the message when SMTP not configured
            // e.g. "Dev Mode Active: Your OTP is 123456"
            setOtpHint(msg);
            setStep(2);
        } catch (err) {
            Alert.alert(
                "Error",
                err.response?.data?.message || "Failed to send OTP. Check your email address."
            );
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async () => {
        if (!otp.trim() || otp.length < 6) {
            Alert.alert("Error", "Please enter the 6-digit OTP.");
            return;
        }
        setLoading(true);
        try {
            await axiosInstance.post("/verify-otp", {
                email: email.trim().toLowerCase(),
                otp: otp.trim(),
            });
            setStep(3);
        } catch (err) {
            Alert.alert(
                "Error",
                err.response?.data?.message || "Invalid or expired OTP."
            );
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset password
    const handleResetPassword = async () => {
        if (!newPassword.trim() || !confirmPassword.trim()) {
            Alert.alert("Error", "Please fill in both password fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            await axiosInstance.post("/reset-password", {
                email: email.trim().toLowerCase(),
                otp: otp.trim(),
                password: newPassword,
            });
            Alert.alert("Success", "Password reset successfully! Please login.", [
                { text: "OK", onPress: () => router.replace("/(auth)/login") },
            ]);
        } catch (err) {
            Alert.alert(
                "Error",
                err.response?.data?.message || "Failed to reset password."
            );
        } finally {
            setLoading(false);
        }
    };

    const stepConfig = [
        { title: "Forgot Password", subtitle: "Enter your email to receive an OTP" },
        { title: "Verify OTP", subtitle: `We sent a 6-digit code to ${email}` },
        { title: "New Password", subtitle: "Create a strong new password" },
    ];

    return (
        <View className="flex-1 bg-[#0f0f1a]">
            <LinearGradient
                colors={["#1a0533", "#0f0f1a"]}
                className="absolute top-0 left-0 right-0"
                style={{ height: 220 }}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => (step > 1 ? setStep(step - 1) : router.back())}
                        className="mt-14 ml-6 mb-4 flex-row items-center"
                    >
                        <Ionicons name="arrow-back" size={22} color="#a78bfa" />
                        <Text className="text-purple-400 ml-1 text-base">Back</Text>
                    </TouchableOpacity>

                    {/* Step Indicator */}
                    <View className="flex-row items-center justify-center mb-6 px-6">
                        {[1, 2, 3].map((s) => (
                            <View key={s} className="flex-row items-center">
                                <View
                                    className={`w-8 h-8 rounded-full items-center justify-center ${s <= step ? "bg-purple-600" : "bg-white/10"
                                        }`}
                                >
                                    {s < step ? (
                                        <Ionicons name="checkmark" size={14} color="white" />
                                    ) : (
                                        <Text className={`text-xs font-bold ${s <= step ? "text-white" : "text-gray-500"}`}>
                                            {s}
                                        </Text>
                                    )}
                                </View>
                                {s < 3 && (
                                    <View
                                        className={`h-0.5 w-12 mx-1 ${s < step ? "bg-purple-600" : "bg-white/10"}`}
                                    />
                                )}
                            </View>
                        ))}
                    </View>

                    {/* Header */}
                    <View className="px-6 mb-6">
                        <Text className="text-white text-2xl font-bold">
                            {stepConfig[step - 1].title}
                        </Text>
                        <Text className="text-gray-400 mt-1 text-sm">
                            {stepConfig[step - 1].subtitle}
                        </Text>
                    </View>

                    {/* Form Card */}
                    <View className="mx-6 bg-white/5 rounded-3xl p-6 border border-white/10">
                        {/* Step 1 */}
                        {step === 1 && (
                            <>
                                <Text className="text-purple-300 text-sm mb-2 font-medium">
                                    Email Address
                                </Text>
                                <View className="flex-row items-center bg-white/10 rounded-xl px-4 border border-white/10 mb-6">
                                    <Ionicons name="mail-outline" size={18} color="#a78bfa" />
                                    <TextInput
                                        className="flex-1 text-white py-3.5 px-3"
                                        placeholder="developer@example.com"
                                        placeholderTextColor="#4b5563"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </View>
                                <TouchableOpacity onPress={handleSendOtp} disabled={loading} activeOpacity={0.85}>
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
                                                Send OTP
                                            </Text>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>
                            </>
                        )}

                        {/* Step 2 */}
                        {step === 2 && (
                            <>
                                {/* Server OTP hint box (Dev mode / no SMTP) */}
                                {otpHint ? (
                                    <View className="bg-amber-500/15 border border-amber-500/40 rounded-xl p-3 mb-4">
                                        <View className="flex-row items-center gap-2 mb-1">
                                            <Ionicons name="information-circle" size={16} color="#f59e0b" />
                                            <Text className="text-amber-400 text-xs font-semibold">Server Message</Text>
                                        </View>
                                        <Text className="text-amber-300 text-sm">{otpHint}</Text>
                                    </View>
                                ) : (
                                    <View className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mb-4">
                                        <Text className="text-blue-300 text-xs">
                                            📧 Check your email for the OTP (or check the server response above if no email came)
                                        </Text>
                                    </View>
                                )}
                                <Text className="text-purple-300 text-sm mb-2 font-medium">
                                    6-Digit OTP
                                </Text>
                                <TextInput
                                    className="bg-white/10 rounded-xl px-4 py-4 text-white border border-white/10 text-center text-2xl tracking-widest mb-6"
                                    placeholder="• • • • • •"
                                    placeholderTextColor="#4b5563"
                                    keyboardType="numeric"
                                    maxLength={6}
                                    value={otp}
                                    onChangeText={setOtp}
                                />
                                <TouchableOpacity onPress={handleVerifyOtp} disabled={loading} activeOpacity={0.85}>
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
                                                Verify OTP
                                            </Text>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSendOtp}
                                    className="mt-4 items-center"
                                >
                                    <Text className="text-gray-400 text-sm">
                                        Didn't receive?{" "}
                                        <Text className="text-purple-400">Resend OTP</Text>
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}

                        {/* Step 3 */}
                        {step === 3 && (
                            <>
                                <View className="mb-4">
                                    <Text className="text-purple-300 text-sm mb-2 font-medium">
                                        New Password
                                    </Text>
                                    <View className="flex-row items-center bg-white/10 rounded-xl px-4 border border-white/10">
                                        <Ionicons name="lock-closed-outline" size={16} color="#a78bfa" />
                                        <TextInput
                                            className="flex-1 text-white py-3.5 px-2"
                                            placeholder="Strong password"
                                            placeholderTextColor="#4b5563"
                                            secureTextEntry={!showPassword}
                                            value={newPassword}
                                            onChangeText={setNewPassword}
                                        />
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                            <Ionicons
                                                name={showPassword ? "eye-off-outline" : "eye-outline"}
                                                size={16}
                                                color="#a78bfa"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View className="mb-6">
                                    <Text className="text-purple-300 text-sm mb-2 font-medium">
                                        Confirm Password
                                    </Text>
                                    <View className="flex-row items-center bg-white/10 rounded-xl px-4 border border-white/10">
                                        <Ionicons name="lock-closed-outline" size={16} color="#a78bfa" />
                                        <TextInput
                                            className="flex-1 text-white py-3.5 px-2"
                                            placeholder="Repeat password"
                                            placeholderTextColor="#4b5563"
                                            secureTextEntry={!showPassword}
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                        />
                                    </View>
                                </View>
                                <TouchableOpacity onPress={handleResetPassword} disabled={loading} activeOpacity={0.85}>
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
                                                Reset Password
                                            </Text>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                    <View className="pb-10" />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
