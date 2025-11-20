# FS Meta Usage Guide

Make directories friendlier: add notes, hide files, set passwords, with controllable inheritance.

## 1. What It Can Do
- **Top/Bottom Notes**: Display Markdown (announcements, tips, disclaimers, etc.) above/below the mounted browser list.
- **Hide Rules**: Use regex to hide specific files/folders from "display" (data remains intact; direct links/downloads still work).
- **Path Passwords**: Lock a path—non-admin access requires a password. Optionally inherit to subdirectories.

> Admins bypass passwords by default. When inheritance is enabled, parent rules stack onto subdirectories (cannot be turned off by children; only appended or tightened).

## 2. Key Concepts
- **Path-Based Configuration**: Each rule applies to a virtual path (e.g., `/public`, `/team/docs`).
- **Inheritance**: Enable "Apply to subfolders" → subdirectories combine parent rules (hiding/passwords/notes).
- **Scope**: Hiding only affects the mounted browser UI list; passwords only apply to web UI access; stored data remains untouched.

## 3. Setup Steps (Admin FS Meta Panel)
1) Go to Admin → **FS Meta Management** → Add/Edit a rule.
2) Fill fields:
   - **Path**: Directory path starting with `/`.
   - **Top Note / Bottom Note**: Markdown text (optional).
   - **Hide Rules**: One JavaScript regex per line, matching `item.name`; toggle "Apply to subfolders".
   - **Path Password**: Set password; toggle "Apply to subfolders". Admins skip input.
3) Save → Refresh the mounted browser. Password prompts appear on first access to protected paths.

## 4. Hide Rule Syntax
> Rules go in the "Hide Rules" text box—one JavaScript regex per line, matching filenames (`item.name`).

Quick Reference:
- **Hide one file**: `^README\.md`
- **Hide all dotfiles**: `^\..*`
- **Hide all Markdown**: `\.md$`
- **Hide temp prefixes**: `^temp_`
- **Hide backup suffixes**: `~$`

Details:
- **Case-Sensitive**: `README.md` ≠ `readme.md`. Use `(?i:^readme\.md$)` for case-insensitive matches, but precise casing is recommended.
- **Escape dots**: Write `\.` to match literal `.`; otherwise, it means "any character".
- **Use `^`/`$` for precision**: Avoid `\.md` matching `readme.mdx`; use `\.md$` or stricter patterns like `^(note_.*\.md)$`.
- **Inheritance stacks**: Parent + child rules merge; no "exclude parent rule" syntax—place generic rules at appropriate levels.

Debug Tips:
1) Test regex on sample filenames (e.g., `.gitignore`, `README.md`, `temp_01.txt`).
2) Check for missing boundaries (e.g., `\.md` matches `abc.md.bak`).
3) Hiding only affects lists; direct links working means rules are active but expected.

## 5. Path Password Scenarios
- **Single locked dir**: Path=`/private`, password=`123456`, inherit=No → only locks this dir.
- **Tree-wide lock**: Path=`/team`, password=`1111`, inherit=Yes → `/team/**` requires one input per session.
- **Parent + stricter child**: `/team`=password `1111` (inherit=Yes); `/team/secret`=password `9999` (inherit=Yes) → entering `secret` requires `9999`.
- **Nested layers**: `/data`=A, `/data/private`=B, `/data/private/logs`=C, all inherited → each layer has its own "lock ring".

Token Behavior: Changing passwords invalidates old tokens. Tokens persist in `sessionStorage`—reusable on tab refresh, but new tabs require re-entry.

## 6. Combo Examples
- **Notice + hide temp files**: `/public` top note=notice, hide `^temp_`, inherit=Yes.
- **Locked docs + hide outputs**: `/docs` password=`docpass` (inherit=Yes); hide `^build_`, `\.log$`.
- **Subdir-specific notes**: Parent `/team` has generic notes; child `/team/rd` sets its own top note without altering parent rules.
- **Strict subdir**: Parent `/assets` no password; child `/assets/licensed` password+inherit=No to avoid affecting siblings.

## 7. Troubleshooting
- Hiding fails/over-applies: Check path matching, missing `^`/`$`, or unescaped `.`; inherited parent rules may stack.
- Password loops: Parent inheritance or recent password changes may require re-entry.
- Notes not showing: Verify field content, path match, and cache (wait for TTL or admin cache clear).
- Subdir independence: Add a new Meta rule for the subdir, disable inheritance, or override notes/hide/password.

**Add notes, hide items, or lock paths—inheritance is optional. It changes "visibility and access", not your stored data.**