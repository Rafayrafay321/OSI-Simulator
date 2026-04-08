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
- [x] **Object-Oriented Node Model**:
    - [x] `NetworkNode` base class for shared L1-L3 logic.
    - [x] `Host` subclass for end-system L4-L7 logic.
    - [x] `Router` subclass for L3 forwarding logic.
- [x] **Multi-Hop Simulation**: Successful `Host A -> Router -> Host B` transmission chain.
- [x] **Default Gateway Logic**: Realistic Layer 2 MAC handoff using gateway IPs.
- [x] **Asynchronous Simulation**: Promise-based simulation to handle "transmission" delays.
- [x] **REST API**: Express.js backend with configurable simulation parameters.
- [x] **React Frontend**: Modern Tailwind CSS v4 UI with live log visualization, Zod schema validation, and synchronized animations.

## 🛠️ Tech Stack
- **Backend**: Node.js, TypeScript, Express, Jest (Testing).
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS v4, PostCSS, Zod, React Hook Form.
- **Tools**: Gemini CLI, npm.

## 📝 Recent Bug Fixes & Improvements
- [x] Fixed `NetworkStack` recursion to process all layers sequentially.
- [x] Resolved `PhysicalLayer` handleIncoming payload assignment.
- [x] Fixed `TransportLayer` checksum mismatch (Segment vs. Full Packet).
- [x] Refactored logic into a proper Class-based hierarchy (`NetworkNode`, `Host`, `Router`).
- [x] Implemented `defaultGateway` check in `DataLinkLayer` for off-network routing.
- [x] Fixed "Hanging Promise" bug by adding `onDataDropped` hooks.
- [x] *Note*: Acknowledged the `127.0.0.1` loopback behavior (stick to standard local IPs like `192.168.x.x` for the simulator).

## 📅 Roadmap / Next Steps

### Phase 1: Deep Inspection (The "Wireshark" Experience)
- [ ] **Backend Enhancements**:
    - [ ] Update `LogEntry` interface to accept an optional `packetSnapshot` object.
    - [ ] Capture the current packet headers (e.g., `packet.getHeader()`) at critical log points.
- [ ] **Frontend Interactive Logs**:
    - [ ] Add `selectedLog` state in React.
    - [ ] Make `LogItem` components clickable.
    - [ ] Build a Details Panel/Modal to render the `packetSnapshot` as formatted JSON.

### Phase 2: Network Realism & Chaos
- [ ] **TTL (Time To Live)**: Implement TTL expiration drops at the Network layer.
- [ ] **Network Latency**: Simulate variable delays (`setTimeout`) per hop.
- [ ] **Corrupted Packets**: Add random payload bit-flipping to test checksum validation dynamically.

### Phase 3: Dynamic Topology Builder (Advanced)
- [ ] **Visual Builder**: Implement a Drag-and-Drop interface (e.g., using React Flow) to let users draw their own node connections.
- [ ] **Dynamic Orchestration**: Refactor the backend to instantiate the `Orchestrator` based on an arbitrary JSON topology map rather than a hardcoded `Host -> Router -> Host` chain.
- [ ] **Multiple Interfaces**: Update the `Router` class to support multiple physical interfaces and a proper Routing Table.

### Infrastructure & QA
- [ ] **WebSockets**: Replace REST polling with real-time socket streams for live logs.
- [ ] **E2E Testing**: Implement Playwright/Cypress tests for the full simulation flow.
- [ ] **Dockerization**: Create a Dockerfile for seamless deployment.
