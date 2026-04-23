# The Deep Packet Journey: OSI Packet Simulator

This document outlines the complete, step-by-step lifecycle of a packet as it traverses the OSI model, triggering a stateful ARP handshake, and finally being delivered to its destination.

## Phase 1: Origination (Host A)
1. **Application Layer (Layer 7):** The user triggers the simulation with a payload (e.g., "Hello from Host A!"). The `ApplicationLayer` attaches an HTTP header and passes the packet down the stack.
2. **Transport Layer (Layer 4):** The `TransportLayer` adds a TCP header specifying the source and destination ports.
3. **Network Layer (Layer 3):** The `NetworkLayer` adds an IP header with `srcIp` (192.168.1.10) and `destIp` (192.168.1.20).
4. **Data Link Layer (Layer 2) - The Intercept:** The `DataLinkLayer` attempts to attach the MAC address. It checks its `arpTable` for `192.168.1.20`. Finding nothing, it:
   - Buffers the original packet in its internal `packetBuffer`.
   - Generates a new **ARP Request** packet with the payload `"Any one has this ip: 192.168.1.20"`.
   - Attaches a Layer 2 header with a broadcast destination MAC (`FF:FF:FF:FF:FF:FF`).
5. **Physical Layer (Layer 1):** Converts the ARP Request into a signal and transmits it across all connected physical cables (to the Switch).

## Phase 2: The Broadcast (Switch 1)
1. **Physical Layer (Layer 1):** The Switch receives the physical signal from Host A.
2. **Data Link Layer (Layer 2) - MAC Learning:** The Switch inspects the Layer 2 headers. It extracts Host A's source MAC and binds it to the incoming port in its `macTable`.
3. **Flooding:** The Switch sees the destination MAC is a broadcast (`FF:FF:FF:FF:FF:FF`). It bypasses upward routing, immediately cloning the packet and transmitting it out of all other active ports (towards Host B).

## Phase 3: The Discovery (Host B)
1. **Physical Layer (Layer 1):** Host B receives the broadcast signal and passes it up.
2. **Data Link Layer (Layer 2) - The Match:** Host B inspects the packet. The payload begins with `"Any one has this ip:"`. It extracts the requested IP and compares it to its own. It's a match!
3. **The Reply:** Host B generates a new **ARP Reply** packet with the payload `"I have this IP: 192.168.1.20, My MAC is: BB:BB:BB:BB:BB:BB"`. It addresses the packet directly to Host A's MAC address and bypasses the upper layers, pushing it directly back down to the Physical Layer using `routeOutgoing`.

## Phase 4: The Unicast (Switch 1)
1. **Data Link Layer (Layer 2):** The Switch receives the ARP Reply from Host B. It learns Host B's MAC address and adds it to its `macTable`.
2. **Targeted Forwarding:** The Switch reads the destination MAC (Host A's MAC). Because it already learned Host A's port during Phase 2, it does not broadcast. It transmits the packet directly to Host A.

## Phase 5: The Buffer Flush (Host A)
1. **Data Link Layer (Layer 2) - The Resolution:** Host A receives the ARP Reply. It parses the payload, extracts Host B's MAC address, and adds it to its `arpTable`.
2. **The Flush:** Host A checks its `packetBuffer` and finds the original paused data packet. It pulls it out, attaches the final Data Link header (now containing Host B's MAC address), calculates the checksum, and pushes it directly down to the Physical Layer.
3. **Cleanup:** Host A deletes the packet from the buffer to free up memory.

## Phase 6: Final Delivery (Host B)
1. **Data Link Layer (Layer 2):** Switch 1 receives the data packet and forwards it directly to Host B.
2. **De-encapsulation:** Host B's `DataLinkLayer` verifies the checksum and MAC address. It removes the Layer 2 header and passes the packet UP the stack.
3. **Upper Layers (Layers 3, 4, 7):** The Network, Transport, and Application layers each strip their respective headers, validating protocols and ports.
4. **Completion:** The final raw payload ("Hello from Host A! Testing the API!") is successfully extracted, and the simulation completes, returning the payload and logs to the frontend via the Orchestrator!
