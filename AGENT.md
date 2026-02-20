# Notion CLI - Agent Guide

This guide helps AI agents effectively use the Notion CLI.

## Quick Start

```bash
# Configure API token
notion config set apiToken YOUR_TOKEN

# Search workspace
notion search "meeting notes"

# Get page
notion pages get <page-id>

# Query database
notion databases query <database-id>
```

## Common Commands

### Pages

- `notion pages get <id>` - Get page details
- `notion pages create --parent-id <id> --title "Title"` - Create page
- `notion pages update <id> --title "New Title"` - Update page
- `notion pages archive <id>` - Archive page

### Databases

- `notion databases get <id>` - Get database details
- `notion databases query <id>` - Query database
- `notion databases query <id> --filter '{...}'` - Query with filter
- `notion databases create --parent-id <id> --title "Title"` - Create database

### Blocks

- `notion blocks get <id>` - Get block details
- `notion blocks children <id>` - Get block children
- `notion blocks append <id> --text "Text"` - Append content
- `notion blocks delete <id>` - Delete block

### Search

- `notion search "query"` - Search workspace
- `notion search "query" --type page` - Search pages only
- `notion search --type database` - List all databases

## JSON Output

All commands support `--json` flag:

```bash
notion pages get <id> --json
notion search "notes" --json
```

## Error Handling

Check exit codes:
- 0 = success
- 1 = error

Parse error messages from stderr.

## Configuration

Config stored at: `~/.config/ktmcp-notion/config.json`

Required settings:
- `apiToken` - Notion API token

Optional:
- `baseURL` - API base URL (default: https://api.notion.com/v1)

## Tips

1. Always use `--json` for programmatic access
2. Use `jq` to parse JSON responses
3. Store page/database IDs for later reference
4. Use search to find pages before getting details
5. Handle rate limiting (429 errors) with retries
