CREATE TABLE reports (
 id TEXT PRIMARY KEY,
 category TEXT NOT NULL CHECK(category IN ('bug','calculation','translation','feature')),
 description TEXT NOT NULL,
 contact_email TEXT,
 locale TEXT NOT NULL,
 app_version TEXT NOT NULL,
 snapshot_json TEXT,
 status TEXT NOT NULL DEFAULT 'New' CHECK(status IN ('New','Reviewing','Accepted','Resolved','Rejected')),
 created_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL,
 expires_at INTEGER NOT NULL,
 revision INTEGER NOT NULL DEFAULT 1,
 issue_state TEXT NOT NULL DEFAULT 'none' CHECK(issue_state IN ('none','creating','created','uncertain')),
 issue_number INTEGER,
 issue_url TEXT
);
CREATE INDEX reports_expiry ON reports(expires_at);
CREATE INDEX reports_category_created ON reports(category, created_at DESC, id);
CREATE INDEX reports_status_created ON reports(status, created_at DESC, id);
CREATE TABLE request_dedup (
 request_id TEXT PRIMARY KEY,
 report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
 actor_hash TEXT NOT NULL,
 payload_hash TEXT NOT NULL,
 expires_at INTEGER NOT NULL
);
CREATE INDEX dedup_expiry ON request_dedup(expires_at);
CREATE TABLE rate_buckets (
 bucket TEXT PRIMARY KEY,
 count INTEGER NOT NULL,
 expires_at INTEGER NOT NULL
);
CREATE INDEX rate_expiry ON rate_buckets(expires_at);
CREATE TABLE used_challenges (token_hash TEXT PRIMARY KEY, expires_at INTEGER NOT NULL);
CREATE INDEX challenges_expiry ON used_challenges(expires_at);
