# Country Currency & Exchange API

A RESTful API that fetches country data from external APIs, stores it in a database, and provides CRUD operations with GDP calculations and image summaries.

## Live Demo
**Base URL:** `https://your-app-domain.com`  
**GitHub Repository:** `https://github.com/your-username/backend-wizards-stage2`

## 📋 Features
- Fetch and cache country data from external APIs
- Calculate estimated GDP based on exchange rates
- Filter and sort countries by region, currency, GDP, population
- Generate summary images with country statistics
- Full CRUD operations for country data
- System status monitoring

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MySQL with Prisma ORM
- **Image Generation:** Canvas
- **Package Manager:** npm

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- npm

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/backend-wizards-stage2.git
   cd backend-wizards-stage2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/countryDB"
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Create database tables
   npx prisma db push
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production build
   npm run build
   npm start
   ```

## 🔧 API Endpoints

### Country Operations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/countries/refresh` | Fetch latest country data and exchange rates |
| `GET` | `/countries` | Get all countries with optional filters |
| `GET` | `/countries/:name` | Get specific country by name |
| `DELETE` | `/countries/:name` | Delete country by name |
| `GET` | `/countries/image` | Get generated summary image |

### System Operations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/status` | Get system status and counts |
| `GET` | `/health` | Health check endpoint |

## 📖 Usage Examples

### Refresh Country Data
```bash
curl -X POST http://localhost:3000/countries/refresh
```
**Response:**
```json
{
  "message": "Countries data refreshed successfully",
  "total_countries": 250,
  "last_refreshed_at": "2025-10-25T15:30:00Z"
}
```

### Get All Countries with Filters
```bash
# Get African countries sorted by GDP
curl "http://localhost:3000/countries?region=Africa&sort=gdp_desc"

# Get countries using Nigerian Naira
curl "http://localhost:3000/countries?currency=NGN"
```

### Get Specific Country
```bash
curl http://localhost:3000/countries/Nigeria
```

### Get Summary Image
```bash
curl http://localhost:3000/countries/image -o summary.png
```

### Get System Status
```bash
curl http://localhost:3000/status
```
**Response:**
```json
{
  "total_countries": 250,
  "last_refreshed_at": "2025-10-25T15:30:00Z"
}
```

## 🎯 Query Parameters

### GET `/countries`
- `region` - Filter by region (e.g., Africa, Europe)
- `currency` - Filter by currency code (e.g., NGN, USD)
- `sort` - Sort by:
  - `gdp_desc` - GDP descending
  - `gdp_asc` - GDP ascending
  - `population_desc` - Population descending
  - `population_asc` - Population ascending

## 📊 GDP Calculation
The estimated GDP is calculated as:
```
estimated_gdp = population × random(1000–2000) ÷ exchange_rate
```

### Special Cases:
- **No currency**: GDP = 0
- **Currency but no exchange rate**: GDP = null
- **Valid currency and rate**: Normal calculation

## 🗃️ Database Schema

### Country Table
- `id` - Auto-generated primary key
- `name` - Country name (required, unique)
- `capital` - Capital city (optional)
- `region` - Geographic region (optional)
- `population` - Population count (required)
- `currency_code` - Currency code (required)
- `exchange_rate` - Exchange rate vs USD
- `estimated_gdp` - Calculated GDP estimate
- `flag_url` - URL to country flag
- `last_refreshed_at` - Last update timestamp

### SystemStatus Table
- `id` - Primary key
- `last_refreshed_at` - Global refresh timestamp

## 🔄 External APIs
- **Countries Data:** https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies
- **Exchange Rates:** https://open.er-api.com/v6/latest/USD

## 🚨 Error Handling
The API returns consistent JSON error responses:

```json
{
  "error": "Error type",
  "details": "Additional information"
}
```

### Common Status Codes:
- `200` - Success
- `400` - Bad Request (validation failed)
- `404` - Not Found (country not found)
- `500` - Internal Server Error
- `503` - Service Unavailable (external APIs down)

## 📁 Project Structure
```
src/
├── controllers/
│   └── countryController.ts
├── routes/
│   └── countryRoutes.ts
├── utils/
│   ├── gdpCalculation.ts
│   └── imageUtils.ts
├── interfaces/
│   └── interface.ts
├── lib/
│   └── prisma.ts
├── prisma/
│   └── schema.prisma
├── app.ts
└── server.ts
```

## 🏃‍♂️ Running Locally
1. Follow installation steps above
2. Ensure MySQL is running
3. Start the server: `npm run dev`
4. Test endpoints using curl or Postman

## 📝 Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Sync database schema

## 👨‍💻 Author
Your Name  
your.email@example.com

## 📄 License
This project is licensed under the MIT License.

---

**Submission Details:**
- **Full Name:** Your Full Name
- **Email:** your.email@example.com
- **API Base URL:** https://your-app-domain.com
- **GitHub Repo:** https://github.com/Devsinglad/anaylze-country-and-currency-Api.git

*Built for Backend Wizards Stage 2 Challenge*