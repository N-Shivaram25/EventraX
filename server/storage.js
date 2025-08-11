import { randomUUID } from "crypto";

// Storage interface for events and users
export class IStorage {
  getUser(id) { throw new Error('Not implemented'); }
  getUserByUsername(username) { throw new Error('Not implemented'); }
  createUser(user) { throw new Error('Not implemented'); }
  
  getEvents() { throw new Error('Not implemented'); }
  getEvent(id) { throw new Error('Not implemented'); }
  createEvent(event) { throw new Error('Not implemented'); }
  updateEvent(id, event) { throw new Error('Not implemented'); }
  deleteEvent(id) { throw new Error('Not implemented'); }
}

export class MemStorage extends IStorage {

  constructor() {
    super();
    this.users = new Map();
    this.events = new Map();
  }

  async getUser(id) {
    return this.users.get(id);
  }

  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser) {
    const id = randomUUID();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getEvents() {
    return Array.from(this.events.values()).sort((a, b) => 
      a.dateTime.localeCompare(b.dateTime)
    );
  }

  async getEvent(id) {
    return this.events.get(id);
  }

  async createEvent(insertEvent) {
    const id = randomUUID();
    const event = { 
      ...insertEvent, 
      id,
      time: insertEvent.time || "",
      description: insertEvent.description || ""
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id, eventUpdate) {
    const existingEvent = this.events.get(id);
    if (!existingEvent) {
      return undefined;
    }
    
    const updatedEvent = { ...existingEvent, ...eventUpdate };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id) {
    return this.events.delete(id);
  }
}

export const storage = new MemStorage();
