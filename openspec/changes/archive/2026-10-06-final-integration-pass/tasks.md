## 1. Token Standardization

- [x] 1.1 Search and replace raw color literals (e.g., `text-gray-*`, `bg-white`) across `app/` and `components/` with correct token roles (`text-text-muted`, `bg-surface`, etc.).
- [x] 1.2 Audit and fix spacing and radius values that violate token constraints in major layout components.

## 2. Dynamic Content Integration

- [x] 2.1 Update `app/api/terminal/route.ts` commands (e.g., `projects`, `status`) to derive counts from the actual parsed `CONTENT`.
- [x] 2.2 Update `SystemStatusServer` to fetch real content lengths (e.g., `CONTENT.projects.length`, `CONTENT.experiences.length`) and pass them to the `SystemStatus` client component.

## 3. UI and Code Cleanup

- [x] 3.1 Strip any remaining obsolete portfolio components or unused legacy assets in the repository.
- [x] 3.2 Ensure consistent component behavior and routing by reviewing `Link` vs `a` tags across all navigations.

## 4. Verification

- [x] 4.1 Run `npm run lint`, `tsc --noEmit`, and `npm run build` to verify the project compiles without warnings or errors.
