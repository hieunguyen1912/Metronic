package org.example.metronic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDto {
    private Long id;

    @NotBlank(message = "title is required")
    @Size(min = 3, message = "at least 3 character")
    private String title;

    @NotBlank(message = "content is required")
    @Size(min = 10, message = "at least 10 character")
    private String content;

    @NotBlank(message = "status is required")
    @Pattern(
            regexp = "DRAFT|PUBLISHED",
            message = "Status must be DRAFT or PUBLISHED"
    )
    private String status;

    private LocalDateTime createdAt = LocalDateTime.now();
}
