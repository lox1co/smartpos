import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useProfile } from '@/hooks/use-profile';
import { styles } from '@/components/store-info/store-info.styles';

const PRESET_AVATARS = [
  { id: 'av-1', name: 'Alex', url: 'https://api.dicebear.com/7.x/adventurer/png?seed=Alex&backgroundColor=b6e3f4' },
  { id: 'av-2', name: 'Sophia', url: 'https://api.dicebear.com/7.x/personas/png?seed=Sophia&backgroundColor=ffd5dc' },
  { id: 'av-3', name: 'Oliver', url: 'https://api.dicebear.com/7.x/personas/png?seed=Oliver&backgroundColor=d1d4f9' },
  { id: 'av-4', name: 'Aneka', url: 'https://api.dicebear.com/7.x/adventurer/png?seed=Aneka&backgroundColor=c0aede' },
  { id: 'av-5', name: 'Leo', url: 'https://api.dicebear.com/7.x/personas/png?seed=Leo&backgroundColor=ffdfbf' },
  { id: 'av-6', name: 'Emma', url: 'https://api.dicebear.com/7.x/personas/png?seed=Emma&backgroundColor=b6e3f4' },
  { id: 'av-7', name: 'Felix', url: 'https://api.dicebear.com/7.x/adventurer/png?seed=Felix&backgroundColor=d1d4f9' },
  { id: 'av-8', name: 'Zack', url: 'https://api.dicebear.com/7.x/adventurer/png?seed=Zack&backgroundColor=c0aede' },
  { id: 'av-9', name: 'POS Bot', url: 'https://api.dicebear.com/7.x/bottts/png?seed=POSBot&backgroundColor=b6e3f4' },
  { id: 'av-10', name: 'Happy Boss', url: 'https://api.dicebear.com/7.x/fun-emoji/png?seed=HappyBoss' },
  { id: 'av-11', name: 'Cool Merchant', url: 'https://api.dicebear.com/7.x/fun-emoji/png?seed=CoolMerchant' },
  { id: 'av-12', name: 'Super Star', url: 'https://api.dicebear.com/7.x/fun-emoji/png?seed=SuperStar' },
];

export default function StoreInfoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, saveProfile, toastMsg, showToast } = useProfile();

  const [shopName, setShopName] = useState(user?.shopName || '');
  const [userName, setUserName] = useState(user?.userName || '');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(user?.image || null);
  const [storeId] = useState(user?.storeId || '');

  const [saving, setSaving] = useState(false);
  const [copiedStoreId, setCopiedStoreId] = useState(false);

  useEffect(() => {
    if (user) {
      setShopName(user.shopName || '');
      setUserName(user.userName || '');
      setSelectedAvatar(user.image || null);
    }
  }, [user]);

  const handleCopyStoreId = () => {
    if (!storeId) return;
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(storeId);
    }
    setCopiedStoreId(true);
    showToast('Store ID copied to clipboard');
    setTimeout(() => setCopiedStoreId(false), 2500);
  };

  const handlePickCustomImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Permission to access photo gallery is required.');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const base64Data = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;
        setSelectedAvatar(base64Data);
      }
    } catch {
      return;
    }
  };

  const handleSave = async () => {
    if (!shopName.trim()) {
      Alert.alert('Validation Error', 'Shop Name cannot be empty.');
      return;
    }
    if (!userName.trim()) {
      Alert.alert('Validation Error', 'Owner / Merchant name cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      await saveProfile({
        shopName: shopName.trim(),
        userName: userName.trim(),
        image: selectedAvatar || '',
      });

      showToast('Profile updated successfully!');
      setTimeout(() => {
        router.back();
      }, 400);
    } catch {
      Alert.alert('Save Failed', 'Could not update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {toastMsg && (
        <View style={styles.floatingToast}>
          <MaterialIcons name="check-circle" size={18} color="#22c55e" />
          <Text style={styles.floatingToastText}>{toastMsg}</Text>
        </View>
      )}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.avatarHeroCard}>
            <View style={styles.avatarMainWrapper}>
              {selectedAvatar ? (
                <Image style={styles.avatarMainImg} source={selectedAvatar} contentFit="cover" />
              ) : (
                <View style={styles.avatarMainPlaceholder}>
                  <Text style={styles.avatarMainPlaceholderText}>
                    {userName ? userName.trim().substring(0, 2).toUpperCase() : 'SP'}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.avatarCameraBadge}
                onPress={handlePickCustomImage}
                activeOpacity={0.8}
              >
                <MaterialIcons name="photo-camera" size={14} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.avatarHeroTitle}>{shopName || 'Store Profile'}</Text>
            <Text style={styles.avatarHeroSub}>{userName || 'Owner Name'}</Text>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <MaterialIcons name="palette" size={18} color="#004ac6" />
              <Text style={styles.sectionHeaderTitle}>Choose Avatar or Upload Photo</Text>
            </View>

            <View style={styles.presetGrid}>
              <TouchableOpacity
                style={[
                  styles.presetItem,
                  selectedAvatar === null && styles.presetItemActive,
                ]}
                onPress={() => setSelectedAvatar(null)}
                activeOpacity={0.7}
              >
                <View style={[styles.presetThumbCircle, { backgroundColor: '#eff6ff' }]}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#004ac6' }}>
                    {userName ? userName.trim().substring(0, 2).toUpperCase() : 'SP'}
                  </Text>
                </View>
                <Text style={styles.presetLabel} numberOfLines={1}>Initials</Text>
                {selectedAvatar === null && (
                  <View style={styles.presetCheckBadge}>
                    <MaterialIcons name="check" size={10} color="#ffffff" />
                  </View>
                )}
              </TouchableOpacity>

              {PRESET_AVATARS.map((av) => {
                const isSelected = selectedAvatar === av.url;
                return (
                  <TouchableOpacity
                    key={av.id}
                    style={[
                      styles.presetItem,
                      isSelected && styles.presetItemActive,
                    ]}
                    onPress={() => setSelectedAvatar(av.url)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.presetThumbCircle}>
                      <Image style={styles.presetThumbImg} source={av.url} contentFit="cover" />
                    </View>
                    <Text style={styles.presetLabel} numberOfLines={1}>{av.name}</Text>
                    {isSelected && (
                      <View style={styles.presetCheckBadge}>
                        <MaterialIcons name="check" size={10} color="#ffffff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.customUploadBtn}
              onPress={handlePickCustomImage}
              activeOpacity={0.8}
            >
              <MaterialIcons name="add-photo-alternate" size={18} color="#004ac6" />
              <Text style={styles.customUploadText}>Upload Photo from Gallery</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <MaterialIcons name="badge" size={18} color="#004ac6" />
              <Text style={styles.sectionHeaderTitle}>Basic Information</Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Shop / Store Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Metro Supermarket"
                placeholderTextColor="#94a3b8"
                value={shopName}
                onChangeText={setShopName}
                autoFocus={false}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Owner / Merchant Full Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. John Doe"
                placeholderTextColor="#94a3b8"
                value={userName}
                onChangeText={setUserName}
                autoFocus={false}
              />
            </View>

            <View style={[styles.fieldGroup, { marginBottom: 0 }]}>
              <Text style={styles.fieldLabel}>Store ID (Staff Join Code)</Text>
              <View style={styles.storeIdRow}>
                <Text style={styles.storeIdText}>{storeId || '—'}</Text>
                <TouchableOpacity
                  style={[styles.copyCodeBtn, copiedStoreId && styles.copyCodeBtnCopied]}
                  onPress={handleCopyStoreId}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name={copiedStoreId ? 'check' : 'content-copy'}
                    size={14}
                    color={copiedStoreId ? '#15803d' : '#004ac6'}
                  />
                  <Text style={[styles.copyCodeBtnText, copiedStoreId && { color: '#15803d' }]}>
                    {copiedStoreId ? 'Copied' : 'Copy'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.fieldHint}>
                Cashiers and store staff use this ID during signup to join this store.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <MaterialIcons name="check" size={20} color="#ffffff" />
              <Text style={styles.saveBtnText}>Save Profile</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
