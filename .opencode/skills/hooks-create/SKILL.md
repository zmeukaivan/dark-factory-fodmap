---
name: hooks-create
description: Configure OpenCode permissions and policies from a plain-English description of what the agent should or shouldn't do. You describe the behavior ("never let the agent edit my migrations", "restrict access to production configs", "require approval before running destructive commands"); this skill configures the right permission rules in opencode.json. Use when you want deterministic guarantees about agent behavior in OpenCode.
argument-hint: [what-the-agent-should-or-shouldn't-do]
---

# Configure Permissions: Turn an Idea Into Working OpenCode Policies

**What the user wants to enforce**: $ARGUMENTS

If that is filled in, treat it as the behavior spec and start from it. Don't re-ask what they already told you;
only ask to pin down the gaps (the exact paths / commands / patterns). If it is blank, start by asking what 
the permission should guarantee or restrict (Workflow step 1).

## What OpenCode permissions are (30-second intro)

OpenCode uses a **permission system** in `opencode.json` to control what agents can and cannot do. Unlike hooks 
that fire automatically, **permissions are evaluated when the agent tries to use a tool** — the agent requests 
an action, and OpenCode checks if it's allowed.

The user brings the **idea** ("the agent should never edit my migrations"); this skill configures the **rules** 
in `opencode.json`. They don't need to know the exact syntax.

**It's all configuration** — permissions are JSON rules that OpenCode evaluates before executing tools. You're 
adding deterministic guarantees to the AI Layer.

## The one thing to get right: which permission type, and what scope?

The behavior the user wants maps to **one or more** permission rules. Pick by *what* should be controlled and 
*how strictly*:

| The user wants to… | Permission Type | Scope |
|---|---|---|
| **Restrict which tools the agent can use** | `tools` | Globally or per-agent |
| **Require approval before certain actions** | `permission` with `ask` | Tool patterns |
| **Block specific tools entirely** | `permission` with `deny` | Tool patterns |
| **Allow tools without prompting** | `permission` with `allow` | Tool patterns |
| **Restrict file access** | `permission` on file tools | Path patterns |
| **Control skill access** | `permission.skill` | Skill name patterns |

> **Allow = no prompt. Ask = prompt user. Deny = block entirely.** Most use cases are combinations: allow safe 
> tools, ask for risky ones, deny dangerous ones.

## Required reading (do this first)

The permission system **evolves** — don't rely on a snapshot. Before configuring, **fetch the current docs** 
and confirm the permission fields and their behavior:

- Permissions reference: https://opencode.ai/docs/permissions/
- Tools reference: https://opencode.ai/docs/tools/

Use `WebFetch` on these and verify against what you're about to write. If the fetch fails, proceed from the 
canonical patterns below and **say so** in your report so the user can double-check.

## The configuration protocol (how permissions work in OpenCode)

- **Location:** `opencode.json` in the project root (or `~/.config/opencode/opencode.json` for global)
- **Structure:**
  ```json
  {
    "permission": {
      "tool-pattern": "allow|ask|deny"
    }
  }
  ```
- **Patterns:** Support wildcards like `Bash(rm:*)`, `Edit(*.md)`, `*`
- **Precedence:** More specific patterns override less specific ones
- **Per-agent overrides:** Custom agents can have their own permission blocks

## Workflow

### 1. Understand the idea (start from `$ARGUMENTS`; ask only to fill gaps)
Start from what the user already described in `$ARGUMENTS` (the user may not be technical). Pin down two things in
plain language, asking only for what is missing:
- **What** should be restricted or allowed, and **which tools** are involved?
- **How strictly** should it be enforced? (block entirely, require approval, or just allow without prompting?)

Get the concrete tool names / file paths / command patterns — the permission is only as good as what it matches, 
so don't guess. If the ask is vague, propose a concrete interpretation and confirm.

### 2. Read the docs
Fetch the permissions/tools reference (above) and confirm the permission fields and their behavior.

### 3. Pick the permission rules
Use the table to choose the permission type(s). Choose **patterns** that scope them tightly — for tool permissions, 
the tool name(s) and arguments (e.g. `"Bash(rm:*)"`, `"Edit(*.sql)"`, `"skill(experimental-*)"`)

### 4. Configure opencode.json
Edit `opencode.json` in the project root (create it if absent). **Merge** into any existing `permission` block — 
never clobber other rules. Shape:
```json
{
  "permission": {
    "Bash(rm:*)": "deny",
    "Edit(*.sql)": "ask",
    "skill(internal-*)": "allow"
  }
}
```

For **per-agent permissions** (custom agents), add to the agent's frontmatter:
```yaml
---
permission:
  "Bash(rm:*)": "deny"
---
```

### 5. Prove it yourself, then explain and warn

**Verify the configuration is valid JSON** before handing it over. A malformed `opencode.json` breaks OpenCode.

```bash
# Validate JSON
cat opencode.json | python -m json.tool
```

Then:
- Tell the user **what you configured**, in plain words: which tools, what the restriction is, and how to adjust it.
- Give them a **way to test it** in the agent: try an action that should be blocked/allowed and verify the behavior.
- Report what you verified, and say plainly if you could not verify something.
- **Security note (always say this):** permissions control what the agent can do automatically. Review them like 
  you review CI config; only allow tools you trust.

## Quality checks

- ✅ The behavior maps to the **right permission type**, and blocking goals use `deny` (not `ask`).
- ✅ The **patterns are scoped** to what the user actually meant (not matching everything by accident).
- ✅ `opencode.json` is **valid JSON** and was **merged**, not overwritten; existing permissions still present.
- ✅ The user got a **plain-English explanation + a test + the security note.**

## Notes

- Permissions are the deterministic floor of the AI Layer — use them for the non-negotiables (secrets, protected 
  paths, dangerous commands), not for things a skill or rule handles well enough.
- A permission's *coverage* is only as good as its pattern — it guarantees the rule **runs**, but you decide 
  what it catches. Be honest with the user about the edges (e.g. `Bash(rm:*)` won't catch `del` on Windows).
- For complex workflows, combine permissions with skills: use permissions to block, skills to guide.

## Examples

### Example 1: Block destructive commands
**User wants:** "Never let the agent delete files without asking"

**Configuration:**
```json
{
  "permission": {
    "Bash(rm:*)": "deny",
    "Bash(rmdir:*)": "deny",
    "Bash(del:*)": "deny",
    "Bash(Remove-Item:*)": "ask"
  }
}
```

### Example 2: Require approval for database changes
**User wants:** "Agent can read migrations but can't edit them without asking"

**Configuration:**
```json
{
  "permission": {
    "Read(*migrations*)": "allow",
    "Edit(*migrations*)": "ask",
    "Write(*migrations*)": "ask"
  }
}
```

### Example 3: Allow internal skills, block experimental ones
**User wants:** "Agent can use stable skills but not experimental ones"

**Configuration:**
```json
{
  "permission": {
    "skill": {
      "internal-*": "allow",
      "experimental-*": "deny"
    }
  }
}
```
