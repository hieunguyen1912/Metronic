package org.example.metronic.controller;

import jakarta.validation.Valid;
import org.example.metronic.dto.PageResponse;
import org.example.metronic.dto.PostDto;
import org.example.metronic.dto.PostMockData;
import org.example.metronic.util.PaginationUtil;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("admin/posts")
@Controller
public class PostController {

    @PostMapping
    public String post(@Valid @ModelAttribute("post") PostDto postDto,
                       BindingResult result,
                       Model model
    ) {
        if (result.hasErrors()) {
            return "create_post";
        }
        postDto.setId(System.currentTimeMillis());
        return "redirect:/admin/posts";
    }

    @GetMapping("/create")
    public String createPost(Model model) {
        model.addAttribute("post", new PostDto());
        return "create_post";
    }

    @GetMapping("/all")
    public String getAllPosts(@RequestParam(value = "page", defaultValue = "1") int page,
                                             @RequestParam(value = "size", defaultValue = "5") int size,
                                             @RequestParam(value = "search", required = false) String search,
                                             @RequestParam(value = "status", required = false) String status,
                                             Model model) {
        List<PostDto> allPosts = PostMockData.getMockPosts();

        if (search != null && !search.trim().isEmpty()) {
            allPosts = PaginationUtil.searchPosts(allPosts, search);
        }

        if (status != null && !status.trim().isEmpty()) {
            allPosts = PaginationUtil.filterByStatus(allPosts, status);
        }

        List<PostDto> data = PaginationUtil.paginate(allPosts, page, size);
        int totalPages = (int) Math.ceil((double) allPosts.size() / size);

        model.addAttribute("posts", data);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("search", search);
        model.addAttribute("status", status);

        return "all_post";
    }
}
