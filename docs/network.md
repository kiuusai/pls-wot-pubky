# Networking and data discovery

This document records the current networking direction and decisions under consideration for PLS WoT as it moves to Pubky.
One product option is to make compatible Homeserver choices easy to find for users who do not already have a provider or contact who can recommend one.
The project could operate a standard Pubky Homeserver as one of those options, while users remain free to choose another compatible Homeserver.

This is a possible hosting approach, not a commitment that the app will provide or operate a Homeserver.
The goal is compatibility with the Pubky network and user's choice of hosting, rather than building custom protocol infrastructure.

## Pubky network model

Pubky provides public-key identities, Homeserver discovery, and storage.
Each user’s Homeserver stores that user’s records under paths such as `/pub/<app-namespace>/...`.
The SDK uses PKARR-based discovery to resolve a public key to its Homeserver and provides public reads and authenticated writes.

The app namespace is a path convention for organizing records, not a DNS subdomain or a protocol-reserved service.
PLS WoT will use `privatelawsociety.wot.app` as its app namespace, for example `/pub/privatelawsociety.wot.app/ratings/<rating-id>`.
The full public URI for a record follows the form `pubky://<public-key>/pub/privatelawsociety.wot.app/ratings/<rating-id>`.

This namespace choice does not make records discoverable or cause an indexer to include them automatically.
Homeservers provide HTTP storage operations and event streams for changes to their own stored files.
The event stream is SSE-based; it is not a global Pubky network stream or a WebSocket feed.

## Nexus scope

Pubky Nexus is an application-level indexer for shared `pubky.app` social data, including profiles, posts, follows, tags, and feeds.
Nexus is not a protocol-wide index of all records on every Homeserver.
PLS WoT will not depend on Nexus to index, search, or return PLS WoT rating records.

The app may use a public Nexus API to look up the signed-in user’s follow relationships when the required endpoint and coverage are available.
Nexus results are a discovery aid for finding followed public keys, not the source of truth for ratings.
Nexus coverage and indexing delay can make follow discovery incomplete or stale.

If the public API does not provide the needed follow lookup reliably, the app will read the user’s follow records directly from known Homeservers or provide another user-controlled source of followed keys.
The current plan is not to build or operate a custom PLS WoT indexer or application backend for the initial implementation.
Operating a standard Pubky Homeserver as an optional provider choice would be compatible with this plan, if that option is pursued.

## Ratings table feed

The ratings table is a personalized feed assembled from users the signed-in user follows.
The app discovers followed public keys, then resolves each key’s Homeserver through the Pubky SDK.
The app reads that user’s public rating records from the PLS WoT namespace on the user’s Homeserver.

The app combines the returned ratings, orders them by their record timestamps, and paginates the local result.
Ratings are stored on the rating author’s Homeserver under a predictable and listable PLS WoT path.
Pubky.app follow relationships describe its general social graph and can help the app find users to read.

PLS WoT could also define its own application-specific relationships, such as trust links, counterparties, or arbitrator recommendations, using records in the PLS WoT namespace.
Those relationships would describe the app’s reputation and dispute-resolution context, separate from general social follows and pubky.app social records.
This is a possible extension, not a current commitment; it would still need an initial set of known users or an index that supports PLS WoT records for discovery.

The feed is scoped to known followed users and does not claim to be a global search across all Pubky users.
The app will use bounded batches, pagination, timeouts, retries with backoff, deduplication, and a local cache to manage latency and Homeserver limits.
Unavailable Homeservers or incomplete Nexus follow results can result in a partial feed.

The interface should show that results may be incomplete when reads fail or discovery is unavailable.

## Graph screen

The graph is assembled from the signed-in user’s records or from a selected target user’s records.
The app fetches the relevant rating records for the selected identity and then reads records for the discovered rating targets as needed.
Graph traversal will have explicit depth, node, and request limits so that a large or highly connected graph cannot trigger unbounded reads.

The graph view is derived from records returned by Homeservers and should preserve each rating’s author, target, timestamp, and source URI.
Missing or unreachable records must be treated as unavailable data, not as evidence that no rating exists.

## Communication choices

Publishing a new rating uses ordinary authenticated HTTP storage requests through the Pubky SDK.
The SDK handles identity authentication, Homeserver discovery, and transport for the write.
The ratings table and graph screens will subscribe to SSE event streams for the relevant known users and rating paths to refresh data as records change.

SSE is a near-real-time update signal; when an event arrives, the app fetches or refreshes the affected public record and updates its local cache.
The app also uses ordinary HTTP requests for initial reads, pagination, record retrieval, and follow discovery.
Subscriptions are limited to the users and Homeservers relevant to the current view, and are closed when the screen or app lifecycle no longer needs them.

Reconnects and missed events require refreshing from the Homeserver or the local pagination cursor so the client can recover after offline periods.
The exact event-stream API and lifecycle support must be confirmed against the React Native Pubky SDK version used by this Expo app before implementation.

## Reliability and tradeoffs

This design avoids custom protocol infrastructure and lets users keep using their chosen Homeservers.
The project could operate a standard Pubky Homeserver as an optional host, especially to give users without an existing provider an easy starting choice.
This remains a product option under consideration, not a promised app feature.

It replaces global search with direct reads from a bounded, known set of users.
It depends on Homeserver availability, PKARR discovery, the SDK’s mobile networking behavior, and the user’s follow records being readable.
Client-side fan-out can increase load time and request count as the follow list grows.

Pagination, batching, caching, bounded graph traversal, and clear partial-result states are required for a usable first version.
Pubky’s public data is public to readers; ratings and rating targets should be designed with that visibility in mind.

## References

- [Pubky Homeserver](https://pubky.org/homeserver/)
- [Pubky SDK documentation](https://pubky.org/explore/pubkycore/sdk/)
- [Pubky app data specifications](https://pubky.org/explore/pubky-apps/app-specs/)
- [Pubky app architectures](https://pubky.org/explore/pubky-apps/app-architectures/introduction/)
- [Pubky indexing and aggregation](https://pubky.org/explore/pubky-apps/indexing-and-aggregation/introduction/)
- [Pubky Nexus](https://pubky.org/pubky-nexus/)
