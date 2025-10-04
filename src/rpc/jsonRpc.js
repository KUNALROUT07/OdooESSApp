// src/rpc/jsonRpc.js

// To See Host:- press "Win + R"  -> "cmd" -> "ipconfig" -> ipV4 

// const HOST = '10.0.2.2';

const PORT = 8069;

const DB = 'odoo18_other';
const URL = `http://${HOST}:${PORT}/jsonrpc`;

async function jsonRpcCall(method, params) {
  const requestData = {
    jsonrpc: '2.0',
    id: Math.floor(Math.random() * 1000000000),
    method: 'call', // Odoo expects "call" as method
    params: {
      service: 'object', // ✅ Add this to avoid "missing service" error
      ...params,
    },
  };

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(requestData),
    });

    const reply = await response.json();
    if (reply.error) throw new Error(reply.error.data.message);
    return reply.result;
  } catch (error) {
    console.error('JSON-RPC Error:', error);
    throw error;
  }
}

export default jsonRpcCall;
export {HOST, PORT, DB, URL};
