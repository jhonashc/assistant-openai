import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";

import { WsType } from "../../domain/types/ws.type";

interface Options {
  server: Server;
  path?: string;
}

export class WssService {
  private static _instance: WssService;
  private wss: WebSocketServer;

  private constructor(options: Options) {
    const { server, path = "" } = options;
    this.wss = new WebSocketServer({ server, path });
  }

  static get instance() {
    if (!WssService._instance) {
      throw "WssService is not initialized";
    }

    return WssService._instance;
  }

  static initWss(options: Options): void {
    WssService._instance = new WssService(options);
  }

  public sendMessage(type: WsType, payload: Object) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type, payload }));
      }
    });
  }

  public start() {
    this.wss.on("connection", (ws: WebSocket) => {
      console.log("Client connected");

      ws.on("close", () => {
        console.log("Client disconnected");
      });
    });
  }
}
