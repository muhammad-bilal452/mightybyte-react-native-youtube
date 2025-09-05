import * as React from "react";
import { 
  Text, 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert 
} from "react-native";
import Logo from "../components/Logo";
import { useTrendingVideos } from "../hooks/useYouTube";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  title: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  },
  subTitle: {
    margin: 24,
    textAlign: "center"
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginVertical: 12,
    color: "#333",
  },
  videoContainer: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  videoContent: {
    padding: 12,
  },
  thumbnail: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  channelName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  videoStats: {
    fontSize: 12,
    color: "#999",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

const formatViewCount = (viewCount?: string) => {
  if (!viewCount) return "";
  
  const count = parseInt(viewCount);
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M views`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K views`;
  }
  return `${count} views`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 1) return "Today";
  if (diffDays <= 7) return `${diffDays} days ago`;
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return `${Math.ceil(diffDays / 30)} months ago`;
};

const Home = () => {
  const { data: videos, isLoading, error, refetch } = useTrendingVideos(10);

  const handleVideoPress = (videoId: string, title: string) => {
    Alert.alert("Video Selected", `Selected: ${title}\nVideo ID: ${videoId}`);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={{ marginTop: 16, color: "#666" }}>Loading trending videos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Failed to load videos. Please check your YouTube API key configuration.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo />
        <Text style={styles.title}>MightyByte React Native Challenge</Text>
        <Text style={styles.subTitle}>YouTube Trending Videos</Text>
      </View>
      
      <ScrollView>
        <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
        
        {videos?.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoContainer}
            onPress={() => handleVideoPress(video.id, video.title)}
          >
            <Image
              source={{ uri: video.thumbnails.medium.url }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.videoContent}>
              <Text style={styles.videoTitle} numberOfLines={2}>
                {video.title}
              </Text>
              <Text style={styles.channelName}>{video.channelTitle}</Text>
              <Text style={styles.videoStats}>
                {formatViewCount(video.viewCount)} • {formatDate(video.publishedAt)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Home;
