import { useSessionStore } from "@/stores/session-store";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreen() {
  const router = useRouter();
  const { t } = useTranslation("common");

  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(() => new Animated.Value(20));
  const [pulseAnim] = useState(() => new Animated.Value(1));
  const [dot1Anim] = useState(() => new Animated.Value(1));
  const [dot2Anim] = useState(() => new Animated.Value(1));
  const [dot3Anim] = useState(() => new Animated.Value(1));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.96,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    const createDotLoop = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 0.25,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    Animated.parallel([
      createDotLoop(dot1Anim, 0),
      createDotLoop(dot2Anim, 150),
      createDotLoop(dot3Anim, 300),
    ]).start();

    let cancelled = false;
    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, 2000));
    const redirect = async () => {
      await minDelay;
      if (cancelled) return;
      const token = useSessionStore.getState().currentUser?.token;
      router.replace(token ? "/(tabs)/dashboard" : "/login");
    };
    void redirect();

    return () => {
      cancelled = true;
    };
  }, [fadeAnim, slideAnim, pulseAnim, dot1Anim, dot2Anim, dot3Anim, router]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      <View style={styles.backgroundContainer} pointerEvents="none">
        <View style={styles.glowTopRight} />
        <View style={styles.glowBottomLeft} />
      </View>

      <Animated.View
        style={[
          styles.mainContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.logoCard,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        <Text style={styles.brandTitle}>SmartPOS</Text>
        <Text style={styles.brandSubtitle}>{t("common:brand.subtitle")}</Text>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { opacity: dot1Anim }]} />
          <Animated.View style={[styles.dot, { opacity: dot2Anim }]} />
          <Animated.View style={[styles.dot, { opacity: dot3Anim }]} />
        </View>
        <Text style={styles.versionText}>v1.0.0 (Expo SDK 58)</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
  },
  glowTopRight: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#e0e7ff",
    opacity: 0.6,
  },
  glowBottomLeft: {
    position: "absolute",
    bottom: -80,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#ede9fe",
    opacity: 0.6,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoCard: {
    width: 110,
    height: 110,
    borderRadius: 28,
    backgroundColor: "#f8f9ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#004fe6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  logoImage: {
    width: 72,
    height: 72,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#131b2e",
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 14,
    color: "#737686",
    marginTop: 6,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 24,
    gap: 12,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#004fe6",
  },
  versionText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
});
