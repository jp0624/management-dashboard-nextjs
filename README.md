# Target Management Dashboard

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
- oldStatus: String or nullable, the status before the change.
- newStatus: String or nullable, the status after the change.
- changedAt: Timestamp, date and time of the change.
- action: String, type of action (e.g., "update", "delete").

## 2. Data Update Strategy

### Change Tracking Mechanism

- Actions: Define clear actions for each operation on targets:
- Create: Adds a new target.
- Update: Changes the pipeline status or other fields.
- Delete: Removes a target and all associated history.

### Logging Changes: Each time a target's status changes:

- Capture the old status and new status.
- Insert a new entry in the history table.

### Update Flow

- Creating a Target: When a new target is added, it is saved in the Targets table.
- Updating a Status:
  - Retrieve the current status.
  - Update the status in the Targets table.
  - Log the change in the History table with the appropriate old and new status.
- Deleting a Target:
  - Retrieve the target to be deleted.
  - Remove the target from the Targets table.
  - Remove all entries related to this target from the History table or log a deletion entry if desired.

## 3. Edge Case Handling

### Edge Case 1: Invalid Status Updates

- Description: An attempt to set a target’s status to an invalid or undefined value.
- Handling: Implement validation on the status before updating. If the status is invalid, return an error response and do not perform the update.
- ### Edge Case 2: Concurrent Updates
- Description: Multiple users attempt to update the same target's status simultaneously.
- Handling: Use optimistic concurrency control. Each target can have a version number or timestamp. When updating, check if the version matches the last known version. If it doesn’t, inform the user of a conflict.

### Edge Case 3: Deleting Non-existent Targets

- Description: An attempt to delete a target that doesn’t exist.
- Handling: Check for the target’s existence before deletion. Return a 404 error if the target is not found.

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

## 5. Conclusion

This strategy provides a robust framework for managing and tracking changes to pipeline statuses of targets. By implementing thorough validation, logging, and edge case handling, we can ensure a reliable and user-friendly experience while maintaining data integrity. Regular monitoring and maintenance will further enhance the system's resilience and performance.
