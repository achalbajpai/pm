from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import requests
from datetime import datetime
import re

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Weather Application API",
    description="API for weather information using Visual Crossing API",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

VISUAL_CROSSING_API_KEY = os.getenv(
    "VISUAL_CROSSING_API_KEY", "XYZVMMZQE73Q8XDH6GAPUC3F3"
)


def is_valid_postal_code(code: str) -> tuple[bool, str]:
    """Check if the string is a valid US ZIP code or Indian PIN code."""
    # Check if it's exactly 5 digits (US ZIP code)
    if re.match(r"^\d{5}$", code):
        return True, "USA"
    # Check if it's exactly 6 digits (Indian PIN code)
    if re.match(r"^\d{6}$", code):
        return True, "India"
    return False, ""


@app.get("/api/weather/{location}")
async def get_weather(location: str):
    """Get current weather and forecast for a location"""
    try:
        # Clean the location string
        location = location.strip()

        # Handle postal codes (ZIP/PIN)
        if location.isdigit():
            is_valid, country = is_valid_postal_code(location)
            if is_valid:
                location = f"{location},{country}"
            else:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid postal code format. Please enter a valid US ZIP code (5 digits) or Indian PIN code (6 digits).",
                )

        url = f"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{location}?unitGroup=metric&key={VISUAL_CROSSING_API_KEY}&include=current,days"

        response = requests.get(url)

        # Handle specific error cases
        if response.status_code == 400:
            raise HTTPException(
                status_code=400,
                detail="Invalid location format. Please check your input.",
            )
        elif response.status_code == 401:
            raise HTTPException(
                status_code=401, detail="API key error. Please try again later."
            )
        elif response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail="Location not found. Please check the location and try again.",
            )

        response.raise_for_status()
        data = response.json()

        if "currentConditions" not in data or "days" not in data:
            raise HTTPException(
                status_code=404, detail="Weather data not found for this location"
            )

        # Get the resolved location name
        location_name = data.get("resolvedAddress", location)
        if (
            location_name == location
            and is_valid_postal_code(location.split(",")[0])[0]
        ):
            location_name = f"ZIP {location.split(',')[0]}, {location.split(',')[1]}"

        return {
            "current": {
                "temperature": data["currentConditions"].get("temp", 0),
                "humidity": data["currentConditions"].get("humidity", 0),
                "description": data["currentConditions"].get("conditions", "Unknown"),
                "wind_speed": data["currentConditions"].get("windspeed", 0),
                "date_time": data["currentConditions"].get("datetime", ""),
            },
            "forecast": [
                {
                    "temperature": day.get("temp", 0),
                    "humidity": day.get("humidity", 0),
                    "description": day.get("conditions", "Unknown"),
                    "wind_speed": day.get("windspeed", 0),
                    "date_time": day.get("datetime", ""),
                }
                for day in data.get("days", [])[1:6]  # Next 5 days forecast
            ],
            "location": {
                "name": location_name,
                "timezone": data.get("timezone", "Unknown"),
            },
        }
    except requests.exceptions.HTTPError as e:
        status_code = getattr(e.response, "status_code", 500)
        raise HTTPException(
            status_code=status_code, detail=f"Failed to fetch weather data: {str(e)}"
        )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Network error while fetching weather data: {str(e)}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {str(e)}"
        )
