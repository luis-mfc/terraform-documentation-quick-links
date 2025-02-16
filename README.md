# terraform-documentation-quick-links
Open the latest docs for any terraform data source or resource by clicking is name.

- [terraform-documentation-quick-links](#terraform-documentation-quick-links)
  - [Features](#features)
  - [Requirements](#requirements)
  - [Extension Settings](#extension-settings)
  - [Known Issues](#known-issues)
  - [Release Notes](#release-notes)
    - [0.0.3](#003)
    - [0.0.2](#002)
    - [0.0.1](#001)

## Features
Adds documentation links to data sources and resources.

## Requirements
- `vscode "^1.97.0"`

## Extension Settings
This extension contributes the following settings:

- General:
  - `terraform-documentation-quick-links.baseurl`: The base documentation url.

- Overriding expected url paths (Custom JSON object strings). By default, the docs links to resources follow the following structure `<terraform-documentation-quick-links.baseurl>/providers/<provider>/<version>/docs/resources/google_project_service`:
  - `terraform-documentation-quick-links.providers`: example `{\"provider\": \"org/provider\"}`
  - `terraform-documentation-quick-links.resources`: example `{\"google_project_iam_member\": \"google_project_iam#google_project_iam_member\"}`
  - `terraform-documentation-quick-links.data-sources`: example `{\"google_project_service\": \"google_project_service\"}`

## Known Issues
- Does not take into account different provider versions;
- Some resources will not be properly resolved out of the box as they do not follow the normal url path structure:
  - See [the settings section](#extension-settings) above to manually add support to individual resources and or data sources
- Modules/Provider docs not currently supported

## Release Notes

### 0.0.3
- Refactor user settings;
- Fix support for:
  - `google_service_account`
  - `google_project_iam_binding`
  - `google_project_iam_policy`
  - `google_project_iam_member`
  - `google_project_iam_audit_config`

### 0.0.2
- Support Data Sources

### 0.0.1
- Support Resources
