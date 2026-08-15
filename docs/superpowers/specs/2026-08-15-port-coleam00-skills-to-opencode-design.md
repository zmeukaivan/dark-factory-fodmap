# Port coleam00/skills to OpenCode

**Date:** 2026-08-15
**Status:** Approved
**Approach:** Hybrid — automated bulk replacement + targeted manual fixes

## Objective

Copy all 33 skills from https://github.com/coleam00/skills into the project's `.opencode/skills/` directory and adapt them to work with OpenCode instead of Claude Code.

## Scope

- **Source:** `C:\Users\zmeuk\AppData\Local\Temp\opencode\coleam00-skills\.claude\skills\`
- **Target:** `C:\antigravitydev\Dark Factory\.opencode\skills\`
- **Skills:** All 33 skills from the repository

## Architecture

### Phase 1: Automated Bulk Replacement

Copy the entire `.claude/skills/` directory to `.opencode/skills/`, then apply these transformations:

**1. Slash command syntax**
- Pattern: `/skill-name` → `use the skill-name skill`
- Occurrences: ~12 across 6 files
- Examples:
  - `/piv-validate` → `use the piv-validate skill`
  - `/piv-slice-epic` → `use the piv-slice-epic skill`
  - `/prime-codebase` → `use the prime-codebase skill`

**2. Rules file references**
- Pattern: `CLAUDE.md` → `AGENTS.md`
- Occurrences: ~67 across 20+ files
- Rationale: OpenCode uses `AGENTS.md` as its convention file (not `CLAUDE.md`)

**3. Path references**
- Pattern: `.claude/` → `.opencode/`
- Occurrences: ~100+
- Examples:
  - `.claude/skills/` → `.opencode/skills/`
  - `.claude/plans/` → `.opencode/plans/`
  - `.claude/references/` → `.opencode/references/`
  - `.claude/reports/` → `.opencode/reports/`
  - `.claude/code-reviews/` → `.opencode/code-reviews/`
  - `.claude/agents/` → `.opencode/agents/`

**4. Frontmatter cleanup**
- Remove `allowed-tools` field (6 occurrences)
- Rationale: OpenCode ignores this field; it's Claude Code-specific
- Keep `name`, `description`, `argument-hint` (OpenCode ignores unknown fields harmlessly)

**5. Remove plugin metadata**
- Delete `.claude-plugin/` directory
- Rationale: OpenCode doesn't use Claude Code's plugin system

### Phase 2: Manual Review (8 Skills)

These skills need context-specific rewrites beyond bulk replacement:

**1. `hooks-create`**
- **Issue:** Claude Code hooks (`.claude/settings.json` lifecycle events) don't exist in OpenCode
- **Action:** Rewrite as a guide for OpenCode's permission/policy system (`opencode.json` permission rules)
- **Alternative:** If no equivalent exists, document the limitation and suggest manual configuration

**2. `build-dark-factory`**
- **Issue:** References `.claude/settings.json`, `CLAUDE.md` templates, factory runner scripts
- **Action:** Adapt to OpenCode's `opencode.json` + `AGENTS.md`
- **Specifics:**
  - Update template paths from `.claude/` to `.opencode/`
  - Change `CLAUDE.md` template to `AGENTS.md`
  - Review factory runner scripts for Claude-specific logic

**3. `agent-browser`**
- **Issue:** Uses `allowed-tools: Bash(agent-browser:*)`
- **Action:** Remove `allowed-tools` field; document that users need to configure tool permissions in `opencode.json` if needed
- **Alternative:** Keep the skill but note that tool permissions must be manually configured

**4. `skills-create`**
- **Issue:** References Claude Code's `skill-reviewer` agent
- **Action:** Adapt to OpenCode's skill tool workflow
- **Specifics:**
  - Remove references to `skill-reviewer`
  - Update validation steps to use OpenCode's skill loading mechanism
  - Keep the core skill-authoring methodology

**5. `rules-create-global`**
- **Issue:** Derives `CLAUDE.md` following Claude Code best practices
- **Action:** Rewrite to derive `AGENTS.md` following OpenCode conventions
- **Specifics:**
  - Change all `CLAUDE.md` references to `AGENTS.md`
  - Update the derivation logic to match OpenCode's rules structure
  - Review the "greenfield" vs "brownfield" workflow for OpenCode compatibility

**6. `ablate-ai-layer`**
- **Issue:** Has Claude-specific runner logic (`claude` CLI, `.claude/settings.json`)
- **Action:** Adapt to OpenCode's agent system
- **Specifics:**
  - Update `run_ablation.py` to use OpenCode's agent invocation method
  - Change `.claude/` path references to `.opencode/`
  - Review the comparison methodology for OpenCode compatibility

**7. `system-evolution-review`**
- **Issue:** References `.claude/skills/` paths and Claude-specific patterns
- **Action:** Update all paths to `.opencode/skills/`
- **Specifics:**
  - Change skill path references
  - Review the review checklist for OpenCode-specific patterns
  - Update any Claude-specific terminology

**8. `piv-review-pr`**
- **Issue:** References `.claude/agents/code-reviewer.md`
- **Action:** Adapt to OpenCode's agent system
- **Specifics:**
  - Change `.claude/agents/` to `.opencode/agents/`
  - Review the subagent delegation logic for OpenCode compatibility
  - Keep the core review methodology

### Phase 3: Verification

**1. Skill discovery**
- Run OpenCode in the project directory
- Check that the `skill` tool lists all 33 skills
- Verify skill names match directory names

**2. Skill loading**
- Test loading 3 representative skills:
  - `piv-implement` (core PIV loop)
  - `prime-codebase` (priming skill)
  - `worktree-create` (parallel work)
- Verify they load without errors

**3. Spot-check correctness**
- Review 2-3 skills for proper adaptation:
  - `piv-validate` — check that placeholder commands are clear
  - `prime-codebase` — verify `AGENTS.md` references are correct
  - `worktree-create` — check path references

## Error Handling

**Scripts with hardcoded paths**
- `ablate-ai-layer/scripts/run_ablation.py` — update `claude` CLI references to OpenCode's invocation method
- `build-dark-factory/scripts/*.py` — update `.claude/` paths to `.opencode/`
- `second-brain-audit/scripts/audit.py` — review for Claude-specific logic

**Templates that generate convention files**
- `build-dark-factory/templates/CLAUDE.md` → rename to `AGENTS.md` and update content
- `rules-create-global` template logic → adapt to `AGENTS.md` format

**Skills with no OpenCode equivalent**
- `hooks-create` — if OpenCode has no hook system, document the limitation and suggest manual alternatives
- `agent-browser` — if tool permissions can't be configured, document that users must manually allow the tool

## Testing

**Discovery test**
```bash
# Run OpenCode and check skill tool description
opencode
# Verify all 33 skills appear in <available_skills>
```

**Loading test**
```bash
# In OpenCode, invoke the skill tool
skill({ name: "piv-implement" })
# Verify it loads without errors
```

**Correctness test**
- Manually review `piv-validate` to ensure placeholder commands are clear
- Check `prime-codebase` for correct `AGENTS.md` references
- Verify `worktree-create` path references are updated

## Success Criteria

- [ ] All 33 skills copied to `.opencode/skills/`
- [ ] Bulk replacements applied correctly
- [ ] 8 manually-reviewed skills adapted properly
- [ ] OpenCode discovers all 33 skills
- [ ] Skills load without errors
- [ ] No broken references to `.claude/` or `CLAUDE.md`
- [ ] Scripts and templates updated for OpenCode

## Out of Scope

- Modifying the core methodology of the skills (PIV loop, planning, etc.)
- Adding new features to the skills
- Testing every skill in a real workflow (only spot-check)
- Creating OpenCode-specific skills from scratch

## Notes

- OpenCode natively reads `.claude/skills/<name>/SKILL.md` paths, but we're using `.opencode/skills/` for clarity and to follow OpenCode conventions
- The `allowed-tools` frontmatter is ignored by OpenCode, but we're removing it for cleanliness
- Some skills reference external tools (e.g., `agent-browser`) that users may need to install separately
- The `build-dark-factory` skill is complex and may need additional manual review after the initial adaptation
