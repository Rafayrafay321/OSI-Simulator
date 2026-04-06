# OSI Packet Simulator - Project Status & Roadmap

A full-stack network simulation tool built to visualize data flow through the OSI model layers.

## 🚀 Core Features
- [x] **Layered Architecture**: Complete implementation of Layers 1, 2, 3, 4, and 7.
- [x] **Functional Logic**:
    - [x] Application: JSON serialization/validation.
    - [x] Transport: Segmentation, reassembly, and checksum validation.
    - [x] Network: MTU-based fragmentation and IP routing.
    - [x] Data Link: ARP cache lookups and MAC addressing.
    - [x] Physical: Raw data transmission simulation.
- [x] **Dual-Host Orchestration**: Simulated communication between two hosts (Host A & Host B).
- [x] **Asynchronous Simulation**: Promise-based simulation to handle "transmission" delays.
- [x] **REST API**: Express.js backend with configurable simulation parameters.
- [x] **React Frontend**: Modern Tailwind CSS v4 UI with live log visualization.

## 🛠️ Tech Stack
- **Backend**: Node.js, TypeScript, Express, Jest (Testing).
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS v4, PostCSS.
- **Tools**: Gemini CLI, npm.

## 📝 Recent Bug Fixes & Improvements
- [x] Fixed `NetworkStack` recursion to process all layers sequentially.
- [x] Resolved `PhysicalLayer` handleIncoming payload assignment.
- [x] Fixed `TransportLayer` checksum mismatch (Segment vs. Full Packet).
- [x] Standardized `BasePacket.metadata` initialization in tests.
- [x] Refactored `removeHeader` to an argument-less signature.
- [x] Migrated Frontend to Tailwind v4 with `@tailwindcss/postcss`.

## 📅 Roadmap / Next Steps
- [ ] **Frontend Polish**: Add framer-motion animations for packet movement.
- [ ] **Simulation Features**:
    - [ ] Implement Packet Loss simulation (Random drop %).
    - [ ] Add a "Router" node between Host A and Host B.
    - [ ] Add TTL (Time To Live) expiration logic.
- [ ] **UI Enhancements**:
    - [ ] Export logs as JSON/Text files.
    - [ ] Interactive "Packet Inspector" to see headers at each layer.
- [ ] **Infrastructure**:
    - [ ] Add Dockerfile for easy deployment.
    - [ ] Implement E2E testing with Playwright/Cypress.
