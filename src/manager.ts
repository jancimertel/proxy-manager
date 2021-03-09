import Proxy from "./proxy";
import Session from "./session";
import * as request from "request";

class Manager {
  availableProxies: Proxy[];
  sessions: Session[];
  currentProxyIndex = -1;

  static refreshUrl: string = process.env.PROXY_ROTATOR_URL;

  refreshList(): Promise<void> {
    return new Promise((resolve) => {
      request(
        {
          method: "GET",
          url: Manager.refreshUrl,
        },
        (err, res, body) => {
          if (err) {
            throw new Error(
              `Error while retrieving proxy list: ${err.toString()}`
            );
          }
          this.availableProxies = body
            .toString()
            .trim()
            .split("\r\n")
            .map((str) => new Proxy(str));
          this.currentProxyIndex = 0;
          resolve();
        }
      );
    });
  }

  getCurrentProxy(): Proxy {
    return this.availableProxies[this.currentProxyIndex];
  }

  async switchProxy() {
    console.log("Switching proxy");
    this.currentProxyIndex++;
    if (this.currentProxyIndex >= this.availableProxies.length) {
      await this.refreshList();
    }
  }
}

export default new Manager();
