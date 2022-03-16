import { UserAccount, PaymentDetails, Payment } from '../models/payments';

describe("Test Payments Functions", () => {
  const mockUserAccount = new UserAccount();
    it("Successful Payment Creation", () => {
      const mockPayment: PaymentDetails = {
        amount: 50,
        beneficiary: 'Test',
        description: 'A test payment'
      };
      mockUserAccount.createPayment(mockPayment).then(result => {
        expect(result).toStrictEqual({id: (result as Payment).id, ...mockPayment});
      });
    });

    it("Unsuccessfuly Payment Creation", () => {
      const mockPayment: PaymentDetails = {
        amount: -5,
        beneficiary: 'Test',
        description: 'A negative payment'
      };
      mockUserAccount.createPayment(mockPayment).then(result => {
        expect(result).toStrictEqual('Amount must be a positive number');
      });
    });

    it("Unsuccessfuly Payment Creation", () => {
      const mockPayment: PaymentDetails = {
        amount: 955,
        beneficiary: 'Test',
        description: 'A test payment larger than balance'
      };
      mockUserAccount.createPayment(mockPayment).then(result => {
        expect(result).toStrictEqual('Not enough money in account to make payment');
      });
    });

    it("Test getting users Balance", () => {
      mockUserAccount.getBalance().then(result => {
        expect(result).toStrictEqual(950);
      });
    });

    it("Current payments length should be 1", () => {
      mockUserAccount.getPayments().then(result => {
        expect(result.length).toStrictEqual(1);
      });
    });
  });