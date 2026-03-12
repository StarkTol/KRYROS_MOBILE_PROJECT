# Database Fix Guide

## The Problem
The `brands` table has `id` as TEXT but Prisma expects it to be INT with autoincrement. This is causing the 500 error.

## Solution: Run this SQL in Neon SQL Editor

### Option 1: Drop and recreate the brands table (RECOMMENDED)
```sql
-- Drop the incorrectly created brands table
DROP TABLE IF EXISTS "brands" CASCADE;
```

This will allow Prisma to recreate it correctly on the next request.

### Option 2: Fix the column type (if you have data you want to keep)
```sql
-- First drop the table if it exists and has wrong structure
DROP TABLE IF EXISTS "brands" CASCADE;

-- Let Prisma recreate it correctly
-- The table will be recreated automatically when you call the API
```

## After Fixing
Once you've run the SQL above, the brands API should work correctly. The table will be recreated with the correct schema:
- `id` - INTEGER with autoincrement
- `name` - TEXT NOT NULL
- `slug` - TEXT NOT NULL UNIQUE
- `logo` - TEXT (optional)
- `description` - TEXT (optional)
- `website` - TEXT (optional)
- `isActive` - BOOLEAN DEFAULT true
- `createdAt` - TIMESTAMP
- `updatedAt` - TIMESTAMP
