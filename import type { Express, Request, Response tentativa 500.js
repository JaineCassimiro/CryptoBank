import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { encryptPassword } from "./crypto";
import { 
  insertTransactionSchema, 
  transactionSchema,
  registerSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Get account information for the logged-in user
  app.get("/api/account", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const account = await storage.getAccountByUserId(req.user.id);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      res.json(account);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch account" });
    }
  });

  // Get transactions for the logged-in user's account
  app.get("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const account = await storage.getAccountByUserId(req.user.id);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      const transactions = await storage.getTransactionsByAccountId(account.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Process a deposit
  app.post("/api/transactions/deposit", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      // Validate request body
      const validatedData = transactionSchema.parse(req.body);
      const amount = parseFloat(validatedData.amount);
      
      // Get user's account
      const account = await storage.getAccountByUserId(req.user.id);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      // Create transaction and update balance
      const transaction = await storage.createTransaction({
        accountId: account.id,
        type: "deposit",
        amount: amount.toString(),
        description: validatedData.description || "Deposit",
        recipient: null,
      });
      
      // Update account balance
      const newBalance = parseFloat(account.balance.toString()) + amount;
      await storage.updateAccountBalance(account.id, newBalance.toString());
      
      // Get updated account
      const updatedAccount = await storage.getAccountByUserId(req.user.id);
      
      res.status(201).json({ transaction, account: updatedAccount });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process deposit" });
    }
  });

  // Process a withdrawal
  app.post("/api/transactions/withdraw", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      // Validate request body
      const validatedData = transactionSchema.parse(req.body);
      const amount = parseFloat(validatedData.amount);
      
      // Get user's account
      const account = await storage.getAccountByUserId(req.user.id);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      // Check if account has sufficient funds
      const currentBalance = parseFloat(account.balance.toString());
      if (currentBalance < amount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }
      
      // Create transaction and update balance
      const transaction = await storage.createTransaction({
        accountId: account.id,
        type: "withdrawal",
        amount: amount.toString(),
        description: validatedData.description || "Withdrawal",
        recipient: null,
      });
      
      // Update account balance
      const newBalance = currentBalance - amount;
      await storage.updateAccountBalance(account.id, newBalance.toString());
      
      // Get updated account
      const updatedAccount = await storage.getAccountByUserId(req.user.id);
      
      res.status(201).json({ transaction, account: updatedAccount });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process withdrawal" });
    }
  });

  // Process a transfer
  app.post("/api/transactions/transfer", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      // Validate request body
      const validatedData = transactionSchema.parse(req.body);
      const amount = parseFloat(validatedData.amount);
      
      if (!validatedData.recipient) {
        return res.status(400).json({ message: "Recipient is required for transfers" });
      }
      
      // Get user's account
      const account = await storage.getAccountByUserId(req.user.id);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      // Check if account has sufficient funds
      const currentBalance = parseFloat(account.balance.toString());
      if (currentBalance < amount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }
      
      // Create transaction and update balance
      const transaction = await storage.createTransaction({
        accountId: account.id,
        type: "transfer",
        amount: amount.toString(),
        description: validatedData.description || "Transfer",
        recipient: validatedData.recipient,
      });
      
      // Update account balance
      const newBalance = currentBalance - amount;
      await storage.updateAccountBalance(account.id, newBalance.toString());
      
      // Get updated account
      const updatedAccount = await storage.getAccountByUserId(req.user.id);
      
      res.status(201).json({ transaction, account: updatedAccount });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process transfer" });
    }
  });

  // Process a payment
  app.post("/api/transactions/payment", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      // Validate request body
      const validatedData = transactionSchema.parse(req.body);
      const amount = parseFloat(validatedData.amount);
      
      // Get user's account
      const account = await storage.getAccountByUserId(req.user.id);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      // Check if account has sufficient funds
      const currentBalance = parseFloat(account.balance.toString());
      if (currentBalance < amount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }
      
      // Create transaction and update balance
      const transaction = await storage.createTransaction({
        accountId: account.id,
        type: "payment",
        amount: amount.toString(),
        description: validatedData.description || "Payment",
        recipient: validatedData.recipient || "Unknown recipient",
      });
      
      // Update account balance
      const newBalance = currentBalance - amount;
      await storage.updateAccountBalance(account.id, newBalance.toString());
      
      // Get updated account
      const updatedAccount = await storage.getAccountByUserId(req.user.id);
      
      res.status(201).json({ transaction, account: updatedAccount });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process payment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
