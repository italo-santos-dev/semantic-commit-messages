# Multi-Line Commits (Body & Footers) Examples

When the header is not enough, use the body for motivation and context, and footers for Git trailers and ticket tracking.

---

### Example 1: Motivation, Context, and Issue Closing
```text
fix(payment): prevent duplicate charges caused by network timeout retries

When a bank gateway times out, frontend retries previously submitted a new idempotency key, causing double billing on certain payment channels.

This change ties the idempotency key strictly to the order ID rather than the attempt timestamp, ensuring exactly-once processing regardless of network retries.

Fixes: #1042
Reported-by: Security Audit Team <security@example.com>
```

### Example 2: Architecture Evolution with Co-authors
```text
feat(cache): implement Redis cluster sharding for session store

Migrate session state from a single Redis instance to a cluster-aware topology.
Implements client-side consistent hashing with fallback to local memory in case of transient partition.

Includes benchmark suite demonstrating 4x throughput under peak loads.

Co-authored-by: Alice Engineer <alice@example.com>
Co-authored-by: Bob Architect <bob@example.com>
Refs: #581, #599
```

### Example 3: Revert Commit with Original Context
```text
revert: feat(notifications): enable WebSocket push by default

This reverts commit 4e1c2a8f09b2e3d7a9c1e2f4a5b6c7d8e9f01234.
WebSocket connections caused memory exhaustion on edge workers during the morning traffic spike. Reverting while connection pooling is implemented.

Refs: INCIDENT-2026-10-18
```
