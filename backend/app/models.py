from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    country = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    weather_records = relationship("WeatherRecord", back_populates="location")


class WeatherRecord(Base):
    __tablename__ = "weather_records"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"))
    temperature = Column(Float)
    humidity = Column(Float)
    pressure = Column(Float)
    description = Column(String)
    wind_speed = Column(Float)
    date_time = Column(DateTime)
    forecast_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    location = relationship("Location", back_populates="weather_records")
