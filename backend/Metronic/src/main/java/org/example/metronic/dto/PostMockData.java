package org.example.metronic.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class PostMockData {

    public static List<PostDto> getMockPosts() {
        List<PostDto> posts = new ArrayList<>();

        posts.add(new PostDto(
                1L,
                "First Post",
                "This is the content of the first post demo",
                "PUBLISHED",
                LocalDateTime.now().minusDays(10)
        ));

        posts.add(new PostDto(
                2L,
                "Second Post",
                "This is the content of the second post demo",
                "DRAFT",
                LocalDateTime.now().minusDays(9)
        ));

        posts.add(new PostDto(
                3L,
                "Third Post",
                "This is the content of the third post demo",
                "PUBLISHED",
                LocalDateTime.now().minusDays(8)
        ));

        posts.add(new PostDto(
                4L,
                "Fourth Post",
                "This is the content of the fourth post demo",
                "DRAFT",
                LocalDateTime.now().minusDays(7)
        ));

        posts.add(new PostDto(
                5L,
                "Fifth Post",
                "This is the content of the fifth post demo",
                "PUBLISHED",
                LocalDateTime.now().minusDays(6)
        ));

        posts.add(new PostDto(
                6L,
                "Sixth Post",
                "This is the content of the sixth post demo",
                "DRAFT",
                LocalDateTime.now().minusDays(5)
        ));

        posts.add(new PostDto(
                7L,
                "Seventh Post",
                "This is the content of the seventh post demo",
                "PUBLISHED",
                LocalDateTime.now().minusDays(4)
        ));

        posts.add(new PostDto(
                8L,
                "Eighth Post",
                "This is the content of the eighth post demo",
                "DRAFT",
                LocalDateTime.now().minusDays(3)
        ));

        posts.add(new PostDto(
                9L,
                "Ninth Post",
                "This is the content of the ninth post demo",
                "PUBLISHED",
                LocalDateTime.now().minusDays(2)
        ));

        posts.add(new PostDto(
                10L,
                "Tenth Post",
                "This is the content of the tenth post demo",
                "DRAFT",
                LocalDateTime.now().minusDays(1)
        ));

        return posts;
    }
}
