# Target Management Dashboard

## Docker + Next.js + Tailwind + chart.js

### Setup using Docker

- make sure you have Docker installed on your machine
- navigate to where you'd like to install the app and clone the repository by running:

```
git clone https://github.com/jp0624/management-dashboard-nextjs.git
```

- next open that directory and build with docker:

```
docker-compose up --build
```

- the app will takes a few minutes the first time to download and install necessary files and packages
- You will then be able to access the app at: http://localhost:3000

#### Note:

After first build you can simply run:

```
docker-compose up
```

To end the docker instance run:

```
docker-compose down
```

### Setup using Next.JS directly

- make sure you have Node v.22 installed on your machine
- navigate to where you'd like to install the app and clone the repository by running:

```
git clone https://github.com/jp0624/management-dashboard-nextjs.git
```

- next open that directory and build with npm:

```
npm install
```

- the app will takes a minute to download and install necessary files and packages
- then launch the app:

```
npm run dev
```

- You will then be able to access the app at: http://localhost:3000

`

# Project Notes & Future Considerations

## Overview & Features

### General

- Overall responsive UI layout throughout.
- Tailwind used for centralized styling.

### Filters

- User can choose what Pipeline Statuses to display.
- Both Chart and Target List are automatically updated.
- User can enable all statuses by clicking `"all"` option.

### Chart

- Bars are hidden when filters are toggled.
- Hover displays the count of targets.

### Target List

- Displays a list of all targets from `/public/data/targets.json`
- User has ability to delete a target with a confirmation modal
- User can edit the pipeline status by clicking edit and saving for each target

### Add New Target

- New target modal allows user to create a new target
- User can add multiple markets by click the [+] button

### History

- Displays a list of all target updates from `/public/data/targets-history.json`
- System track when a target is created or deleted
- Status changes are show in the history list with previous and update values
- Action type be used to sort and filter history list items

## 1. Database Schema

### Targets Table

- id: Primary key, unique identifier for each target.
- name: String, name of the target.
- description: String, description of the target.
- pipelineStatus: String or nullable, current status of the target (e.g., "In Progress", "Completed", "Not Set").
- markets: Array of strings, relevant markets for the target.

### History Table

- id: Primary key, unique identifier for each history entry.
- targetId: Foreign key, references the id of the target.
- oldStatus?: String or nullable, the status before the change.
- newStatus?: String or nullable, the status after the change.
- changedAt: Timestamp, date and time of the change.
- action: String, type of action ("added", "deleted", "status").

### Status Table

- id: Primary key, unique identifier for each target.
- name: String, name of the status (e.g., "In Progress", "Completed", "Not Set").

## 2. Data Update Strategy

### Change Tracking Mechanism

- Actions: Define clear actions for each operation on targets:
  - Create: Adds a new target.
  - Update: Changes the pipeline status or other fields.
  - Delete: Removes a target and all associated history.

### Logging Changes: Each time a target's status changes:

- Capture the target action type `'added'` `'deleted'` `'status'`
- Capture the old status and new status.
- Insert a new entry in the history table.

### Update Flow

- Creating a Target: When a new target is added, it is saved in the Targets table.
- Adding a Target:
  - Add the target from the Targets table.
  - log a creation entry if desired in the History table `'action': 'added'`
- Updating a Status:
  - Retrieve the current status.
  - Update the status in the Targets table.
  - Log the change in the History table with the appropriate old and new status.
  - Log the status change in the History table `'action': 'status'`
- Deleting a Target:
  - Retrieve the target to be deleted.
  - Remove the target from the Targets table.
  - Remove all entries related to this target from the History table or log a deletion entry if desired in the History table `'action': 'deleted'`

## 3. Edge Case Handling

### Edge Case 1: Invalid Status Updates

- Description: An attempt to set a target’s status to an invalid or undefined value.
- Handling: Implement validation on the status before updating. If the status is invalid, return a default as `'Not Set'` for display purposes in UI.

- ### Edge Case 2: Concurrent Updates

- Description: Multiple users attempt to update the same target's status simultaneously.
- Handling: Use optimistic concurrency control. Each target can have a version number or timestamp. When updating, check if the version matches the last known version. If it doesn’t, inform the user of a conflict.

### Edge Case 3: Deleting Non-existent Targets

- Description: An attempt to delete a target that doesn’t exist.
- Handling: Check for the target’s existence before deletion. Return `"error": "Target not found"` via api.

### Edge Case 4: Handling Bulk Updates

- Description: Multiple targets need status updates in a single operation.
- Handling: Validate each target's status in the batch. If any updates fail, roll back the successful updates to maintain data integrity, or implement partial success handling where applicable.

### Edge Case 5: Data Integrity Issues

- Description: Corrupted data in the history table (e.g., orphaned entries).
- Handling: Implement periodic checks to ensure referential integrity. Use cascading deletes or other constraints to maintain relationships.

## 4. Monitoring and Maintenance

- Audit Logs: Maintain logs of all changes to targets and their statuses for security and compliance.
- Data Backups: Regularly back up the database to prevent data loss.
- Performance Monitoring: Monitor the performance of queries, especially when dealing with large datasets, to ensure efficient access and updates.

## 6. API creation and usage

- Targets: (GET, PUT, POST, PATCH, DELETE) are setup for usage at `<url>/api/targets` and dynamic items `<url>/api/targets/[id]`
- History: (GET, POST, DELETE) are setup for usage at `<url>/api/history` and dynamic items `<url>/api/history/[id]`

## 7. Conclusion

This strategy provides a robust framework for managing and tracking changes to pipeline statuses of targets. By implementing thorough validation, logging, and edge case handling, we can ensure a reliable and user-friendly experience while maintaining data integrity. Regular monitoring and maintenance will further enhance the system's resilience and performance.
