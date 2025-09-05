import { StyleSheet, SafeAreaView } from "react-native";
import VideoGrid from "../components/VideoGrid";

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <VideoGrid />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
});

export default Home;
