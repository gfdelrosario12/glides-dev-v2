## 1. Components

- [x] 1.1 Create `CopyEmailButton` Client Component in `components/connect/copy-email.tsx` using `navigator.clipboard`.
- [x] 1.2 Create `TerminalContact` Server Component in `components/connect/terminal-contact.tsx` styled with surface and text tokens.

## 2. Connect Page Route

- [x] 2.1 Create the route folder `app/connect` and `page.tsx` file.
- [x] 2.2 Import `CONTENT.socialLinks` and `PROFILE` from `lib/content/model.ts` (or `site.ts`) into `app/connect/page.tsx`.
- [x] 2.3 Render the list of social links, applying `external` attributes correctly.
- [x] 2.4 Integrate `CopyEmailButton` alongside the email link.
- [x] 2.5 Integrate `TerminalContact` into the layout.

## 3. Navigation Update

- [x] 3.1 Ensure `/connect` is added to site navigation (e.g. `SECTION_IDS` or relevant header links if applicable).

## 4. Verification

- [x] 4.1 Run `npm run lint` and `npm run build` to verify the project builds successfully with no errors.
