---
title: 'A few good bits'
description: 'Packing a little state into a byte. Bit flags, readable masks, and the joy of small representations.'
date: 2026-09-12
tags: [Rust]
example: true
art: bits
---

A single byte can hold eight independent yes-or-no answers. That is useful for compact state, device protocols, and game entity flags.

The trick is to make the meaning of each bit obvious enough that you do not need to translate binary in your head while reading the code.

## Give the bits names

```rust
const VISIBLE: u8 = 1 << 0;
const SOLID: u8 = 1 << 1;
const INTERACTIVE: u8 = 1 << 2;

fn main() {
    let mut flags = VISIBLE | SOLID;

    // Set a flag.
    flags |= INTERACTIVE;

    // Clear a flag.
    flags &= !SOLID;

    // Test a flag.
    if flags & INTERACTIVE != 0 {
        println!("Ready for input");
    }

    assert_eq!(flags, VISIBLE | INTERACTIVE);
}
```

Each constant has exactly one set bit. The names communicate intent while the operators describe how the representation changes.

## Any versus all

Combining several flags into a mask introduces a useful distinction:

```rust
fn has_any(flags: u8, mask: u8) -> bool {
    flags & mask != 0
}

fn has_all(flags: u8, mask: u8) -> bool {
    flags & mask == mask
}
```

`has_any` checks whether at least one requested bit is set. `has_all` checks whether every requested bit is set. For an empty mask, `has_any` is false and `has_all` is true.

Those edge cases are easy to miss when the operators are repeated inline throughout a program.

## Keep the representation at the boundary

Bit flags are useful, but compactness does not automatically make a design better. A struct with named boolean fields can be clearer when memory layout is not a constraint.

When the representation matters, keep the masks in one place and expose operations that use the language of the program. A method named `is_interactive()` tells a reader more than a repeated hexadecimal literal.

Small representations work best with clear names.
