---
sidebar_position: 2
---

# Using Claude Code Skills to Write and Ship a PR Description

This walkthrough covers the full flow of using a Claude Code skill — from discovering available skills, running the `pr-description` skill, to committing and pushing your changes to GitHub.

---

## Step 1: Open the Skills Menu

Type `/skills` in the Claude Code prompt to open the skills dialog. This shows all available skills configured for your project.

```
/skills
```

Skills are stored as markdown files under `~/.claude/skills/<skill-name>/SKILL.md`.

---

## Step 2: Invoke the `pr-description` Skill

Trigger the skill by asking Claude to write a PR description:

```
Write a PR description for my changes
```

Claude detects the intent and invokes the `pr-description` skill automatically.

### What the skill does

The skill runs:

```bash
git diff main...HEAD
```

This shows all changes on your current branch compared to `main`. Claude then formats the output into a structured PR description:

```markdown
## What
One sentence explaining what this PR does.

## Why
Brief context on why this change is needed.

## Changes
- Bullet points of specific changes made
- Group related changes together
- Mention any files deleted or renamed
```

### Note: working directly on `main`

If you're committing directly to `main` (no feature branch), `git diff main...HEAD` returns nothing. In that case, Claude falls back to:

```bash
git diff HEAD~1 HEAD   # latest commit
git diff               # any unstaged changes
```

---

## Step 3: Commit the Changes

Once you're happy with the changes (e.g., an updated README), ask Claude to commit:

```
commit this
```

Claude will:
1. Run `git status` and `git log` to understand the current state
2. Stage the relevant files with `git add`
3. Write a commit message and create the commit

Example commit command generated:

```bash
git add README.md docusaurus.config.js
git commit -m "Update README and relax broken link config"
```

---

## Step 4: Push to GitHub

```
push it
```

Claude runs:

```bash
git push
```

This pushes to `origin/main`. If a GitHub Actions deployment workflow is configured, it will trigger automatically and deploy your site to GitHub Pages.

---

## Skill File Reference

The `pr-description` skill is defined at:

```
~/.claude/skills/pr-description/SKILL.md
```

Contents:

```markdown
---
name: pr-description
description: Writes pull request descriptions. Use when creating a PR, writing a PR,
  or when the user asks to summarize changes for a pull request.
---

When writing a PR description:

1. Run `git diff main...HEAD` to see all changes on this branch
2. Write a description following this format:

## What
One sentence explaining what this PR does.

## Why
Brief context on why this change is needed

## Changes
- Bullet points of specific changes made
- Group related changes together
- Mention any files deleted or renamed
```
