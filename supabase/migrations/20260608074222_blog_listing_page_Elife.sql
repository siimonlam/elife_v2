
/*
# Elife — Blog Listing Page Database
Optimises the blog_posts table for the Blog listing page:
- Index on published + published_at for the default listing query (published posts, newest first)
- GIN index on tags array for tag-filter pills
- Full-text search index on blog title (English) for future search feature
- Adds read_time_minutes column so article cards can display estimated reading time
- Adds view_count column for "most popular" sort option
*/

-- Index for default listing: published posts ordered by date
CREATE INDEX IF NOT EXISTS blog_posts_published_date_idx
  ON blog_posts(published, published_at DESC) WHERE published = true;

-- GIN index on tags array for tag filter pills
CREATE INDEX IF NOT EXISTS blog_posts_tags_gin_idx
  ON blog_posts USING gin(tags);

-- Full-text search index on title (English)
CREATE INDEX IF NOT EXISTS blog_posts_title_en_search_idx
  ON blog_posts USING gin(to_tsvector('english', (title->>'en')));

-- Add estimated reading time column (populated by admin when creating posts)
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS read_time_minutes int NOT NULL DEFAULT 5;

-- Add view counter for future "most popular" sort
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS view_count int NOT NULL DEFAULT 0;

-- Index on view_count for popular-posts queries
CREATE INDEX IF NOT EXISTS blog_posts_view_count_idx
  ON blog_posts(view_count DESC) WHERE published = true;

-- Backfill read_time estimates based on English content word count (~200 wpm)
UPDATE blog_posts
SET read_time_minutes = GREATEST(1, (
  length(regexp_replace(content->>'en', '<[^>]+>', '', 'g')) -
  length(replace(regexp_replace(content->>'en', '<[^>]+>', '', 'g'), ' ', ''))
) / 200)
WHERE read_time_minutes = 5;
