/*
import * as Font from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { Slot } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";



export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const splashFontSize = SCREEN_WIDTH * 0.08; 

  useEffect(() => {
    async function loadResources() {
      await Font.loadAsync({
        BBHSansBartle: require("../assets/images/fonts/BBHSansBartle-Regular.ttf"),
        MontserratRegular: require("../assets/images/fonts/Montserrat-Regular.ttf"),
      });
      setFontsLoaded(true);

      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: false,
        }).start(() => setShowSplash(false));
      }, 1500);

      return () => clearTimeout(timer);
    }
    loadResources();
  }, []);

  if (!fontsLoaded) return null;

  if (showSplash) {
    return (
      <LinearGradient
      colors={["#000000", "#000000", "#070016", "#212267"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.splashContainer}
      >
        <Animated.Text
          style={[styles.splashText, { opacity, fontFamily: "BBHSansBartle", fontSize: splashFontSize,    color: "beige", }]}
        >
          m o v i e z
        </Animated.Text>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.innerContainer]}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#000", // Yanlar siyah
    display: "flex",
    alignItems: "center",
    overflow: "hidden", // Scroll bar gizli
  },
  innerContainer: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
  },
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  splashText: {
    color: "lightgrey",
    textAlign: "center",
  },
});
*/

import * as Font from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { Slot } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current; // text fade
  const fillAnim = useRef(new Animated.Value(0)).current; // blue fill

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
  const splashFontSize = SCREEN_WIDTH * 0.08;
  const targetHeight = SCREEN_HEIGHT * 0.6;

  useEffect(() => {
    async function loadResources() {
      await Font.loadAsync({
        BBHSansBartle: require("../assets/images/fonts/BBHSansBartle-Regular.ttf"),
        MontserratRegular: require("../assets/images/fonts/Montserrat-Regular.ttf"),
      });
      setFontsLoaded(true);

      // Yazı animasyonu (fade in-out)
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }).start();

      // Mavi alttan dolma efekti
      Animated.timing(fillAnim, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: false,
      }).start();

      // Splash’ten çıkış (2.5 saniye sonra)
      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: false,
        }).start(() => setShowSplash(false));
      }, 2500);

      return () => clearTimeout(timer);
    }

    loadResources();
  }, []);

  if (!fontsLoaded) return null;

  if (showSplash) {
    const filledHeight = fillAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, targetHeight],
    });

    return (
      <View style={styles.splashContainer}>
        {/* Alttan gelen mavi glow */}
        <Animated.View style={[styles.glowContainer, { height: filledHeight }]}>
          <LinearGradient
            colors={["rgba(0,0,0,0)", "#070016", "#212267"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Yazı */}
        <Animated.Text
          style={[
            styles.splashText,
            {
              opacity,
              fontFamily: "BBHSansBartle",
              fontSize: splashFontSize,
            },
          ]}
        >
          m o v i e z
        </Animated.Text>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    overflow: "hidden",
  },
  innerContainer: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
  },
  splashContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  splashText: {
    color: "beige",
    textAlign: "center",
    textShadowColor: "#212267",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15, // glowing efekt
  },
  glowContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
});

