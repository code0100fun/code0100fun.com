---
title: 'Memory management without the mystery'
description: 'A small arena, an explicit lifetime, and one less thing to keep in your head.'
date: 2026-09-14
tags: [C, Zig]
example: true
art: memory
---

Memory gets easier to reason about when objects that live together are freed together. A frame’s temporary data, a parsed document, or a compiler pass can often share one lifetime.

An **arena** turns that lifetime into a concrete thing: a block of memory and a position inside it.

## Start with a byte arena

This minimal C arena serves byte buffers. It doesn’t promise alignment for arbitrary types; a general-purpose allocator would need to handle that too.

```c
#include <stddef.h>
#include <stdint.h>

typedef struct {
    uint8_t *data;
    size_t capacity;
    size_t used;
} ByteArena;

void *arena_alloc_bytes(ByteArena *arena, size_t size) {
    if (size > arena->capacity - arena->used) {
        return NULL;
    }

    void *result = arena->data + arena->used;
    arena->used += size;
    return result;
}

void arena_reset(ByteArena *arena) {
    arena->used = 0;
}
```

Initialize the arena with a valid backing buffer and `used = 0`. Keep `used <= capacity` as an invariant. The subtraction in the bounds check avoids an overflowing `used + size` calculation.

Resetting does not erase data. It makes the entire region available to allocate again. Existing pointers become logically invalid even though the bytes may still be there.

## The useful part is the lifetime

An arena is a good fit when you can name the moment that everything inside it stops being useful:

- End of a frame.
- End of a request.
- End of a parsing operation.

It is a poor fit when allocations have many unrelated lifetimes. You may keep a large amount of otherwise unused memory alive because one small object is still needed.

## The same idea in Zig

Zig makes allocators explicit. Its standard library provides an arena with proper alignment and backing allocation management:

```zig
const std = @import("std");

pub fn main() !void {
    var arena = std.heap.ArenaAllocator.init(
        std.heap.page_allocator,
    );
    defer arena.deinit();

    const bytes = try arena.allocator().alloc(u8, 256);
    @memset(bytes, 0);
}
```

The `defer` puts the lifetime in one obvious place. Every allocation owned by the arena is released when the arena is deinitialized.

## Make ownership boring

The best allocator is often the one that makes ownership easiest to explain. Before reaching for a more elaborate strategy, ask a smaller question: **when can all of this disappear?**
