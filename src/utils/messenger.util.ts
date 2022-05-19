class Messenger {
  onMessage = new Event("message");

  private message = "";

  sendMessage(message: string) {
    this.message = message;
  }
}

export default Messenger;
