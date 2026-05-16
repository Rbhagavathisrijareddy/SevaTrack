// User model/schema
export class User {
  constructor(email, name, role, workerId = null) {
    this.id = `user-${Date.now()}-${Math.random()}`;
    this.email = email;
    this.name = name;
    this.role = role; // 'admin' or 'worker'
    this.workerId = workerId;
    this.isVerified = role === 'admin';
    this.createdAt = new Date();
    this.lastLogin = null;
  }
}

// Worker profile model
export class WorkerProfile {
  constructor(userId, email, name, phone = null, location = null) {
    this.id = `worker-${Date.now()}`;
    this.userId = userId;
    this.email = email;
    this.name = name;
    this.phone = phone;
    this.location = location;
    this.status = 'active'; // active, inactive, suspended
    this.submissionCount = 0;
    this.createdAt = new Date();
  }
}
