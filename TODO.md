Excellent. Thank you for the context. I've analyzed your orchestrator.ts file and it's the perfect starting point. You've correctly identified the tight
coupling—the "chain" of new Layer(..., new Layer(...)) is exactly the problem the Mediator pattern solves.

You have a clear vision, and my role is to provide the roadmap. We will use TDD to transform this Orchestrator into a true NetworkStack mediator. We will
focus on the handleIncoming logic first.

Here is your high-level, step-by-step TDD plan.

Step 1: Forge the NetworkStack and Its Core Logic

We'll start by building the mediator itself. The goal is to create a class that knows about all the layers and can route packets between them.

Your TDD Plan:

1.  Test 1 (Layer Registration): A stack needs to know what layers it's managing.
    - Write this test first: Create a test file for your NetworkStack. In it, test that your NetworkStack has a registerLayer method. In the test, create
      a mock layer, register it, and then assert that the stack is now aware of it (e.g., a private property in the stack now contains the mock layer).

2.  Test 2 (Incoming Routing): This is the mediator's primary job. It must direct a packet "up" the stack.
    - Write this test next: Create a test for a method like routeIncoming(packet). In this test:
      1.  Create mock instances of the DataLinkLayer and the NetworkLayer.
      2.  Register both mocks with your NetworkStack.
      3.  Create a mock packet and set its metadata.currentLayer to DATA_LINK_2.
      4.  Call networkStack.routeIncoming(packet).
      5.  Assert that handleIncoming was called on your mock NetworkLayer, and not on the DataLinkLayer. This proves your routing logic is working correctly.

---

Step 2: Decouple Your First Layer (DataLinkLayer)

Now we'll refactor a single layer to talk to the mediator instead of another layer.

Your TDD Plan:

1.  Test 1 (Constructor Refactor): The layer must depend on the NetworkStack.
    - Go to dataLinkLayer.test.ts: Modify the test for creating a DataLinkLayer. Change its constructor so it no longer accepts nextLayer. Instead, it
      must accept an instance of your NetworkStack. The test should now pass a mock NetworkStack to the constructor.

2.  Test 2 (Behavior Refactor): The layer must hand off the packet to the stack.
    - Write this test next: In a test for the "success" scenario of handleIncoming (e.g., the MAC address matches), the final assertion will change.
      Instead of asserting that nextLayer.handleIncoming was called, you will now assert that networkStack.routeIncoming was called. You'll write this
      test, watch it fail, and then implement the change in your DataLinkLayer's handleIncoming method to make it pass.

---

Step 3: Repeat, Integrate, and Conquer

Once you have one layer refactored, the rest will follow the same pattern.

1.  Repeat Step 2 for all other layers (NetworkLayer, TransportLayer, etc.). For each one, use TDD to change its constructor and its handleIncoming logic
    to communicate with the NetworkStack.

2.  Write the Full Integration Test:
    - Goal: Prove the entire decapsulation flow works through the mediator.
    - Action: In a high-level test file:
      1.  Create a real NetworkStack instance.
      2.  Create real instances of all your layers and register them with the stack.
      3.  Create a Packet that is fully encapsulated (has headers for all layers).
      4.  Kick off the process: networkStack.routeIncoming(packet).
      5.  Assert that the handleIncoming method of your ApplicationLayer was eventually called with the final, pure payload.

This plan provides a safe, iterative path to your desired architecture. You will build and test the mediator, then connect each layer to it one by one,
ensuring everything works at each stage.

Let's begin. How would you like to start writing your very first test for the NetworkStack's registerLayer method?
