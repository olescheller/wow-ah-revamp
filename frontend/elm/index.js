import * as AbsintheSocket from "@absinthe/socket";
import { Socket as PhoenixSocket } from "phoenix";
import {Elm} from './js/main'
let notifiers = [];

document.addEventListener("DOMContentLoaded", function() {
  const absintheSocket = AbsintheSocket.create(
      new PhoenixSocket("ws://127.0.0.1:4000")
  );

  const app = Elm.Main.init({ node: document.getElementById("main"), flags: 2 });
  console.log("das hier geh")
  app.ports.createSubscriptions.subscribe(function(subscription) {
    console.log("createSubscriptions called with", [subscription]);
    // Remove existing notifiers
    notifiers.map(notifier => AbsintheSocket.cancel(absintheSocket, notifier));

    // Create new notifiers for each subscription sent
    notifiers = [subscription].map(operation =>
        AbsintheSocket.send(absintheSocket, {
          operation,
          variables: {}
        })
    );

    function onStart(data) {
      console.log(">>> Start", JSON.stringify(data));
      app.ports.socketStatusConnected.send(null);
    }

    function onAbort(data) {
      console.log(">>> Abort", JSON.stringify(data));
    }

    function onCancel(data) {
      console.log(">>> Cancel", JSON.stringify(data));
    }

    function onError(data) {
      console.log(">>> Error", JSON.stringify(data));
      app.ports.socketStatusReconnecting.send(null);
    }

    function onResult(res) {
      console.log(">>> Result", JSON.stringify(res));
      app.ports.gotSubscriptionData.send(res);
    }

    notifiers.map(notifier =>
        AbsintheSocket.observe(absintheSocket, notifier, {
          onAbort,
          onError,
          onCancel,
          onStart,
          onResult
        })
    );
  });
});