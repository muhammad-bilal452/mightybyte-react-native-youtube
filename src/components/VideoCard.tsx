import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { YouTubeVideo } from '../services/youtube';

interface VideoCardProps {
  video: YouTubeVideo;
  onPress?: (video: YouTubeVideo) => void;
}

const { width: screenWidth } = Dimensions.get('window');

// YouTube-style card dimensions
const CARD_WIDTH = Math.min(360, (screenWidth - 64) / Math.floor(screenWidth / 360));
const CARD_HEIGHT = CARD_WIDTH * 0.56; 
const POPUP_WIDTH = CARD_WIDTH * 1.2;
const POPUP_HEIGHT = POPUP_WIDTH * 0.56;

const VideoCard: React.FC<VideoCardProps> = ({ video, onPress }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const popupOpacity = useRef(new Animated.Value(0)).current;
  const popupScale = useRef(new Animated.Value(0.9)).current;
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };


  const handleHoverIn = () => {
    setIsHovered(true);
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setShowPopup(true);
      
      Animated.parallel([
        Animated.timing(popupOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(popupScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);
  };

  const handleHoverOut = () => {
    setIsHovered(false);
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    Animated.parallel([
      Animated.timing(popupOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(popupScale, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowPopup(false);
    });
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.card}
        onPress={() => onPress?.(video)}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
      >
        <Animated.View 
          style={[
            styles.cardContent,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Main thumbnail */}
          <View style={styles.thumbnailContainer}>
            <Image
              source={{ uri: video.thumbnails.medium?.url || video.thumbnails.default?.url }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.duration}>
              <Text style={styles.durationText}>12:34</Text>
            </View>
          </View>

          {/* Video info */}
          <View style={styles.videoInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {video.channelTitle.charAt(0).toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={2}>
                {video.title}
              </Text>
              <Text style={styles.channelName}>
                {video.channelTitle}
              </Text>
              <Text style={styles.metadata}>
                {formatDate(video.publishedAt)}
              </Text>
            </View>

            <View style={styles.moreButton}>
              <Text style={styles.moreButtonText}>⋮</Text>
            </View>
          </View>
        </Animated.View>
      </Pressable>

      {/* Hover popup */}
      {showPopup && (
        <Animated.View
          style={[
            styles.popup,
            {
              opacity: popupOpacity,
              transform: [{ scale: popupScale }],
            },
          ]}
          pointerEvents="none"
        >
          <View style={styles.popupContent}>
            <Image
              source={{ uri: video.thumbnails.high?.url || video.thumbnails.medium?.url }}
              style={styles.popupThumbnail}
              resizeMode="cover"
            />
            <View style={styles.popupOverlay}>
              <View style={styles.popupActions}>
                <View style={styles.actionButton}>
                  <Text style={styles.actionIcon}>▶</Text>
                </View>
                <View style={styles.actionButton}>
                  <Text style={styles.actionIcon}>🕑</Text>
                </View>
                <View style={styles.actionButton}>
                  <Text style={styles.actionIcon}>📋</Text>
                </View>
              </View>
            </View>
            <View style={styles.popupInfo}>
              <Text style={styles.popupTitle} numberOfLines={2}>
                {video.title}
              </Text>
              <Text style={styles.popupChannel}>
                {video.channelTitle}
              </Text>
              <Text style={styles.popupDescription} numberOfLines={3}>
                {video.description}
              </Text>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 40,
    position: 'relative',
  },
  card: {
    width: '100%',
  },
  cardContent: {
    width: '100%',
  },
  thumbnailContainer: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  duration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  videoInfo: {
    flexDirection: 'row',
    paddingTop: 12,
    alignItems: 'flex-start',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#0f0f0f',
    marginBottom: 4,
  },
  channelName: {
    fontSize: 13,
    color: '#606060',
    marginBottom: 2,
  },
  metadata: {
    fontSize: 13,
    color: '#606060',
  },
  moreButton: {
    padding: 8,
  },
  moreButtonText: {
    fontSize: 16,
    color: '#606060',
  },
  popup: {
    position: 'absolute',
    top: -20,
    left: -((POPUP_WIDTH - CARD_WIDTH) / 2),
    width: POPUP_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    zIndex: 1000,
  },
  popupContent: {
    width: '100%',
  },
  popupThumbnail: {
    width: '100%',
    height: POPUP_HEIGHT,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: POPUP_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    color: 'white',
    fontSize: 18,
  },
  popupInfo: {
    padding: 16,
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f0f0f',
    marginBottom: 8,
    lineHeight: 22,
  },
  popupChannel: {
    fontSize: 14,
    color: '#606060',
    marginBottom: 8,
  },
  popupDescription: {
    fontSize: 13,
    color: '#606060',
    lineHeight: 18,
  },
});

export default VideoCard;
