/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ColumnBaaS } from '../nodes/Column BaaS/Column BaaS.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('ColumnBaaS Node', () => {
  let node: ColumnBaaS;

  beforeAll(() => {
    node = new ColumnBaaS();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Column BaaS');
      expect(node.description.name).toBe('columnbaas');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Account Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.column.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('createAccount operation', () => {
		it('should create an account successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createAccount')
				.mockReturnValueOnce('checking')
				.mockReturnValueOnce('customer123')
				.mockReturnValueOnce('product456')
				.mockReturnValueOnce('');

			const mockResponse = { id: 'account123', status: 'active' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.column.com/accounts',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					account_type: 'checking',
					customer_id: 'customer123',
					product_id: 'product456',
				},
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle createAccount errors', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('createAccount');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getAccount operation', () => {
		it('should get account successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAccount')
				.mockReturnValueOnce('account123');

			const mockResponse = { id: 'account123', balance: 1000 };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.column.com/accounts/account123',
				headers: {
					'Authorization': 'Bearer test-key',
				},
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('listAccounts operation', () => {
		it('should list accounts successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listAccounts')
				.mockReturnValueOnce('customer123')
				.mockReturnValueOnce('active')
				.mockReturnValueOnce(10)
				.mockReturnValueOnce(0);

			const mockResponse = { accounts: [{ id: 'account1' }, { id: 'account2' }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.column.com/accounts?customer_id=customer123&status=active&limit=10&offset=0',
				headers: {
					'Authorization': 'Bearer test-key',
				},
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('updateAccount operation', () => {
		it('should update account successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateAccount')
				.mockReturnValueOnce('account123')
				.mockReturnValueOnce('frozen')
				.mockReturnValueOnce('My Account');

			const mockResponse = { id: 'account123', status: 'frozen' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PATCH',
				url: 'https://api.column.com/accounts/account123',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					status: 'frozen',
					nickname: 'My Account',
				},
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('closeAccount operation', () => {
		it('should close account successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('closeAccount')
				.mockReturnValueOnce('account123')
				.mockReturnValueOnce('customer_request');

			const mockResponse = { id: 'account123', status: 'closed' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.column.com/accounts/account123/close',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					reason: 'customer_request',
				},
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Transaction Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.column.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(), 
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  test('should create transaction successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createTransaction')
      .mockReturnValueOnce('acc123')
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce('Test transaction')
      .mockReturnValueOnce('counterparty123');

    const mockResponse = { id: 'txn123', status: 'pending' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.column.com/transactions',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        account_id: 'acc123',
        amount: 1000,
        description: 'Test transaction',
        counterparty: 'counterparty123',
      },
      json: true,
    });

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('should get transaction successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTransaction')
      .mockReturnValueOnce('txn123');

    const mockResponse = { id: 'txn123', status: 'completed' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.column.com/transactions/txn123',
      headers: {
        'Authorization': 'Bearer test-key',
      },
      json: true,
    });

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('should list transactions successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listTransactions')
      .mockReturnValueOnce('acc123')
      .mockReturnValueOnce('pending')
      .mockReturnValueOnce('2023-01-01')
      .mockReturnValueOnce('2023-12-31')
      .mockReturnValueOnce(50)
      .mockReturnValueOnce(0);

    const mockResponse = { transactions: [], total: 0 };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.column.com/transactions',
      headers: {
        'Authorization': 'Bearer test-key',
      },
      qs: {
        account_id: 'acc123',
        status: 'pending',
        start_date: '2023-01-01',
        end_date: '2023-12-31',
        limit: 50,
        offset: 0,
      },
      json: true,
    });

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('should update transaction successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateTransaction')
      .mockReturnValueOnce('txn123')
      .mockReturnValueOnce('completed');

    const mockResponse = { id: 'txn123', status: 'completed' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PATCH',
      url: 'https://api.column.com/transactions/txn123',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        status: 'completed',
      },
      json: true,
    });

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('should cancel transaction successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('cancelTransaction')
      .mockReturnValueOnce('txn123');

    const mockResponse = { id: 'txn123', status: 'cancelled' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.column.com/transactions/txn123/cancel',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('should handle errors correctly', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTransaction');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });
});

describe('Customer Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.column.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('createCustomer operation', () => {
    it('should create customer successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createCustomer')
        .mockReturnValueOnce('John')
        .mockReturnValueOnce('Doe')
        .mockReturnValueOnce('john.doe@example.com')
        .mockReturnValueOnce('+1234567890')
        .mockReturnValueOnce('123 Main St')
        .mockReturnValueOnce('');

      const mockResponse = { id: 'cust_123', status: 'active' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });

    it('should handle createCustomer error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('createCustomer');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'API Error' },
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('getCustomer operation', () => {
    it('should get customer successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCustomer')
        .mockReturnValueOnce('cust_123');

      const mockResponse = { id: 'cust_123', first_name: 'John' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('listCustomers operation', () => {
    it('should list customers successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listCustomers')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('active')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(0);

      const mockResponse = { customers: [], total: 0 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('updateCustomer operation', () => {
    it('should update customer successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateCustomer')
        .mockReturnValueOnce('cust_123')
        .mockReturnValueOnce('newemail@example.com')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');

      const mockResponse = { id: 'cust_123', email: 'newemail@example.com' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('verifyCustomer operation', () => {
    it('should verify customer successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('verifyCustomer')
        .mockReturnValueOnce('cust_123')
        .mockReturnValueOnce('{"type": "passport", "number": "123456"}');

      const mockResponse = { id: 'cust_123', verification_status: 'pending' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });

    it('should handle invalid JSON in documents', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('verifyCustomer')
        .mockReturnValueOnce('cust_123')
        .mockReturnValueOnce('invalid json');

      await expect(executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('Invalid JSON in documents');
    });
  });
});

describe('Card Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.column.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should issue a new card', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('issueCard')
      .mockReturnValueOnce('acc123')
      .mockReturnValueOnce('debit')
      .mockReturnValueOnce({ street: '123 Main St', city: 'City', state: 'CA', zipCode: '12345' });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ 
      card_id: 'card123', 
      status: 'pending' 
    });

    const result = await executeCardOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.column.com/cards',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        account_id: 'acc123',
        card_type: 'debit',
        shipping_address: {
          street: '123 Main St',
          city: 'City',
          state: 'CA',
          zip_code: '12345',
        },
      },
      json: true,
    });

    expect(result).toEqual([{
      json: { card_id: 'card123', status: 'pending' },
      pairedItem: { item: 0 },
    }]);
  });

  it('should get card details', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCard')
      .mockReturnValueOnce('card123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ 
      card_id: 'card123', 
      status: 'active' 
    });

    const result = await executeCardOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.column.com/cards/card123',
      headers: {
        'Authorization': 'Bearer test-key',
      },
      json: true,
    });

    expect(result).toEqual([{
      json: { card_id: 'card123', status: 'active' },
      pairedItem: { item: 0 },
    }]);
  });

  it('should handle errors when continuing on fail', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCard');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeCardOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { error: 'API Error' },
      pairedItem: { item: 0 },
    }]);
  });

  it('should activate a card', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('activateCard')
      .mockReturnValueOnce('card123')
      .mockReturnValueOnce('ACT123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ 
      card_id: 'card123', 
      status: 'active' 
    });

    const result = await executeCardOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.column.com/cards/card123/activate',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        activation_code: 'ACT123',
      },
      json: true,
    });
  });

  it('should freeze a card', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('freezeCard')
      .mockReturnValueOnce('card123')
      .mockReturnValueOnce('lost');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ 
      card_id: 'card123', 
      status: 'frozen' 
    });

    const result = await executeCardOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.column.com/cards/card123/freeze',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        reason: 'lost',
      },
      json: true,
    });
  });
});

describe('Webhook Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.column.com'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('createWebhook', () => {
		it('should create a webhook successfully', async () => {
			const mockResponse = {
				id: 'wh_123',
				url: 'https://example.com/webhook',
				events: ['account.created', 'transaction.created'],
				status: 'active'
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createWebhook')
				.mockReturnValueOnce('https://example.com/webhook')
				.mockReturnValueOnce(['account.created', 'transaction.created'])
				.mockReturnValueOnce('Test webhook')
				.mockReturnValueOnce('');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.column.com/webhooks',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					url: 'https://example.com/webhook',
					events: ['account.created', 'transaction.created'],
					description: 'Test webhook',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle createWebhook errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createWebhook')
				.mockReturnValueOnce('https://example.com/webhook')
				.mockReturnValueOnce(['account.created'])
				.mockReturnValueOnce('')
				.mockReturnValueOnce('');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid webhook URL'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'Invalid webhook URL' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('getWebhook', () => {
		it('should get webhook successfully', async () => {
			const mockResponse = {
				id: 'wh_123',
				url: 'https://example.com/webhook',
				events: ['account.created'],
				status: 'active'
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getWebhook')
				.mockReturnValueOnce('wh_123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.column.com/webhooks/wh_123',
				headers: {
					'Authorization': 'Bearer test-key',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('listWebhooks', () => {
		it('should list webhooks successfully', async () => {
			const mockResponse = {
				data: [
					{ id: 'wh_123', url: 'https://example.com/webhook1', status: 'active' },
					{ id: 'wh_456', url: 'https://example.com/webhook2', status: 'inactive' }
				],
				pagination: { limit: 25, offset: 0, total: 2 }
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listWebhooks')
				.mockReturnValueOnce('active')
				.mockReturnValueOnce(25)
				.mockReturnValueOnce(0);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.column.com/webhooks',
				headers: {
					'Authorization': 'Bearer test-key',
				},
				qs: {
					status: 'active',
					limit: 25,
					offset: 0,
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('updateWebhook', () => {
		it('should update webhook successfully', async () => {
			const mockResponse = {
				id: 'wh_123',
				url: 'https://example.com/new-webhook',
				events: ['account.created', 'account.updated'],
				status: 'active'
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateWebhook')
				.mockReturnValueOnce('wh_123')
				.mockReturnValueOnce(true)
				.mockReturnValueOnce(true)
				.mockReturnValueOnce(false)
				.mockReturnValueOnce('https://example.com/new-webhook')
				.mockReturnValueOnce(['account.created', 'account.updated']);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PATCH',
				url: 'https://api.column.com/webhooks/wh_123',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					url: 'https://example.com/new-webhook',
					events: ['account.created', 'account.updated'],
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('deleteWebhook', () => {
		it('should delete webhook successfully', async () => {
			const mockResponse = { success: true };

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteWebhook')
				.mockReturnValueOnce('wh_123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://api.column.com/webhooks/wh_123',
				headers: {
					'Authorization': 'Bearer test-key',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle deleteWebhook errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteWebhook')
				.mockReturnValueOnce('wh_123');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Webhook not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'Webhook not found' },
				pairedItem: { item: 0 },
			}]);
		});
	});
});
});
