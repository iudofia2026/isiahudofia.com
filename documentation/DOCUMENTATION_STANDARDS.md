# DOCUMENTATION STANDARDS & MAINTENANCE GUIDE

**Version:** 1.0
**Last Updated:** 2026-01-31
**Purpose:** Ensure documentation remains accurate, useful, and maintainable

---

## TABLE OF CONTENTS

1. [Documentation Philosophy](#documentation-philosophy)
2. [Writing Standards](#writing-standards)
3. [File Organization](#file-organization)
4. [When to Document](#when-to-document)
5. [Review Process](#review-process)
6. [Maintenance Schedule](#maintenance-schedule)

---

## DOCUMENTATION PHILOSOPHY

### Core Principles

**1. Documentation is Code, Not Comments**
- Documentation lives alongside code, not inside it
- External docs are more maintainable than inline comments
- Docs should explain WHY, code shows HOW

**2. Write for Future You (6 Months Later)**
- You won't remember the details
- Assume the reader is competent but unfamiliar
- Include context, not just facts

**3. Radically Simple is Better**
- Delete unnecessary docs
- Avoid redundancy
- Prefer concise over comprehensive
- Update or delete, don't just add

**4. Documentation Has a Maintenance Cost**
- Every doc must be maintained
- If you won't maintain it, don't create it
- Prefer fewer, better-maintained docs

### What Makes Good Documentation?

**Clear Purpose:**
- Answers "what is this?" immediately
- States who should read it
- Explains why it exists

**Actionable Information:**
- Provides concrete steps
- Includes code examples
- Shows before/after when relevant

**Current and Accurate:**
- Reflects the actual codebase
- Updated when code changes
- Includes version numbers and dates

**Well-Structured:**
- Table of contents for long docs
- Logical sections
- Cross-references to related docs

---

## WRITING STANDARDS

### Markdown Formatting

**Headings:**
```markdown
# Main Title (H1) - Document title

## Section Title (H2) - Major sections

### Subsection (H3) - Subdivisions

#### Detail (H4) - Rarely needed
```

**Code Blocks:**
```markdown
# Inline code for variables, functions, file paths:
Use the `bundle.js` file and check `sessionStorage.hasVisited`

# Code blocks for examples:
```javascript
// Multi-line code block
function example() {
  return true;
}
```

**Emphasis:**
```markdown
*Italic* for emphasis (use sparingly)
**Bold** for key terms
***Bold italic*** for very important things
```

**Links:**
```markdown
[Link text](/path/to/file.md)
[External link](https://example.com)

# Reference sections within same doc:
[See Testing section](#testing-section)
```

**Lists:**
```markdown
- Unordered list item
- Another item
  - Nested item
  - Another nested item

1. Ordered list
2. Second item
3. Third item
```

### Structure Template

**For Technical Documents:**

```markdown
# Document Title

**Version:** X.X
**Last Updated:** YYYY-MM-DD
**Purpose:** One sentence explaining what this doc covers

---

## Executive Summary
3-5 sentences summarizing the document

## Table of Contents
(For docs longer than 500 lines)

## Section 1: Name
Content...

## Section 2: Name
Content...

## Testing/Validation
(If applicable)

## Troubleshooting
(If applicable)

## Related Documentation
- [Related Doc 1](/path/to/doc1.md)
- [Related Doc 2](/path/to/doc2.md)

---

## Changelog
### YYYY-MM-DD
- Description of change
```

### Code Examples

**Do:**
- Show complete, runnable examples
- Include comments explaining key lines
- Show both "before" and "after" for changes
- Use real code from the codebase when possible

**Don't:**
- Use pseudocode (unless necessary for clarity)
- Show incomplete snippets (unless explaining a concept)
- Over-comment obvious code

**Example:**
```javascript
// GOOD: Complete example with context
// Before: Hardcoded preloader text
Q.shuffleIn("Welcome", title1, 50, false);

// After: Read from HTML for per-page customization
const welcomeText = title1?.textContent?.trim() || "Welcome";
Q.shuffleIn(welcomeText, title1, 50, false);
```

### Screenshots and Diagrams

**When to Use:**
- Architecture diagrams show system relationships
- Screenshots illustrate UI states
- Code flow diagrams explain complex logic

**Format:**
- Use ASCII art for simple diagrams
- Use mermaid.js for flowcharts (if supported)
- Link to external images for complex visuals
- Always add alt text descriptions

**Example ASCII Diagram:**
```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Barba.js   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Content   │
└─────────────┘
```

---

## FILE ORGANIZATION

### Directory Structure

```
documentation/
├── README.md                          # Documentation hub (START HERE)
├── DOCUMENTATION_STANDARDS.md         # This file
│
├── architecture/                      # System architecture docs
│   └── ARCHITECTURAL_PRESERVATION.md
│
├── systems/                           # Individual component/system docs
│   └── PRELOADER_SYSTEM.md
│
├── performance/                       # Performance-related docs
│   └── PERFORMANCE_STATE.md
│
├── planning/                          # Planning and strategy docs
│   └── archive/
│       └── PARALLEL_DEVELOPMENT_STRATEGY.md
│
└── archive/                           # Outdated but historically useful docs
    ├── analyses/
    │   └── 2026-01-31_DOCUMENTATION_AUDIT.md
    └── bugfixes/
        └── RESUME_LOAD_FIX.md
```

### File Naming Conventions

**Use:**
- `UPPERCASE.md` for primary, current documents
- `kebab-case.md` for supporting documents
- `YYYY-MM-DD_DESC.md` for dated archived documents

**Examples:**
- `ARCHITECTURAL_PRESERVATION.md` (primary)
- `preloader-system.md` (supporting - not used, use uppercase instead)
- `2026-01-31_DOCUMENTATION_AUDIT.md` (archived)

### What Goes Where?

| Location | Purpose | Examples |
|----------|---------|----------|
| `/documentation/README.md` | Hub and index | Main doc index |
| `/documentation/architecture/` | System architecture | SPA structure, core patterns |
| `/documentation/systems/` | Component docs | Preloader, animations, routing |
| `/documentation/performance/` | Performance docs | Metrics, optimization |
| `/documentation/planning/` | Strategy docs | Development workflows |
| `/documentation/archive/` | Old docs | Bugfixes, outdated analyses |

---

## WHEN TO DOCUMENT

### Must Document (Required)

**When:**
- Adding new major features
- Changing core architecture
- Fixing critical bugs
- Adding new dependencies
- Removing dependencies
- Performance optimizations
- Security changes

**What to Include:**
- Why the change was made
- What was changed
- How it works
- How to test it
- Risks and considerations

### Should Document (Recommended)

**When:**
- Creating reusable components
- Adding configuration options
- Changing behavior (even slightly)
- Adding new data attributes
- Creating new utilities

**What to Include:**
- Purpose of the component/function
- How to use it
- Examples
- Gotchas and edge cases

### Could Document (Optional)

**When:**
- Documenting obvious code
- Adding inline comments
- Writing tutorials
- Creating examples

**Guideline:**
- Only if it provides clear value
- If you won't maintain it, don't write it
- Prefer to improve code clarity over adding docs

### Don't Document

**Don't document:**
- Self-evident code
- Temporary/debug code
- Code that will be deleted soon
- Obvious HTML structure
- Standard library functions

**Instead:**
- Make the code clearer
- Use better variable names
- Simplify the logic
- Add type hints (if applicable)

---

## REVIEW PROCESS

### Self-Review Checklist

Before committing documentation:

**Content:**
- [ ] Is the purpose clear?
- [ ] Is the information accurate?
- [ ] Are code examples tested?
- [ ] Are all claims verified?

**Structure:**
- [ ] Has a table of contents (if long)?
- [ ] Has clear sections?
- [ ] Links to related docs?
- [ ] Includes version and date?

**Clarity:**
- [ ] Explains WHY, not just WHAT?
- [ ] Assumes reader is competent but unfamiliar?
- [ ] Avoids jargon (or explains it)?
- [ ] Uses examples for complex concepts?

**Maintainability:**
- [ ] Will this still be accurate in 6 months?
- [ ] Is it easy to update?
- [ ] Is it in the right location?
- [ ] Is the file name appropriate?

### Peer Review (Optional but Recommended)

**Ask another developer to review:**
- Does it make sense to someone unfamiliar with the code?
- Are the steps actionable?
- Is anything missing?
- Is it overly verbose or too brief?

### Update Existing Docs

When code changes:

1. **Find related documentation**
   ```bash
   # Search for docs mentioning the changed code:
   grep -r "functionName" documentation/
   grep -r "data-attribute-name" documentation/
   ```

2. **Update or delete**
   - If code changed: Update the doc
   - If feature removed: Delete or archive the doc
   - If behavior changed: Update examples and explanations

3. **Update version number and date**
   ```markdown
   **Version:** 2.0 (was 1.0)
   **Last Updated:** 2026-01-31
   ```

4. **Add changelog entry**
   ```markdown
   ### 2026-01-31
   - Updated to reflect new preloader system
   - Added hybrid implementation approach
   - Updated code examples
   ```

---

## MAINTENANCE SCHEDULE

### Quarterly Review (Every 3 Months)

**Check:**
- [ ] Are all docs still accurate?
- [ ] Any orphaned docs (code deleted but docs remain)?
- [ ] Any missing docs (new features undocumented)?
- [ ] Outdated examples or screenshots?
- [ ] Broken links?

**Actions:**
- Update or delete inaccurate docs
- Create docs for new features
- Fix broken links
- Archive historical docs

### Annual Cleanup (Every Year)

**Review:**
- Documentation structure
- Naming conventions
- Redundant content
- Outdated formats

**Actions:**
- Restructure if needed
- Consolidate redundant docs
- Update standards
- Improve organization

### When Code Changes

**Before:**
1. Document what you're changing
2. Explain why
3. Update related docs
4. Archive old docs if behavior changed significantly

**After:**
1. Test documentation examples
2. Verify all claims are accurate
3. Update version numbers and dates
4. Check links to other docs

---

## DOCUMENTATION TEMPLATES

### Template 1: Technical System Document

```markdown
# SYSTEM_NAME Documentation

**Version:** 1.0
**Last Updated:** YYYY-MM-DD
**Status:** Stable / Draft / Deprecated

---

## Executive Summary
2-3 sentences explaining what this system does and why it exists.

## Table of Contents
(For docs > 500 lines)

## 1. Overview
- Purpose
- Key features
- Dependencies
- Location in codebase

## 2. How It Works
Detailed technical explanation

## 3. Implementation Guide
Step-by-step instructions

## 4. Configuration
Options and settings

## 5. Testing
How to verify it works

## 6. Troubleshooting
Common issues and solutions

## 7. Related Documentation
Links to related docs

## Appendix
- Code reference
- Data attributes
- Examples

---
**END OF DOCUMENT**
```

### Template 2: Quick Reference

```markdown
# FEATURE_NAME Quick Reference

**Last Updated:** YYYY-MM-DD

## What It Does
One sentence description.

## How to Use
```example
Code example
```

## Common Tasks
- Task 1: Description
- Task 2: Description

## Gotchas
- Thing to watch out for
- Another thing

## See Also
- [Full documentation](link)
```

### Template 3: Changelog Entry

```markdown
### YYYY-MM-DD
**Changed:** [Component/Feature]
**What:** Description of change
**Why:** Reason for change
**Impact:** What breaks or changes
**Migration:** How to update old code (if breaking)

Example:
```javascript
// Before
oldFunction();

// After
newFunction();
```
```

---

## BEST PRACTICES

### Writing Style

**Do:**
- Use active voice ("Click the button" not "The button should be clicked")
- Be specific ("1.3 seconds" not "a short delay")
- Provide context ("This prevents memory leaks" not just "Clear intervals")
- Use examples ("Like this: ```code```" not "Do X")

**Don't:**
- Use jargon without explanation
- Assume knowledge of implementation details
- Write walls of text without examples
- State the obvious ("This is HTML code")

### Code Documentation

**Inline Comments:**
```javascript
// GOOD: Explain WHY, not WHAT
// Use sessionStorage instead of localStorage so preloader shows again when user closes tab
sessionStorage.setItem('hasVisited', 'true');

// BAD: States the obvious
// Set hasVisited to true
sessionStorage.setItem('hasVisited', 'true');
```

**Function Documentation:**
```javascript
/**
 * Initialize preloader based on visit history
 * @param {string} pageKey - SessionStorage key for current page
 * @returns {void}
 *
 * This checks sessionStorage to determine if user has visited before.
 * First visit: Full 1.3s animation
 * Return visit: Shortened 0.8s animation
 */
function initializePreloader(pageKey) {
  // Implementation
}
```

### Diagrams and Visuals

**Keep It Simple:**
- ASCII art for simple flows
- Tables for comparisons
- Lists for steps

**Example Comparison Table:**
| Approach | Performance | UX | Complexity |
|----------|-------------|-----|------------|
| Option A | Low | Poor | Low |
| Option B | Medium | Good | Medium |
| Option C | High | Excellent | High |

**Example Step List:**
1. Create HTML file
2. Add Barba namespace
3. Update navigation links
4. Test transitions

---

## TOOLS AND WORKFLOW

### Recommended Tools

**Editing:**
- Any text editor (VS Code, etc.)
- Markdown preview extension
- Spell checker

**Reviewing:**
- Git diff for changes
- Side-by-side comparison
- Print to PDF for sharing

**Hosting:**
- GitHub renders Markdown natively
- VS Code works with local files
- Static site generators (optional)

### Workflow

**Creating New Documentation:**
1. Start with template
2. Write draft
3. Self-review using checklist
4. Test code examples
5. Peer review (optional)
6. Commit with clear message

**Updating Documentation:**
1. Find the doc
2. Make changes
3. Update version and date
4. Add changelog entry
5. Test examples
6. Commit

**Archiving Documentation:**
1. Move to `/documentation/archive/`
2. Add date prefix to filename
3. Update index to remove link
4. Add note explaining why archived

---

## MEASURING SUCCESS

### Good Documentation Indicators

**Qualitative:**
- New developers can onboard quickly
- Questions decrease over time
- Fewer "how does this work?" conversations
- Changes don't break things (people understand architecture)

**Quantitative:**
- Docs are updated when code changes
- Orphaned docs are archived
- Links don't break
- Code examples tested and working

### Red Flags

**Too Much Documentation:**
- Docs contradict each other
- Multiple docs for same thing
- Outdated docs cluttering folders
- Nobody reads the docs

**Too Little Documentation:**
- Same questions asked repeatedly
- Fear of changing code
- "Tribal knowledge" (only one person knows)
- Surprising behavior (nobody knew it worked that way)

**Right Balance:**
- Docs answer actual questions
- Updated regularly
- Easy to find what you need
- Maintenance is manageable

---

## END OF DOCUMENT

This standards document should be reviewed and updated annually or when documentation practices change significantly.

**Last Reviewed:** 2026-01-31
**Next Review:** 2026-07-31
