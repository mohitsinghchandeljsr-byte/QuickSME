# QuickSME ERP API Testing Guide

This guide provides comprehensive testing instructions for the QuickSME ERP API using Postman and automated testing tools.

## 📋 Prerequisites

1. **QuickSME ERP System Running**
   - Install Docker Desktop
   - Run: `docker-compose -f docker-compose.postgres.yml up -d` (or mysql version)
   - Verify: `http://localhost:3000` is accessible

2. **Postman Installed**
   - Download from: https://www.postman.com/downloads/
   - Import the collection: `QuickSME_API_Tests.postman_collection.json`

3. **Newman (Optional for CI/CD)**
   ```bash
   npm install -g newman
   ```

## 🚀 Quick Start

### 1. Import Collection
- Open Postman
- Click "Import" → "File"
- Select `QuickSME_API_Tests.postman_collection.json`

### 2. Set Environment Variables
Create a new environment in Postman:
- `baseUrl`: `http://localhost:3000`
- Other variables will auto-populate during testing

### 3. Run Health Check
Execute "Server Health Check" request to verify the API is running.

## 📊 Test Categories

### ✅ Functional Tests

#### Ledgers API
- **GET /api/ledgers** - Retrieve all ledgers
- **GET /api/ledgers/{id}** - Get specific ledger
- **POST /api/ledgers** - Create new ledger
- **Validation**: Invalid data handling

#### Parties API
- **GET /api/parties** - List all parties
- **GET /api/parties/{id}** - Get party details
- **POST /api/parties** - Create customers/vendors
- **GSTIN validation**

#### Vouchers API
- **GET /api/vouchers** - Transaction history
- **GET /api/vouchers/{id}** - Specific transaction
- **POST /api/vouchers** - Sales/Purchase entries
- **GST calculations** (CGST/SGST/IGST)

#### Stock Items API
- **CRUD operations** - Create, Read, Update, Delete
- **Inventory management**
- **Reorder level alerts**

#### API Keys & Webhooks
- **Security testing** - API key management
- **Integration testing** - Webhook configurations

#### AI Assistant
- **Natural language queries**
- **Business intelligence**
- **GST compliance assistance**

### ⚡ Performance Tests

#### Load Testing
- Bulk ledger creation
- Concurrent voucher processing
- Response time validation (< 2000ms)

#### Stress Testing
- High-volume data operations
- Memory usage monitoring
- Database connection pooling

### 🛡️ Security & Error Testing

#### Input Validation
- SQL injection attempts
- XSS prevention
- Data type validation

#### Error Handling
- Invalid endpoints (404)
- Malformed JSON (400)
- Server errors (500)

#### Authentication
- API key validation
- Rate limiting
- Unauthorized access

## 🔄 Test Execution Workflow

### Phase 1: Setup & Verification
1. Run health check
2. Create test ledger
3. Create test party (customer)
4. Create test party (vendor)

### Phase 2: Core Functionality
1. Create stock items
2. Generate sales vouchers
3. Generate purchase vouchers
4. Update inventory

### Phase 3: Advanced Features
1. Test AI assistant queries
2. Configure webhooks
3. Generate API keys
4. Test GitHub integration

### Phase 4: Load Testing
1. Bulk data creation
2. Concurrent operations
3. Performance monitoring

### Phase 5: Error Scenarios
1. Invalid inputs
2. Non-existent resources
3. Malformed requests

## 📈 Automated Testing

### Newman CLI Testing

```bash
# Run all tests
newman run QuickSME_API_Tests.postman_collection.json \
  --environment QuickSME_Test_Env.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export results.json

# Run with iterations for load testing
newman run QuickSME_API_Tests.postman_collection.json \
  --environment QuickSME_Test_Env.postman_environment.json \
  --iteration-count 100 \
  --delay-request 100
```

### CI/CD Integration

```yaml
# .github/workflows/api-tests.yml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install Newman
        run: npm install -g newman
      - name: Run API Tests
        run: newman run QuickSME_API_Tests.postman_collection.json
```

## 📊 Test Results Analysis

### Success Criteria
- ✅ All requests return 2xx status codes
- ✅ Response times < 2000ms
- ✅ Valid JSON responses
- ✅ Proper error handling (4xx for client errors)
- ✅ Data consistency across operations

### Performance Benchmarks
- **API Response Time**: < 500ms average
- **Database Queries**: < 100ms
- **Concurrent Users**: Support 100+ simultaneous connections
- **Memory Usage**: < 512MB under normal load

### Coverage Metrics
- **Endpoint Coverage**: 100% of API endpoints
- **HTTP Methods**: GET, POST, PATCH, DELETE
- **Status Codes**: 200, 201, 400, 404, 500
- **Data Validation**: Required fields, data types, constraints

## 🐛 Common Issues & Troubleshooting

### Connection Issues
```bash
# Check if services are running
docker-compose -f docker-compose.postgres.yml ps

# View logs
docker-compose -f docker-compose.postgres.yml logs app

# Restart services
docker-compose -f docker-compose.postgres.yml restart
```

### Database Issues
```bash
# Reset database
docker-compose -f docker-compose.postgres.yml down -v
docker-compose -f docker-compose.postgres.yml up -d

# Check database connectivity
docker-compose -f docker-compose.postgres.yml exec postgres pg_isready -U user -d quicksme
```

### Test Failures
- **429 Rate Limited**: Add delays between requests
- **500 Server Error**: Check application logs
- **400 Bad Request**: Verify request payload format
- **404 Not Found**: Ensure resource exists or check URL

## 📝 Test Data Management

### Sample Data Included
The system comes with pre-loaded sample data:
- 8 sample ledgers
- 4 sample parties
- 5 sample stock items
- GST-compliant transactions

### Test Data Creation
Use the collection's "Create" requests to generate test data:
1. Create test ledgers
2. Add parties (customers/vendors)
3. Set up stock items
4. Generate transactions

## 🔧 Advanced Testing Scenarios

### Integration Testing
- **Payment Gateway**: Mock external payment APIs
- **Email Service**: Test notification systems
- **File Upload**: Document attachment handling

### End-to-End Workflows
1. **Sales Process**: Customer → Quotation → Invoice → Payment
2. **Purchase Process**: Vendor → PO → Goods Receipt → Payment
3. **Inventory Management**: Reorder → Purchase → Stock Update

### Compliance Testing
- **GST Calculations**: Verify tax computations
- **Audit Trail**: Check transaction logging
- **Data Retention**: Validate record keeping

## 📊 Reporting & Monitoring

### Test Reports
- **Newman JSON**: Detailed test results
- **HTML Reports**: Visual test summaries
- **JUnit XML**: CI/CD integration

### Monitoring Dashboards
- **Grafana**: Performance metrics
- **Prometheus**: System monitoring
- **Custom Dashboards**: Business KPIs

## 🎯 Best Practices

### Test Organization
- Group related tests in folders
- Use descriptive test names
- Include test data setup/teardown

### Performance Testing
- Start with baseline measurements
- Gradually increase load
- Monitor system resources

### Security Testing
- Test input sanitization
- Validate authentication
- Check authorization levels

### Maintenance
- Update tests with API changes
- Review test coverage regularly
- Archive old test results

---

## 📞 Support

For issues with testing:
1. Check the troubleshooting section
2. Review application logs
3. Verify test data integrity
4. Contact development team

**Happy Testing! 🚀**
