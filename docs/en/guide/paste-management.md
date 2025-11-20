# Text Management Guide

Use CloudPaste to create, share, and protect your text (including Markdown).

## 1. What You Can Do
- **Create & Share Text**: Supports title, notes, and content (Markdown supported).
- **Security Options**: Optional password, expiration time, max view count, and public/private setting.
- **Access Methods**:
   - Regular view page: `/paste/:slug`
   - Raw text: `/api/raw/:slug`
- **Management**:
   - Admins can view/search/delete/clean up expired pastes.
   - API Key users can only manage their own shares.

## 2. One-Step Creation
1) Open the frontend homepage (Markdown editor) or backend "Text Management."
2) Fill in:
   - **Title** (optional, defaults to the short-link slug)
   - **Content** (required, Markdown supported)
   - **Notes** (optional)
3) Optional settings:
   - **Password**: Requires verification before access. The generated proxy link includes the password for easy sharing.
   - **Expiration Time**: Automatically deletes when expired.
   - **Max Views**: Deletes after reaching the limit.
   - **Public/Private**: Private pastes are only accessible to admins or the creator (`apikey:ID`).
4) After submission, get a short-link slug (customizable, must be unique and contain only letters, numbers, `-`, `_`, or `.`).

## 3. How to Access
- **Regular View Page**: `/paste/{slug}` (supports password verification and remaining view count).
- **Raw Text**: `/api/raw/{slug}` (requires `?password=xxx` if protected).
- **Last View**: Shows a deletion notice when max views are reached.
- **Expired Pastes**: Returns "Expired/Deleted" immediately.

## 4. Management & Cleanup
- **Admins**: Can search/filter by creator, bulk delete, and clean expired pastes (`/api/pastes/clear-expired`).
- **API Key Users**: Only see their own pastes; can only delete/update their shares.
- **Bulk Deletion**: Supports deleting multiple pastes; failures return individual reasons.
- **Editing**: Update title, notes, password, expiration, max views, or public/private status.
- **View Toggle (Masonry)**:
   - Backend "Text Management" supports list/masonry views.
   - Masonry is ideal for browsing many text cards; adjust columns/spacing via toolbar (settings persist locally).
   - Desktop: Double-click to edit.
   - Mobile: Long-press (0.8s) to edit.
   - Edit shortcuts: `Ctrl+Enter` / `⌘+Enter` to save, `Esc` to cancel.

## 5. Permissions & Security
- **Admins**: Full access, bypasses password/visibility restrictions.
- **API Keys**: Require `TEXT_SHARE`/`TEXT_MANAGE` permissions and can only manage their own data.
- **Public/Private**: Private pastes return "Not Found" for unauthorized users.
- **Password**: Incorrect/missing passwords are rejected immediately. Changing a password invalidates old tokens.

## 6. Common Scenarios
- **One-Time Share**: Set max views = 1 or a short expiration.
- **Confidential Snippets**: Use password + private (visible only to admins/creator).
- **Public Examples**: Set as public, no password, for easy embedding.
- **Cleanup**: Use "Clean Expired" in the backend to delete old shares.

## 7. Troubleshooting
- **Slug Taken**: Try a different suffix or let the system auto-generate one.
- **Password Always Prompted**: Check if password/parent (private) restrictions are enabled or if the password was changed.
- **"Deleted/Expired"**: Verify if max views or expiration time was reached.
- **Can’t See Others’ Pastes**: API Keys can only access their own shares—this is intentional.

---