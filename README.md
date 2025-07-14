# Fortnite.gg Insights Dashboard

A web app for visualizing and forecasting Fortnite Creative map player counts using unofficial data sources.

---

## Setup & Run Steps

### 1 Prerequisites:

- Node.js 18+
- npm or pnpm installed
- Supabase project (for user profiles/auth)

### 2 clone & Install:

```bash
git clone https://github.com/yourusername/fortnite-insights.git
cd fortnite-insights
npm install

### 3 Environment Variables:

Create a .env.local file in the root of the project with the following values:
SUPABASE_URL=https://rzkmyfggejhdwabxaksx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6a215ZmdnZWpoZHdhYnhha3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDg4MjUsImV4cCI6MjA2Nzk4NDgyNX0.LhGtepbEgfd0nz4IDcI3c1a3YlgpLMK_3d4P8lOwsAc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6a215ZmdnZWpoZHdhYnhha3N4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjQwODgyNSwiZXhwIjoyMDY3OTg0ODI1fQ.73EGg7Revu6hr8C6ZR4N-eul_L77oE4ZCAOW6diG4Mo
NEXT_PUBLIC_SUPABASE_URL=https://rzkmyfggejhdwabxaksx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6a215ZmdnZWpoZHdhYnhha3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDg4MjUsImV4cCI6MjA2Nzk4NDgyNX0.LhGtepbEgfd0nz4IDcI3c1a3YlgpLMK_3d4P8lOwsAc

### 4 Run Development Server:
npm run dev

#Approach & Assumptions
The core idea was to fetch Fortnite Creative map player statistics by inspecting the Fortnite.gg website using browser developer tools. By looking through Fetch/XHR requests and analyzing page source attributes such as data-id, I identified hidden public endpoints like /player-count-graph. These endpoints allowed me to pull both full historical data and current player counts programmatically, essentially building an unofficial API layer.

For forecasting, ARIMA was selected because of my previous experience applying it in commercial time series forecasting, specifically for energy prices. It performed well there for predicting smaller timeframes of data based on previous data so I decided to use it here as well. Here, ARIMA is configured to emphasize the most recent 30–60 days while respecting monthly seasonality (s=30) so predictions realistically follow player count behavior trends.
```
