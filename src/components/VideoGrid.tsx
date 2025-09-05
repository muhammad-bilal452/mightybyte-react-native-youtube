import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
  RefreshControl,
} from 'react-native';
import VideoCard from './VideoCard';
import { useVideosInfinite } from '../hooks/useYouTube';
import { YouTubeVideo } from '../services/youtube';

const { width: screenWidth } = Dimensions.get('window');

// Calculate number of columns based on screen width
const getNumColumns = (width: number) => {
  if (width < 768) return 1;
  if (width < 1024) return 2;
  if (width < 1280) return 3;
  if (width < 1536) return 4;
  return 5;
};

const CARD_SPACING = 16;

const VideoGrid: React.FC = () => {
  const flatListRef = useRef<FlatList>(null);
  const [numColumns, setNumColumns] = useState(getNumColumns(screenWidth));

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useVideosInfinite(12);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = Dimensions.get('window').width;
      setNumColumns(getNumColumns(newWidth));
    };

    const subscription = Dimensions.addEventListener('change', handleResize);
    return () => subscription?.remove();
  }, []);

  const allVideos = data?.pages.flatMap(page => page.videos) || [];

  const handleVideoPress = (video: YouTubeVideo) => {
    console.log('Video pressed:', video.title);
  };

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderVideoItem = ({ item }: { item: YouTubeVideo }) => (
    <View style={[styles.videoItem, { width: (screenWidth - (numColumns + 1) * CARD_SPACING) / numColumns }]}>
      <VideoCard video={item} onPress={handleVideoPress} />
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Loading more videos...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {error ? 'Failed to load videos. Pull down to retry.' : 'No videos found.'}
        </Text>
      </View>
    );
  };

  const keyExtractor = (item: YouTubeVideo, index: number) => `${item.id}-${index}`;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Loading programming videos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={allVideos}
        renderItem={renderVideoItem}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        key={numColumns} 
        contentContainerStyle={styles.contentContainer}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#FF0000"
            colors={['#FF0000']}
          />
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={8}
        getItemLayout={undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  contentContainer: {
    padding: CARD_SPACING,
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-between',
  },
  videoItem: {
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingFooter: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#606060',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#606060',
    textAlign: 'center',
  },
});

export default VideoGrid;
