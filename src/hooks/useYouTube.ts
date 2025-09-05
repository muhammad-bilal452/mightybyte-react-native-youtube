import { useInfiniteQuery } from '@tanstack/react-query';
import {
  searchVideos,
  transformSearchResults,
  YouTubeVideo,
} from '../services/youtube';

export const useVideosInfinite = (maxResults: number = 12) => {
  return useInfiniteQuery(
    ['youtube', 'programming', 'infinite', maxResults],
    async ({ pageParam }) => {
      const response = await searchVideos(maxResults, pageParam);
      return {
        videos: transformSearchResults(response),
        nextPageToken: response.nextPageToken,
      };
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPageToken,
      getPreviousPageParam: () => undefined,
    }
  );
};

export type { YouTubeVideo };
