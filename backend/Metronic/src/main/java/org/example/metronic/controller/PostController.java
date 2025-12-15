package org.example.metronic.controller;

import jakarta.validation.Valid;
import org.example.metronic.dto.PageResponse;
import org.example.metronic.dto.PostDto;
import org.example.metronic.dto.PostMockData;
import org.example.metronic.util.PaginationUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/posts")
@RestController
public class PostController {

    @PostMapping
    public ResponseEntity<PostDto> post(@Valid @RequestBody PostDto postDto) {
        postDto.setId(System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.CREATED).body(postDto);
    }

    @GetMapping
    public PageResponse<PostDto> getAllPosts(@RequestParam(value = "page", defaultValue = "1") int page,
                                             @RequestParam(value = "size", defaultValue = "5") int size,
                                             @RequestParam(value = "search", required = false) String search,
                                             @RequestParam(value = "status", required = false) String status) {
        List<PostDto> allPosts = PostMockData.getMockPosts();

        if (search != null && !search.trim().isEmpty()) {
            allPosts = PaginationUtil.searchPosts(allPosts, search);
        }

        if (status != null && !status.trim().isEmpty()) {
            allPosts = PaginationUtil.filterByStatus(allPosts, status);
        }

        List<PostDto> data = PaginationUtil.paginate(allPosts, page, size);
        int totalPages = (int) Math.ceil((double) allPosts.size() / size);

        return PageResponse.<PostDto>builder()
                .data(data)
                .page(page)
                .size(size)
                .totalElements(allPosts.size())
                .totalPages(totalPages).build();
    }
}
