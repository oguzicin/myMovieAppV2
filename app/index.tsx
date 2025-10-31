import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs"; // basit tarih karşılaştırma için
import { LinearGradient } from "expo-linear-gradient"; // <- gradyan için
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
// dayjs yoksa: npm install dayjs

import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_KEY = process.env.EXPO_PUBLIC_OMDB_API_KEY;


const POPULAR_MOVIES = [
  "tt0111161",
  "tt0068646",
  "tt0071562",
  "tt0468569",
  "tt0050083",
  "tt0108052",
  "tt0167260",
  "tt0110912",
  "tt0060196",
  "tt0137523",
  "tt0120737",
  "tt0109830",
  "tt1375666",
  "tt0167261",
  "tt0080684",
  "tt0133093",
  "tt0099685",
  "tt0073486",
  "tt0047478",
  "tt0114369",
  "tt0118799",
  "tt0102926",
  "tt0038650",
  "tt0114814",
  "tt0110413",
  "tt0245429",
  "tt0120815",
  "tt0120689",
  "tt0816692",
  "tt0120586",
  "tt0172495",
  "tt0110357",
  "tt0088763",
  "tt0076759",
  "tt0209144",
  "tt0082971",
  "tt1853728",
  "tt0118799",
  "tt0111161",
  "tt0103064",
  "tt0078788",
  "tt0120689",
  "tt0120735",
  "tt0110357",
  "tt0081505",
  "tt0364569",
  "tt0253474",
  "tt0090605",
  "tt0095016",
  "tt0317248",
];

const HomeScreen = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownResults, setDropdownResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Search butonuna basınca
  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setShowDropdown(false);
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
      );
      const data = await res.json();
      if (data.Response === "True") {
        setResults(data.Search);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Uygulama açıldığında rastgele 10 film
  /*
  useEffect(() => {
    const fetchRandomMovies = async () => {
      setLoading(true);
      try {
        const shuffled = POPULAR_MOVIES.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);
        const fetchedMovies: any[] = [];
        for (let id of selected) {
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
          );
          const data = await res.json();
          if (data.Response === "True") fetchedMovies.push(data);
        }
        setResults(fetchedMovies);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRandomMovies();
  }, []);
  */
/*
useEffect(() => {
  const fetchRandomMovies = async () => {
    setLoading(true);
    try {
      const shuffled = POPULAR_MOVIES.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 10); // 8 film = daha hızlı
      // 🔹 Promise.all ile paralel fetch
      const fetchedMovies = await Promise.all(
        selected.map(async (id) => {
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
          );
          const data = await res.json();
          return data.Response === "True" ? data : null;
        })
      );

      // null olanları filtrele
      setResults(fetchedMovies.filter(Boolean));
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  fetchRandomMovies();
}, []);
*/


useEffect(() => {
  const fetchMoviesOncePerDay = async () => {
    setLoading(true);
    try {
      // AsyncStorage'dan veri al
      const storedData = await AsyncStorage.getItem("cachedMovies");
      const storedTime = await AsyncStorage.getItem("cachedTime");

      // Eğer 24-12 saat geçmediyse, önbellekten yükle
      if (storedData && storedTime) {
        const diffHours = dayjs().diff(dayjs(storedTime), "hour");
        if (diffHours < 12) {
          setResults(JSON.parse(storedData));
          setLoading(false);
          return;
        }
      }

      // 24 saat geçmişse veya veri yoksa API'den çek
      const shuffled = POPULAR_MOVIES.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 10);
      const fetchedMovies: any[] = [];

      const promises = selected.map(async (id) => {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`);
        const data = await res.json();
        if (data.Response === "True") fetchedMovies.push(data);
      });

      await Promise.all(promises);

      // Yeni veriyi kaydet
      await AsyncStorage.setItem("cachedMovies", JSON.stringify(fetchedMovies));
      await AsyncStorage.setItem("cachedTime", dayjs().toISOString());

      setResults(fetchedMovies);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  fetchMoviesOncePerDay();
}, []);





  // Harf girerken dropdown
  const handleDropdownSearch = async (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setDropdownResults([]);
      setShowDropdown(false);
      return;
    }
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${text}`
      );
      const data = await res.json();
      if (data.Response === "True") {
        setDropdownResults(data.Search);
        setShowDropdown(true);
      } else {
        setDropdownResults([]);
        setShowDropdown(false);
      }
    } catch {
      setDropdownResults([]);
      setShowDropdown(false);
    }
  };

  // Film seçildiğinde
const handleSelectMovie = (movie: any) => {
  setQuery(movie.Title);
  setShowDropdown(false);
  Keyboard.dismiss();
  router.push({
    pathname: "./movie/[id]",
    params: { id: movie.imdbID },
  });
};




  return (
    <LinearGradient
      colors={["#000000", "#000000", "#070016", "#212267"]}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>m o v i e z</Text>

        {/* 🔍 Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="search for a movie"
            placeholderTextColor="lightgrey"
            value={query}
            onChangeText={handleDropdownSearch}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.button} onPress={handleSearch}>
            <FontAwesome name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* 🪟 Dropdown */}
        {showDropdown && (
          <View style={styles.dropdown}>
            <FlatList
              data={dropdownResults.slice(0, 6)}
              keyExtractor={(item) => item.imdbID}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelectMovie(item)}
                >
                  {item.Poster && item.Poster !== "N/A" && (
                    <Image
                      source={{ uri: item.Poster }}
                      style={styles.dropdownPoster}
                    />
                  )}
                  <Text style={{ color: "white", marginLeft: 8 }}>
                    {item.Title} ({item.Year})
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Loading */}
        {loading && (
          <ActivityIndicator
            size="large"
            color="#3B82F6"
            style={{ marginTop: 16 }}
          />
        )}

        {/* Movie Grid */}
        <FlatList
          data={results}
          keyExtractor={(item) => item.imdbID}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ marginTop: 16, paddingBottom: 80 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.movieCard}
              onPress={() => handleSelectMovie(item)}
            >
              {item.Poster && item.Poster !== "N/A" ? (
                <Image source={{ uri: item.Poster }} style={styles.poster} />
              ) : (
                <View
                  style={[
                    styles.poster,
                    { justifyContent: "center", alignItems: "center" },
                  ]}
                >
                  <Text style={{ color: "#D1D5DB" }}>No Poster</Text>
                </View>
              )}

              <Text style={styles.movieTitle}>{item.Title}</Text>
              <Text style={styles.movieYear}>{item.Year}</Text>

              {/* 🌟 Rotten Tomatoes Badge */}
              {item.Ratings &&
                Array.isArray(item.Ratings) &&
                item.Ratings.some((r) => r.Source === "Rotten Tomatoes") && (
                  <View style={styles.rtBadge}>
                    <Text style={styles.rtText}>
                      {item.Ratings.find((r) => r.Source === "Rotten Tomatoes")
                        ?.Value ?? "N/A"}
                    </Text>
                  </View>
                )}
            </TouchableOpacity>
          )}
        />
      </View>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
    overflow: "hidden",
    alignItems: "center", // inner container ortalama
  },
  innerContainer: {
    width: "100%",
    maxWidth: 375,
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "beige",
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.9,
    fontFamily: "BBHSansBartle",
  },
searchContainer: {
  flexDirection: "row",
  backgroundColor: "rgba(255, 255, 255, 0.1)", // saydam beyaz arka plan
  borderRadius: 20,
  borderWidth: 1,
  borderColor: "rgba(255, 255, 255, 0.2)", // dış hatlar parlak beyaz
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 12,
  marginBottom: 20,
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 10,
  elevation: 6, // Android için gölge
  backdropFilter: "blur(10px)", // Web için blur efekti
},

  input: { flex: 1, height: 48, color: "beige", fontSize: 13, opacity:0.5 },
  button: {
    opacity:0.4,
    padding: 12,
    borderRadius: 0,
    marginLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: "beige",
    color:"beige",
  },
dropdown: {
  position: "absolute", 
  top: 130, 
  width: "100%",                         
  backgroundColor: "rgba(030, 030, 030, 0.95)",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "rgba(255, 255, 255, 0.3)",
  maxHeight: 300,
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 10,
  elevation: 8,
  backdropFilter: "blur(20px)",
  zIndex: 999, 
},
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  dropdownPoster: { width: 40, height: 60, borderRadius: 4 },
movieCard: {
  backgroundColor: "rgba(255, 255, 255, 0.1)", // saydam beyaz zemin
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "rgba(255, 255, 255, 0.1)", // dış çerçeve hafif beyaz
  overflow: "hidden",
  width: "48%",
  marginBottom: 16,
  position: "relative",
  // Parlak cam efekti
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 10,
  elevation: 6, // Android desteği
  backdropFilter: "blur(10px)", 
},
  poster: { width: "100%", height: 210 },
  movieTitle: {
    color: "#E5E7EB",
    fontWeight: "600",
    fontSize: 14,
    marginTop: 4,
    marginHorizontal: 4,
    fontFamily: "MontserratRegular",
  },
  movieYear: {
    color: "#9CA3AF",
    fontSize: 12,
    marginBottom: 4,
    marginHorizontal: 4,
    fontFamily: "MontserratRegular",
  },
  rtBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rtText: {
    color: "#FA320A",
    fontSize: 10,
    fontWeight: "600",
    fontFamily: "MontserratRegular",
  },
});
