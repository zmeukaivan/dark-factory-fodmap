# Port coleam00/skills to OpenCode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Copy all 33 skills from coleam00/skills and adapt them to work with OpenCode

**Architecture:** Copy the `.claude/skills/` directory to `.opencode/skills/`, apply automated bulk text replacements for Claude Code → OpenCode adaptations, then manually review 8 skills that need deeper changes.

**Tech Stack:** Markdown files, YAML frontmatter, PowerShell for bulk operations

## Global Constraints

- Target directory: `C:\antigravitydev\Dark Factory\.opencode\skills\`
- Source directory: `C:\Users\zmeuk\AppData\Local\Temp\opencode\coleam00-skills\.claude\skills\`
- All 33 skills must be copied
- Bulk replacements: `/skill-name` → `use the skill-name skill`, `CLAUDE.md` → `AGENTS.md`, `.claude/` → `.opencode/`
- Remove `allowed-tools` frontmatter field
- Delete `.claude-plugin/` directory (not copied)

---

### Task 1: Copy All Skills

**Files:**
- Create: `.opencode/skills/<skill-name>/` for all 33 skills

**Interfaces:**
- Consumes: Source directory with 33 skill folders
- Produces: Target directory with 33 skill folders copied

- [ ] **Step 1: Create target directory**

```powershell
New-Item -ItemType Directory -Path "C:\antigravitydev\Dark Factory\.opencode\skills" -Force
```

- [ ] **Step 2: Copy all skills from source to target**

```powershell
Copy-Item -Path "C:\Users\zmeuk\AppData\Local\Temp\opencode\coleam00-skills\.claude\skills\*" -Destination "C:\antigravitydev\Dark Factory\.opencode\skills\" -Recurse -Force
```

- [ ] **Step 3: Verify all 33 skills were copied**

```powershell
Get-ChildItem "C:\antigravitydev\Dark Factory\.opencode\skills" -Directory | Measure-Object | Select-Object -ExpandProperty Count
```

Expected: 33

- [ ] **Step 4: List all copied skills**

```powershell
Get-ChildItem "C:\antigravitydev\Dark Factory\.opencode\skills" -Directory | Select-Object -ExpandProperty Name
```

Expected: All 33 skill names listed

---

### Task 2: Apply Bulk Replacements — Slash Commands

**Files:**
- Modify: All SKILL.md files containing `/skill-name` patterns

**Interfaces:**
- Consumes: Copied skill files
- Produces: Files with updated slash command syntax

- [ ] **Step 1: Find all files with slash commands**

```powershell
Get-ChildItem "C:\antigravitydev\Dark Factory\.opencode\skills" -Recurse -Filter "SKILL.md" | Select-String -Pattern "/piv-" -List | Select-Object -ExpandProperty Path
```

- [ ] **Step 2: Replace slash commands with natural language**

For each file found, replace patterns like `/piv-validate` with `use the piv-validate skill`.

Specific replacements:
- `/piv-slice-epic` → `use the piv-slice-epic skill`
- `/piv-plan-implementation` → `use the piv-plan-implementation skill`
- `/piv-implement` → `use the piv-implement skill`
- `/piv-commit` → `use the piv-commit skill`
- `/piv-validate` → `use the piv-validate skill`
- `/piv-review-changes` → `use the piv-review-changes skill`
- `/piv-create-pr` → `use the piv-create-pr skill`
- `/piv-review-pr` → `use the piv-review-pr skill`
- `/piv-run-full-loop` → `use the piv-run-full-loop skill`
- `/piv-investigate-issue` → `use the piv-investigate-issue skill`
- `/piv-implement-issue` → `use the piv-implement-issue skill`
- `/piv-fix-review-findings` → `use the piv-fix-review-findings skill`
- `/prime-codebase` → `use the prime-codebase skill`
- `/prime-backend` → `use the prime-backend skill`
- `/prime-frontend` → `use the prime-frontend skill`
- `/plan-create-prd` → `use the plan-create-prd skill`
- `/plan-architecture` → `use the plan-architecture skill`
- `/plan-create-stories` → `use the plan-create-stories skill`

- [ ] **Step 3: Verify no slash commands remain**

```powershell
Get-ChildItem "C:\antigravitydev\Dark Factory\.opencode\skills" -Recurse -Filter "SKILL.md" | Select-String -Pattern "/piv-|/prime-|/plan-" | Select-Object Path, LineNumber, Line
```

Expected: No matches

---

### Task 3: Apply Bulk Replacements — CLAUDE.md References

**Files:**
- Modify: All files containing `CLAUDE.md`

**Interfaces:**
- Consumes: Files with `CLAUDE.md` references
- Produces: Files with `AGENTS.md` references

- [ ] **Step 1: Find all files with CLAUDE.md references**

```powershell
Get-ChildItem "C:\antigravitydev\Dark Factory\.opencode\skills" -Recurse -File | Select-String -Pattern "CLAUDE\.md" -List | Select-Object -ExpandProperty Path
```

- [ ] **Step 2: Replace CLAUDE.md with AGENTS.md**

For each file, replace all occurrences of `CLAUDE.md` with `AGENTS.md`.

Note: Keep the context — if it says "CLAUDE.md or AGENTS.md", change to just "AGENTS.md" or rephrase for clarity.

- [ ] **Step 3: Verify no CLAUDE.md references remain**

```powershell
Get-ChildItem "C:\antigravitydev\Dark Factory\.opencode\skills" -Recurse -File | Select-String -Pattern "CLAUDE\.md" | Select-Object Path, LineNumber, Line
```

Expected: No matches

---

### Task 4: Apply Bulk Replacements — .claude/ Paths

**Files:**
- Modify: All files containing `.claude/` paths

**Interfaces:**
- Consumes: Files with `.claude/` path references
- Produces: Files with `.opencode/` path references

- [ ] **Step 1: Find all files with .claude/ paths**

```powershell
Get-ChildItem "C:\antigravitydev\Dark Factory\.opencode\skills" -Recurse -File | Select-String -Pattern "\.claude/" -List | Select-Object -ExpandProperty Path
```

- [ ] **Step 2: Replace .claude/ with .opencode/**

For each file, replace all occurrences of `.claude/` with `.opencode/`.

Specific path replacements:
- `.claude/skills/` → `.opencode/skills/`
- `.claude/plans/` → `.opencode/plans/`
- `.claude/references/` → `.opencode/references/`
- `.claude/reports/` → `.opencode/reports/`
- `.claude/code-reviews/` → `.opencode/code-reviews/`
- `.claude/agents/` → `.opencode/agents/`
- `.claude/settings.json` → `.opencode/settings.json` (or `opencode.json`)
- `.claude/settings.local.json` → remove or adapt

- [ ] **Step 3: Verify no .claude/ paths remain**

```powershell
Get-ChildItem "C:\antigravitydev\Dark Factory\.opencode\skills" -Recurse -File | Select-String -Pattern "\.claude/" | Select-Object Path, LineNumber, Line
```

Expected: No matches (or only in comments/documentation explaining the migration)

---

### Task 5: Remove allowed-tools Frontmatter

**Files:**
- Modify: SKILL.md files with `allowed-tools` field

**Interfaces:**
- Consumes: Files with `allowed-tools` frontmatter
- Produces: Files with `allowed-tools` removed

- [ ] **Step 1: Find all files with allowed-tools**

```powershell
Get-ChildItem "C:\antigravitydev\Dark Factory\.opencode\skills" -Recurse -Filter "SKILL.md" | Select-String -Pattern "allowed-tools:" -List | Select-Object -ExpandProperty Path
```

- [ ] **Step 2: Remove allowed-tools lines**

For each file, remove the entire `allowed-tools:` line (and any continuation lines if it's a multi-line value).

- [ ] **Step 3: Verify no allowed-tools remain**

```powershell
Get-ChildItem "C:\antigravitydev\Dark Factory\.opencode\skills" -Recurse -Filter "SKILL.md" | Select-String -Pattern "allowed-tools:" | Select-Object Path, LineNumber, Line
```

Expected: No matches

---

### Task 6: Manual Review — hooks-create

**Files:**
- Modify: `.opencode/skills/hooks-create/SKILL.md`

**Interfaces:**
- Consumes: Current hooks-create skill
- Produces: Adapted skill for OpenCode's permission system

- [ ] **Step 1: Read current hooks-create skill**

Read `.opencode/skills/hooks-create/SKILL.md` to understand what needs to change.

- [ ] **Step 2: Rewrite for OpenCode**

Claude Code hooks (`.claude/settings.json` lifecycle events) don't exist in OpenCode. Rewrite this skill to:
- Explain OpenCode's permission/policy system (`opencode.json` permission rules)
- Provide examples of how to configure tool permissions
- Remove references to Claude Code's hook lifecycle events
- Keep the core concept of "deterministic guarantees" but adapt to OpenCode's model

- [ ] **Step 3: Verify the rewrite**

Read the updated file and ensure:
- No references to Claude Code hooks remain
- The skill is actionable for OpenCode users
- The frontmatter is valid

---

### Task 7: Manual Review — build-dark-factory

**Files:**
- Modify: `.opencode/skills/build-dark-factory/SKILL.md`
- Modify: `.opencode/skills/build-dark-factory/templates/CLAUDE.md` → rename to `AGENTS.md`
- Modify: `.opencode/skills/build-dark-factory/scripts/*.py`

**Interfaces:**
- Consumes: Current build-dark-factory skill
- Produces: Adapted skill for OpenCode

- [ ] **Step 1: Read current build-dark-factory skill**

Read `.opencode/skills/build-dark-factory/SKILL.md` and related files.

- [ ] **Step 2: Update template paths**

Change all `.claude/` references to `.opencode/` in the skill and templates.

- [ ] **Step 3: Rename and update CLAUDE.md template**

Rename `.opencode/skills/build-dark-factory/templates/CLAUDE.md` to `AGENTS.md` and update its content to reflect OpenCode conventions.

- [ ] **Step 4: Update Python scripts**

Review and update:
- `factory_doctor.py` — change `.claude/` paths to `.opencode/`
- `_test_factory_doctor.py` — update test paths
- `_test_runner.py` — update paths
- `_test_audit_runner.py` — update paths
- `run_ablation.py` — adapt Claude CLI references to OpenCode

- [ ] **Step 5: Verify the adaptation**

Read the updated files and ensure:
- No `.claude/` paths remain
- No `CLAUDE.md` references remain
- The skill is actionable for OpenCode users

---

### Task 8: Manual Review — agent-browser

**Files:**
- Modify: `.opencode/skills/agent-browser/SKILL.md`

**Interfaces:**
- Consumes: Current agent-browser skill
- Produces: Adapted skill without allowed-tools

- [ ] **Step 1: Read current agent-browser skill**

Read `.opencode/skills/agent-browser/SKILL.md`.

- [ ] **Step 2: Remove allowed-tools and adapt**

- Remove the `allowed-tools` field from frontmatter
- Add a note that users need to configure tool permissions in `opencode.json` if they want to restrict which tools the agent can use
- Keep the core browser automation methodology

- [ ] **Step 3: Verify the adaptation**

Read the updated file and ensure:
- No `allowed-tools` field remains
- The skill is actionable for OpenCode users

---

### Task 9: Manual Review — skills-create

**Files:**
- Modify: `.opencode/skills/skills-create/SKILL.md`
- Modify: `.opencode/skills/skills-create/references/*.md`

**Interfaces:**
- Consumes: Current skills-create skill
- Produces: Adapted skill for OpenCode

- [ ] **Step 1: Read current skills-create skill**

Read `.opencode/skills/skills-create/SKILL.md` and reference files.

- [ ] **Step 2: Update for OpenCode**

- Remove references to Claude Code's `skill-reviewer` agent
- Update validation steps to use OpenCode's skill loading mechanism
- Change `.claude/` paths to `.opencode/`
- Keep the core skill-authoring methodology

- [ ] **Step 3: Verify the adaptation**

Read the updated files and ensure:
- No Claude Code-specific references remain
- The skill is actionable for OpenCode users

---

### Task 10: Manual Review — rules-create-global

**Files:**
- Modify: `.opencode/skills/rules-create-global/SKILL.md`

**Interfaces:**
- Consumes: Current rules-create-global skill
- Produces: Adapted skill for AGENTS.md

- [ ] **Step 1: Read current rules-create-global skill**

Read `.opencode/skills/rules-create-global/SKILL.md`.

- [ ] **Step 2: Rewrite for AGENTS.md**

- Change all `CLAUDE.md` references to `AGENTS.md`
- Update the derivation logic to match OpenCode's rules structure
- Review the "greenfield" vs "brownfield" workflow for OpenCode compatibility
- Keep the core methodology of deriving rules from codebase/specs

- [ ] **Step 3: Verify the adaptation**

Read the updated file and ensure:
- No `CLAUDE.md` references remain
- The skill is actionable for OpenCode users
- The frontmatter is valid

---

### Task 11: Manual Review — ablate-ai-layer

**Files:**
- Modify: `.opencode/skills/ablate-ai-layer/SKILL.md`
- Modify: `.opencode/skills/ablate-ai-layer/scripts/*.py`
- Modify: `.opencode/skills/ablate-ai-layer/references/*.md`

**Interfaces:**
- Consumes: Current ablate-ai-layer skill
- Produces: Adapted skill for OpenCode

- [ ] **Step 1: Read current ablate-ai-layer skill**

Read `.opencode/skills/ablate-ai-layer/SKILL.md` and scripts.

- [ ] **Step 2: Update Python scripts**

Update `run_ablation.py`:
- Change `claude` CLI references to OpenCode's invocation method
- Update `.claude/` paths to `.opencode/`
- Review the comparison methodology for OpenCode compatibility

Update `map_layer.py`:
- Change `.claude/` path mappings to `.opencode/`
- Update agent detection logic

- [ ] **Step 3: Update reference docs**

Update `references/comparison.md` and other reference files to remove Claude-specific terminology.

- [ ] **Step 4: Verify the adaptation**

Read the updated files and ensure:
- No `.claude/` paths remain
- No `claude` CLI references remain
- The skill is actionable for OpenCode users

---

### Task 12: Manual Review — system-evolution-review

**Files:**
- Modify: `.opencode/skills/system-evolution-review/SKILL.md`

**Interfaces:**
- Consumes: Current system-evolution-review skill
- Produces: Adapted skill for OpenCode

- [ ] **Step 1: Read current system-evolution-review skill**

Read `.opencode/skills/system-evolution-review/SKILL.md`.

- [ ] **Step 2: Update paths and references**

- Change `.claude/skills/` to `.opencode/skills/`
- Update any Claude-specific terminology
- Review the review checklist for OpenCode-specific patterns

- [ ] **Step 3: Verify the adaptation**

Read the updated file and ensure:
- No `.claude/` paths remain
- The skill is actionable for OpenCode users

---

### Task 13: Manual Review — piv-review-pr

**Files:**
- Modify: `.opencode/skills/piv-review-pr/SKILL.md`

**Interfaces:**
- Consumes: Current piv-review-pr skill
- Produces: Adapted skill for OpenCode

- [ ] **Step 1: Read current piv-review-pr skill**

Read `.opencode/skills/piv-review-pr/SKILL.md`.

- [ ] **Step 2: Update for OpenCode**

- Change `.claude/agents/` to `.opencode/agents/`
- Review the subagent delegation logic for OpenCode compatibility
- Keep the core review methodology

- [ ] **Step 3: Verify the adaptation**

Read the updated file and ensure:
- No `.claude/` paths remain
- The skill is actionable for OpenCode users

---

### Task 14: Verification — Skill Discovery

**Files:**
- None (verification only)

**Interfaces:**
- Consumes: All adapted skills
- Produces: Verification that skills are discovered

- [ ] **Step 1: Run OpenCode in the project directory**

```powershell
cd "C:\antigravitydev\Dark Factory"
opencode
```

- [ ] **Step 2: Check skill tool description**

In the OpenCode session, check that the `skill` tool lists all 33 skills.

Expected: All 33 skill names appear in `<available_skills>`

- [ ] **Step 3: Test loading a skill**

Invoke the skill tool:
```
skill({ name: "piv-implement" })
```

Expected: Skill loads without errors

- [ ] **Step 4: Test loading 2 more skills**

```
skill({ name: "prime-codebase" })
skill({ name: "worktree-create" })
```

Expected: Both skills load without errors

- [ ] **Step 5: Verify no broken references**

```powershell
Get-ChildItem "C:\antigravitydev\Dark Factory\.opencode\skills" -Recurse -File | Select-String -Pattern "\.claude/|CLAUDE\.md" | Select-Object Path, LineNumber, Line
```

Expected: No matches (or only in comments explaining the migration)

---

### Task 15: Final Cleanup

**Files:**
- None (cleanup only)

**Interfaces:**
- Consumes: Adapted skills
- Produces: Clean, ready-to-use skill set

- [ ] **Step 1: Remove any temporary files**

Check for and remove any temporary files created during the migration.

- [ ] **Step 2: Verify directory structure**

```powershell
Get-ChildItem "C:\antigravitydev\Dark Factory\.opencode\skills" -Directory | Select-Object -ExpandProperty Name | Sort-Object
```

Expected: All 33 skill directories present

- [ ] **Step 3: Count total skills**

```powershell
(Get-ChildItem "C:\antigravitydev\Dark Factory\.opencode\skills" -Directory).Count
```

Expected: 33

- [ ] **Step 4: Document the migration**

Create a brief summary of what was done:
- 33 skills copied from coleam00/skills
- Bulk replacements applied (slash commands, CLAUDE.md → AGENTS.md, .claude/ → .opencode/)
- 8 skills manually reviewed and adapted
- All skills verified to load in OpenCode

---

## Success Criteria

- [ ] All 33 skills copied to `.opencode/skills/`
- [ ] Bulk replacements applied correctly
- [ ] 8 manually-reviewed skills adapted properly
- [ ] OpenCode discovers all 33 skills
- [ ] Skills load without errors
- [ ] No broken references to `.claude/` or `CLAUDE.md`
- [ ] Scripts and templates updated for OpenCode
