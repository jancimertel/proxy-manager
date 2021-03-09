export default class Session {
  user: string;
  sessionId: string;

  constructor(proxyUser: string) {
    [this.user, this.sessionId] = proxyUser.split("-");
  }
}
