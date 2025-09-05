const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  channelTitle: string;
  publishedAt: string;
  viewCount?: string;
  likeCount?: string;
}

export interface YouTubeSearchResponse {
  items: Array<{
    id: { videoId: string };
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        default: { url: string };
        medium: { url: string };
        high: { url: string };
      };
      channelTitle: string;
      publishedAt: string;
    };
  }>;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}


export const searchVideos = async (
  maxResults: number = 50,
  pageToken?: string
): Promise<YouTubeSearchResponse> => {
  if (!API_KEY) {
    throw new Error('YouTube API key is not configured');
  }

  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    q: 'programming',
    maxResults: maxResults.toString(),
    key: API_KEY,
  });

  if (pageToken) {
    params.append('pageToken', pageToken);
  }

  const response = await fetch(`${YOUTUBE_API_BASE_URL}/search?${params}`);
  
  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};


export const transformSearchResults = (response: YouTubeSearchResponse): YouTubeVideo[] => {
  return response.items.map(item => ({
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnails: item.snippet.thumbnails,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
  }));
};
