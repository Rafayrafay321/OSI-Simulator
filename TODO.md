# OSI Packet Simulator - Project Roadmap

This document outlines the next steps to enhance this project, turning it into a comprehensive portfolio piece. The tasks are designed to be high-level to guide your learning.

---

### Phase 1: Testing and Validation (Highest Priority)

**Goal:** Prove your code is reliable and works as expected by implementing a professional testing suite. This is a critical skill for any software developer.

**Task:** Set up the Jest testing framework and write unit tests for each layer.

**Hints:**

- **Setup:**
  - Install Jest, `ts-jest` (for TypeScript support), and `@types/jest`.
  - Create a `jest.config.js` file in the `backend` directory. `ts-jest` can help generate a basic configuration.
  - Consider adding a `test` script to your `package.json`: `"test": "jest"`.
- **Writing Tests:**
  - Create a `__tests__` directory inside `backend/src`.
  - Start with a simple test file, like `applicationLayer.test.ts`.
  - In your tests, you'll need to "mock" dependencies. For example, when testing `ApplicationLayer`, you don't need a real `TransportLayer`. Use `jest.fn()` to create mock functions for the `logger` and the `nextLayer`.
  - Your test should check things like: "When `handleOutgoing` is called, is the payload correctly set on the packet?" and "Was the `nextLayer`'s `handleOutgoing` method called exactly once?".

---

### Phase 2: Completing the Simulation Loop

**Goal:** Implement the "incoming" packet flow to create a full, two-way simulation. This demonstrates your ability to think through a complete data lifecycle.

**Task:** Implement the `handleIncoming` method for each layer, starting from the bottom (`PhysicalLayer`) and moving up.

**Hints:**

- **Reverse Flow:** The `handleIncoming` method should do the reverse of `handleOutgoing`.
- **Header Processing:** Each layer should be responsible for reading and validating its own header from the packet.
- **Passing the Packet Up:** After a layer processes its header, it should "unwrap" it and pass the rest of the packet up to the next layer in the stack.
- **Reassembly:**
  - **Network Layer:** If a packet was fragmented, how will you collect all the fragments and reassemble them in the correct order before passing the complete data to the `TransportLayer`?
  - **Transport Layer:** Similarly, how will you reassemble segments of data?

---

### Phase 3: Enhancing Realism

**Goal:** Add features that make your simulation behave more like a real network. This shows a deeper understanding of networking concepts.

**Task:** Implement more dynamic and realistic network behaviors.

**Hints:**

- **Simulate ARP Requests:** Instead of a pre-populated ARP cache in the `DataLinkLayer`, what if a MAC address is missing? You could have the layer "broadcast" a request, which the `Orchestrator` could intercept and "reply" to.
- **Implement Routing Logic:** Use the `routingTable` in your `NetworkLayer`. When a packet arrives, the layer should look at the destination IP and use the routing table to decide which `nextLayer` to send it to. What should happen if there's no route?
- **Simulate Packet Corruption:** In the `PhysicalLayer`, introduce a small probability that a byte in the packet's payload gets flipped. Then, in the `DataLinkLayer`'s `handleIncoming` method, re-calculate the checksum and compare it to the one in the header to see if you can detect the error.

---

### Phase 4: Professional Polish

**Goal:** Make your project easy for others (like hiring managers) to understand, run, and evaluate.

**Task:** Improve the project's tooling and documentation.

**Hints:**

- **`package.json` Scripts:**
  - Add a `build` script that uses the TypeScript compiler (`tsc`) to output JavaScript files to a `dist` directory.
  - Add a `start` script that uses `node` to run the compiled output from your `build` script.
- **`README.md`:**
  - Write a compelling project description. What is the goal of this simulator?
  - Add a "Features" section that lists what you've implemented (e.g., "Layered Architecture", "Packet Fragmentation", "Unit Testing").
  - Include clear "How to Run" instructions that tell a user to `npm install`, `npm run build`, and `npm start`. Don't forget `npm test`!
    .
