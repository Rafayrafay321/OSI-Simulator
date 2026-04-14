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

### 🌐 Phase 5: The Landing Page (ACTIVE)
- [ ] **Design System Extension**: Establish color, typography, and spacing tailored for an engaging landing page.
- [ ] **Hero Section**: Strong value proposition, animated networking visual, and a Call to Action (CTA) leading to the Simulator.
- [ ] **Features Section**: Highlight deep inspection, physical node emulation, and chaos engineering.
- [ ] **Technical Architecture Section**: Display the AWS/Vercel/Node/React stack diagram.
- [ ] **Responsive Navigation & Footer**: Setup routing (Home vs. Simulator).

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

### 🚀 Production Deployment Plan (Zero-Cost AWS Architecture) - [COMPLETED]

**Architecture Blueprint:**
- **Code Repository & CI/CD:** GitHub + GitHub Actions (Free)
- **Frontend Hosting (CDN):** AWS Amplify or Vercel (Free Tier)
- **Backend Hosting (Compute):** AWS EC2 `t2.micro` or `t3.micro` (Free Tier - 750 hrs/month)
- **Process Management:** PM2 (Open Source)
- **Reverse Proxy & SSL:** NGINX + Let's Encrypt / Certbot (Free)
- **DNS Management:** Cloudflare or GitHub Student Developer Pack Domain.

**Execution Phases:**
- [x] **Phase 1: Foundation & Safety**
    - [x] Push codebase to a private GitHub repository.
    - [x] Create an AWS account (or use AWS Educate/Academy).
    - [x] **CRITICAL:** Set up an AWS Billing Alarm (Zero Spend Budget) to prevent accidental charges.
- [x] **Phase 2: Backend Server Setup**
    - [x] Launch an Ubuntu EC2 instance (`t2.micro`, Free Tier eligible).
    - [x] Configure Security Groups (Allow SSH:22 from own IP, HTTP:80, HTTPS:443).
    - [x] SSH into the server, install Node.js via `nvm`, and clone the repository.
    - [x] Build the TypeScript backend and start the process using `pm2`.
- [x] **Phase 3: Reverse Proxy & Security**
    - [x] Install and configure NGINX to reverse proxy port 80 traffic to `localhost:3001`.
    - [x] (Optional) Point a custom student domain to the EC2 Public IP.
    - [x] Install Certbot and generate a free SSL certificate for HTTPS.
- [x] **Phase 4: Frontend CDN Deployment**
    - [x] Update frontend API calls to use environment variables (`import.meta.env.VITE_API_URL`).
    - [x] Connect the GitHub repository to AWS Amplify (or Vercel).
    - [x] Configure build settings and set production environment variables.
    - [x] Trigger the initial automated deployment.

### 🌐 Phase 5: The Landing Page (Current Objective)
- [ ] **Design System Extension**: Establish color, typography, and spacing tailored for an engaging landing page.
- [ ] **Hero Section**: Strong value proposition, animated networking visual, and a Call to Action (CTA) leading to the Simulator.
- [ ] **Features Section**: Highlight deep inspection, physical node emulation, and chaos engineering.
- [ ] **Technical Architecture Section**: Display the AWS/Vercel/Node/React stack diagram.
- [ ] **Responsive Navigation & Footer**: Setup routing (Home vs. Simulator).

### Infrastructure & QA
- [ ] **WebSockets**: Replace REST polling with real-time socket streams for live logs.
- [ ] **E2E Testing**: Implement Playwright/Cypress tests for the full simulation flow.
- [ ] **Dockerization**: Create a Dockerfile for seamless deployment.
