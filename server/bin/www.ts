#!/usr/bin/env node

/**
 * Module dependencies.
 */

import * as http from "http";
import * as appInitializer from "../app";
import { serverPort } from "../config";
import { Database } from '../db/database';

const db: Database = new Database();
let app;
let server;
let port;

db.createConnection()
  .then(() => db.initDatabase())
  .then(() => console.log('DB successfully initialized'))
  .then(() => setApp());

function setApp() {
  app = appInitializer.getApp();
  port = normalizePort(process.env.PORT || serverPort);
  app.set("port", port);
  server = http.createServer(app);
  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val): boolean | number {

  const normalizedPort = parseInt(val, 10);

  if (isNaN(normalizedPort)) {
    // named pipe
    return val;
  }

  if (normalizedPort >= 0) {
    // port number
    return normalizedPort;
  }

  return false;
}

/**
 * Event listener for HTTP server 'error' event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string"
    ? "Pipe " + port
    : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      // tslint:disable-next-line
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      // tslint:disable-next-line
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server 'listening' event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string"
    ? "pipe " + addr
    : "port " + addr.port;
}
