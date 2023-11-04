import * as grpc from '@grpc/grpc-js';
const PROTO_PATH = "proto/services/api/v1/api.proto";
import * as protoLoader from '@grpc/proto-loader';

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  };
  
var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const apiService = grpc.loadPackageDefinition(packageDefinition).API;

const client = new apiService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

let symbol = "ETH";
let investment = 200;

client.processRequest({symbol, investment}, (error, apiResponse) => {
      console.log(apiResponse);
  });