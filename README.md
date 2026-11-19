# PLS WoT

**PLS WoT (Private Law Society Web of Trust)** is a mobile application for decentralized reputation among pseudonymous people. It helps users evaluate potential counterparties and arbitrators through signed ratings and recommendations, supporting informed decisions about private agreements.

## The problem and values

PLS is a voluntary, decentralized vision for private agreements and dispute resolution. Its manifesto argues that people should be able to choose the rules they agree to, with cryptography, incentives, reputation, and agreed collateral supporting those commitments instead of reliance on a central authority. PLS WoT addresses one part of that vision: in a pseudonymous environment, people need a way to assess the reliability of counterparties and the competence of arbitrators.

The project emphasizes individual sovereignty, property rights, privacy, pseudonymity, and voluntary association. Participants use cryptographic identities rather than relying on government-issued identities. These values describe the project's aims; the app itself provides reputation data and does not guarantee that an agreement will be fulfilled or a dispute resolved.

## Principles

PLS WoT is guided by these product principles:

- **Voluntary participation:** Joining, evaluating others, and forming trust relationships are opt-in choices.
- **Individual sovereignty:** Each person controls their own statements and chooses which criteria, sources, and connections to consider.
- **Subjective, relational trust:** A key evaluates another identity; the system does not declare an absolute reputation.
- **Careful transitivity:** Trust may extend through a network (if A trusts B, A may consider B's view of C), with distance-based decay and a clear explanation of how the signal was derived.
- **Direct experience matters:** Evaluations distinguish completed business from other opinions.
- **Different roles, different reputations:** Reputation as a contracting party and reputation as an arbitrator are separate dimensions.
- **Transparency and verifiability:** Evaluations and calculations should have auditable authorship, dates, history, and sources.
- **Human judgment:** Rankings and scores can support decisions, but do not replace individual assessment.
- **Accountability:** Keeping agreements, acting in good faith, and demonstrating competence should build reputation; documented violations may harm it.
- **Resistance to Sybil attacks:** Creating more accounts should not automatically create more reputation. Network distance, persistence, diversity, and connection to a person's trusted network matter.
- **Privacy and pseudonymity:** Collect only what is needed and avoid inferring civil identity. In this MVP, an X account is used only as the reference identity.
- **Honest about centralization:** The MVP is centralized. It does not claim to already provide the decentralized, censorship-resistant architecture described in the manifesto.
- **Open evolution:** Significant changes should be public, traceable, and adopted voluntarily, taking inspiration from the manifesto's PLIP process.

PLS WoT is not intended to become:

- A universal ranking of human worth or a social credit score.
- A context-free public list of enemies or “untrustworthy” people.
- A tool for harassment, exposure, or coordinated action against individuals.
- A complete mirror of X or a product built on indiscriminate data collection.
- An opaque algorithm that participants cannot understand.
- A promise of absolute security or truth.

## How the Web of Trust works

In a Web of Trust (WoT), keys evaluate keys. A participant signs an evaluation of another pseudonymous identity, creating a public, auditable record and a network of trust relationships. Evaluations can record whether the rater's judgment is positive or negative, whether they have done business with the evaluated party, and an optional written explanation.

Each user can interpret the network using personal criteria, such as the number and weight of recommendations, how far a recommendation is from their own trusted contacts, or the recency and context of past evaluations. Trust may extend through connections, but remains subjective: one person's confidence in another does not prove that a third party is trustworthy.

The WoT has two intended roles:

- **Reputation of parties:** A track record of completed agreements, positive or negative evaluations, and dispute outcomes can help people decide whom to work with and what safeguards, such as collateral, they may require.
- **Reputation of arbitrators:** Evaluations can help parties find arbitrators viewed as fair, knowledgeable, and effective, including people with experience in particular kinds of agreements.

The WoT can therefore help people make more informed choices before entering a private contract and when selecting an arbitrator. It supplies information and possible reputation indicators; it does not replace the user's judgment or guarantee a contract's outcome.

## Technical direction

The manifesto describes the original WoT design as using Nostr to publish signed evaluations across relays. PLS WoT is now migrating its backend from Nostr to the Pubky approach. The project found Nostr's relay behavior, data format conventions, and NIP constraints difficult for its needs. In particular, relay operators may prune data, JSON event definitions can be inconsistent across implementations, and protocol limitations can constrain the product's data model.

The project is moving toward Pubky to better fit its decentralized data model and reduce reliance on Nostr relays. Both approaches use secp256k1 public/private key cryptography, which is intended to make it possible to continue using Nostr keys. Newly created keys may also support a 24-word backup phrase. Key migration and backup behavior are still part of the ongoing work; users should follow the instructions shown by the app and keep their own secure backups.

This is an active migration, so the implementation and supported flows may change as the project develops.

## Project status

PLS WoT is beta software. Features, data handling, and security may change, and bugs or other issues may occur. Please report issues through this project's GitHub repository or its Discord channels.

## Disclaimer

- **Your data:** PLS WoT does not control users' data. Data may be stored or handled by decentralized services and other infrastructure outside the project's control; availability and retention can depend on those services.
- **Your keys:** We cannot recover private keys if they are lost or compromised. You are responsible for keeping your private keys and any recovery phrase secure, and for maintaining your own backups. Never share a private key or recovery phrase with anyone.
- **Beta software:** This software is provided in beta and may contain bugs, security issues, or other problems. Please contact the project through its GitHub repository or Discord channels to report an issue.

## Development

### Documentation

- [Networking and data discovery](docs/network.md): Pubky Homeservers, Nexus scope, the client-only ratings feed and graph strategy, SSE updates, and HTTP publishing decisions.

This application is built with Expo and React Native, with Expo Router for navigation.

Install dependencies and start the development server:

```bash
npm install
npx expo start
```

Use the Expo CLI prompts to open the app on a device, emulator, or web browser.
