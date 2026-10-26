# Instructions for AI Assistant (Rules)

## Auto-Push to GitHub Rule
Whenever any code, configuration, or documentation in this repository is added, edited, or modified:
1. Always stage the modified files: `git add .` (respecting `.gitignore`, never adding `.env` or sensitive credentials).
2. Commit with a clear, descriptive message: `git commit -m "..."`.
3. Immediately push to GitHub: `git push origin main`.
4. Confirm to the user that the changes have been pushed to GitHub with the commit details.
