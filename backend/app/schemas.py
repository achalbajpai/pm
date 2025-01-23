from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class LocationBase(BaseModel):
    name: str
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    country: str


class LocationCreate(LocationBase):
    pass


class Location(LocationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class WeatherBase(BaseModel):
    temperature: float
    humidity: float
    pressure: float
    description: str
    wind_speed: float
    date_time: datetime
    forecast_data: Optional[dict] = None


class WeatherCreate(WeatherBase):
    location_id: int


class WeatherRecord(WeatherBase):
    id: int
    location_id: int
    created_at: datetime
    location: Location

    class Config:
        from_attributes = True


class WeatherResponse(BaseModel):
    current: WeatherBase
    forecast: Optional[List[WeatherBase]] = None
    location: Location


class LocationSearch(BaseModel):
    query: str
    date_range_start: Optional[datetime] = None
    date_range_end: Optional[datetime] = None


class ExportFormat(BaseModel):
    format: str = Field(..., regex="^(json|csv|pdf|xml|markdown)$")
