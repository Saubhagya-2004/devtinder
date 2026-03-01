import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
    const { user, logout, updateUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axiosInstance.get("/profile");
            const data = res.data.data;
            setProfile(data);
            setForm({
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                Bio: data.Bio || "",
                profession: data.profession || "",
                skills: data.skills?.join(", ") || "",
            });
        } catch (err) {
            Alert.alert("Error", "Failed to load profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const skillsArr = form.skills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .slice(0, 5);

            const res = await axiosInstance.patch("/profile/edit", {
                firstName: form.firstName,
                lastName: form.lastName,
                Bio: form.Bio,
                profession: form.profession,
                skills: skillsArr,
            });
            const updated = res.data.data;
            setProfile(updated);
            await updateUser(updated);
            setEditMode(false);
            Alert.alert("Success", "Profile updated successfully!");
        } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleUploadPhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission needed", "Please grant photo library access.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (result.canceled) return;
        const asset = result.assets[0];

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("photo", {
                uri: asset.uri,
                type: "image/jpeg",
                name: "profile.jpg",
            });

            const res = await axiosInstance.post("/profile/upload-photo", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const updated = res.data.data;
            setProfile(updated);
            await updateUser(updated);
            Alert.alert("Success", "Profile photo updated!");
        } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "Photo upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", style: "destructive", onPress: logout },
        ]);
    };

    if (loading) {
        return (
            <View className="flex-1 bg-[#0f0f1a] items-center justify-center">
                <ActivityIndicator size="large" color="#a855f7" />
            </View>
        );
    }

    const photoUrl =
        profile?.profile ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent((profile?.firstName || "U") + "+" + (profile?.lastName || ""))}&background=9333ea&color=fff&size=400`;

    return (
        <View className="flex-1 bg-[#0f0f1a]">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 40 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header Banner */}
                    <LinearGradient
                        colors={["#1a0533", "#2d1052"]}
                        className="pt-14 pb-20 px-6 items-center"
                    >
                        <View className="flex-row justify-between w-full mb-4">
                            <Text className="text-white text-2xl font-bold">Profile</Text>
                            <TouchableOpacity onPress={handleLogout}>
                                <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>

                    {/* Avatar */}
                    <View className="items-center -mt-16 mb-4">
                        <View className="relative">
                            <Image
                                source={{ uri: photoUrl }}
                                className="w-32 h-32 rounded-full border-4 border-[#0f0f1a]"
                            />
                            <TouchableOpacity
                                onPress={handleUploadPhoto}
                                disabled={uploading}
                                className="absolute bottom-0 right-0 bg-purple-600 rounded-full w-9 h-9 items-center justify-center border-2 border-[#0f0f1a]"
                            >
                                {uploading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Ionicons name="camera" size={16} color="white" />
                                )}
                            </TouchableOpacity>
                        </View>
                        {!editMode && (
                            <>
                                <Text className="text-white text-2xl font-bold mt-3">
                                    {profile?.firstName} {profile?.lastName}
                                </Text>
                                {profile?.profession && (
                                    <Text className="text-purple-400 mt-1">{profile.profession}</Text>
                                )}
                                <View className="flex-row items-center gap-2 mt-1">
                                    {profile?.gender && (
                                        <Text className="text-gray-400 text-xs">{profile.gender}</Text>
                                    )}
                                    {profile?.age && (
                                        <Text className="text-gray-400 text-xs">· Age {profile.age}</Text>
                                    )}
                                </View>
                            </>
                        )}
                    </View>

                    {/* Card */}
                    <View className="mx-4 bg-white/5 rounded-3xl p-5 border border-white/10">
                        {!editMode ? (
                            <>
                                {/* Bio */}
                                <View className="mb-4">
                                    <Text className="text-purple-300 text-xs font-medium mb-1">About Me</Text>
                                    <Text className="text-gray-300">{profile?.Bio || "No bio yet."}</Text>
                                </View>

                                {/* Skills */}
                                {profile?.skills?.length > 0 && (
                                    <View className="mb-4">
                                        <Text className="text-purple-300 text-xs font-medium mb-2">Skills</Text>
                                        <View className="flex-row flex-wrap gap-2">
                                            {profile.skills.map((s, i) => (
                                                <View key={i} className="bg-purple-600/30 border border-purple-500/40 rounded-full px-3 py-1">
                                                    <Text className="text-purple-300 text-xs font-medium">{s}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}

                                {/* Email */}
                                <View className="mb-4 flex-row items-center gap-2">
                                    <Ionicons name="mail-outline" size={14} color="#a78bfa" />
                                    <Text className="text-gray-400 text-sm">{profile?.email}</Text>
                                </View>

                                {/* Edit Button */}
                                <TouchableOpacity
                                    onPress={() => setEditMode(true)}
                                    className="border border-purple-500/50 rounded-xl py-3 items-center"
                                >
                                    <Text className="text-purple-400 font-semibold">Edit Profile</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                {/* Edit Form */}
                                {[
                                    { label: "First Name", key: "firstName" },
                                    { label: "Last Name", key: "lastName" },
                                    { label: "Profession", key: "profession" },
                                    { label: "Bio", key: "Bio", multiline: true },
                                    { label: "Skills (comma separated, max 5)", key: "skills" },
                                ].map(({ label, key, multiline }) => (
                                    <View key={key} className="mb-4">
                                        <Text className="text-purple-300 text-xs mb-1.5 font-medium">{label}</Text>
                                        <TextInput
                                            className={`bg-white/10 rounded-xl px-4 text-white border border-white/10 ${multiline ? "py-3 h-20" : "py-3.5"}`}
                                            placeholderTextColor="#4b5563"
                                            value={form[key]}
                                            onChangeText={(v) => setForm((prev) => ({ ...prev, [key]: v }))}
                                            multiline={multiline}
                                            textAlignVertical={multiline ? "top" : "center"}
                                        />
                                    </View>
                                ))}

                                <View className="flex-row gap-3">
                                    <TouchableOpacity
                                        onPress={() => setEditMode(false)}
                                        disabled={saving}
                                        className="flex-1 border border-white/20 rounded-xl py-3.5 items-center"
                                    >
                                        <Text className="text-gray-400 font-semibold">Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleSave}
                                        disabled={saving}
                                        activeOpacity={0.85}
                                        className="flex-1"
                                    >
                                        <LinearGradient
                                            colors={["#9333ea", "#7c3aed"]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            className="rounded-xl py-3.5 items-center"
                                        >
                                            {saving ? (
                                                <ActivityIndicator color="white" size="small" />
                                            ) : (
                                                <Text className="text-white font-bold">Save Changes</Text>
                                            )}
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
