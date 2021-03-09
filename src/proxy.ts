export default class Proxy {
  ip: string;
  port: string;
  username: string;
  password: string;

  constructor(proxystring: string) {
    [this.ip, this.port, this.username, this.password] = proxystring.split(":");
  }

  getUrl(): string {
    return `http://${this.username}:${this.password}@${this.ip}:${this.port}`;
  }
}
