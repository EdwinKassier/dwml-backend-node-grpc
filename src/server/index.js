import * as grpc from '@grpc/grpc-js';
const PROTO_PATH = "proto/services/api/v1/api.proto";
import * as protoLoader from '@grpc/proto-loader';
import express from 'express';

import DataCache from '../utils/data_cache.js';
import DataCollector from '../utils/data_collector.js';
import GraphCreator from '../utils/graph_creator.js';

const healthCheckApp = express();
const HTTP_PORT = 8080;

const healthCheckServer = healthCheckApp.listen(HTTP_PORT, () => {
  console.log(`HTTP health check server listening on port ${HTTP_PORT}`);
});

healthCheckApp.get('/health', (req, res) => {
  // Implement a health check logic
  res.sendStatus(200); // Service is healthy
});

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const apiProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

async function process_request(call) {
  const symbol = call.request.symbol;
  const investment = call.request.investment;

  // Create instances of your utility classes
  const cache = new DataCache(symbol, investment);
  const collector = new DataCollector(symbol, investment);
  const creator = new GraphCreator(symbol, investment);

  // Perform the necessary logic
  let result = await collector.driver_logic();
  let graph_data = await creator.driver_logic();

  // Log the result (optional)
  // console.log(`Received result: ${JSON.stringify(result)} and the graph data ${JSON.stringify(graph_data)}`);

  if (result === undefined) {
    result = "Symbol doesn't exist";
    graph_data = "Symbol doesn't exist";
  }


  return { message: result, graph_data: graph_data };
}

server.addService(apiProto.API.service, {
  processRequest: async (call, callback) => {
    try {
      const response = await process_request(call);
      callback(null, response);
    } catch (error) {
      callback(error); // Pass the error to the callback
    }
  },
});




server.bindAsync('[::]:443', grpc.ServerCredentials.createInsecure(), (error, port) => {
  server.start();
});
