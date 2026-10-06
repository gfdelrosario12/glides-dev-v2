## Purpose
Defines global constraints for media optimization, lazy loading, and rendering performance to ensure a fast, lightweight user experience.

## ADDED Requirements

### Requirement: Media assets are optimized and lazy-loaded
All non-critical media assets (such as images not immediately visible in the initial viewport) SHALL be lazy-loaded. Furthermore, all images SHALL be optimized in sizing and format to prevent negative impacts on initial rendering or normal page navigation.

#### Scenario: Non-critical images are deferred
- **WHEN** a user visits a page containing below-the-fold media
- **THEN** those media assets are lazy-loaded and do not block the initial page render

### Requirement: CPU-heavy continuous animations are avoided
The application SHALL avoid continuous, CPU-heavy animations that degrade battery life or frame rates. If continuous animations exist, they SHALL be paused or disabled when the user specifies a reduced-motion preference or when they are not in the viewport.

#### Scenario: Heavy animations are paused on reduced motion
- **WHEN** a user with a `prefers-reduced-motion` preference navigates the site
- **THEN** continuous animations are disabled or paused automatically
