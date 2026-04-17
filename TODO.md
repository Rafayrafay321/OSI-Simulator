# OSI Packet Simulator - Enterprise Upgrade TODO

## 1. Real-Time Telemetry via WebSockets (Streaming Simulation)
- [x] Install and configure Socket.io or WS in the Express backend.
- [x] Refactor internal components (Logger/NetworkStack) to use a Node.js `EventEmitter`.
- [x] Broadcast packet transitions in real-time as they happen.
- [x] Update frontend to consume WebSocket streams instead of waiting for a single REST response.

## 2. Dynamic, Stateful Network Topologies (Graph Structures)
- [ ] Introduce a Topology Manager in the core engine.
- [ ] Allow dynamic creation of nodes (Hosts, Switches, Routers, Firewalls) via API.
- [ ] Persist topologies using an in-memory datastore (e.g., Redis) or Graph database (e.g., Neo4j).

## 3. Worker Threads & Message Queuing for High-Concurrency
- [ ] Implement BullMQ (Redis) or RabbitMQ for queueing simulation requests.
- [ ] Offload heavy `NetworkStack` computations to Node.js Worker Threads.
- [ ] Ensure the Express main event loop remains unblocked during heavy loads.

## 4. Advanced Protocol Simulation (NAT, Firewalls & SPI)
- [ ] Implement Stateful Packet Inspection (SPI) in a new `Firewall` core component.
- [ ] Implement Network Address Translation (NAT) inside the `Router` model.
- [ ] Simulate actual UDP/TCP Handshakes and basic DNS resolution steps before data transmission.

## 5. PCAP Generation & "Time-Travel" Event Sourcing
- [ ] Store every simulation event in an event-sourced database (PostgreSQL/MongoDB).
- [ ] Create an API to query and "replay" past simulations step-by-step.
- [ ] Implement a utility to export simulation events into standard `.pcap` files for Wireshark analysis.
