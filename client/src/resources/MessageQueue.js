class MessageQueue {
    constructor(limit = 10) {
        this.limit = limit;
        this.arr = new Array(limit);
    }

    push(element) {
        console.log(element);
    }
}

export default MessageQueue;
