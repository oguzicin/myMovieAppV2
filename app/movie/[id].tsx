import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_KEY = process.env.EXPO_PUBLIC_OMDB_API_KEY;

export default function MovieDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const headerFontSize = SCREEN_WIDTH * 0.08; // ekran genişliğine göre boyut

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
        );
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovie();
  }, [id]);

  if (!movie)
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#fff" />;

  const genres = movie.Genre ? movie.Genre.split(", ") : [];
  const rottenRating = movie.Ratings?.find(
    (r: any) => r.Source === "Rotten Tomatoes"
  );

  return (
    <LinearGradient
      colors={["#000000", "#000000", "#070016", "#212267"]}
      style={styles.gradientParent}
    >
      <View style={styles.innerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.moviezHeader, { marginTop: 40 }]}>
            m o v i e z
          </Text>
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* POSTER + Overlay */}
          {movie.Poster && movie.Poster !== "N/A" && (
            <View style={styles.posterWrapper}>
              <Image source={{ uri: movie.Poster }} style={styles.image} />

              {/* 🔥 ALT %15 OPACITY EFEKTİ BURADA */}
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,1)"]}
                style={styles.posterOverlay}
              />
            </View>
          )}

          {/* TITLE WRAPPER with FADE BG */}
<View style={styles.titleWrapper}>
  <LinearGradient
    colors={[
      "rgba(0,0,0,1)",      // tam siyah
      "rgba(0,0,0,0.75)",
      "rgba(0,0,0,0.45)",
      "rgba(0,0,0,0.20)",
      "transparent"         // aşağı doğru fade
    ]}
    style={styles.titleFadeBg}
  />

  <Text style={styles.title}>{movie.Title}</Text>
</View>


          <Text style={styles.year}>{movie.Year}</Text>

          {/* Genre Tags */}
          <View style={styles.genreContainer}>
            {genres.map((genre: string, index: number) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>

          {/* Rotten Tomatoes Rating */}
          {movie.Ratings &&
            movie.Ratings.map((rating: any, index: number) => {
              if (rating.Source === "Rotten Tomatoes") {
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 0,
                    }}
                  >
                    <Text
                      style={{ fontSize: 20, marginRight: 6, opacity: 0.8 }}
                    >
                      🍅
                    </Text>
                    <Text
                      style={{
                        color: "#FA320A",
                        fontSize: 16,
                        fontWeight: "600",
                        paddingTop: 4,
                        opacity: 0.8,
                      }}
                    >
                      {rating.Value}
                    </Text>
                  </View>
                );
              }
              return null;
            })}

          <Text style={styles.sectionTitle}>Plot</Text>
          <Text style={styles.overview}>{movie.Plot}</Text>

          <Text style={styles.sectionTitle}>Runtime</Text>
          <Text style={styles.info}>{movie.Runtime}</Text>

          <Text style={styles.sectionTitle}>Director</Text>
          <Text style={styles.info}>{movie.Director}</Text>

          <Text style={styles.sectionTitle}>Writer</Text>
          <Text style={styles.info}>{movie.Writer}</Text>

          <Text style={styles.sectionTitle}>Actors</Text>
          <Text style={styles.info}>{movie.Actors}</Text>

          <Text style={styles.sectionTitle}>Language</Text>
          <Text style={styles.info}>{movie.Language}</Text>

          <Text style={styles.sectionTitle}>Country</Text>
          <Text style={styles.info}>{movie.Country}</Text>

          <Text style={styles.sectionTitle}>Awards</Text>
          <Text style={styles.info}>{movie.Awards}</Text>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientParent: {
    flex: 1,
    overflow: "hidden",
    alignItems: "center",
  },
  innerContainer: {
    width: "100%",
    maxWidth: 375,
    flex: 1,
  },
  moviezHeader: {
    fontFamily: "BBHSansBartle",
    color: "beige",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 18,
  },
  scrollContent: {
    padding: 0,
    paddingBottom: 40,
  },
  titleWrapper: {
  width: "100%",
  position: "relative",
  paddingTop: 25,   // fade görünmesi için alan
  paddingBottom: 15,
  alignItems: "center",
  overflow: "hidden",
},

titleFadeBg: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 120,     // fade yüksekliği (yumuşaklık burada)
  zIndex: -1,      // textin arkasında kalacak
},


  /** POSTER + OVERLAY */
  posterWrapper: {
    width: "100%",
    height: 450,

    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  /*
  posterWrapper: { width: "100%", height: 450, borderRadius: 8, overflow: "hidden", position: "relative", },

  image: { marginTop: 0, width: "100%", height: 435, borderTopRightRadius: 8, borderTopLeftRadius: 8},
  */
  posterOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%", // Alt %15 alan
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
    textAlign: "center",
    fontFamily: "MontserratRegular",
  },

  year: { fontSize: 16, color: "#ccc", textAlign: "center", marginBottom: 10 },

  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 8,
  },
  genreTag: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 3,
    // Parlak cam efekti
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6, // Android desteği
    backdropFilter: "blur(10px)",
  },
  genreText: {
    color: "lightgrey",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "MontserratRegular",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 16,
    marginBottom: 6,
    fontFamily: "MontserratRegular",
  },
  overview: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 12,
    lineHeight: 22,
    fontFamily: "MontserratRegular",
  },
  info: {
    fontSize: 15,
    color: "#bbb",
    paddingBottom: 8,
    fontFamily: "MontserratRegular",
  },
});
