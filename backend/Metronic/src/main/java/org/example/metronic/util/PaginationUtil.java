package org.example.metronic.util;

import org.example.metronic.dto.PostDto;

import java.util.List;

public class PaginationUtil {

    public static <T> List<T> paginate(List<T> data, int page, int size) {
        if (page < 1 || size < 1) {
            throw new IllegalArgumentException("Page and size must be greater than 0");
        }

        int fromIndex = (page - 1) * size;

        if (fromIndex >= data.size()) {
            return List.of();
        }

        int toIndex = Math.min(fromIndex + size, data.size());
        return data.subList(fromIndex, toIndex);
    }

    public static List<PostDto> searchPosts(List<PostDto> posts, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return posts;
        }

        String searchTerm = keyword.trim().toLowerCase();
        return posts.stream()
                .filter(post -> 
                    (post.getTitle() != null && post.getTitle().toLowerCase().contains(searchTerm)) ||
                    (post.getContent() != null && post.getContent().toLowerCase().contains(searchTerm))
                )
                .toList();
    }

    public static List<PostDto> filterByStatus(List<PostDto> posts, String status) {
        if (status == null || status.trim().isEmpty()) {
            return posts;
        }

        String statusFilter = status.trim().toUpperCase();
        return posts.stream()
                .filter(post -> post.getStatus() != null && post.getStatus().equals(statusFilter))
                .toList();
    }
}
