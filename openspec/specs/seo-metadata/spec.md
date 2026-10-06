## Purpose

Ensures the portfolio is fully discoverable by search engines through proper semantic HTML, structured data, canonical routing, crawler directives, and metadata, while providing a multi-format favicon system and web app manifest matching the terminal engineering identity.

## Requirements

### Requirement: Every route includes page-specific SEO metadata
The system SHALL define descriptive `<title>`, `<meta name="description">`, and canonical URLs for every route. These SHALL reflect verified engineering identity rather than generic template phrases.

#### Scenario: Crawling the application
- **WHEN** a search engine crawler requests a page (`/`, `/connect`, etc.)
- **THEN** it receives descriptive metadata and canonical URLs specific to that route's content

### Requirement: Multi-format favicon and web app manifest support
The system SHALL provide responsive, multi-format favicon assets and a Web App Manifest (`manifest.webmanifest`) in `app/manifest.ts` supporting standard desktop browsers, mobile home screen shortcuts, and high-DPI displays.
- Favicon SVG (`/icon.svg` and `app/icon.svg`) with dark/light mode CSS adaptations.
- Raster icons: `favicon-32x32.png`, `favicon.ico`, `apple-touch-icon.png` (180x180), `icon-192.png`, and `icon-512.png`.
- Web App Manifest declaring application name, short name, theme color (`#0b0c0e`), background color, and icon declarations.

#### Scenario: Displaying tab and shortcut icons
- **WHEN** a visitor navigates to the portfolio or adds it to their mobile home screen
- **THEN** modern browsers display the sharp SVG/PNG favicon and mobile operating systems utilize the declared touch icon without blurriness

### Requirement: Automated search engine discovery via sitemap and robots
The system SHALL dynamically generate `/sitemap.xml` via `app/sitemap.ts` and `/robots.txt` via `app/robots.ts`.
- `sitemap.xml` SHALL declare authoritative canonical URLs with last modified timestamps and change frequencies.
- `robots.txt` SHALL allow crawling of public routes, disallow `/api/` internal endpoints, and link to the sitemap.

#### Scenario: Search engine discovery
- **WHEN** web crawlers inspect `/robots.txt` and `/sitemap.xml`
- **THEN** all valid portfolio endpoints are indexed efficiently with clear crawl priorities

### Requirement: Structured data provides linked JSON-LD entities
The system SHALL inject Schema.org JSON-LD structured data linking `WebSite`, `ProfilePage`, and `Person` records.
- All information SHALL be derived strictly from verified portfolio content.
- The `Person` record SHALL declare verified education (`Polytechnic University of the Philippines`), `knowsAbout` skills, job title, image, and authoritative `sameAs` social links.

#### Scenario: Parsing structured entity data
- **WHEN** search engines or rich snippet validators parse the document head
- **THEN** a valid `@graph` containing `WebSite`, `ProfilePage`, and `Person` is present without validation errors

### Requirement: Meaningful content relies on semantic HTML and accessible images
All core content SHALL be rendered as semantic HTML elements (`<h1>`-`<h3>`, `<article>`, `<section>`, `<ol>`, `<ul>`, `<p>`) with proper heading hierarchy. All images SHALL provide descriptive, non-empty `alt` attributes explaining the subject without keyword stuffing.

#### Scenario: Assessing document accessibility and structure
- **WHEN** screen readers or search engines parse the DOM
- **THEN** a logical heading hierarchy is present, all interactive links have descriptive labels, and all images possess accessible alternative text