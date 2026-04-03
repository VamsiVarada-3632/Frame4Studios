# Design System Specification: The Noir Perspective

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Noir Perspective."** 

This is not a standard corporate interface; it is a cinematic experience. It draws inspiration from high-end film production, where the interplay between shadow (the void) and light (the focus) creates tension. We move away from the "template" look by embracing intentional asymmetry, extreme typographic contrast, and a "texture-first" philosophy. 

The layout should feel like a film’s title sequence—dramatic, paced, and authoritative. We break the rigid grid by allowing imagery and typography to overlap, using the provided 1px structural lines not as boxes, but as "technical annotations" or camera guides that frame the narrative.

---

## 2. Colors & Atmospheric Depth
Our palette is rooted in the dark, using the depth of the "black point" to make the crimson accents feel visceral and luminous.

### Color Tokens
*   **Background:** `surface_dim` (#131313) or `surface_container_lowest` (#0e0e0e)
*   **Primary Accent:** `primary_container` (#C41E3A) — used for "The Flare"
*   **Accent Highlight:** `primary` (#FFB3B4) — used for critical interactive states
*   **Text:** `on_surface` (#E5E2E1) and `on_surface_variant` (#E3BEBD)

### The "No-Line" Rule
Designers are prohibited from using 1px solid borders for sectioning. To separate content blocks, use background color shifts. For example, a `surface_container_low` section sitting against a `surface_dim` background. Let the tonal change define the edge, not a stroke.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of film stock. 
*   **Base:** `surface_container_lowest` for the global canvas.
*   **Level 1:** `surface_container` for primary content areas.
*   **Level 2:** `surface_container_high` for elevated cards or modals.
This nesting creates a "natural lift" that feels architectural rather than digital.

### The "Glass & Flare" Rule
To add soul to the dark noir aesthetic, use glassmorphism for floating navigation or overlay elements. Utilize `surface_variant` at 40% opacity with a `20px` backdrop blur. Enhance this with **Signature Textures**: apply a global `3-5%` opacity white noise texture over the entire canvas to simulate film grain, and use `primary_container` in subtle radial gradients (20% opacity) to create "lens flare" glows in the corners of sections.

---

## 3. Typography
The typography is an editorial dialogue between the romanticism of the past and the technical precision of the future.

*   **Headlines (Display/Headline Scale):** Use **Cormorant Garamond** (mapped to `display-lg` through `headline-sm`). Keep weights at 300. Use italics for emphasis to create a "Director's Cut" editorial feel. This is our "Hero" voice—dramatic and large.
*   **UI/Labels (Label Scale):** Use **Syne** (mapped to `label-md/sm`). Set to Uppercase with `0.15em` letter-spacing. This provides a brutalist, technical contrast to the serif headlines. It mimics camera metadata and equipment labels.
*   **Body (Title/Body Scale):** Use **DM Sans** (mapped to `title-lg` through `body-sm`). Keep weight at 300. This is the "Script"—minimal, legible, and unobtrusive.

---

## 4. Elevation & Depth
In this design system, shadows are rarely used. Depth is a product of light and layering.

*   **The Layering Principle:** Achieve hierarchy by "stacking" surface tiers. A `surface_container_highest` card on a `surface_container` background creates a sophisticated lift without the "muddy" look of traditional shadows.
*   **Ambient Shadows:** If a floating element (like a dropdown) requires a shadow, it must be ultra-diffused. Use a 40px blur at 8% opacity using the `primary_container` color tinted toward black. This mimics the soft falloff of a studio light.
*   **The "Ghost Border" Fallback:** If a container requires a boundary for accessibility, use a "Ghost Border." This is the `outline_variant` token at 15% opacity. Never use 100% opaque borders.

---

## 5. Components

### Buttons
*   **Style:** Sharp corners (`0px` radius).
*   **Primary:** Background `primary_container`, text `on_primary_container`. No border.
*   **Secondary:** Ghost Border (`outline_variant` at 20%) with text in `label-md` (Syne, Uppercase).
*   **Interaction:** On hover, transition the background to `primary` and add a subtle `primary_container` radial glow behind the button.

### Cards & Lists
*   **Construction:** Forbid the use of divider lines. Use `1.4rem` to `2.75rem` of vertical space (from the Spacing Scale) to separate items.
*   **Visual Interest:** In the top-left and bottom-right corners of featured cards, place "Camera Brackets"—1px lines (8px length) using the `primary_container` color at 40% opacity.

### Input Fields
*   **Style:** Minimalist. A single 1px bottom border using `outline_variant`. 
*   **Active State:** The bottom border transforms into `primary_container` and a subtle red glow appears behind the text.

### The "Full-Screen Noir" Navigation
The mobile navigation must be a full-screen `surface_container_lowest` overlay. Typography should be `display-md` (Cormorant Garamond Italics), centered, with large amounts of breathing room. Each menu item should feel like a film credit.

---

## 6. Do's and Don'ts

### Do:
*   **Do** embrace the void. Large areas of `#080808` are your friend; they create focus.
*   **Do** use intentional asymmetry. Offset a headline to the left and a body paragraph to the far right.
*   **Do** use the 1px red structural lines as decorative "framing" elements rather than functional containers.

### Don't:
*   **Don't** use rounded corners. Everything in this system is a hard edge (`0px`), reflecting the precision of a camera frame.
*   **Don't** use standard grey shadows. They kill the "Noir" tension.
*   **Don't** over-use the red accent. It should feel like a warning or a spotlight—rare and impactful.
*   **Don't** use divider lines between list items. Trust the white space and the `surface` shifts.

---

## 7. Spacing Scale
Always use the following increments to maintain rhythmic tension:
*   **Tight (UI):** `0.35rem` (1), `0.7rem` (2)
*   **Standard (Content):** `1.4rem` (4), `2rem` (6)
*   **Cinematic (Sections):** `5.5rem` (16), `8.5rem` (24)