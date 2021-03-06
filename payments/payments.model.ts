import { v4 as uuidv4 } from "uuid";
import schedule from "node-schedule";
import moment from "moment";

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

    this.payments.push(userPayment);
    this.balance -= payment.amount;

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

  /**
   * Schedule a payment to trigger on a given date
   * @param payment payment to schedule
   * @returns Promise
   */
  public async schedulePayment(payment: PaymentDetails): Promise<string | void> {
    // early return
    if (!payment.payDate) return "Pay Date required";
    
    const payDate = this.cleanDate(new Date(payment.payDate));

    // get maximum schedule date, return error message if exceeded
    if(this.getDateDifference(payDate, this.cleanDate(new Date())) > 28) return "Exceeded maximum future payment cut off.";

    const nextBusinessDay = this.cleanDate(this.getNextBusinessDay());
    if (
      payDate.toString() === nextBusinessDay.toString() ||
      payDate.toString() === this.cleanDate(new Date()).toString()
    ) {
      this.createPayment(payment);
    } else {
      schedule.scheduleJob(payDate, () => {
        this.createPayment(payment);
        console.info(`Job has been triggered at: ${new Date()}`);
      });
    }
  }

  private cleanDate(date: Date): Date {
    return new Date(date.toDateString());
  }

  private getNextBusinessDay(): Date {
    const currentDate = new Date();
    const day = currentDate.getDay();
    let add = 1;

    if (day === 5) add = 3;
    else if (day === 6) add = 2;
    currentDate.setDate(currentDate.getDate() + add);

    return currentDate;
  }

  private getDateDifference(payDate: Date, maxScheduleDate: Date): number {
    return moment(payDate).diff(maxScheduleDate, 'days');
  }
}
