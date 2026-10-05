## Purpose

Defines the interactive terminal presented at the site's address: the closed set of commands it accepts, how those commands resolve against real content, how it behaves for keyboard and assistive-technology users, and the constraints that keep it a page in the shell rather than a widget layered over it.

## ADDED Requirements

### Requirement: The command set is declared and closed

The terminal SHALL accept only commands declared in its registry. Each entry SHALL declare its name, its arity, and its resolved output. An unrecognised command SHALL be refused with an error naming the unknown command and offering the closest matching command, and SHALL NOT be executed in any form.

#### Scenario: A declared command runs

- **WHEN** a user enters `help`
- **THEN** the terminal prints the list of declared commands with their descriptions

#### Scenario: An unrecognised command is refused with a suggestion

- **WHEN** a user enters `projcts`
- **THEN** the terminal prints an error naming `projcts` as unrecognised, suggests `projects`, and executes nothing

#### Scenario: The wrong number of arguments is refused

- **WHEN** a user enters `open` with no argument
- **THEN** the terminal prints a usage error for `open`, states the argument it expected, and does not navigate

#### Scenario: There is no escape hatch to the host

- **WHEN** the registry and the component that reads input are inspected
- **THEN** no input is evaluated, interpolated, or passed to a shell, an evaluator, or any host process

### Requirement: Commands resolve against the content model

Every command that reports on the site SHALL derive its output from the content model, including the cross-referenced figures the model yields. No command SHALL return a figure written by hand.

#### Scenario: A content command reflects the real collection

- **WHEN** a user enters `projects`
- **THEN** every project in the content model appears once, in a stable order, with its declared category and its declared destinations

#### Scenario: A figure command matches the content model

- **WHEN** a user enters `stats`
- **THEN** every figure it prints equals the corresponding figure the content model yields

#### Scenario: A command reflects the current model, not a snapshot

- **WHEN** the content model changes and the terminal is requested again
- **THEN** the terminal's output reflects the new content without any change to the command implementation

### Requirement: Content-backed command output is resolved on the server

A command whose output is a fact about the site SHALL ship no content data to the browser. Entering such a command SHALL result in a request that resolves it on the server and returns its output as text lines. A command SHALL NOT be resolved in the browser against content it holds.

#### Scenario: No content data is in the client bundle

- **WHEN** the terminal's client bundle and the command implementations are inspected
- **THEN** no project, certification, role, or skill record is present in the client bundle, and no content-backed command is resolved in the browser

#### Scenario: Output arrives as text lines

- **WHEN** a content-backed command resolves
- **THEN** its output is returned as an ordered list of lines of selectable text, not as markup or as a pre-rendered component tree

#### Scenario: Slugs are not in the client bundle

- **WHEN** the terminal's client bundle is inspected
- **THEN** it holds the declared command names and the input's interaction code, and no project slug, title, or address

### Requirement: Session-scoped commands resolve without a round trip

A command whose output is a property of the current page load rather than a fact about the site SHALL be resolved in the browser and SHALL NOT require a request. Such a command SHALL be refused as unknown if it is sent to the server.

#### Scenario: `history` resolves without a request

- **WHEN** a user enters `history`
- **THEN** the terminal lists the session's commands, and no request is made

#### Scenario: `clear` resolves without a request

- **WHEN** a user enters `clear`
- **THEN** the output region empties, and no request is made

#### Scenario: A session command is not also a server command

- **WHEN** the server is asked to resolve a session-scoped command name
- **THEN** it refuses it as a command it does not serve, so the two resolution paths cannot diverge on the same name

### Requirement: `open` navigates to the project a slug identifies

The `open` command SHALL resolve its argument against the declared project slugs and SHALL navigate to the matching project address. An argument that matches no slug SHALL print an error listing the slugs that do exist and SHALL NOT navigate.

#### Scenario: A known slug navigates

- **WHEN** a user enters `open medassist`
- **THEN** the browser navigates to that project's address and the case-study page renders

#### Scenario: An unknown slug does not navigate

- **WHEN** a user enters `open nonexistent`
- **THEN** the terminal prints an error naming the unmatched argument, lists the slugs that exist, and the current address is unchanged

#### Scenario: Navigation from the terminal lands on a full page

- **WHEN** a user navigates with `open`
- **THEN** the destination is the ordinary case-study page in the shell, not a client-side view of it

### Requirement: History is per page load

The terminal SHALL recall previously executed commands with the up and down arrows, and SHALL offer a `history` command that lists them in execution order. History SHALL NOT be persisted beyond the current page load.

#### Scenario: The up arrow recalls the previous command

- **WHEN** a user enters `help` and then presses the up arrow
- **THEN** the previous command is restored into the input, and pressing it again recalls the one before it

#### Scenario: `history` lists commands in order

- **WHEN** a user executes `help`, then `projects`, then enters `history`
- **THEN** the three entries are listed in the order they were executed, most recent last

#### Scenario: Nothing is remembered across a reload

- **WHEN** a user executes commands and then reloads the page
- **THEN** the history is empty and the up arrow recalls nothing

### Requirement: Tab completes command names

Pressing Tab in the input SHALL complete the current word against the declared command names. The terminal SHALL NOT complete arguments, and Tab SHALL NOT be bound to anything else.

#### Scenario: Tab completes a unique prefix

- **WHEN** a user types `pro` and presses Tab
- **THEN** the input becomes `projects ` and is ready for Enter

#### Scenario: A prefix with several matches lists them

- **WHEN** a user types a prefix matching more than one command name and presses Tab
- **THEN** the terminal prints the matching names and leaves the input unchanged

#### Scenario: An unknown prefix is left alone

- **WHEN** a user types a word that matches no command and presses Tab
- **THEN** the input is unchanged and no navigation occurs

### Requirement: Output is append-only scrollback that `clear` empties

Entered commands and their output SHALL append to the output region in order. The `clear` command SHALL empty that region. There SHALL be no maximum retained length.

#### Scenario: Output accumulates

- **WHEN** a user executes `help` and then `projects`
- **THEN** both commands and both outputs are present, in order, one after the other

#### Scenario: `clear` empties the region

- **WHEN** a user enters `clear` after producing output
- **THEN** the output region contains nothing and retains nothing from before

#### Scenario: Nothing is discarded for length

- **WHEN** a user produces more output than would fit on screen
- **THEN** every line the session produced is still present in the region

### Requirement: Input is a real text control with a real caret

The input SHALL be a real text control, so that selection, caret movement, insertion, and deletion are performed by the platform rather than by a component that simulates them. There SHALL be no separately drawn caret element. The prompt text SHALL be visible to assistive technology as part of the control's accessible name or description.

#### Scenario: The caret is the platform caret

- **WHEN** a user types into the input and moves the caret with the arrow keys
- **THEN** insertion and deletion follow the caret position, and no second caret element is drawn anywhere

#### Scenario: Editing keys behave natively

- **WHEN** a user presses Home, End, Backspace, or Delete
- **THEN** the control behaves as a single-line text control does in the platform

#### Scenario: Focus is visible

- **WHEN** focus enters the input, by click or by Tab
- **THEN** the input shows a visible focus indication meeting the contrast requirement

### Requirement: The terminal is operable by keyboard and announced to assistive technology

The terminal SHALL be reachable and fully operable by keyboard alone, and SHALL be announced as a named region.

#### Scenario: The input is reachable by Tab from the page

- **WHEN** a user presses Tab from the top of the terminal page
- **THEN** focus reaches the terminal input, and the only focusable elements before it are the skip link and the header navigation

#### Scenario: Enter submits the command

- **WHEN** a user focuses the input and presses Enter
- **THEN** the entered command runs, and focus remains in the input

#### Scenario: The terminal is announced as a region

- **WHEN** the page is traversed by assistive technology
- **THEN** the terminal is exposed as a named region

### Requirement: Command results are announced without interrupting

Output SHALL be announced to assistive technology through a politely updating live region, so that a result is read when it arrives without interrupting what is being read.

#### Scenario: A result is announced politely

- **WHEN** a command produces output while the user is reading elsewhere on the page
- **THEN** the output is announced when it arrives, and no existing reading is interrupted

#### Scenario: What exists before any command is real text

- **WHEN** the terminal page is fetched without executing client scripts
- **THEN** the terminal's own initial lines — its heading, its prompt, and the instructions it states — are present in the returned markup as selectable text, and not as an image or an empty frame

#### Scenario: Produced output is selectable and copyable

- **WHEN** a user selects the scrollback with the pointer or the keyboard
- **THEN** each command and its output are selectable as ordinary text and can be copied, and no line is rendered as an image, as a canvas, or as separately drawn glyphs

### Requirement: The terminal is a page in the shell, not an overlay

The terminal SHALL be a route that renders inside the shell, inheriting the skip link, header, main region, and footer without opting out. It SHALL NOT be presented as a modal, an overlay, or a replacement for the shell, and it SHALL NOT require the user to dismiss anything to reach the rest of the page.

#### Scenario: The shell is present exactly once

- **WHEN** the terminal page is rendered
- **THEN** the document contains exactly one banner, one main region, and one contentinfo, and the skip link is the first focusable element

#### Scenario: No overlay is presented

- **WHEN** the terminal page is rendered and no user action has been taken
- **THEN** no element traps input, no backdrop is drawn, and the header navigation remains reachable

#### Scenario: The terminal cannot cover the shell

- **WHEN** the terminal page is styled
- **THEN** the header, the skip link, and the footer remain usable and visible, and the terminal occupies the page's own content region

### Requirement: The terminal renders on the server and degrades to a usable shell

The terminal page and its input SHALL be delivered by the server. The route SHALL introduce exactly one client component, the one that holds the input. With scripting unavailable, the input and the surrounding page SHALL remain present and the rest of the site SHALL remain navigable.

#### Scenario: The terminal is a shell for one client component

- **WHEN** the client directives across the application are enumerated
- **THEN** the terminal route introduces no client component beyond the single input leaf the shell already uses

#### Scenario: The page degrades to a usable shell

- **WHEN** the page is fetched without executing client scripts
- **THEN** the input and the surrounding page are present, and every route the shell links to remains reachable

#### Scenario: Input is not carried in a query string

- **WHEN** a user enters a command
- **THEN** the address does not change and the command is not written into the address bar or the request path

### Requirement: Self-describing commands measure what they claim

A command that reports a runtime quantity SHALL state what that quantity measures, and SHALL NOT present a process uptime as the site's uptime.

#### Scenario: `uptime` states what it measures

- **WHEN** a user enters `uptime`
- **THEN** the output states the interval it is reporting and labels it as the age of the running process or server, and does not state how long the site has been available

#### Scenario: `date` reports the request time

- **WHEN** a user enters `date`
- **THEN** the output states the server's current date and time

#### Scenario: `status` reports figures that exist

- **WHEN** a user enters `status`
- **THEN** every figure it prints is one the content model yields, and no figure stands in for a measurement that was not taken

### Requirement: The terminal's styling composes from existing tokens

The terminal's surface, text, border, and status colours SHALL be drawn from the token layer's existing roles — the surface roles, the three text roles, the two border roles, and the four status roles. It SHALL introduce no new colour token, no new spacing step, no new radius, and no new type step.

#### Scenario: No token is added

- **WHEN** this change is complete
- **THEN** the token layer is unchanged, and every colour, spacing step, radius, and type step the terminal uses already exists in it

#### Scenario: The terminal surface is an existing surface role

- **WHEN** the terminal's background, its inset input row, and its prompt are styled
- **THEN** they resolve to the declared surface roles and to the mono and text roles, and to no literal colour value

#### Scenario: Command state is not signalled by colour alone

- **WHEN** a command fails
- **THEN** the failure is stated in the text of the output and is not conveyed by colour alone, and a user who cannot perceive the colour difference reads the same failure

#### Scenario: Motion is suppressed on request

- **WHEN** the user has asked for reduced motion
- **THEN** the terminal's transitions and animations do not run

### Requirement: The terminal responds on narrow and wide viewports

The terminal SHALL remain usable and its output SHALL remain readable at narrow widths and at wide widths.

#### Scenario: The terminal stays usable when narrow

- **WHEN** the terminal is viewed at a narrow width
- **THEN** the prompt and input remain on one line, the output region remains readable, and no line of output requires horizontal scrolling to read

#### Scenario: Long lines are contained

- **WHEN** a command emits a line longer than the terminal's width
- **THEN** the line wraps within the output region and no content is clipped