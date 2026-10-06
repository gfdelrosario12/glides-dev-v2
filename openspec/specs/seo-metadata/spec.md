## Purpose

Ensures the portfolio is fully discoverable by search engines through proper semantic HTML, structured data, and metadata, without compromising its terminal-themed visual experience.

## Requirements

### Requirement: Every route includes page-specific SEO metadata
The system SHALL define descriptive `<title>`, `<meta name="description">`, and canonical URLs for every route. These SHALL reflect professional engineering identity rather than generic template phrases.

#### Scenario: Crawling the application
- **WHEN** a search engine crawler requests a page
- **THEN** it receives descriptive metadata specific to that route's content

### Requirement: Meaningful content relies on semantic HTML, not visual effects
Text that establishes the user's identity, skills, or experience SHALL be rendered as semantic HTML elements (`<h1>`, `<article>`, `<p>`) and SHALL NOT be hidden inside canvas elements, SVG-only paths, or script-dependent animations that omit text content.

#### Scenario: Assessing document structure
- **WHEN** accessibility tools or search engines parse the DOM
- **THEN** a correct and complete heading hierarchy is present and all important text is readable

### Requirement: Open Graph metadata and structured data are provided
The system SHALL inject relevant `Person`, `WebSite`, or `ProfilePage` structured data (JSON-LD) and comprehensive Open Graph/Twitter card tags for social sharing.

#### Scenario: Sharing a link on social media
- **WHEN** a visitor shares a link to the portfolio
- **THEN** a rich preview is generated using the specified Open Graph image, title, and description