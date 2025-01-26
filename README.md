<div align="center">
  <h3>Issue Wrapper</h3>
  <h4>Issue Wrapper simplifies the process of reporting issues for app users and developers. It ensures structured, clear, and actionable feedback is collected seamlessly and delivered as GitHub issues.</h4>
</div>

## Overview

Issue Wrapper enables developers to create a custom issue-reporting link for their applications. When users click the link, they are directed to a page with a developer-defined set of questions. Once completed, the responses are submitted directly as a GitHub issue, formatted as specified by the developer.

## Features

- **Customizable Issue Forms**: Developers can design tailored forms to collect relevant information.
- **Automated GitHub Issue Creation**: User reports are directly submitted to the specified GitHub repository.
- **Progress Tracking**: Users can track the status and updates of their reported issues through the familiar GitHub UI.

## Get Started

1. Integrate Issue Wrapper with your application.
2. Customize the reporting link and form settings.
3. Share the link with your users.

## How It Works

#### Developer Setup
  - Define the form fields/questions
  - Generate a custom issue-reporting link for your app.
  - Navigate the user to the link when a bug needs to be reported
    - Optionally include logs that will be included at the bottom of your report
    - _(It's recommended to cap a generated URL to 2048 characters in length to maintain compatiblity)_

#### User Experience
  - Users are taken to the generated link and authenticate if required.
  - Fill out the structured form with details of the issue.
  - Submit the form to generate a GitHub issue.

#### Developer Resolution
  - Developers receive issues in a consistent, predefined format.
  - Users stay updated on the progress directly.


## Benefits

- **For Developers**: Streamlined feedback collection and improved issue tracking.
- **For Users**: Easy-to-use interface and transparency in issue resolution.
