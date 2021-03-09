import * as proxyChain from "proxy-chain";
import manager from "./manager";

class Server extends (proxyChain.Server as any) {
  constructor(opts: any) {
    super(opts);
    this.prepareRequestFunction = this.serverPrepareRequest.bind(this);
  }

  start(): Promise<void> {
    return new Promise((resolve) => {
      manager.refreshList().then(() => {
        this.listen(() => {
          console.log(`Proxy server is listening on port ${this.port}`);
          resolve();
        });
      });
    });
  }

  serverPrepareRequest({
    request,
    username,
    password,
    hostname,
    port,
    isHttp,
    connectionId,
  }) {
    return {
      requestAuthentication: false, // always true - or sth like username !== "bob" || password !== "TopSecret",

      // Sets up an upstream HTTP proxy to which all the requests are forwarded.
      // If null, the proxy works in direct mode, i.e. the connection is forwarded directly
      // to the target server. This field is ignored if "requestAuthentication" is true.
      upstreamProxyUrl: this.enabled ? this.getCurrentProxy().getUrl() : null,

      // If "requestAuthentication" is true, you can use the following property
      // to define a custom error message instead of the default "Proxy credentials required"
      failMsg: "Bad username or password, please try again.",
    };
  }

  getPort(): number {
    return this.port;
  }

  stopServer(): Promise<void> {
    return new Promise((resolve) => {
      this.close(true, resolve);
    });
  }
}

export default new Server({
  port: process.env.PORT,
  verbose: false,
});
