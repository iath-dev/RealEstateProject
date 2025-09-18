# Contributing Guidelines

## Branching

- Main branch: `main`
- Development branch: `dev`
- Release branch: `release/<version>`
- Feature branches: `feature/<scope>`
- Bug fixes: `fix/<scope>`

Examples:

- `feature/backend-filter`
- `feature/frontend-ui`
- `fix/frontend-styling`

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat: add property filtering by price`
- `fix: correct DTO mapping for ownerId`
- `chore: update .gitignore`
- `docs: update README with setup instructions`
- `test: add NUnit test for property service`

## Pull Requests

- Open a PR for each feature branch into `main`.
- Provide a clear description of changes.
- Ensure tests pass locally before pushing.
