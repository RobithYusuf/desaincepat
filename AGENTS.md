# DesainCepat - Agent Instructions

## CRITICAL Rules - Always Follow

### Docker First
• **ALWAYS use Docker** for running the app
• Use `docker-compose up` or Docker commands
• Never run directly with `npm run dev` unless explicitly asked

### Testing & Debugging
• **AVOID screenshots unless absolutely necessary** (too many photos!)
• **Prefer these debugging methods first:**
  1. `take_snapshot` → Text-based UI inspection (lightweight)
  2. `list_console_messages` → Check browser errors/warnings
  3. `evaluate_script` → Inspect DOM elements, state, variables
  4. `list_network_requests` → Check API calls, failed requests
  5. `get_console_message` → Get specific error details

• **Only screenshot when:**
  - Visual bug that needs human review
  - Final result verification
  - Explicitly requested by user

• **If screenshot needed:**
  - Resize viewport to 1280×720 first
  - Save to file: `screenshots/name.jpg` (never display inline)
  - Use quality 40-50, max 2MB

### Build & Deployment
• **DO NOT run `npm run build`** unless explicitly requested
• Build is only for production deployment
• Development work stays in Docker

### Git Workflow
• **I handle git staging and commits manually**
• Never auto-stage files with `git add`
• Never auto-commit with `git commit`
• You can suggest changes, but I execute git commands myself

---

That's it. Keep it simple.
