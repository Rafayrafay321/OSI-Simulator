import WebSocket from 'ws';

const PORT = 3001; // Ensure this matches your running server
const BASE_URL = `http://localhost:${PORT}/api`;
const WS_URL = `ws://localhost:${PORT}`;

const testTopology = {
  nodes: [
    { id: 'HostA', type: 'Host', ip: '192.168.1.10', mac: 'AA:AA:AA:AA:AA:AA' },
    { id: 'Switch1', type: 'Switch', mac: 'SS:SS:SS:SS:SS:SS' },
    { id: 'HostB', type: 'Host', ip: '192.168.1.20', mac: 'BB:BB:BB:BB:BB:BB' }
  ],
  edges: [
    ['HostA', 'Switch1'],
    ['Switch1', 'HostB']
  ]
};

const testConfig = {
  srcIp: '192.168.1.10',
  destIp: '192.168.1.20',
  srcPort: 1234,
  destPort: 80,
  appProtocol: 'HTTP',
  appMethod: 'GET',
  payload: 'Hello from Host A! Testing the API!',
  dropChance: 0
};

async function runTest() {
  console.log('1. Connecting to WebSocket...');
  const ws = new WebSocket(WS_URL);

  let socketId: string;

  ws.on('message', async (data) => {
    const message = JSON.parse(data.toString());
    
    if (message.type === 'Connected') {
      socketId = message.socketId;
      console.log(`✅ WebSocket Connected! Socket ID: ${socketId}\n`);
      
      try {
        console.log('2. Registering Topology...');
        const topoRes = await fetch(`${BASE_URL}/topology`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testTopology)
        });
        
        const topoData = await topoRes.json() as any;
        console.log(`✅ Topology Registered! Topology ID: ${topoData.topologyId}\n`);

        console.log('3. Triggering Simulation...');
        const simRes = await fetch(`${BASE_URL}/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            config: testConfig,
            socketId: socketId,
            topologyId: topoData.topologyId
          })
        });

        const simData = await simRes.json();
        console.log(`✅ Simulation Completed! Final API Response:\n`, simData);
        
        console.log('\nClosing connection in 2 seconds...');
        setTimeout(() => ws.close(), 2000);

      } catch (err) {
        console.error('❌ Error during API requests:', err);
        ws.close();
      }
    } else {
      // These are likely the streaming logs from the Orchestrator!
      console.log('📡 [STREAM LOG]:', message);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket closed.');
    process.exit(0);
  });
}

runTest();
