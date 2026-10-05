## Purpose

Defines the interactive terminal available from every route: the closed set of commands it accepts, how those commands resolve against real content, how the overlay is opened and dismissed, where focus goes while it is open, and the constraints that keep one engine serving every presentation.

## ADDED Requirements

### Requirement: The terminal opens from any route without navigating

The terminal SHALL be openable from every route. Opening it SHALL NOT change the address, SHALL NOT navigate away from the route it was opened from, and SHALL NOT require the visitor to visit a terminal page. No URL SHALL address the terminal.

#### Scenario: Opening preserves the current route

- **WHEN** the terminal is opened on a route
- **THEN** the address is unchanged, the route's content is still rendered, and the terminal is presented over it

#### Scenario: Closing returns to the same route

- **WHEN** the terminal is closed
- **THEN** the visitor is on the route they opened it from, at the scroll position they left it

#### Scenario: There is no address for the terminal

- **WHEN** the site's routes are enumerated
- **THEN** no route renders the terminal, and the terminal cannot be reached or shared by direct address

#### Scenario: History and back do not record opening

- **WHEN** the terminal is opened and closed repeatedly
- **THEN** the browser's forward and back history contains no entry for opening or closing it

### Requirement: The command set is declared and closed

The terminal SHALL accept only commands declared in its registry. Each entry SHALL declare its name, its arity, its resolution class, and its output. An unrecognised command SHALL be refused with an error naming the unknown command and offering the closest matching command, and SHALL NOT be executed in any form.

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

### Requirement: One engine serves every presentation

The command registry, execution, history, and completion SHALL exist once and SHALL NOT be duplicated per surface. The terminal SHALL NOT have a separate implementation for any route, and the overlay SHALL NOT carry a second copy of command logic.

#### Scenario: There is one command registry

- **WHEN** the implementation is inspected
- **THEN** exactly one command registry exists, and no route or component declares its own list of commands or its own execution logic

#### Scenario: Opening the terminal twice reuses the same engine

- **WHEN** the terminal is opened, closed, and opened again
- **THEN** each session resolves commands through the same registry and the same resolution paths, and the second session shares no state with the first

#### Scenario: Adding a command is one edit

- **WHEN** a command is added to the registry
- **THEN** it becomes available from every route and in the help output without any change to the overlay, the navigation, or the server endpoint

### Requirement: Commands resolve against the content model

Every command that reports on the site SHALL derive its output from the content model, including the cross-referenced figures the model yields. No command SHALL return a figure written by hand.

#### Scenario: A content command reflects the real collection

- **WHEN** a user enters `projects`
- **THEN** every project in the content model appears once, in a stable order, with its declared category and its declared destinations

#### Scenario: A figure command matches the content model

- **WHEN** a user enters `status`
- **THEN** every figure it prints equals the corresponding figure the content model yields

#### Scenario: A command reflects the current model, not a snapshot

- **WHEN** the content model changes and the terminal is opened again
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
- **THEN** it holds the declared command names and the overlay's interaction code, and no project slug, title, or address

### Requirement: Session-scoped commands resolve without a round trip

A command whose output is a property of the current overlay session rather than a fact about the site SHALL be resolved in the browser and SHALL NOT require a request. Such a command SHALL be refused as unknown if it is sent to the server.

#### Scenario: `history` resolves without a request

- **WHEN** a user enters `history`
- **THEN** the terminal lists the session's commands, and no request is made

#### Scenario: `clear` resolves without a request

- **WHEN** a user enters `clear`
- **THEN** the output region empties, and no request is made

#### Scenario: A session command is not also a server command

- **WHEN** the server is asked to resolve a session-scoped command name
- **THEN** it refuses it as a command it does not serve, so the two resolution paths cannot diverge on the same name

### Requirement: `open` navigates only to a published destination

The `open` command SHALL resolve its argument against the declared project slugs and SHALL navigate to the matching case study only when that case study is published. An argument that matches no slug, or whose slug has no published case study, SHALL print an error and SHALL NOT navigate.

#### Scenario: A known published slug navigates

- **WHEN** a user enters `open <slug>` for a project whose case study is published
- **THEN** the terminal closes and the browser navigates to that project's address, rendering the case-study page

#### Scenario: An unknown slug does not navigate

- **WHEN** a user enters `open nonexistent`
- **THEN** the terminal prints an error naming the unmatched argument, lists the slugs that exist, and the terminal remains open on the same route

#### Scenario: An unpublished slug is reported honestly

- **WHEN** a user enters `open <slug>` for a project that has no published case study
- **THEN** the terminal states that no case study is published for that slug, and does not navigate

#### Scenario: Navigation lands on a full page

- **WHEN** the terminal navigates
- **THEN** the destination is the ordinary case-study page in the shell, not a client-side view of it

### Requirement: The overlay is announced as a dialog

While the terminal is open it SHALL be exposed to assistive technology as a named dialog, carrying a label that identifies it as a terminal. While it covers the page, the content beneath it SHALL be hidden from assistive technology.

#### Scenario: The open terminal is a named dialog

- **WHEN** the terminal is open
- **THEN** it is exposed as a dialog with a name that identifies it as a terminal

#### Scenario: The covered page is hidden while covered

- **WHEN** the terminal covers the page
- **THEN** the header, main content, and footer are not exposed to assistive technology and cannot be reached by keyboard

### Requirement: Opening moves focus into the terminal

Opening the terminal SHALL move focus to its input, so a visitor who opened it can type immediately without first tabbing to it.

#### Scenario: Focus lands on the input

- **WHEN** the terminal is opened from navigation or from the keyboard shortcut
- **THEN** the terminal input has focus and is ready to receive typed characters

#### Scenario: Opening does not leave focus behind

- **WHEN** the terminal is open
- **THEN** no element outside the terminal holds focus

### Requirement: Focus is contained only while the terminal covers the page

While the terminal covers the page, keyboard focus SHALL remain inside the terminal and SHALL NOT reach the content beneath it. While the terminal does not cover the page, the content beneath it SHALL remain reachable and focus SHALL NOT be contained.

#### Scenario: Tab does not escape a covering terminal

- **WHEN** the terminal covers the page and focus is on its last focusable element
- **THEN** pressing Tab moves focus to the terminal's first focusable element rather than to the content beneath it

#### Scenario: Shift and Tab do not escape backwards

- **WHEN** the terminal covers the page and focus is on its first focusable element
- **THEN** pressing Shift and Tab moves focus to the terminal's last focusable element

#### Scenario: A non-covering terminal does not trap focus

- **WHEN** the terminal does not cover the page
- **THEN** the header, the skip link, and the content beneath remain reachable by keyboard while the terminal is open

### Requirement: Escape always closes and focus returns to the opener

Pressing Escape SHALL close the terminal from any state, including while a command is resolving, and SHALL return focus to the element that opened it. Focus SHALL NOT be left on a removed element.

#### Scenario: Escape closes from anywhere in the terminal

- **WHEN** the terminal is open and focus is on its input, its close control, or its scrollback
- **THEN** pressing Escape closes it

#### Scenario: Escape closes while a command is resolving

- **WHEN** a command is in flight and the visitor presses Escape
- **THEN** the terminal closes immediately, and a late response for the abandoned session is discarded rather than reopening or appending to it

#### Scenario: Focus returns to the opener

- **WHEN** the terminal closes
- **THEN** focus is on the element that opened it — the navigation action or the shortcut's last focused element

#### Scenario: Focus is never stranded

- **WHEN** the terminal closes after the visitor moved focus within it
- **THEN** focus is on an element that exists in the page, and the visitor's next Tab continues from the header rather than from the document body

### Requirement: The terminal does not prevent conventional navigation

The terminal SHALL be dismissible without running a command and without reading it, and nothing about it SHALL require a visitor who prefers conventional navigation to use it. A visitor who never opens the terminal SHALL find every route the shell offers reachable.

#### Scenario: Closing needs no command

- **WHEN** a visitor opens the terminal and wants to leave
- **THEN** Escape or the close control dismisses it, and no command is required

#### Scenario: The site is complete without the terminal

- **WHEN** a visitor never opens the terminal
- **THEN** every route the shell links to is reachable, and the navigation action is not the only route to any destination

#### Scenario: The opener announces the shortcut

- **WHEN** a visitor focuses the navigation action that opens the terminal
- **THEN** its accessible name states the keyboard shortcut that opens the same thing

### Requirement: A keyboard shortcut opens the terminal from any route

A single declared key combination SHALL open the terminal from any route. The shortcut SHALL be suppressed while the visitor is typing in a text field, textarea, or other text control, and SHALL NOT fire while a modifier other than the platform's command modifier is held.

#### Scenario: The shortcut opens the terminal

- **WHEN** a visitor presses the declared combination on any route while not typing
- **THEN** the terminal opens

#### Scenario: The shortcut does not fire while typing

- **WHEN** a visitor presses the declared combination while focus is in a text field, textarea, or other text control
- **THEN** the terminal does not open and the keystroke reaches the field

#### Scenario: The shortcut is ignored with other modifiers

- **WHEN** a visitor presses the combination with an additional modifier held
- **THEN** the terminal does not open

#### Scenario: The shortcut closes as well as opens

- **WHEN** the terminal is open and focus is not in a text control within it
- **THEN** pressing the declared combination closes it

#### Scenario: There is exactly one shortcut

- **WHEN** the implementation is inspected
- **THEN** exactly one key combination opens the terminal, declared in one place, and no other combination is bound to it

### Requirement: The presentation adapts to the viewport

Below the small breakpoint the terminal SHALL present as a drawer that does not cover the page, leaving the header and the skip link visible and reachable. At and above that breakpoint it SHALL present as a surface covering the viewport. Both presentations SHALL use the same engine and expose the same commands.

#### Scenario: Narrow viewports get a drawer

- **WHEN** the terminal is opened below the small breakpoint
- **THEN** it is presented as a drawer, and the header and skip link remain visible and operable

#### Scenario: Wide viewports get a covering surface

- **WHEN** the terminal is opened at or above the small breakpoint
- **THEN** it covers the viewport

#### Scenario: One engine, both presentations

- **WHEN** the viewport crosses the breakpoint with the terminal closed and it is reopened
- **THEN** the same commands are available in the new presentation, and the engine is not duplicated per presentation

#### Scenario: Narrow presentation stays usable

- **WHEN** the drawer is open at the narrowest supported width
- **THEN** the prompt and input remain on one line, output remains readable, and no line requires horizontal scrolling to read

### Requirement: History is per overlay session

The terminal SHALL recall previously executed commands with the up and down arrows, and SHALL offer a `history` command that lists them in execution order. History SHALL NOT be persisted beyond the current overlay session.

#### Scenario: The up arrow recalls the previous command

- **WHEN** a user enters `help` and then presses the up arrow
- **THEN** the previous command is restored into the input, and pressing it again recalls the one before it

#### Scenario: `history` lists commands in order

- **WHEN** a user executes `help`, then `projects`, then enters `history`
- **THEN** the three entries are listed in the order they were executed, most recent last

#### Scenario: Nothing is remembered after closing

- **WHEN** a user executes commands, closes the terminal, and opens it again
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

#### Scenario: Output is not shown before the server produces it

- **WHEN** a command is resolving
- **THEN** no output line for that command is present in the scrollback, and a line appears only once the server has returned it

### Requirement: Input is a real text control with a real caret

The input SHALL be a real text control, so that selection, caret movement, insertion, and deletion are performed by the platform rather than by a component that simulates them. There SHALL be no separately drawn caret element. The prompt SHALL be identified to assistive technology as part of the control rather than as the control's only label.

#### Scenario: The caret is the platform caret

- **WHEN** a user types into the input and moves the caret with the arrow keys
- **THEN** insertion and deletion follow the caret position, and no second caret element is drawn anywhere

#### Scenario: Editing keys behave natively

- **WHEN** a user presses Home, End, Backspace, or Delete
- **THEN** the control behaves as a single-line text control does in the platform

#### Scenario: The input has an accessible name

- **WHEN** the input is reached by assistive technology
- **THEN** it exposes a name identifying it as a terminal command input, and the decorative prompt glyph is not what identifies it

### Requirement: Command results are announced without interrupting

Output SHALL be announced to assistive technology through a politely updating live region, so that a result is read when it arrives without interrupting what is being read and without re-reading the whole scrollback.

#### Scenario: A result is announced politely

- **WHEN** a command produces output
- **THEN** the most recent result is announced when it arrives, and no existing reading is interrupted

#### Scenario: The scrollback is not re-announced

- **WHEN** a second command is executed after a first
- **THEN** only the second result is announced, and the first result is not announced again

#### Scenario: Produced output is selectable and copyable

- **WHEN** a user selects the scrollback with the pointer or the keyboard
- **THEN** each command and its output are selectable as ordinary text and can be copied, and no line is rendered as an image, as a canvas, or as separately drawn glyphs

### Requirement: The overlay is presented without motion the visitor did not ask for

The terminal SHALL NOT animate its appearance or dismissal beyond a scroll, and SHALL NOT animate at all when the visitor has asked for reduced motion. No typing animation and no sound SHALL accompany a command.

#### Scenario: Reduced motion is honoured

- **WHEN** the visitor has asked for reduced motion
- **THEN** the overlay and its content do not transition or animate

#### Scenario: No typing animation

- **WHEN** a command resolves
- **THEN** its output appears at once, and is not revealed character by character

#### Scenario: No sound

- **WHEN** any command resolves or the terminal opens or closes
- **THEN** no audio is produced

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

The terminal's surface, text, border, and status colours SHALL be drawn from the token layer's existing roles — the surface roles, the three text roles, the two border roles, and the four status roles. It SHALL introduce no new colour token, no new spacing step, no new radius, and no new type step. Its output type SHALL satisfy the size-contrast floor the typography capability states for a terminal surface.

#### Scenario: No token is added

- **WHEN** this change is complete
- **THEN** the token layer is unchanged, and every colour, spacing step, radius, and type step the terminal uses already exists in it

#### Scenario: The terminal surface is an existing surface role

- **WHEN** the overlay's backdrop, its surface, and its input row are styled
- **THEN** they resolve to the declared surface roles and to the mono and text roles, and to no literal colour value

#### Scenario: Command state is not signalled by colour alone

- **WHEN** a command fails
- **THEN** the failure is stated in the text of the output and is not conveyed by colour alone, and a user who cannot perceive the colour difference reads the same failure

#### Scenario: Focus is visible against the terminal surface

- **WHEN** any terminal element has keyboard focus
- **THEN** it shows a visible focus indication that meets the contrast requirement against the surface it sits on

### Requirement: The terminal introduces no client component outside its own boundary

The command engine SHALL be free of React and of any client-only API. The overlay's client components SHALL be confined to the overlay and its trigger, and the skip link, header structure, main region, and footer SHALL remain server-rendered.

#### Scenario: The engine imports no client API

- **WHEN** the command engine is inspected
- **THEN** it imports neither React nor a client-only hook, and is callable with no rendering context

#### Scenario: The shell structure stays server-rendered

- **WHEN** a page is fetched without executing scripts
- **THEN** the skip link, header, main region, and footer are present, and the terminal is closed

#### Scenario: The trigger's presence does not require scripting to reach the site

- **WHEN** client scripts fail to load
- **THEN** every route the shell links to remains navigable, and the terminal is simply never openable