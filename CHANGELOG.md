# Credex AI Audit Tool - Changelog

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
