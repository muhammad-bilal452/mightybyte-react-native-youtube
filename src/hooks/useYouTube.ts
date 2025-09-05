import { useQuery } from '@tanstack/react-query';
import {
  searchVideos,
  getTrendingVideos,
  getVideoDetails,
  transformSearchResults,
  transformVideoDetails,
  YouTubeVideo,
} from '../services/youtube';

export const useSearchVideos = (
  query: string,
  maxResults: number = 10,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['youtube', 'search', query, maxResults],
    queryFn: async () => {
      const response = await searchVideos(query, maxResults);
      return transformSearchResults(response);
    },
    enabled: enabled && !!query,
  });
};

export const useTrendingVideos = (
  maxResults: number = 10,
  regionCode: string = 'US'
) => {
  return useQuery({
    queryKey: ['youtube', 'trending', maxResults, regionCode],
    queryFn: async () => {
      const response = await getTrendingVideos(maxResults, regionCode);
      return transformVideoDetails(response);
    },
  });
};

export const useVideoDetails = (videoIds: string[], enabled: boolean = true) => {
  return useQuery({
    queryKey: ['youtube', 'videoDetails', videoIds],
    queryFn: async () => {
      const response = await getVideoDetails(videoIds);
      return transformVideoDetails(response);
    },
    enabled: enabled && videoIds.length > 0
  });
};

export const useVideoDetail = (videoId: string, enabled: boolean = true) => {
  const { data, ...rest } = useVideoDetails([videoId], enabled);
  return {
    data: data?.[0],
    ...rest,
  };
};

export type { YouTubeVideo };
