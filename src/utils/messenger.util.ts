import { store } from "../store/index";

class Messenger {
  onMessage = new Event("message");

  private message = "";

  sendMessage(message: string) {
    this.message = message;
    store.commit("consoleMsg", message)
  }
}

export default Messenger;
