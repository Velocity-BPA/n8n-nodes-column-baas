/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-columnbaas/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class ColumnBaaS implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Column BaaS',
    name: 'columnbaas',
    icon: 'file:columnbaas.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Column BaaS API',
    defaults: {
      name: 'Column BaaS',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'columnbaasApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Transaction',
            value: 'transaction',
          },
          {
            name: 'Customer',
            value: 'customer',
          },
          {
            name: 'Card',
            value: 'card',
          },
          {
            name: 'Webhook',
            value: 'webhook',
          }
        ],
        default: 'account',
      },
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['account'],
		},
	},
	options: [
		{
			name: 'Create Account',
			value: 'createAccount',
			description: 'Create a new bank account',
			action: 'Create a bank account',
		},
		{
			name: 'Get Account',
			value: 'getAccount',
			description: 'Retrieve account details',
			action: 'Get a bank account',
		},
		{
			name: 'List Accounts',
			value: 'listAccounts',
			description: 'List all accounts with optional filters',
			action: 'List bank accounts',
		},
		{
			name: 'Update Account',
			value: 'updateAccount',
			description: 'Update account information',
			action: 'Update a bank account',
		},
		{
			name: 'Close Account',
			value: 'closeAccount',
			description: 'Close an account',
			action: 'Close a bank account',
		},
	],
	default: 'createAccount',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['transaction'] } },
  options: [
    { name: 'Create Transaction', value: 'createTransaction', description: 'Create a new transaction', action: 'Create transaction' },
    { name: 'Get Transaction', value: 'getTransaction', description: 'Get transaction details', action: 'Get transaction' },
    { name: 'List Transactions', value: 'listTransactions', description: 'List transactions with filters', action: 'List transactions' },
    { name: 'Update Transaction', value: 'updateTransaction', description: 'Update transaction status or details', action: 'Update transaction' },
    { name: 'Cancel Transaction', value: 'cancelTransaction', description: 'Cancel a pending transaction', action: 'Cancel transaction' }
  ],
  default: 'createTransaction',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['customer'] } },
  options: [
    { name: 'Create Customer', value: 'createCustomer', description: 'Create a new customer profile', action: 'Create customer' },
    { name: 'Get Customer', value: 'getCustomer', description: 'Retrieve customer details', action: 'Get customer' },
    { name: 'List Customers', value: 'listCustomers', description: 'List customers with optional filters', action: 'List customers' },
    { name: 'Update Customer', value: 'updateCustomer', description: 'Update customer information', action: 'Update customer' },
    { name: 'Verify Customer', value: 'verifyCustomer', description: 'Submit customer for KYC verification', action: 'Verify customer' }
  ],
  default: 'createCustomer',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['card'] } },
  options: [
    { name: 'Issue Card', value: 'issueCard', description: 'Issue a new debit or credit card', action: 'Issue a card' },
    { name: 'Get Card', value: 'getCard', description: 'Get details of a specific card', action: 'Get a card' },
    { name: 'List Cards', value: 'listCards', description: 'List cards for account or customer', action: 'List cards' },
    { name: 'Update Card', value: 'updateCard', description: 'Update card settings and limits', action: 'Update a card' },
    { name: 'Activate Card', value: 'activateCard', description: 'Activate a card with activation code', action: 'Activate a card' },
    { name: 'Freeze Card', value: 'freezeCard', description: 'Freeze a card to prevent transactions', action: 'Freeze a card' },
  ],
  default: 'issueCard',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
		},
	},
	options: [
		{
			name: 'Create Webhook',
			value: 'createWebhook',
			description: 'Create a webhook endpoint',
			action: 'Create a webhook',
		},
		{
			name: 'Get Webhook',
			value: 'getWebhook',
			description: 'Get webhook configuration',
			action: 'Get a webhook',
		},
		{
			name: 'List Webhooks',
			value: 'listWebhooks',
			description: 'List all webhook endpoints',
			action: 'List webhooks',
		},
		{
			name: 'Update Webhook',
			value: 'updateWebhook',
			description: 'Update webhook settings',
			action: 'Update a webhook',
		},
		{
			name: 'Delete Webhook',
			value: 'deleteWebhook',
			description: 'Delete a webhook endpoint',
			action: 'Delete a webhook',
		},
	],
	default: 'createWebhook',
},
{
	displayName: 'Account Type',
	name: 'accountType',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['createAccount'],
		},
	},
	options: [
		{ name: 'Checking', value: 'checking' },
		{ name: 'Savings', value: 'savings' },
		{ name: 'Business', value: 'business' },
	],
	default: 'checking',
	description: 'Type of account to create',
},
{
	displayName: 'Customer ID',
	name: 'customerId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['createAccount'],
		},
	},
	default: '',
	description: 'ID of the customer who will own the account',
},
{
	displayName: 'Product ID',
	name: 'productId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['createAccount'],
		},
	},
	default: '',
	description: 'ID of the product associated with the account',
},
{
	displayName: 'Idempotency Key',
	name: 'idempotencyKey',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['createAccount'],
		},
	},
	default: '',
	description: 'Optional idempotency key for the request',
},
{
	displayName: 'Account ID',
	name: 'accountId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getAccount', 'updateAccount', 'closeAccount'],
		},
	},
	default: '',
	description: 'ID of the account',
},
{
	displayName: 'Customer ID',
	name: 'customerId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['listAccounts'],
		},
	},
	default: '',
	description: 'Filter accounts by customer ID',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['listAccounts'],
		},
	},
	options: [
		{ name: 'All', value: '' },
		{ name: 'Active', value: 'active' },
		{ name: 'Closed', value: 'closed' },
		{ name: 'Pending', value: 'pending' },
	],
	default: '',
	description: 'Filter accounts by status',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['listAccounts'],
		},
	},
	default: 50,
	description: 'Maximum number of accounts to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['listAccounts'],
		},
	},
	default: 0,
	description: 'Number of accounts to skip',
},
{
	displayName: 'Status',
	name: 'statusUpdate',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['updateAccount'],
		},
	},
	options: [
		{ name: 'Active', value: 'active' },
		{ name: 'Frozen', value: 'frozen' },
		{ name: 'Restricted', value: 'restricted' },
	],
	default: '',
	description: 'New status for the account',
},
{
	displayName: 'Nickname',
	name: 'nickname',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['updateAccount'],
		},
	},
	default: '',
	description: 'New nickname for the account',
},
{
	displayName: 'Close Reason',
	name: 'reason',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['closeAccount'],
		},
	},
	options: [
		{ name: 'Customer Request', value: 'customer_request' },
		{ name: 'Compliance', value: 'compliance' },
		{ name: 'Fraud', value: 'fraud' },
		{ name: 'Inactivity', value: 'inactivity' },
	],
	default: 'customer_request',
	description: 'Reason for closing the account',
},
{
  displayName: 'Account ID',
  name: 'account_id',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['createTransaction'] } },
  default: '',
  description: 'The account ID for the transaction',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['createTransaction'] } },
  default: 0,
  description: 'The transaction amount',
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['createTransaction'] } },
  default: '',
  description: 'The transaction description',
},
{
  displayName: 'Counterparty',
  name: 'counterparty',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['createTransaction'] } },
  default: '',
  description: 'The counterparty for the transaction',
},
{
  displayName: 'Transaction ID',
  name: 'transaction_id',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransaction', 'updateTransaction', 'cancelTransaction'] } },
  default: '',
  description: 'The transaction ID',
},
{
  displayName: 'Account ID',
  name: 'account_id',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions'] } },
  default: '',
  description: 'Filter by account ID',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  options: [
    { name: 'Pending', value: 'pending' },
    { name: 'Completed', value: 'completed' },
    { name: 'Failed', value: 'failed' },
    { name: 'Cancelled', value: 'cancelled' }
  ],
  required: false,
  displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions', 'updateTransaction'] } },
  default: '',
  description: 'Filter by or update transaction status',
},
{
  displayName: 'Start Date',
  name: 'start_date',
  type: 'dateTime',
  required: false,
  displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions'] } },
  default: '',
  description: 'Filter transactions from this date',
},
{
  displayName: 'End Date',
  name: 'end_date',
  type: 'dateTime',
  required: false,
  displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions'] } },
  default: '',
  description: 'Filter transactions to this date',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions'] } },
  default: 50,
  description: 'Maximum number of transactions to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions'] } },
  default: 0,
  description: 'Number of transactions to skip',
},
{
  displayName: 'First Name',
  name: 'firstName',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['customer'], operation: ['createCustomer'] } },
  default: '',
  description: 'Customer first name',
},
{
  displayName: 'Last Name',
  name: 'lastName',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['customer'], operation: ['createCustomer'] } },
  default: '',
  description: 'Customer last name',
},
{
  displayName: 'Email',
  name: 'email',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['customer'], operation: ['createCustomer'] } },
  default: '',
  description: 'Customer email address',
},
{
  displayName: 'Phone',
  name: 'phone',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['customer'], operation: ['createCustomer'] } },
  default: '',
  description: 'Customer phone number',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['customer'], operation: ['createCustomer'] } },
  default: '',
  description: 'Customer address',
},
{
  displayName: 'Idempotency Key',
  name: 'idempotencyKey',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['customer'], operation: ['createCustomer'] } },
  default: '',
  description: 'Optional idempotency key for safe retries',
},
{
  displayName: 'Customer ID',
  name: 'customerId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['customer'], operation: ['getCustomer', 'updateCustomer', 'verifyCustomer'] } },
  default: '',
  description: 'The customer ID',
},
{
  displayName: 'Email Filter',
  name: 'emailFilter',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['customer'], operation: ['listCustomers'] } },
  default: '',
  description: 'Filter customers by email',
},
{
  displayName: 'Status Filter',
  name: 'statusFilter',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['customer'], operation: ['listCustomers'] } },
  options: [
    { name: 'Active', value: 'active' },
    { name: 'Pending', value: 'pending' },
    { name: 'Verified', value: 'verified' },
    { name: 'Suspended', value: 'suspended' }
  ],
  default: '',
  description: 'Filter customers by status',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['customer'], operation: ['listCustomers'] } },
  default: 50,
  description: 'Maximum number of customers to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['customer'], operation: ['listCustomers'] } },
  default: 0,
  description: 'Number of customers to skip',
},
{
  displayName: 'Update Email',
  name: 'updateEmail',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['customer'], operation: ['updateCustomer'] } },
  default: '',
  description: 'Updated email address',
},
{
  displayName: 'Update Phone',
  name: 'updatePhone',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['customer'], operation: ['updateCustomer'] } },
  default: '',
  description: 'Updated phone number',
},
{
  displayName: 'Update Address',
  name: 'updateAddress',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['customer'], operation: ['updateCustomer'] } },
  default: '',
  description: 'Updated address',
},
{
  displayName: 'Documents',
  name: 'documents',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['customer'], operation: ['verifyCustomer'] } },
  default: '',
  description: 'KYC documents for verification (JSON format)',
},
{
  displayName: 'Account ID',
  name: 'accountId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['card'],
      operation: ['issueCard'],
    },
  },
  default: '',
  description: 'The ID of the account to issue the card for',
},
{
  displayName: 'Card Type',
  name: 'cardType',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['card'],
      operation: ['issueCard'],
    },
  },
  options: [
    { name: 'Debit', value: 'debit' },
    { name: 'Credit', value: 'credit' },
  ],
  default: 'debit',
  description: 'Type of card to issue',
},
{
  displayName: 'Shipping Address',
  name: 'shippingAddress',
  type: 'fixedCollection',
  required: true,
  displayOptions: {
    show: {
      resource: ['card'],
      operation: ['issueCard'],
    },
  },
  typeOptions: {
    multipleValues: false,
  },
  default: {},
  options: [
    {
      name: 'address',
      displayName: 'Address',
      values: [
        {
          displayName: 'Street',
          name: 'street',
          type: 'string',
          default: '',
        },
        {
          displayName: 'City',
          name: 'city',
          type: 'string',
          default: '',
        },
        {
          displayName: 'State',
          name: 'state',
          type: 'string',
          default: '',
        },
        {
          displayName: 'ZIP Code',
          name: 'zipCode',
          type: 'string',
          default: '',
        },
      ],
    },
  ],
  description: 'Shipping address for the card',
},
{
  displayName: 'Card ID',
  name: 'cardId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['card'],
      operation: ['getCard', 'updateCard', 'activateCard', 'freezeCard'],
    },
  },
  default: '',
  description: 'The ID of the card',
},
{
  displayName: 'Account ID',
  name: 'accountId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['card'],
      operation: ['listCards'],
    },
  },
  default: '',
  description: 'Filter cards by account ID',
},
{
  displayName: 'Customer ID',
  name: 'customerId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['card'],
      operation: ['listCards'],
    },
  },
  default: '',
  description: 'Filter cards by customer ID',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['card'],
      operation: ['listCards'],
    },
  },
  options: [
    { name: 'All', value: '' },
    { name: 'Active', value: 'active' },
    { name: 'Inactive', value: 'inactive' },
    { name: 'Frozen', value: 'frozen' },
    { name: 'Cancelled', value: 'cancelled' },
  ],
  default: '',
  description: 'Filter cards by status',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['card'],
      operation: ['listCards'],
    },
  },
  typeOptions: {
    minValue: 1,
    maxValue: 100,
  },
  default: 50,
  description: 'Maximum number of results to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['card'],
      operation: ['listCards'],
    },
  },
  typeOptions: {
    minValue: 0,
  },
  default: 0,
  description: 'Number of results to skip',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['card'],
      operation: ['updateCard'],
    },
  },
  options: [
    { name: 'Active', value: 'active' },
    { name: 'Inactive', value: 'inactive' },
    { name: 'Frozen', value: 'frozen' },
  ],
  default: 'active',
  description: 'New status for the card',
},
{
  displayName: 'Spending Limits',
  name: 'spendingLimits',
  type: 'fixedCollection',
  displayOptions: {
    show: {
      resource: ['card'],
      operation: ['updateCard'],
    },
  },
  typeOptions: {
    multipleValues: false,
  },
  default: {},
  options: [
    {
      name: 'limits',
      displayName: 'Limits',
      values: [
        {
          displayName: 'Daily Limit',
          name: 'dailyLimit',
          type: 'number',
          default: 0,
          description: 'Daily spending limit in cents',
        },
        {
          displayName: 'Monthly Limit',
          name: 'monthlyLimit',
          type: 'number',
          default: 0,
          description: 'Monthly spending limit in cents',
        },
        {
          displayName: 'Per Transaction Limit',
          name: 'perTransactionLimit',
          type: 'number',
          default: 0,
          description: 'Per transaction limit in cents',
        },
      ],
    },
  ],
  description: 'Spending limits for the card',
},
{
  displayName: 'Activation Code',
  name: 'activationCode',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['card'],
      operation: ['activateCard'],
    },
  },
  default: '',
  description: 'The activation code for the card',
},
{
  displayName: 'Reason',
  name: 'reason',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['card'],
      operation: ['freezeCard'],
    },
  },
  options: [
    { name: 'Lost', value: 'lost' },
    { name: 'Stolen', value: 'stolen' },
    { name: 'Damaged', value: 'damaged' },
    { name: 'Suspicious Activity', value: 'suspicious_activity' },
    { name: 'Customer Request', value: 'customer_request' },
  ],
  default: 'customer_request',
  description: 'Reason for freezing the card',
},
{
	displayName: 'Webhook URL',
	name: 'url',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['createWebhook'],
		},
	},
	default: '',
	placeholder: 'https://your-endpoint.com/webhook',
	description: 'HTTPS URL where webhook events will be sent',
	validation: [
		{
			type: 'regex',
			properties: {
				regex: '^https://.+',
				errorMessage: 'URL must be HTTPS',
			},
		},
	],
},
{
	displayName: 'Events',
	name: 'events',
	type: 'multiOptions',
	required: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['createWebhook'],
		},
	},
	options: [
		{ name: 'Account Created', value: 'account.created' },
		{ name: 'Account Updated', value: 'account.updated' },
		{ name: 'Account Closed', value: 'account.closed' },
		{ name: 'Transaction Created', value: 'transaction.created' },
		{ name: 'Transaction Failed', value: 'transaction.failed' },
		{ name: 'Transfer Initiated', value: 'transfer.initiated' },
		{ name: 'Transfer Completed', value: 'transfer.completed' },
		{ name: 'Transfer Failed', value: 'transfer.failed' },
		{ name: 'Card Created', value: 'card.created' },
		{ name: 'Card Activated', value: 'card.activated' },
		{ name: 'Card Blocked', value: 'card.blocked' },
	],
	default: [],
	description: 'Events that will trigger this webhook',
},
{
	displayName: 'Description',
	name: 'description',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['createWebhook'],
		},
	},
	default: '',
	description: 'Optional description for this webhook',
},
{
	displayName: 'Idempotency Key',
	name: 'idempotencyKey',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['createWebhook'],
		},
	},
	default: '',
	description: 'Optional idempotency key to prevent duplicate webhook creation',
},
{
	displayName: 'Webhook ID',
	name: 'webhookId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['getWebhook', 'updateWebhook', 'deleteWebhook'],
		},
	},
	default: '',
	description: 'The ID of the webhook',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['listWebhooks'],
		},
	},
	options: [
		{ name: 'All', value: '' },
		{ name: 'Active', value: 'active' },
		{ name: 'Inactive', value: 'inactive' },
		{ name: 'Failed', value: 'failed' },
	],
	default: '',
	description: 'Filter webhooks by status',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['listWebhooks'],
		},
	},
	typeOptions: {
		minValue: 1,
		maxValue: 100,
	},
	default: 25,
	description: 'Number of webhooks to return (max 100)',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['listWebhooks'],
		},
	},
	typeOptions: {
		minValue: 0,
	},
	default: 0,
	description: 'Number of webhooks to skip',
},
{
	displayName: 'Update URL',
	name: 'updateUrl',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['updateWebhook'],
		},
	},
	default: false,
	description: 'Whether to update the webhook URL',
},
{
	displayName: 'Webhook URL',
	name: 'url',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['updateWebhook'],
			updateUrl: [true],
		},
	},
	default: '',
	placeholder: 'https://your-endpoint.com/webhook',
	description: 'New HTTPS URL for the webhook',
	validation: [
		{
			type: 'regex',
			properties: {
				regex: '^https://.+',
				errorMessage: 'URL must be HTTPS',
			},
		},
	],
},
{
	displayName: 'Update Events',
	name: 'updateEvents',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['updateWebhook'],
		},
	},
	default: false,
	description: 'Whether to update the webhook events',
},
{
	displayName: 'Events',
	name: 'events',
	type: 'multiOptions',
	required: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['updateWebhook'],
			updateEvents: [true],
		},
	},
	options: [
		{ name: 'Account Created', value: 'account.created' },
		{ name: 'Account Updated', value: 'account.updated' },
		{ name: 'Account Closed', value: 'account.closed' },
		{ name: 'Transaction Created', value: 'transaction.created' },
		{ name: 'Transaction Failed', value: 'transaction.failed' },
		{ name: 'Transfer Initiated', value: 'transfer.initiated' },
		{ name: 'Transfer Completed', value: 'transfer.completed' },
		{ name: 'Transfer Failed', value: 'transfer.failed' },
		{ name: 'Card Created', value: 'card.created' },
		{ name: 'Card Activated', value: 'card.activated' },
		{ name: 'Card Blocked', value: 'card.blocked' },
	],
	default: [],
	description: 'New events that will trigger this webhook',
},
{
	displayName: 'Update Status',
	name: 'updateStatus',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['updateWebhook'],
		},
	},
	default: false,
	description: 'Whether to update the webhook status',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['updateWebhook'],
			updateStatus: [true],
		},
	},
	options: [
		{ name: 'Active', value: 'active' },
		{ name: 'Inactive', value: 'inactive' },
	],
	default: 'active',
	description: 'New status for the webhook',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'transaction':
        return [await executeTransactionOperations.call(this, items)];
      case 'customer':
        return [await executeCustomerOperations.call(this, items)];
      case 'card':
        return [await executeCardOperations.call(this, items)];
      case 'webhook':
        return [await executeWebhookOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('columnbaasApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createAccount': {
					const accountType = this.getNodeParameter('accountType', i) as string;
					const customerId = this.getNodeParameter('customerId', i) as string;
					const productId = this.getNodeParameter('productId', i) as string;
					const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;

					const body: any = {
						account_type: accountType,
						customer_id: customerId,
						product_id: productId,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/accounts`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					if (idempotencyKey) {
						options.headers['Idempotency-Key'] = idempotencyKey;
					}

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAccount': {
					const accountId = this.getNodeParameter('accountId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/accounts/${accountId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'listAccounts': {
					const customerId = this.getNodeParameter('customerId', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const params = new URLSearchParams();
					if (customerId) params.append('customer_id', customerId);
					if (status) params.append('status', status);
					if (limit) params.append('limit', limit.toString());
					if (offset) params.append('offset', offset.toString());

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/accounts?${params.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateAccount': {
					const accountId = this.getNodeParameter('accountId', i) as string;
					const statusUpdate = this.getNodeParameter('statusUpdate', i) as string;
					const nickname = this.getNodeParameter('nickname', i) as string;

					const body: any = {};
					if (statusUpdate) body.status = statusUpdate;
					if (nickname) body.nickname = nickname;

					const options: any = {
						method: 'PATCH',
						url: `${credentials.baseUrl}/accounts/${accountId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'closeAccount': {
					const accountId = this.getNodeParameter('accountId', i) as string;
					const reason = this.getNodeParameter('reason', i) as string;

					const body: any = {
						reason: reason,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/accounts/${accountId}/close`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{
							itemIndex: i,
						},
					);
			}

			returnData.push({
				json: result,
				pairedItem: {
					item: i,
				},
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: error.message,
					},
					pairedItem: {
						item: i,
					},
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeTransactionOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('columnbaasApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createTransaction': {
          const account_id = this.getNodeParameter('account_id', i) as string;
          const amount = this.getNodeParameter('amount', i) as number;
          const description = this.getNodeParameter('description', i) as string;
          const counterparty = this.getNodeParameter('counterparty', i) as string;

          const body = {
            account_id,
            amount,
            description,
            counterparty,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/transactions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransaction': {
          const transaction_id = this.getNodeParameter('transaction_id', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/transactions/${transaction_id}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listTransactions': {
          const account_id = this.getNodeParameter('account_id', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const start_date = this.getNodeParameter('start_date', i) as string;
          const end_date = this.getNodeParameter('end_date', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams: any = {};
          if (account_id) queryParams.account_id = account_id;
          if (status) queryParams.status = status;
          if (start_date) queryParams.start_date = start_date;
          if (end_date) queryParams.end_date = end_date;
          if (limit) queryParams.limit = limit;
          if (offset) queryParams.offset = offset;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/transactions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            qs: queryParams,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateTransaction': {
          const transaction_id = this.getNodeParameter('transaction_id', i) as string;
          const status = this.getNodeParameter('status', i) as string;

          const body: any = {};
          if (status) body.status = status;

          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/transactions/${transaction_id}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelTransaction': {
          const transaction_id = this.getNodeParameter('transaction_id', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/transactions/${transaction_id}/cancel`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeCustomerOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('columnbaasApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createCustomer': {
          const firstName = this.getNodeParameter('firstName', i) as string;
          const lastName = this.getNodeParameter('lastName', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          const phone = this.getNodeParameter('phone', i) as string;
          const address = this.getNodeParameter('address', i) as string;
          const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;

          const body: any = {
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            address,
          };

          const headers: any = {
            'Authorization': `Bearer ${credentials.apiKey}`,
            'Content-Type': 'application/json',
          };

          if (idempotencyKey) {
            headers['Idempotency-Key'] = idempotencyKey;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/customers`,
            headers,
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCustomer': {
          const customerId = this.getNodeParameter('customerId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/customers/${customerId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listCustomers': {
          const emailFilter = this.getNodeParameter('emailFilter', i) as string;
          const statusFilter = this.getNodeParameter('statusFilter', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams: any = {};
          if (emailFilter) queryParams.email = emailFilter;
          if (statusFilter) queryParams.status = statusFilter;
          if (limit) queryParams.limit = limit;
          if (offset) queryParams.offset = offset;

          const queryString = Object.keys(queryParams).length > 0 
            ? '?' + new URLSearchParams(queryParams).toString()
            : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/customers${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateCustomer': {
          const customerId = this.getNodeParameter('customerId', i) as string;
          const updateEmail = this.getNodeParameter('updateEmail', i) as string;
          const updatePhone = this.getNodeParameter('updatePhone', i) as string;
          const updateAddress = this.getNodeParameter('updateAddress', i) as string;

          const body: any = {};
          if (updateEmail) body.email = updateEmail;
          if (updatePhone) body.phone = updatePhone;
          if (updateAddress) body.address = updateAddress;

          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/customers/${customerId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'verifyCustomer': {
          const customerId = this.getNodeParameter('customerId', i) as string;
          const documents = this.getNodeParameter('documents', i) as string;

          let parsedDocuments: any;
          try {
            parsedDocuments = JSON.parse(documents);
          } catch (parseError: any) {
            throw new NodeOperationError(this.getNode(), `Invalid JSON in documents: ${parseError.message}`);
          }

          const body: any = {
            documents: parsedDocuments,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/customers/${customerId}/verify`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeCardOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('columnbaasApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'issueCard': {
          const accountId = this.getNodeParameter('accountId', i) as string;
          const cardType = this.getNodeParameter('cardType', i) as string;
          const shippingAddress = this.getNodeParameter('shippingAddress.address', i) as any;

          const body: any = {
            account_id: accountId,
            card_type: cardType,
            shipping_address: {
              street: shippingAddress.street,
              city: shippingAddress.city,
              state: shippingAddress.state,
              zip_code: shippingAddress.zipCode,
            },
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/cards`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCard': {
          const cardId = this.getNodeParameter('cardId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/cards/${cardId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listCards': {
          const accountId = this.getNodeParameter('accountId', i) as string;
          const customerId = this.getNodeParameter('customerId', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams: any = {
            limit: limit.toString(),
            offset: offset.toString(),
          };

          if (accountId) queryParams.account_id = accountId;
          if (customerId) queryParams.customer_id = customerId;
          if (status) queryParams.status = status;

          const queryString = new URLSearchParams(queryParams).toString();

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/cards?${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateCard': {
          const cardId = this.getNodeParameter('cardId', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const spendingLimits = this.getNodeParameter('spendingLimits.limits', i) as any;

          const body: any = {
            status,
          };

          if (spendingLimits) {
            body.spending_limits = {};
            if (spendingLimits.dailyLimit) body.spending_limits.daily_limit = spendingLimits.dailyLimit;
            if (spendingLimits.monthlyLimit) body.spending_limits.monthly_limit = spendingLimits.monthlyLimit;
            if (spendingLimits.perTransactionLimit) body.spending_limits.per_transaction_limit = spendingLimits.perTransactionLimit;
          }

          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/cards/${cardId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'activateCard': {
          const cardId = this.getNodeParameter('cardId', i) as string;
          const activationCode = this.getNodeParameter('activationCode', i) as string;

          const body: any = {
            activation_code: activationCode,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/cards/${cardId}/activate`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'freezeCard': {
          const cardId = this.getNodeParameter('cardId', i) as string;
          const reason = this.getNodeParameter('reason', i) as string;

          const body: any = {
            reason,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/cards/${cardId}/freeze`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeWebhookOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('columnbaasApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createWebhook': {
					const url = this.getNodeParameter('url', i) as string;
					const events = this.getNodeParameter('events', i) as string[];
					const description = this.getNodeParameter('description', i) as string;
					const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;

					const body: any = {
						url,
						events,
					};

					if (description) {
						body.description = description;
					}

					const headers: any = {
						'Authorization': `Bearer ${credentials.apiKey}`,
						'Content-Type': 'application/json',
					};

					if (idempotencyKey) {
						headers['Idempotency-Key'] = idempotencyKey;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/webhooks`,
						headers,
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getWebhook': {
					const webhookId = this.getNodeParameter('webhookId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/webhooks/${webhookId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'listWebhooks': {
					const status = this.getNodeParameter('status', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const qs: any = {
						limit,
						offset,
					};

					if (status) {
						qs.status = status;
					}

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/webhooks`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateWebhook': {
					const webhookId = this.getNodeParameter('webhookId', i) as string;
					const updateUrl = this.getNodeParameter('updateUrl', i) as boolean;
					const updateEvents = this.getNodeParameter('updateEvents', i) as boolean;
					const updateStatus = this.getNodeParameter('updateStatus', i) as boolean;

					const body: any = {};

					if (updateUrl) {
						const url = this.getNodeParameter('url', i) as string;
						body.url = url;
					}

					if (updateEvents) {
						const events = this.getNodeParameter('events', i) as string[];
						body.events = events;
					}

					if (updateStatus) {
						const status = this.getNodeParameter('status', i) as string;
						body.status = status;
					}

					const options: any = {
						method: 'PATCH',
						url: `${credentials.baseUrl}/webhooks/${webhookId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteWebhook': {
					const webhookId = this.getNodeParameter('webhookId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/webhooks/${webhookId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
