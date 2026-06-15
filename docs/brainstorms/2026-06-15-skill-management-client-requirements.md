---
date: 2026-06-15
topic: skill-management-client
---

# Skill Management Client

## Summary

An open-source Electron desktop client that scans local skill directories across Codex, Claude Code, and Cursor, presents them in a tool-tabbed UI with visual on/off assembly, and supports saving, importing, and exporting skill configuration snapshots. A scanner plugin interface allows the community to add support for other AI tools without modifying the client core.

## Key Decisions

- **Electron over Tauri** — faster prototyping and lower community contribution barrier at the cost of larger binary size. Accepted tradeoff for v1.
- **Local-first before cloud** — all skill data, configurations, and snapshots live on the user's filesystem. No backend, no user accounts, no sync. Future cloud features would layer on top of the local snapshot format.
- **Scanner interface as core API** — the boundary between the client and any AI tool's skill format is a defined Scanner trait. New tool support comes as a Scanner implementation, not a fork or a patch to the UI.
- **Cross-platform from day one** — scanner paths need to differ per OS (macOS, Windows, Linux). The Scanner interface receives the host OS and resolves the correct default paths internally.

## Actors

- A1. **End user** — browses, assembles, imports and exports skill configurations on their own machine
- A2. **Team lead / manager** — distributes a curated snapshot file to team members who apply it locally
- A3. **Scanner plugin contributor** — writes a Scanner implementation for a new AI tool and registers it with the client

## Requirements

### Scanning and Discovery

- R1. **Scan Codex skill directory.** Read `~/.codex/skills/` recursively and discover all installed skills. Each skill's metadata (name, description, source path) is extracted from its manifest or SKILL.md frontmatter.
- R2. **Scan Claude Code skill directory.** Read `~/.agents/skills/` recursively with the same metadata extraction rules.
- R3. **Scan Cursor skill directory.** Read the Cursor equivalent skill directory and extract metadata.
- R4. **Scanner plugin interface.** Define a public Scanner trait/interface that receives a directory path and returns a list of SkillRecords (name, description, source path, tool origin, format version). External contributions can implement this interface without touching the client UI.
- R5. **Automatic re-scan.** The client re-scans all registered directories on startup. A manual "Refresh" button is also available.

### User Interface

- R6. **Tool-tabbed layout.** The main view shows one tab per detected AI tool (Codex, Claude Code, Cursor). Tabs for tools with zero installed skills are still shown with an empty-state message.
- R7. **Skill card display.** Each scanned skill renders as a card showing: skill name, short description, source file path, tool origin badge. Long descriptions are truncated with an expand toggle.
- R8. **Enable/disable toggle on each card.** A switch or checkbox visibly marks whether a skill is included in the current assembly. Toggling updates a live count of enabled skills.
- R9. **Live assembly summary.** A persistent bar or panel shows total / enabled skill counts and the occupied disk space. Changes take effect immediately in the UI without a separate "apply" step.

### Configuration Snapshots

- R10. **Save snapshot.** Export the current set of enabled skills (with their full source paths and scanner origin) to a user-chosen file path. The snapshot format is a portable, versioned JSON file.
- R11. **Load snapshot.** Import a snapshot file and apply its enabled set. Skills present in the snapshot but not installed on the current machine are shown as unavailable with a clear visual indicator.
- R12. **Snapshot metadata.** Each snapshot includes a `created_at` timestamp, a version field, tool-and-skill counts, and an optional user-provided label.
- R13. **Download individual skills.** Allow exporting a single skill's source file (its SKILL.md + references directory, or equivalent) as a downloadable archive (.zip or .tar.gz).

### Cross-platform

- R14. **OS-aware default paths.** The scanner for each tool resolves its default directory based on the host OS. Users can override any path via the client settings.

## Key Flows

- F1. **Startup and initial scan**
  - **Trigger:** Client launches
  - **Actors:** A1
  - **Steps:** Client reads registered tool directories → each Scanner produces a list of SkillRecords → results merge into a unified model → UI populates tabs → assembly summary updates
  - **Covered by:** R1, R2, R3, R5, R6, R7, R9

- F2. **Assembly editing**
  - **Trigger:** User toggles a skill on or off
  - **Actors:** A1
  - **Steps:** Toggle changes skill's enabled state in local model → assembly summary updates live → user can switch tabs and continue editing
  - **Covered by:** R8, R9

- F3. **Snapshot export**
  - **Trigger:** User clicks Export
  - **Actors:** A1, A2
  - **Steps:** User optionally enters a label → client collects enabled skill records with paths → serialises to JSON → prompts save dialog → writes file
  - **Covered by:** R10, R12

- F4. **Snapshot import**
  - **Trigger:** User clicks Import and selects a snapshot file
  - **Actors:** A1, A2
  - **Steps:** Client reads and validates the snapshot JSON → matches each entry against installed skills → marks matched skills as enabled → marks unmatched skills as unavailable → updates UI → user can review before confirming
  - **Covered by:** R11, R12

## Scope Boundaries

- **Skill authoring / editing** — no built-in editor for creating or modifying skill files. The client is a management and assembly view, not an IDE.
- **Cloud sync** — no user accounts, backend, or automatic sync between machines. Snapshots are files; syncing is handled by the user via git, cloud drives, or other tools.
- **Runtime execution** — the client does not run or evaluate skills themselves. It manages their metadata and enablement state.
- **Marketplace / discovery of remote skills** — scanning GitHub for undiscovered skills is out of scope for v1. All skill discovery is local.

## Success Criteria

- A first-time user can open the client, see all their installed skills grouped by tool in under 3 seconds
- A user can disable 10 skills across two tools, export the snapshot, send it to a teammate who imports it, and see the same set applied
- A contributor can add a new Scanner for a fourth AI tool by writing a single module implementing the Scanner interface, without touching the renderer or assembly logic
- The Electron app launches and scans correctly on macOS, Windows (tested via CI), and at minimum launches on Linux
