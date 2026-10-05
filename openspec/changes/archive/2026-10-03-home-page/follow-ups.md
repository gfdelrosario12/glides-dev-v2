# Follow-ups for the content owner

Findings from the `home-page` change. Nothing here was rewritten in `content/` —
the site renders the source text as written, so every item below is a decision
only the owner can make.

## 1. Descriptions that contradict their own record

These are rendered verbatim on the site as they stand. Each is flagged because a
reader comparing the title against the description will see the mismatch.

| Record | Contradiction |
| --- | --- |
| **Director for Cloud Computing**, PUP Manila Microsoft Student Community | The title and organisation are cloud and Microsoft; the description says "Built Android applications, contributed to collaborative projects, and supported technical workshops for students." No cloud or Microsoft work is described. |
| **Mobile Developer**, Google Developer Stuent Clubs PUP | The title is an engineering role; the description says "Led strategic business development efforts, advocating cloud adoption and delivering infrastructure-focused workshops." That is a business-development and enablement role. |
| **SBD Lead — Department of Cloud Computing and Infrastructure**, AWS Cloud Clubs PUP | The organisation is the AWS student club, but the description centres on Azure: "Directed cloud learning tracks, hosted Azure bootcamps, and enabled students in Microsoft technologies and cloud certifications." SBD is a business-development lead; the description is technical enablement. |
| **Blockchain Developer**, TON Society — Manila Bootcamp: Hackers League Hackathon | The title and description are blockchain and Web3, but the declared `skills` are "Technology \| Business Analysis \| Development" — no blockchain, smart-contract, or Web3 token. The skills list looks carried over from the other competitive records. |

## 2. Records that are not shaped like records

| Record | Issue |
| --- | --- |
| **Devskolar**, The Programmer's Guild | The `title` field holds a programme name, not a role. Every other experience record names a position. Either a role is missing or this row does not belong in the experience list. |
| **IT Service Management Intern (1st Semester)**, Sun Life Global Solutions — Philippines | Duration is "July 2024 - September 2025" — about fifteen months for a record labelled "1st Semester". The description is consistent with the internship; only the span is implausible. |
| **IT Service Management Intern (1st Semester)** and **(2nd Semester)**, Sun Life | The two semesters of one internship overlap: the 1st runs to September 2025, the 2nd runs March 2025 to May 2025. Consecutive semesters should not overlap. |

## 3. Organisation names carrying spelling errors

These are rendered as written, so they appear on the site misspelled.

| As written | Almost certainly intended |
| --- | --- |
| "Google Developer Stuent Clubs PUP" (3 records: Chief Community Development Officer, Community Development Fellow Lead, Mobile Developer) | "Google Developer **Student** Clubs PUP" |
| "PUP Manila Microsoft Student Community" (1 record) | "PUP Manila **Microsoft Student Community**" — the "Manila" qualifier reads as a duplicate of the campus, not part of the org name. |

Note that the data does correctly distinguish **Google Developer Groups on Campus PUP** (a working group) from **Google Developer Student Clubs PUP** (a student club), so the fix is to repair "Stuent" without merging the two organisations.

## 4. Mechanical corrections applied to `content/` only

`content/` differs from `../data for portfolio/` in exactly these places. The
upstream directory is untouched.

| File | Field | Upstream | In `content/` |
| --- | --- | --- | --- |
| `certifications.csv` | header | `title,organization,&#32;&#32;year,description,color,url` | `title,organization,year,description,color,url` |
| `projects.csv` | `githubUrl`, Care Max | `…/CareMax-Arduino.gitt` | `…/CareMax-Arduino.git` |
| `projects.csv` | new final column | absent | `featured`, an order index: Guardian Vision `1`, eTapon `2`, empty for the other five |
| `experiences.csv` | `duration`, Community Development Fellow Lead | `Devember 2022 - August 2023` | `December 2022 - August 2023` |
| `experiences.csv` | `type`, 4 competitive records | `competetive` | `competitive` |

`content/education.csv` is new and has no upstream counterpart. Its three
records were transcribed verbatim from the v1 `components/sections/EducationSection.tsx`
in `../glides-dev/`.

## 5. `color` in `certifications.csv` is dead data

All six records carry `color: blue`, and all six `badgeColor` values in
`experiences.csv` come from a four-value set. The value is not rendered — this
system takes its colour from the token layer, not from content. The column can
be dropped when convenient; it is validated and ignored in the meantime.

## 6. Portrait aspect ratio

`Main.JPG` is 3:2 landscape (6000×4000) and is used in the v1 site inside a
square avatar frame, which crops the subject. The `home-page` design keeps the
full 3:2 frame in a fixed aspect container, so the composition is preserved. A
square or portrait original would serve the layout better.

---

# Verification record

## Profile image (tasks 6.1, 6.2, 6.4)

| | Dimensions | Size |
| --- | --- | --- |
| Source `../glides-dev/public/images/Main.JPG` | 6000 × 4000 | 11,230,499 bytes (10.7 MiB) |
| Derivative `public/images/profile.jpg` | 1600 × 1067 | 165,218 bytes (161.3 KiB) |

A 68× reduction, produced with `magick … -resize 1600x -strip -interlace Plane
-quality 82`. The 3:2 ratio is preserved and nothing is cropped at the source.
The 11.2 MB original is **not** in this repository; `public/images/` contains
only the derivative, and no file over 1 MB exists in the tree outside
`node_modules` and `.next`.

Confirmed served through `next/image`: the browser selected
`/_next/image?url=%2Fimages%2Fprofile.jpg&w=750&q=75` at DPR 2, decoded to
375×250, rendered at 341×227 with `object-fit: cover` inside a parent at
`aspect-ratio: 3 / 2`. Optimizer responses return 200 at every generated width
(256 → 5.9 KB, 1920 → 98.8 KB).

## Horizontal overflow (task 9.6)

Measured in headless Chromium 151 over CDP against the production build:

| Viewport | `innerWidth` | `clientWidth` | `scrollWidth` | Horizontal scroll |
| --- | --- | --- | --- | --- |
| 320 | 320 | 320 | 320 | no |
| 360 | 360 | 360 | 360 | no |
| 375 | 375 | 375 | 375 | no |
| 414 | 414 | 414 | 414 | no |
| 768 | 768 | 753 | 753 | no |
| 1024 | 1024 | 1009 | 1009 | no |
| 1440 | 1440 | 1425 | 1425 | no |

`scrollWidth` equals `clientWidth` at every width, so the document never scrolls
horizontally. 320px is the narrowest width tested and the narrowest this design
supports.

The longest real values are present at 320px without overflowing:
`https://github.com/gfdelrosario12/etapon-prototype` in a project card,
`Polytechnic University of the Philippines - College of Engineering` on a
qualification card, and the hero eyebrow listing all five focus areas.

One element reports a 1px box at `left: -1` — the visually hidden skip link.
That is the `clip-path` technique already declared in `app/globals.css`, and it
contributes nothing to `scrollWidth`.

## Derived figures (task 9.4)

Read out of the built page's markup, not from the source:

| Figure | Rendered | Expected |
| --- | --- | --- |
| Years of practice | 3 | derived |
| Projects | 7 | 7 |
| Technologies | 16 | 16 |
| Cloud platforms | 4 | 4 |
| Roles held | 20 | 20 |
| Leadership roles | 9 | 9 |
| Certifications | 6 | 6 |
| Featured | 2 | derived |

**Years of practice is 3, not 4.** Year arithmetic from 2022 to 2026 gives four,
but the earliest *interpretable* record starts December 2022 — the October 2022
record is excluded because it reads `October 2022 - August 2022`, ending before
it begins. December 2022 to October 2026 is three whole years. The figure is
month-precise rather than year-precise, which is the more accurate reading of
"from the earliest recorded start to the present".

## Records reported by the build

Two categories of problem are surfaced by `derive.ts` rather than swallowed:

- `experiences.csv` line 12, "Mobile Developer": `October 2022 - August 2022`
  ends before it begins. Excluded from the years-of-practice figure.
- No unmatched focus signals and no unmapped cloud tokens.

A signal that matches nothing is reported rather than silently omitted, because
a slightly wrong token — a dropped `NC2`, a renamed skill — lowers a count
without changing anything visible. That check caught one real mistake during
this change: `Computer Systems Servicing` matched nothing, because the actual
certification title is `Computer Systems Servicing NC2`, and the Networking
count was one short until it was fixed.
