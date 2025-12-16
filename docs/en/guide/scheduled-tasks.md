# Scheduled Tasks

CloudPaste provides a complete scheduled task system that supports automated execution of background tasks such as cleanup and synchronization. Administrators can configure and monitor all scheduled tasks through the admin panel.

## Feature Overview

The scheduled task system supports the following core features:

- ✅ **Multiple scheduling modes**: Supports fixed interval and Cron expression scheduling
- ✅ **Distributed lock mechanism**: Prevents duplicate execution in multi-instance environments
- ✅ **Manual trigger**: Supports immediate task execution
- ✅ **Execution history**: Records status, duration, and results of each execution
- ✅ **Statistical analysis**: Provides 24-hour execution heatmap

## 1. Accessing Scheduled Task Management

1. Log in to the CloudPaste admin panel
2. Click "Scheduled Tasks" in the left menu
3. Enter the scheduled task management page

## 2. Task Types

CloudPaste includes the following built-in task types:

### 2.1 Cleanup Upload Sessions (cleanup_upload_sessions)

**Description:**
- Automatically cleans up expired chunked upload sessions
- Marks timed-out active sessions as expired
- Deletes historical session records beyond the retention period

**Configuration Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| keepDays | number | 30 | Number of days to retain history records |
| activeGraceHours | number | 24 | Maximum idle time for active sessions (hours) |

**Cleanup Logic:**
1. Mark active sessions with `expires_at < current time` as expired
2. Mark active sessions not updated for more than `activeGraceHours` as expired
3. Delete records with status completed/aborted/error/expired that are older than `keepDays`

### 2.2 Storage Sync (scheduled_sync_copy)

**Description:**
- Periodically sync files between different storage configurations
- Supports one-way incremental sync (only copies new/updated files)
- Supports configuring multiple source-target path pairs

**Configuration Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| pairs | array | - | Array of source-target path pairs |
| sourcePath | string | - | Source path for simple mode |
| targetPath | string | - | Target path for simple mode |
| skipExisting | boolean | true | Whether to skip existing files (incremental mode) |
| maxConcurrency | number | 5 | Number of concurrent copy threads (max 32) |

**Configuration Example:**

```json
{
  "pairs": [
    {
      "sourcePath": "/mount1/backup",
      "targetPath": "/mount2/archive"
    },
    {
      "sourcePath": "/mount1/photos",
      "targetPath": "/mount3/photos-backup"
    }
  ],
  "skipExisting": true,
  "maxConcurrency": 5
}
```

## 3. Creating Scheduled Tasks

### 3.1 Basic Steps

1. Click "New Task" on the scheduled task management page
2. Select task type (Handler)
3. Fill in task configuration information
4. Set the schedule plan
5. Click "Save" to create the task

### 3.2 Configuration Field Descriptions

- **Task Name** (Optional)
  - Custom display name for the task
  - Uses default name from task type if not specified

- **Task Description** (Optional)
  - Description text for the task
  - Helps identify the task's purpose

- **Schedule Type**
  - **Fixed Interval**: Execute at fixed time intervals
  - **Cron Expression**: Use standard Cron expressions to define execution time

- **Execution Interval** (Fixed interval mode)
  - Supports seconds/minutes/hours/days and other units
  - Minimum interval: 60 seconds

- **Cron Expression** (Cron mode)
  - Standard five-field format: `minute hour day month weekday`
  - The interface automatically displays a readable description of the Cron expression

- **Enabled Status**
  - When enabled, the task will execute automatically according to schedule
  - When disabled, the task will pause execution

- **Configuration Parameters**
  - Task-specific configuration items
  - Supports switching between form mode and JSON mode

### 3.3 Cron Expression Examples

| Expression | Description |
|------------|-------------|
| `0 0 * * *` | Execute at midnight every day |
| `0 */6 * * *` | Execute every 6 hours |
| `30 2 * * *` | Execute at 2:30 AM every day |
| `0 0 * * 0` | Execute at midnight every Sunday |
| `0 0 1 * *` | Execute at midnight on the 1st of every month |

## 4. Task Management Operations

### 4.1 Viewing Task List

The task list page displays the following information:
- Task name and description
- Execution cycle (interval or Cron expression)
- Last execution time
- Next execution time
- Total execution count
- Current status

### 4.2 Task Status Descriptions

| Status | Description |
|--------|-------------|
| Disabled | Task is disabled and will not execute automatically |
| Waiting | Task is enabled, waiting for next execution time |
| Pending Trigger | Execution time has arrived, waiting for scheduler trigger |
| Running | Task is currently executing |

### 4.3 Manual Task Execution

1. Find the target task in the task list
2. Click the "Run Now" button (lightning icon) in the actions column
3. The system will execute the task immediately
4. Status will refresh automatically after execution completes

### 4.4 Enable/Disable Tasks

- Click the task status toggle to switch enabled status
- Task will not execute automatically when disabled
- Manual execution is still possible when disabled

### 4.5 Editing Tasks

1. Click the "Edit" button in the task's actions column
2. Modify task configuration
3. Click "Save" to apply changes

### 4.6 Deleting Tasks

1. Click the "Delete" button in the task's actions column
2. Confirm the delete operation
3. The task and its execution history will be deleted

> **Note**: Delete operations cannot be undone. Please proceed with caution.

## 5. Viewing Execution History

### 5.1 Accessing Execution History

1. Click the "View Details" button for the target task in the task list
2. View execution history in the popup details window

### 5.2 Execution History Information

Each execution record contains:
- **Execution Status**: success / failure / skipped
- **Trigger Method**: auto / manual
- **Start Time**: Time when task started executing
- **Execution Duration**: Time spent executing the task (milliseconds)
- **Execution Summary**: Brief description of task execution results
- **Error Information**: Error details when failed

## 6. Statistics Heatmap

The 24-hour execution heatmap is displayed at the top of the scheduled task management page:

- **Color intensity** represents the number of executions in that time period
- **Hover** to display the specific execution count
- **Color levels**:
  - Light: 1-3 times
  - Medium: 4-7 times
  - Dark: 8-12 times
  - Very dark: >12 times

## 7. Scheduling Mechanism

### 7.1 Cloudflare Workers Environment

- Triggered by Cloudflare Scheduled Events
- Default: Check for due tasks every 5 minutes
- Configuration location: `cron` field in `wrangler.toml`

### 7.2 Docker/Node.js Environment

- Implemented using the `node-schedule` library
- Default: Check for due tasks every minute
- Customizable via `SCHEDULED_TICK_CRON` environment variable

### 7.3 Distributed Lock Mechanism

- System uses database locks to prevent duplicate execution across multiple instances
- Default lock duration: 5 minutes
- Lock is automatically released after execution completes

## 8. Best Practices

### 8.1 Cleanup Task Configuration Recommendations

- **keepDays**: Set based on storage space and compliance requirements, typically 7-30 days
- **activeGraceHours**: Recommend setting to 24 hours or more to avoid marking ongoing uploads as expired
- **Execution interval**: Recommend once daily (86400 seconds)

### 8.2 Sync Task Configuration Recommendations

- **skipExisting**: Recommend enabling for incremental sync and improved efficiency
- **maxConcurrency**: Adjust based on network bandwidth and storage performance, typically 3-10
- **Execution interval**: Set based on data update frequency, such as hourly or daily

### 8.3 Important Notes

1. **Avoid overlapping execution**: Set reasonable execution intervals to ensure tasks have sufficient time to complete
2. **Monitor execution status**: Regularly check task execution history and pay attention to failure records
3. **Set parameters reasonably**: Adjust configuration parameters based on actual data volume
4. **Test before enabling**: Manually execute new tasks to test, confirm no issues before enabling automatic execution

## 9. FAQ

### 9.1 Task Not Executing on Schedule

**Possible causes:**
- Task is not enabled
- Scheduler is not running properly
- Previous execution has not completed (holding lock)

**Solutions:**
1. Confirm task status is "Enabled"
2. Check system logs to confirm scheduler is running normally
3. Wait for lock timeout or restart the service

### 9.2 Task Execution Failed

**Possible causes:**
- Configuration parameters are incorrect
- Storage configuration is invalid
- Network connection issues

**Solutions:**
1. View error information in execution history
2. Check task configuration parameters
3. Verify related storage configuration is working properly

### 9.3 Sync Task Files Incomplete

**Possible causes:**
- `maxConcurrency` set too high causing timeouts
- Source path or target path configured incorrectly
- Insufficient storage space

**Solutions:**
1. Reduce `maxConcurrency` value
2. Check if path configurations are correct
3. Confirm target storage has sufficient space

## 10. API Endpoints

Scheduled tasks provide the following management APIs (requires `admin.all` permission):

| Method | Endpoint | Function |
|--------|----------|----------|
| GET | `/api/admin/scheduled/types` | Get task type list |
| GET | `/api/admin/scheduled/jobs` | Get task list |
| GET | `/api/admin/scheduled/jobs/:taskId` | Get task details |
| POST | `/api/admin/scheduled/jobs` | Create task |
| PUT | `/api/admin/scheduled/jobs/:taskId` | Update task |
| DELETE | `/api/admin/scheduled/jobs/:taskId` | Delete task |
| POST | `/api/admin/scheduled/jobs/:taskId/run` | Execute task immediately |
| GET | `/api/admin/scheduled/jobs/:taskId/runs` | Get execution history |
| GET | `/api/admin/scheduled/analytics` | Get execution statistics |
