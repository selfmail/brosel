# Release Process for typecmd

This document outlines the automated release process for the `typecmd` package.

## Overview

The release process is automated using GitHub Actions and includes:
- Automated testing and building
- Publishing to NPM Registry
- Publishing to GitHub Packages (as backup)
- Creating GitHub Releases with changelogs
- Version management

## Prerequisites

### 1. NPM Token Setup
You need to set up an NPM access token in your GitHub repository:

1. Go to [npmjs.com](https://www.npmjs.com) and log in
2. Go to Account Settings → Access Tokens
3. Create a new token with "Automation" type
4. Copy the token
5. In your GitHub repository, go to Settings → Secrets and variables → Actions
6. Create a new secret named `NPM_TOKEN` and paste your token

### 2. Repository Permissions
Make sure your repository has the following permissions enabled:
- Actions: Read and write permissions
- Contents: Write permissions 
- Packages: Write permissions

## Release Methods

### Method 1: Automated via Script (Recommended)

Use the provided release script for easy version management:

```bash
# Patch release (0.0.2 → 0.0.3)
bun run release:patch

# Minor release (0.0.2 → 0.1.0)  
bun run release:minor

# Major release (0.0.2 → 1.0.0)
bun run release:major

# Specific version
./scripts/release-typecmd.sh 1.2.3
```

The script will:
1. Check if git is clean
2. Update package.json version
3. Build the package
4. Commit the version bump
5. Create and push a git tag
6. Trigger the GitHub Actions workflow

### Method 2: Manual Tag Creation

```bash
# Update version manually in package.json
cd packages/typecmd
npm version patch  # or minor, major

# Push changes and create tag
git add .
git commit -m "chore(typecmd): bump version to x.x.x"
git tag typecmd-vx.x.x
git push origin main
git push origin typecmd-vx.x.x
```

### Method 3: Manual GitHub Actions Trigger

1. Go to your repository on GitHub
2. Click on "Actions" tab
3. Select "Release and Publish" workflow
4. Click "Run workflow"
5. Fill in the package name and version
6. Click "Run workflow"

## What Happens During Release

### 1. Testing Phase
- Runs all tests with `bun test`
- Performs linting with `bun run lint`
- Type checking with `bun run check-types`

### 2. Build Phase
- Builds the package with `bun run build`
- Creates TypeScript declarations
- Uploads build artifacts

### 3. Publishing Phase
- **NPM Registry**: Published as `typecmd`
- **GitHub Packages**: Published as `@selfmail/typecmd`

### 4. Release Creation
- Creates a GitHub release
- Generates changelog from git commits
- Marks as prerelease if version contains `-` (e.g., `1.0.0-beta.1`)

## Version Strategy

We follow [Semantic Versioning](https://semver.org/):

- **PATCH** (0.0.X): Bug fixes, documentation updates
- **MINOR** (0.X.0): New features, backward compatible
- **MAJOR** (X.0.0): Breaking changes

## Publishing Destinations

### NPM Registry (Primary)
- **Package name**: `typecmd`
- **Installation**: `npm install typecmd`
- **Registry**: https://registry.npmjs.org
- **Visibility**: Public

### GitHub Packages (Backup)
- **Package name**: `@selfmail/typecmd`
- **Installation**: `npm install @selfmail/typecmd --registry=https://npm.pkg.github.com`
- **Registry**: https://npm.pkg.github.com
- **Visibility**: Public (linked to repository)

## Monitoring Releases

### GitHub Actions
Monitor the release process at:
`https://github.com/selfmail/brosel/actions`

### NPM Package
Check published versions at:
`https://www.npmjs.com/package/typecmd`

### GitHub Releases
View releases and changelogs at:
`https://github.com/selfmail/brosel/releases`

## Troubleshooting

### Common Issues

1. **NPM_TOKEN not set**
   - Error: "npm ERR! need auth auth required for publishing"
   - Solution: Set up NPM_TOKEN secret in repository settings

2. **Permission denied**
   - Error: "npm ERR! 403 Forbidden"
   - Solution: Check NPM token permissions and package ownership

3. **Git not clean**
   - Error: "Git working directory is not clean"
   - Solution: Commit or stash changes before releasing

4. **Tag already exists**
   - Error: "tag already exists"
   - Solution: Delete the tag or use a different version

### Manual Recovery

If automated release fails, you can publish manually:

```bash
cd packages/typecmd
bun run build
npm publish --access public
```

## Development Workflow

### Regular Development
1. Make changes to the code
2. Test locally: `bun test`
3. Commit changes: `git commit -m "feat: add new feature"`
4. Push to main: `git push origin main`

### When Ready to Release
1. Ensure all tests pass
2. Review changes and decide on version bump
3. Run release script: `bun run release:patch`
4. Monitor GitHub Actions for completion
5. Verify package is published on NPM

## Best Practices

1. **Always test before releasing**: Run `bun test` locally
2. **Use conventional commits**: Follow format like `feat:`, `fix:`, `chore:`
3. **Review changelog**: Check generated changelog before confirming release
4. **Monitor release process**: Watch GitHub Actions to ensure successful publish
5. **Document breaking changes**: For major versions, update README and migration guides
