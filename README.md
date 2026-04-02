# n8n-nodes-column-baas

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides seamless integration with Column BaaS (Banking-as-a-Service) platform, enabling developers to build financial applications with banking capabilities. The node includes 5 core resources with comprehensive CRUD operations for account management, transaction processing, customer onboarding, card issuance, and webhook management.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Banking](https://img.shields.io/badge/Banking-BaaS-green)
![Fintech](https://img.shields.io/badge/Fintech-API-orange)
![FDIC](https://img.shields.io/badge/FDIC-Insured-gold)

## Features

- **Account Management** - Create, retrieve, update, and manage bank accounts with full lifecycle control
- **Transaction Processing** - Execute transfers, payments, and transaction queries with real-time processing
- **Customer Onboarding** - Complete KYC/AML compliant customer registration and identity verification
- **Card Issuance** - Issue virtual and physical debit cards with spending controls and limits
- **Webhook Integration** - Real-time event notifications for account activities and transaction updates
- **Compliance Ready** - Built-in FDIC insurance and regulatory compliance features
- **Developer Friendly** - Comprehensive error handling and detailed response data
- **Production Grade** - Enterprise-level security and reliability for financial operations

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-column-baas`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-column-baas
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-column-baas.git
cd n8n-nodes-column-baas
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-column-baas
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Column BaaS API key from the developer dashboard | Yes |
| Environment | Select sandbox or production environment | Yes |

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| Create | Open a new bank account with customer information |
| Get | Retrieve account details by account ID |
| Update | Modify account settings and configurations |
| List | Get all accounts with optional filtering |
| Close | Close an existing account |
| Get Balance | Retrieve current account balance |
| Get Statement | Generate account statements for date ranges |

### 2. Transaction

| Operation | Description |
|-----------|-------------|
| Create | Initiate a new transaction or transfer |
| Get | Retrieve transaction details by transaction ID |
| List | Get transaction history with filtering options |
| Cancel | Cancel a pending transaction |
| Get Status | Check the current status of a transaction |
| Create Transfer | Execute transfers between accounts |
| Create Payment | Process external payments |

### 3. Customer

| Operation | Description |
|-----------|-------------|
| Create | Register a new customer with KYC information |
| Get | Retrieve customer profile and details |
| Update | Modify customer information and settings |
| List | Get all customers with search capabilities |
| Verify Identity | Perform identity verification checks |
| Get Documents | Retrieve uploaded customer documents |
| Update Status | Change customer verification status |

### 4. Card

| Operation | Description |
|-----------|-------------|
| Create | Issue a new virtual or physical debit card |
| Get | Retrieve card details and information |
| Update | Modify card settings and spending limits |
| List | Get all cards for an account or customer |
| Activate | Activate a newly issued card |
| Block | Temporarily block a card |
| Unblock | Unblock a previously blocked card |
| Get PIN | Retrieve or reset card PIN |

### 5. Webhook

| Operation | Description |
|-----------|-------------|
| Create | Register a new webhook endpoint |
| Get | Retrieve webhook configuration details |
| Update | Modify webhook settings and events |
| List | Get all configured webhooks |
| Delete | Remove a webhook endpoint |
| Test | Send a test event to webhook endpoint |
| Get Events | List available webhook event types |

## Usage Examples

```javascript
// Create a new customer account
{
  "resource": "customer",
  "operation": "create",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-15",
  "ssn": "123-45-6789"
}
```

```javascript
// Open a bank account
{
  "resource": "account",
  "operation": "create",
  "customerId": "cust_abc123",
  "accountType": "checking",
  "initialDeposit": 1000.00,
  "currency": "USD"
}
```

```javascript
// Issue a debit card
{
  "resource": "card",
  "operation": "create",
  "accountId": "acct_xyz789",
  "cardType": "virtual",
  "spendingLimit": 500.00,
  "allowedCategories": ["grocery", "gas", "retail"]
}
```

```javascript
// Process a transaction
{
  "resource": "transaction",
  "operation": "create",
  "fromAccountId": "acct_xyz789",
  "toAccountId": "acct_def456",
  "amount": 250.00,
  "currency": "USD",
  "description": "Payment for services"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and active in Column dashboard |
| Insufficient Funds | Account balance too low for transaction | Check account balance before processing transactions |
| Customer Not Verified | Customer KYC verification incomplete | Complete identity verification process before account opening |
| Card Blocked | Card is temporarily blocked or suspended | Unblock card or contact Column support |
| Webhook Delivery Failed | Webhook endpoint not responding | Verify endpoint URL is accessible and returning 200 status |
| Rate Limit Exceeded | Too many API requests in time window | Implement request throttling and retry logic |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-column-baas/issues)
- **Column API Documentation**: [Column Developer Docs](https://column.com/docs)
- **Banking API Reference**: [Column API Reference](https://column.com/docs/api)