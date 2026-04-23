# 🌐 OSI Packet Simulator

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A high-fidelity, full-stack network simulation environment designed to model, visualize, and analyze the encapsulation and transmission of data across the OSI (Open Systems Interconnection) reference model.

---

## 📖 Introduction

The **OSI Packet Simulator** is an educational and technical tool that implements a functional network stack from the ground up. It provides a granular view of how data is transformed from a high-level application JSON object into raw physical bits, routed through intermediate nodes (Routers), and reassembled at a destination host.

This project bridges the gap between theoretical networking concepts and practical implementation, offering a "Wireshark-like" visibility into the automated processes of modern networking.

## 🚀 Key Technical Capabilities

### 🛡️ Layered Stack Implementation
- **L7 (Application)**: JSON serialization, payload validation, and protocol simulation.
- **L4 (Transport)**: TCP/UDP-style segmentation, sequence numbering, and checksum calculation.
- **L3 (Network)**: IP addressing, MTU-based fragmentation, and TTL (Time-To-Live) management.
- **L2 (Data Link)**: Stateful ARP (Address Resolution Protocol) cache, automatic packet buffering during handshakes, and Ethernet framing.
- **L1 (Physical)**: Bit-stream conversion, asynchronous transmission simulation, and physical medium broadcasts.

### 🛣️ Advanced Routing & Orchestration
- **Intelligent Routing**: Routers utilize Layer 3 logic to determine next-hop interfaces.
- **L2 Switch Forwarding**: Switches dynamically learn MAC addresses and perform targeted Unicast forwarding or Broadcast flooding.
- **Multi-Hop Topologies**: Full support for complex, dynamic topologies defined via Graph structures (Nodes & Edges).

### 📊 Modern Observability
- **WebSocket Real-Time Streaming**: Live, granular event tracking of every packet modification across nodes.
- **Synchronized Visuals**: Dashboard providing immediate feedback on simulation status and deep packet inspection via JSON snapshots.
- **Schema Validation**: Robust data integrity ensured via Zod-powered simulation parameters.

## 🏗️ System Architecture

The project utilizes a strict Object-Oriented Design (OOD) to mirror real-world hardware components:

```mermaid
graph TD
    subgraph "Host A (192.168.1.2)"
        L7A[Application Layer] --> L4A[Transport Layer]
        L4A --> L3A[Network Layer]
        L3A --> L2A[Data Link Layer]
        L2A --> L1A[Physical Layer]
    end

    L1A -- "Ethernet Frame" --> SW1[Switch]

    subgraph "Switch (L2 Forwarding)"
        SL1[L1: Physical] --> SL2[L2: MAC Learning]
        SL2 --> SL1_out[L1: Unicast/Broadcast]
    end

    SL1_out -- "Ethernet Frame" --> L1B[Host B (192.168.1.20)]

    subgraph "Host B (Destination)"
        L1B --> L2B
        L2B --> L3B
        L3B --> L4B
        L4B --> L7B[Data Reassembled]
    end
```

### Class Hierarchy
- **`NetworkNode`**: Base class providing core L1-L3 functionality and dynamic orchestration hooks.
- **`Host`**: Extends `NetworkNode` with L4-L7 capabilities for end-system simulation.
- **`Router`**: Specialized node optimized for L3 packet switching and multi-interface management.
- **`Switch`**: Specialized node optimized for L2 MAC learning and Unicast/Broadcast forwarding.

## 🛠️ Project Structure

```text
├── backend/            # Express.js & TypeScript Simulation Engine
│   ├── src/core/       # OOP Base Classes (Host, Router, Packet)
│   ├── src/layers/     # Individual OSI Layer Logic (1-7)
│   └── __tests__/      # Comprehensive Jest Unit Tests
├── frontend/           # React 19 & Tailwind CSS v4 Dashboard
│   ├── src/components/ # Modular UI Components (LogItem, NetworkMap)
│   └── src/schemas/    # Zod Validation Schemas
└── docs/               # Technical Documentation & Diagrams
```

## 🚥 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Installation
Clone the repository and install dependencies for both services:

```bash
# Clone
git clone https://github.com/your-username/osi-packet-simulator.git
cd osi-packet-simulator

# Install Backend
cd backend && npm install && cd ..

# Install Frontend
cd frontend && npm install && cd ..
```

### 2. Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=3001
NODE_ENV=development
```

### 3. Execution
Run both services in separate terminals:

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

Visit `http://localhost:5173` to start simulating.

## 🧪 Quality Assurance

The backend is covered by a suite of unit tests verifying layer-to-layer communication and edge-case handling (e.g., fragmentation, checksum failure).

```bash
cd backend
npm test
```

## 📅 Roadmap

- **Q2 2026**: ~~Implementation of "Wireshark" deep-packet inspection (Header snapshots).~~ (Completed ✅)
- **Q3 2026**: ~~Interactive Topology Builder (Graph-based orchestration).~~ (Completed ✅)
- **Q4 2026**: Network Chaos Engine (Variable latency, jitter, and packet drop simulation UI integration).

## 📝 License

Distributed under the **ISC License**. See `LICENSE` for more information.

---

*Part of a research initiative into visual networking education. Powered by **Gemini CLI**.*
