export const sum = (a: number, b: number): number => a + b;
import { v4 as uuidv4 } from "uuid";

export interface PaymentDetails {
  payDate?: Date;
  amount: number;
  beneficiary: string;
  description: string;
}

export interface Payment extends PaymentDetails {
  id: string;
}

export class UserAccount {
  private balance: number;
  private payments: Payment[];

  constructor() {
    this.balance = 1000;
    this.payments = [];
  }

  /**
   * Create a new payment for the user account
   * @param payment the payment to create
   * @returns Promise
   */
  public async createPayment(
    payment: PaymentDetails
  ): Promise<string | Payment> {
    // early return if no payment object
    if (!payment) return "No Payment Specified";

    if (payment.amount < 0) return "Amount must be a positive number";

    if (!payment.beneficiary || !payment.description) return "Missing Fields";

    if (this.balance - payment.amount < 0) return "Not enough money in account to make payment";

    const userPayment: Payment = { id: uuidv4(), ...payment };

    if (!payment.payDate) {
      this.payments.push(userPayment);
      this.balance -= payment.amount;
    }

    return userPayment;
  }

  /**
   * Update a given payment by id
   * @param id id of payment to update
   * @param payment payment details to set
   * @returns Promise
   */
  public async updatePayment(
    id: string,
    payment: PaymentDetails
  ): Promise<Payment | string> {
    // find index of payment id
    const paymentIndex = this.payments?.findIndex(
      (payment) => payment.id === id
    );

    if (paymentIndex === -1) return "No Payment Found with provided id";

    const amountDifference = this.payments[paymentIndex].amount - payment.amount;
    this.balance = this.balance + amountDifference;
    // update payment at given index
    this.payments[paymentIndex] = { id, ...payment };

    return this.payments[paymentIndex];
  }

  /**
   * Get the user accounts payments history
   * @returns Promise
   */
  public async getPayments(): Promise<Payment[]> {
    return this.payments;
  }

  /**
   * Get the user accounts balance
   * @returns Promise
   */
  public async getBalance(): Promise<number> {
    return this.balance;
  }
}
