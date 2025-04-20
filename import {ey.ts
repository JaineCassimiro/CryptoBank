import { 
  User, InsertUser, 
  Account, InsertAccount, 
  Transaction, InsertTransaction 
} from "@shared/schema";
import { encryptPassword } from "./crypto";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Account methods
  getAccount(id: number): Promise<Account | undefined>;
  getAccountByUserId(userId: number): Promise<Account | undefined>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccountBalance(accountId: number, newBalance: string): Promise<Account>;
  
  // Transaction methods
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByAccountId(accountId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private accounts: Map<number, Account>;
  private transactions: Map<number, Transaction>;
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private accountIdCounter: number;
  private transactionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.accounts = new Map();
    this.transactions = new Map();
    this.userIdCounter = 1;
    this.accountIdCounter = 1;
    this.transactionIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    
    // Encrypt the password before storing
    const encryptedPassword = encryptPassword(insertUser.password);
    
    const user: User = { 
      ...insertUser, 
      id,
      password: encryptedPassword,
      createdAt: now
    };
    
    this.users.set(id, user);
    return user;
  }

  // Account methods
  async getAccount(id: number): Promise<Account | undefined> {
    return this.accounts.get(id);
  }

  async getAccountByUserId(userId: number): Promise<Account | undefined> {
    return Array.from(this.accounts.values()).find(
      (account) => account.userId === userId,
    );
  }

  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    const id = this.accountIdCounter++;
    const now = new Date();
    
    const account: Account = { 
      ...insertAccount, 
      id,
      createdAt: now
    };
    
    this.accounts.set(id, account);
    return account;
  }

  async updateAccountBalance(accountId: number, newBalance: string): Promise<Account> {
    const account = await this.getAccount(accountId);
    if (!account) {
      throw new Error("Account not found");
    }
    
    const updatedAccount = { 
      ...account, 
      balance: newBalance
    };
    
    this.accounts.set(accountId, updatedAccount);
    return updatedAccount;
  }

  // Transaction methods
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionsByAccountId(accountId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter((transaction) => transaction.accountId === accountId)
      .sort((a, b) => {
        // Sort by createdAt in descending order (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const now = new Date();
    
    const transaction: Transaction = { 
      ...insertTransaction, 
      id,
      createdAt: now
    };
    
    this.transactions.set(id, transaction);
    return transaction;
  }
}

export const storage = new MemStorage();
