 1. Implement a Simulated ARP Cache for MAC Address Resolution

  Your layer currently uses a hardcoded destination MAC address. An industry-standard layer would use a protocol like ARP (Address Resolution Protocol) to
  discover the MAC address dynamically. We can simulate this.


   * Action: Centralize MAC Address Mappings
       * In `src/core/orchestrator.ts`: Create a "master" registry that maps the IP addresses of your hosts to their MAC addresses. A Map is perfect for
         this.


   1         // At the top of your Orchestrator class
   2         const macAddressRegistry = new Map<string, string>();
   3         macAddressRegistry.set('192.168.1.10', 'AA:AA:AA:AA:AA:AA'); // Host A
   4         macAddressRegistry.set('192.168.2.10', 'BB:BB:BB:BB:BB:BB'); // Host B
   5         // ... add routers etc.
   * Action: Update the `DataLinkLayer`
       * In `src/layers/dataLinkLayer_2.ts`:
           1. Add a private arpCache: Map<string, string> to store resolved addresses.
           2. Modify the constructor: Instead of taking destMac in its options, it should accept the macAddressRegistry and use it to initialize its
              arpCache.
           3. Modify handleOutgoing:
               * Get the final destination IP address from the packet's metadata: packet.metadata.destinationIp.
               * Use this IP to look up the destination MAC address from your arpCache.
               * If the IP is not in the cache, log an error (in a real network, this would trigger an ARP broadcast). For this simulation, you can assume
                 the cache is pre-populated.
               * Use the dynamically found MAC address when you call packet.addHeader().

  2. Calculate a Frame Check Sequence (FCS) for Error Detection


  The trailer in your header is currently static. Its real purpose is to store a checksum (like a CRC32) of the frame's data. The receiving device
  recalculates the checksum and compares it to the trailer to check for transmission errors.


   * Action: Create a Checksum Function
       * You can create a simple utility function that generates a numeric checksum from a string. This doesn't need to be a complex CRC algorithm; a basic
         one will prove the concept.


   1         // A simple checksum function you can place in a utility file or in dataLinkLayer_2.ts
   2         const calculateChecksum = (payload: string): string => {
   3           let sum = 0;
   4           for (let i = 0; i < payload.length; i++) {
   5             sum += payload.charCodeAt(i);
   6           }
   7           return sum.toString(16); // Return as a hex string
   8         };
   * Action: Update `handleOutgoing`
       * In `src/layers/dataLinkLayer_2.ts`:
           1. Before you add the header, call your calculateChecksum function on the packet's payload.
           2. Use the result of this function as the value for the trailer property in your header data.

  Summary of Changes


  By implementing these two features, your DataLinkLayer will no longer rely on hardcoded values. It will dynamically resolve addresses and calculate a
  data-integrity check, which are core functions of a true, industry-standard Layer 2.