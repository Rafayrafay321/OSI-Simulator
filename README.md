# 🌐 OSI Packet Simulator

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)

> A comprehensive, full-stack network simulation tool designed to visualize and demystify the journey of data through the OSI Model layers.

---

## ✨ Overview

The **OSI Packet Simulator** provides a deep-dive into networking fundamentals. It simulates a multi-hop transmission (Host A → Router → Host B), breaking down every step of the encapsulation and decapsulation process across Layers 1, 2, 3, 4, and 7.

Whether you're a student learning networking or a developer curious about what happens "under the hood" of a socket, this tool brings the abstract OSI model to life with real-time logs and interactive visualizations.

## 🚀 Key Features

- **🛡️ Full Layered Architecture**: Complete implementation of Layers 1 (Physical) through 7 (Application).
- **📦 Realistic Encapsulation**: Watch packets get wrapped in headers (TCP/UDP, IP, Ethernet) and fragmented based on MTU.
- **🔍 Deep Inspection**: View detailed logs of ARP cache lookups, MAC handoffs, and checksum validations.
- **🛣️ Intelligent Routing**: Simulates Router logic with Default Gateway checks and Layer 3 forwarding.
- **📊 Live Visualization**: A modern React 19 dashboard with synchronized animations and log streaming.
- **🧪 Robust Logic**: Handles segmentation, reassembly, and "transmission" delays asynchronously.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4 (Modern, utility-first)
- **Validation**: Zod & React Hook Form
- **Icons**: Custom SVG system

### Backend
- **Runtime**: Node.js & TypeScript
- **Framework**: Express.js
- **Testing**: Jest (Unit testing for every layer)
- **Architecture**: Pure Object-Oriented (NetworkNode, Host, Router classes)

## 🏗️ How It Works

The simulator follows a strict OOP approach to model network behavior:

```mermaid
graph TD
    subgraph "Host A (Source)"
        L7A[Layer 7: Application] --> L4A[Layer 4: Transport]
        L4A --> L3A[Layer 3: Network]
        L3A --> L2A[Layer 2: Data Link]
        L2A --> L1A[Layer 1: Physical]
    end

    L1A -- "Raw Data" --> R1[Router]

    subgraph "Router"
        RL1[Layer 1] --> RL2[Layer 2]
        RL2 --> RL3[Layer 3: IP Routing]
        RL3 --> RL2_out[Layer 2: New Handoff]
        RL2_out --> RL1_out[Layer 1]
    end

    RL1_out -- "Raw Data" --> L1B[Host B (Destination)]

    subgraph "Host B (Target)"
        L1B --> L2B
        L2B --> L3B
        L3B --> L4B
        L4B --> L7B[Layer 7: Data Received]
    end
```

## 🚥 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/osi-packet-simulator.git
   cd osi-packet-simulator
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the App:**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📅 Roadmap

- [ ] **Phase 1**: "Wireshark" style packet inspection (Deep header snapshots).
- [ ] **Phase 2**: Network Chaos (Latency simulation, TTL expiration, and Bit-flipping).
- [ ] **Phase 3**: Dynamic Topology Builder (Drag-and-drop network design).
- [ ] **Phase 4**: Real-time WebSockets for log streaming.

## 📝 License

This project is licensed under the **ISC License**.

---

Built with ❤️ for the networking community using **Gemini CLI**.
