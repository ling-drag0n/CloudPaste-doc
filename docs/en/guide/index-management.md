# Index Management

Manage file search indexes to keep the search functionality working properly.

## 1. What You Can Do

- **View Index Status**: See the index health and number of pending changes for each mount point.
- **Rebuild Index**: Perform a complete scan of all files and re-establish the search index (suitable for first-time use or corrupted indexes).
- **Apply Changes**: Update only files that have changed, quickly synchronizing the index (suitable for daily maintenance).
- **Monitor Tasks**: View index task progress in real-time and stop long-running tasks at any time.
- **Clean Index**: Delete corrupted or unnecessary index data.

## 2. What is an Index?

> An index is like a library catalog card that helps you quickly find the files you want.

When you search for files in CloudPaste, the system doesn't open files one by one to search. Instead, it queries a pre-established "index". The index records information about each file such as name, path, and content summary, making searches lightning-fast.

**Why do you need to manage indexes?**
- Newly uploaded files need to be added to the index to be searchable
- After deleting or modifying files, the index needs to be updated
- Indexes can become corrupted for various reasons and need to be rebuilt

## 3. Index Status Explanation

Go to "Admin Panel → Index Management" and you'll see the status of each mount point:

- **✅ Ready (ready)**: Index is normal and searchable
- **🔄 Indexing (indexing)**: Index is being created or updated
- **⚠️ Not Ready (not_ready)**: Index hasn't been created or creation failed
- **❌ Error (error)**: Last operation failed and needs attention

**Health Indicator**: Shows the percentage of mount points in "ready" status. 100% means all mount point indexes are functioning normally.

## 4. Two Types of Index Operations

### Rebuild Index (Complete Scan)

**When to use:**
- First time using a mount point
- Index status shows "not ready" or "error"
- Suspect index data is inaccurate
- Large number of pending changes (system will recommend this)

**How it works:**
Scans all files and folders starting from the mount point root directory and establishes a complete index.

**Operation Steps:**
1. Find the target mount point in the mount point list
2. Click the "Rebuild" button (or use the action panel on the right)
3. Optional configuration:
   - **Batch Size**: How many files to process at once (20-1000, default 100)
   - **Max Depth**: How many folder levels to scan (0 means unlimited)
4. Confirm to start and view progress in the "Running Tasks" area

### Apply Changes (Incremental Update)

**When to use:**
- Daily maintenance with few file changes
- See "Pending Changes" count is not zero
- System recommends "Apply Changes"

**How it works:**
Only processes files that have changed (added, modified, deleted), without re-scanning all files.

**Operation Steps:**
1. Find the mount point with "Pending Changes" in the mount point list
2. Click the "Apply Changes" button
3. Optional configuration:
   - **Batch Size**: How many changes to process at once (10-2000, default 100)
   - **Max Count**: Maximum number of changes to process (0 means process all)
   - **Rebuild Subtree**: If changes involve folders, whether to re-scan the entire folder
4. Confirm to start

## 5. Usage Recommendations

### Recommended Maintenance Strategy

1. **First Time Use**: Execute "Rebuild Index" once for each mount point
2. **Daily Maintenance**: Regularly check "Pending Changes"; when it exceeds 100, execute "Apply Changes"
3. **Troubleshooting**: If search results are inaccurate, try "Rebuild Index"

### Performance Optimization

- **Batch Size**:
  - Small batches (20-50): Low resource usage, suitable for servers with average performance
  - Large batches (500-1000): Fast speed, suitable for high-performance servers

- **Max Depth**:
  - If you only need to index shallow files, you can limit the depth (e.g., 3-5 levels)
  - Deeply nested folders increase indexing time

### When to Stop Tasks

If an index task runs too long or you discover a configuration error, you can click the "Stop" button at any time. Processed data will be retained and you can continue next time.

## 6. Common Scenarios

### Scenario 1: New Mount Point Not Searchable

**Problem**: Newly added mount point, no files can be found in search.

**Solution**:
1. Go to "Index Management"
2. Find the mount point; status should be "not ready"
3. Click the "Rebuild" button and wait for completion
4. Once status changes to "ready", you can search

### Scenario 2: Uploaded Files Not Found in Search

**Problem**: Newly uploaded files don't appear in search results.

**Solution**:
1. Check the "Pending Changes" count for that mount point
2. Click the "Apply Changes" button
3. Wait for completion and search again

### Scenario 3: Inaccurate Search Results

**Problem**: Search finds deleted files or can't find files that clearly exist.

**Solution**:
1. Execute "Rebuild Index" (complete scan)
2. If the problem persists, you can "Clean Index" first, then "Rebuild Index"

### Scenario 4: Index Task Stuck

**Problem**: Index task shows "indexing" but progress hasn't moved for a long time.

**Solution**:
1. Click the "Stop" button
2. Check if mount point configuration is correct (storage credentials, network connection)
3. Re-execute the index operation

## 7. Troubleshooting

### Index Status Always "Not Ready"

- Check if mount point configuration is correct
- Verify you have permission to access storage
- Try manually "Rebuild Index" and check error messages

### Pending Changes Count Keeps Increasing

- There may be a program continuously modifying files
- Recommend executing "Apply Changes" when file changes are minimal
- If count exceeds 5000, system will recommend "Rebuild Index"

### Index Task Fails

- Check error messages (click mount point card to view details)
- Common causes:
  - Storage credentials expired
  - Network connection issues
  - Insufficient file permissions
  - Insufficient storage space

### Search Speed Slow

- Check if index status is "ready"
- If index data volume is large, consider optimizing search keywords
- You can try "Clean Index" followed by "Rebuild Index"

---
