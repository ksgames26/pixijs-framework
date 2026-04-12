---
"@ksgames26/core": patch
"@ksgames26/assets": patch
"@ksgames26/scene": patch
"@ksgames26/ui": patch
"@ksgames26/spine": patch
"@ksgames26/debug": patch
"@ksgames26/platform-web": patch
"@ksgames26/platform-wechat": patch
"@ksgames26/platform-douyin": patch
---

Setup publishing workflow with changesets

- Added @changesets/cli and @changesets/changelog-github for version management
- Configured GitHub Actions for CI and automated releases
- Added repository metadata to all package.json files
- Added publishConfig with public access for npm publishing
- Added typecheck scripts to all packages
- Fixed cyclic dependency between core and platform packages
- Added release documentation in .changeset/PUBLISHING.md
