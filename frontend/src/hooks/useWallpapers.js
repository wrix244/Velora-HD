import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

// Fetch wallpapers with filters (for Infinite Scroll)
export const useWallpapers = (filters) => {
  return useInfiniteQuery({
    queryKey: ['wallpapers', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get('/api/wallpapers', {
        params: {
          ...filters,
          page: pageParam,
          limit: 12,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const { page, pages, hasMore } = lastPage.pagination;
      return hasMore ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Fetch single wallpaper by slug
export const useWallpaperBySlug = (slug) => {
  return useQuery({
    queryKey: ['wallpaper', slug],
    queryFn: async () => {
      const response = await axios.get(`/api/wallpapers/slug/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });
};

// Fetch trending wallpapers
export const useTrendingWallpapers = () => {
  return useQuery({
    queryKey: ['wallpapers', 'trending'],
    queryFn: async () => {
      const response = await axios.get('/api/wallpapers/trending');
      return response.data.data;
    },
  });
};

// Fetch latest wallpapers
export const useLatestWallpapers = () => {
  return useQuery({
    queryKey: ['wallpapers', 'latest'],
    queryFn: async () => {
      const response = await axios.get('/api/wallpapers/latest');
      return response.data.data;
    },
  });
};

// Fetch related wallpapers
export const useRelatedWallpapers = (id) => {
  return useQuery({
    queryKey: ['wallpapers', 'related', id],
    queryFn: async () => {
      const response = await axios.get(`/api/wallpapers/${id}/related`);
      return response.data.data;
    },
    enabled: !!id,
  });
};
