#!/bin/bash

# Release script for typecmd package
# Usage: ./scripts/release-typecmd.sh [patch|minor|major|<version>]

set -e

PACKAGE_DIR="packages/typecmd"
PACKAGE_NAME="typecmd"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "$PACKAGE_DIR/package.json" ]; then
    print_error "typecmd package.json not found. Make sure you're in the project root."
    exit 1
fi

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    print_error "Git working directory is not clean. Please commit or stash changes first."
    exit 1
fi

# Get current version
CURRENT_VERSION=$(cd $PACKAGE_DIR && node -p "require('./package.json').version")
print_status "Current version: $CURRENT_VERSION"

# Determine new version
if [ $# -eq 0 ]; then
    VERSION_TYPE="patch"
else
    VERSION_TYPE="$1"
fi

# Calculate new version
if [[ "$VERSION_TYPE" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-.*)?$ ]]; then
    NEW_VERSION="$VERSION_TYPE"
else
    case $VERSION_TYPE in
        patch)
            NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{$NF = $NF + 1;} 1' | sed 's/ /./g')
            ;;
        minor)
            NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{$(NF-1) = $(NF-1) + 1; $NF = 0;} 1' | sed 's/ /./g')
            ;;
        major)
            NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{$1 = $1 + 1; $(NF-1) = 0; $NF = 0;} 1' | sed 's/ /./g')
            ;;
        *)
            print_error "Invalid version type. Use 'patch', 'minor', 'major', or a specific version like '1.0.0'"
            exit 1
            ;;
    esac
fi

print_status "New version will be: $NEW_VERSION"

# Confirm with user
read -p "Do you want to proceed with releasing version $NEW_VERSION? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Release cancelled."
    exit 0
fi

# Update package.json version
print_status "Updating package.json version..."
cd $PACKAGE_DIR
# Use node to update version instead of npm to avoid workspace conflicts
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = '$NEW_VERSION';  
fs.writeFileSync('package.json', JSON.stringify(pkg, null, '\t') + '\n');
console.log('Updated to version: ' + pkg.version);
"
cd ../..

# Build the package
print_status "Building package..."
cd $PACKAGE_DIR
bun run build
cd ../..

# Commit changes
print_status "Committing version bump..."
git add "$PACKAGE_DIR/package.json"
git commit -m "chore(typecmd): bump version to $NEW_VERSION"

# Create and push tag
TAG_NAME="typecmd-v$NEW_VERSION"
print_status "Creating tag: $TAG_NAME"
git tag $TAG_NAME

print_status "Pushing changes and tag..."
git push origin main
git push origin $TAG_NAME

print_status "Release $NEW_VERSION initiated! Check GitHub Actions for publishing status."
print_warning "Make sure you have set up the NPM_TOKEN secret in your GitHub repository settings."
