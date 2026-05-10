# Credex AI Audit Tool - Changelog

## [10-05-2026] - Compare Models Integration & Exam Prep
*Note: Progress was a bit lighter today as the primary focus is preparing for the "Cryptography and System Security" endsem exam tomorrow. All the best!*
### Added
- **Dynamic "Compare Models" Button**: A new interactive button that sits beside the primary recommendation action on every tool card.
- **Side-by-Side Analysis**: Clicking the compare button instantly populates the comparison table at the bottom of the page with the current model and the engine's suggested alternative model, then smoothly scrolls the user down to view the head-to-head stats.
- **Baseline Fallbacks**: Even if the user's current tool is optimal, the button uses a smart baseline fallback (like comparing against ChatGPT or Claude) to ensure the comparison feature is always available.

## [09-05-2026] - Intelligence & UX Polish
### Added
- **Dynamic Pricing Engine**: Replaced manual spend inputs with an automated engine that calculates exact costs based on chosen tools, plans, and seats.
- **Granular AI Use Cases**: Expanded use cases to 10 industry-specific roles (e.g., Agentic Workflows, SEO & Marketing, Customer Support).
- **Per-Tool Tracking**: Users now define specific use cases for each tool within their stack, rather than applying a single global use case.
- **Deep Audit Engine**: The engine mathematically compares your specific `toolUseCase` against exact, dynamic target benchmarks to produce hyper-accurate savings to the dollar.

### Changed
- **Ecosystem Graph Physics**: Removed complex float physics and "click-to-open" requirements in favor of buttery-smooth, instant hover tracking for tool nodes.
- **Hero Interface**: Stripped out the blinking ticker and non-interactive bloat to align with a more premium, minimalistic design language.

### Fixed
- **Canvas Scaling Bug**: Resolved an issue where horizontal padding desynced the DOM coordinate tracking on the right-side nodes (Cursor, Claude, Windsurf) causing missed hover states.
