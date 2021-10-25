const WebSocket = require("ws");
const wsServer = new WebSocket.Server({ port: 9000 });

wsServer.on("connection", onConnect);

function onConnect(wsClient) {
  wsClient.send(
    JSON.stringify({ type: "info", message: "Client connected to WS" })
  );

  wsClient.on("close", function () {
    JSON.stringify({ type: "info", message: "Client disconnected from WS" });
  });

  const getIntervalMessages = (count) => {
    setInterval(() => {
      const rand = Math.floor(Math.random() * (1000 - 10 + 1) + 10);
      wsClient.send(JSON.stringify({ type: "set_value", value: rand }));
    }, 1000);
  };

  wsClient.on("message", function (message) {
    try {
      const jsonMessage = JSON.parse(message);
      switch (jsonMessage.type) {
        case "get_queued_messages":
          getIntervalMessages(10);
          break;
        default:
          console.log("Error. No such command");
          break;
      }
    } catch (error) {
      console.log("Error", error);
    }
  });
}

console.log("Server running on :9000");
