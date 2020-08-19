import { promisify } from "util";

// Wrap setTimeout in a promise so we can use it with async/await
const wait = promisify(setTimeout);

// We're going to create more than one queue in our app, so we'll
// make a Queue class that wraps the RSMQ API; the methods in this
// class will facilitate easy queue fetching and standardize
// error handling if something goes wrong.

class Queue {

  // A Queue object will be instantiated with two properties: rsmq is
  // the instance of RedisSMQ created in config/redisSMQ.js, and qname 
  // will be a unique name we use to identify a queue.
  constructor(rsmq, qname) {
    this.rsmq = rsmq;
    this.qname = qname;
  }

  // For the most part, the Queue class methods will handle queue
  // creation/deletion and transmit messages between producers
  // and consumers.

  async createQueue() {
    const queues = await this.rsmq.listQueuesAsync();

    if (queues.find(queue => queue === this.qname)) {
      return;
    }

    // If the queue didn't already exist and is successfully created, 
    // the createQueueAsync method will return a 1
    const response = await this.rsmq.createQueueAsync({
      qname: this.qname,
      vt: 1
    });

    // If the response is not 1, handle error
    if (response !== 1) {
      throw new Error(`${this.qname} could not be created`);
    }

    console.log(`${this.qname} successfully created`);
  }

  // This method will only be used for testing and development; we 
  // won't need to delete any queues we create when running the
  // real application:

  async deleteQueue() {
    const response = await this.rsmq.deleteQueueAsync({
      qname: this.qname
    });

    if (response !== 1) {
      console.log(`Queue could not be deleted`);
      return;
    }

    console.log(`${this.qname} queue and all messages deleted`);
  }

  // This method allows producers to broadcast messages:

  async sendMessage(message) {
    const response = await this.rsmq.sendMessageAsync({
      qname: this.qname,
      message
    });

    if (!response) {
      throw new Error(`Message could not be sent to ${this.qname}`);
    }

    // The response returned will be the unique ID of the newly created
    // message in Redis
    return response;
  }

  // This method allows consumers to receive the next available message
  // in the queue:

  async receiveMessage() {
    const response = await this.rsmq.receiveMessageAsync({
      qname: this.qname
    });

    // If a subsequent message is unavailable, then RSMQ's receiveMessage
    // method will return an empty object
    if (!response || !response.id) {
      return null;
    }

    return response;
  }

  // After any consumer receives a message it will remain in the queue,
  // so after we're done with it we need to clean up after ourselves
  // using this method: 

  async deleteMessage(id) {
    const response = await this.rsmq.deleteMessageAsync({
      qname: this.qname,
      id
    });

    // RSMQ's deleteMessage method returns 1 on success or 0 on failure,
    // so we return true or false booleans based on that integer value
    return response === 1;
  }

  // The listen method will be used to create a loop on a per-queue
  // basis so consumers can check for messages that need to be processed
  async listen({ interval = 10000, maxReceivedCount = 10 }, callback) {
    const start = Date.now();

    try {
      // Start by receiving the next available message
      const response = await this.receiveMessage();

      // If the message has already been received too many times, it
      // may be un-processable, so we delete it
      if (response && response.rc > maxReceivedCount) {
        await this.deleteMessage(response.id);
      } else if (response) {
        // Otherwise, if the message is still fresh, we pass the
        // response object into the callback to process it, then
        // we delete the message
        callback(response);
        await this.deleteMessage(response.id);
      }
    } finally {
      // The finally block sets up the next tick of the loop by
      // checking how much time has elapsed since the listen method
      // was first called, and recursively calling listen again, after
      // the difference in time between the elapsed time and the
      // setInterval loop has passed (ie, ten seconds minus the time
      // it took to process the code block). If the code in the try
      // block took more than the setInterval time to run, then the
      // next loop tick will happen immediately.
      const elapsedTime = Date.now() - start;
      const waitTime = interval = elapsedTime;

      await wait(Math.max(0, waitTime));
      await this.listen({ interval, maxReceivedCount }, callback);
    }
  }
}

export default Queue;

// How this goes: the deleteAccount mutation is called from the client.
// That causes the accounts service to delete that account from Auth0,
// and to send a message to the account_deleted queue. That message's 
// payload contains the id of the deleted account. The profiles service
// consumes that message, uses the id in the payload to delete the 
// appropriate profile from MongoDB, then deletes the message from
// the account_deleted queue. The profiles service then sends a message
// to the profile_deleted queue, with the profile id as the payload. 
// The run service consumes the message, deletes all appropriate 
// run documents matching that id, then deletes the
// message upon success. This way, a delete event cascades across all 
// services, but each service is still only responsible for handling 
// its own content, which is tidy. 
