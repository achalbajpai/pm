# Weather Application

A modern weather application built with React (frontend) and FastAPI (backend) that provides current weather information and 5-day forecasts for any city or US/Indian postal codes.

## Features

-  Current weather information including:
   -  Temperature
   -  Humidity
   -  Wind speed
   -  Weather conditions with icons
-  5-day weather forecast
-  Support for both city names and US ZIP codes
-  Responsive design for all devices
-  Error handling and input validation
-  Clean and modern UI using Material-UI

## Tech Stack

### Frontend

-  React.js
-  Material-UI for components
-  Axios for API requests
-  date-fns for date formatting

### Backend

-  FastAPI (Python)
-  Visual Crossing Weather API
-  Python-dotenv for environment variables

## Prerequisites

-  Node.js (v14 or higher)
-  Python 3.10 or higher
-  Visual Crossing API key (get it from [Visual Crossing Weather](https://www.visualcrossing.com/weather-api))

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with your API key:

   ```
   VISUAL_CROSSING_API_KEY=your_api_key_here
   ```

5. Start the backend server:
   ```bash
   cd app
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

## Usage

1. Open your browser and go to `http://localhost:3000`
2. Enter a city name (e.g., "London") or a US ZIP code (e.g., "10001")
3. Click the Search button or press Enter
4. View the current weather and 5-day forecast

## Project Structure

```
weather-application/
├── backend/
│   ├── app/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   │   └── Home.js
│   │   │   └── App.js
│   │   │   └── index.js
│   │   │
│   │   ├── package.json
│   │   └── package-lock.json
│   │
│   └── README.md
```

## Error Handling

The application includes comprehensive error handling for:

-  Invalid locations
-  Network errors
-  API errors
-  Invalid ZIP code formats
-  Missing input validation

## Deployment

### Frontend Deployment (Netlify)

1. Fork or clone this repository
2. Connect your GitHub repository to Netlify:
   -  Log in to Netlify
   -  Click "New site from Git"
   -  Choose your repository
   -  Set build settings:
      -  Base directory: `frontend`
      -  Build command: `npm run build`
      -  Publish directory: `build`
3. Set environment variables in Netlify:
   -  Go to Site settings > Build & deploy > Environment
   -  Add environment variable:
      -  Key: `REACT_APP_API_URL`
      -  Value: Your backend API URL

### Backend Deployment

The backend needs to be deployed to a service that supports Python/FastAPI applications. Some options include:

-  Heroku
-  DigitalOcean
-  AWS Elastic Beanstalk
-  Google Cloud Run

Make sure to:

1. Set up CORS to allow requests from your Netlify domain
2. Configure environment variables on your backend host
3. Update the frontend's `.env.production` with your backend URL

## Environment Variables

### Frontend

-  `REACT_APP_API_URL`: Backend API URL

### Backend

-  `VISUAL_CROSSING_API_KEY`: Your Visual Crossing Weather API key
