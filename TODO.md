High-Level Future Step

Implement the de-encapsulation and reassembly logic in the handleIncoming method of each layer.

This involves:

- Physical/DataLink Layers: Verifying checksums and MAC addresses.
- Network Layer: Reassembling fragmented packets.
- Transport Layer: Reassembling segmented data into a coherent stream.
- Application Layer: Reading the final headers and payload.
