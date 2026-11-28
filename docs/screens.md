# App Screens

This document describes the application screens for PLS WoT, their purpose, and the login flows.

## Login Screens

### Watch-Only Mode Screen

- **Purpose**: Allow users to browse ratings and the graph without writing to the network
- **Input**: Public key (pubkey) or npub identifier
- **Utility**: View ratings feed, view user ratings graph, search for identities
- **Application**: Users who want to observe the Web of Trust without exposing their own identity

### Full Login Screen

- **Purpose**: Allow users to publish ratings and interact with the Web of Trust
- **Input**: Private key (nsec) or seed phrase
- **Utility**: Publish rating records, add followers, manage profile
- **Application**: Active participants who want to evaluate counterparties and arbitrators

## Principal Screens

### 1. Ratings Feed Screen

- **Route**: `src/app/ratings-feed/[userId]`
- **What it shows**: A paginated feed of rating records from users the signed-in user follows
- **Utility**: Stay updated on new evaluations from trusted contacts; discover new counterparties. Can also be used to stay updated on new evaluations for negative paths (untrustful too).
- **Flux**: Feed updates via SSE events from followed users' Homeservers; partial results shown when some Homeservers are unavailable
- **Reference**: See [`docs/network.md#ratings-table-feed`](./network.md#ratings-table-fees) for networking spec

### 2. User Ratings Graph Screen

- **Route**: `src/app/ratings-graph/[targetUserId]`
- **What it shows**: Graph traversal of rating records starting from a selected identity
- **Utility**: Visualize the Web of Trust network around a specific user; assess connection depth and reliability
- **Flux**: Graph data fetched on-demand from Homeservers; explicit depth and request limits prevent unbounded reads; missing records treated as unavailable
- **Reference**: See [`docs/network.md#graph-screen`](./network.md#graph-screen) for networking spec

## Publish Rating Screen

- **What it shows**: Form to create and submit a new rating record
- **Utility**: Evaluate a counterparty or arbitrator by signing a rating
- **Application**: Full login mode users who want to contribute to the Web of Trust
- **Login access**: Should be logged in full login mode

### Form Fields

1. **Target identity**: Public key or npub of the rated user
2. **Evaluation**: Positive or negative rating indicator — marks the person as trustful or not trustful
3. **Business relationship**: Whether the rater has done business with the target
4. **Written explanation**: Required free-text context for the evaluation

### Workflow

1. User enters target identity (pubkey/npub)
2. System validates the identity format
3. User fills in evaluation details — evaluation field marks person as trustful or not trustful
4. User submits; SDK handles authentication and HTTP write to user's Homeserver
5. SSE subscription refreshes affected screens

### Reference

- Networking write operations: [`docs/network.md#communication-choices`](./network.md#communication-choices)

## Navigation Flow

```
Login Mode Selection
    │
    ├─ Watch-Only → Ratings Feed → User Graph
    └─ Full Login → Ratings Feed → User Graph → Publish Rating
```

## Login Access Roles

- **Ratings Feed Screen**: Should be logged in
- **User Ratings Graph Screen**: Should be logged in
- **Publish Rating Screen**: Should be logged in full login mode
