import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { FormField } from './FormField';
import { styles } from './add-product.styles';

interface ProductImageSectionProps {
  imageUrl: string;
  onChangeImageUrl: (url: string) => void;
}

export const ProductImageSection = ({
  imageUrl,
  onChangeImageUrl,
}: ProductImageSectionProps) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleTextChange = (text: string) => {
    onChangeImageUrl(text);
    setImageError(false);
    setImageLoading(Boolean(text.trim()));
  };

  const handleClearImage = () => {
    onChangeImageUrl('');
    setImageError(false);
    setImageLoading(false);
  };

  const trimmedUrl = imageUrl.trim();

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeader}>Product Image</Text>
        {trimmedUrl ? (
          <TouchableOpacity
            style={styles.clearImageBtn}
            onPress={handleClearImage}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons name="delete-outline" size={16} color="#ba1a1a" />
            <Text style={styles.clearImageBtnText}>Remove Image</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {trimmedUrl ? (
        <View style={styles.imagePreviewWrapper}>
          <Image
            source={{ uri: trimmedUrl }}
            style={styles.imagePreview}
            contentFit="contain"
            transition={200}
            onLoadStart={() => {
              setImageLoading(true);
              setImageError(false);
            }}
            onLoad={() => {
              setImageLoading(false);
              setImageError(false);
            }}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
          />

          {imageLoading && (
            <View style={styles.imageLoadingOverlay}>
              <ActivityIndicator size="small" color="#004ac6" />
              <Text style={styles.imageLoadingText}>Fetching image...</Text>
            </View>
          )}

          {imageError && (
            <View style={styles.imageErrorOverlay}>
              <MaterialIcons name="broken-image" size={32} color="#ba1a1a" />
              <Text style={styles.imageErrorTitle}>Unable to load image</Text>
              <Text style={styles.imageErrorSub}>Check URL or try a direct image link</Text>
            </View>
          )}

          {!imageLoading && !imageError && (
            <View style={styles.imageSuccessBadge}>
              <MaterialIcons name="check-circle" size={13} color="#16a34a" />
              <Text style={styles.imageSuccessBadgeText}>Image Loaded</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.imagePlaceholderArea}>
          <View style={styles.placeholderIconCircle}>
            <MaterialIcons name="image" size={26} color="#737686" />
          </View>
          <Text style={styles.placeholderTitle}>No Image Provided</Text>
          <Text style={styles.placeholderSub}>Enter an image URL below to fetch and preview</Text>
        </View>
      )}

      <View style={{ marginTop: 12 }}>
        <FormField
          label="Image URL (Optional)"
          value={imageUrl}
          onChangeText={handleTextChange}
          placeholder="https://example.com/product.jpg"
          iconRight={trimmedUrl ? 'close' : undefined}
          onIconRightPress={trimmedUrl ? handleClearImage : undefined}
        />
      </View>
    </View>
  );
};
