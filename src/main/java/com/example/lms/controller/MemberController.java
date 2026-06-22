package com.example.lms.controller;

import com.example.lms.entity.Member;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.repository.MemberRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {
    private final MemberRepository members;

    public MemberController(MemberRepository members) {
        this.members = members;
    }

    @GetMapping
    List<Member> all() { return members.findAll(); }

    @GetMapping("/{id}")
    Member one(@PathVariable Long id) {
        return members.findById(id).orElseThrow(() -> new ResourceNotFoundException("Member not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    Member create(@Valid @RequestBody Member member) { return members.save(member); }

    @PutMapping("/{id}")
    Member update(@PathVariable Long id, @Valid @RequestBody Member request) {
        Member member = one(id);
        member.setMemberCode(request.getMemberCode());
        member.setFullName(request.getFullName());
        member.setEmail(request.getEmail());
        member.setPhone(request.getPhone());
        member.setAddress(request.getAddress());
        member.setMembershipDate(request.getMembershipDate());
        member.setActive(request.isActive());
        return members.save(member);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable Long id) { members.delete(one(id)); }
}
