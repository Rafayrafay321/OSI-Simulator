import ServerNode from './ServerNodeUI';
import ConnectionWireUI from './ConnectionWireUI';

const NetworkMapUI = () => {
  return (
    <div className="w-full bg-slate-950 rounded-3xl p-12 border border-slate-800 shadow-2xl ">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <ServerNode
          label="Host A"
          type="host"
          colorClass="bg-gradient-to-b from-blue-500 to-blue-700"
          statusColor="bg-emerald-400"
        />

        <ConnectionWireUI />

        <ServerNode
          label="Router"
          type="router"
          colorClass="bg-gradient-to-b from-slate-700 to-slate-900"
          statusColor="bg-amber-400"
        />

        <ConnectionWireUI />

        <ServerNode
          label="Host B"
          type="host"
          colorClass="bg-gradient-to-b from-indigo-500 to-indigo-700"
          statusColor="bg-emerald-400"
        />
      </div>
    </div>
  );
};

export default NetworkMapUI;
