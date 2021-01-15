"""
    Main module for Flask Server. Handles querying of data from the database and then 
    returning a JSON object which is to be used by the ReactJS Front-end.
"""
import time
import os
import sqlite3
import json
import pandas as pd
from flask import Flask, jsonify
from flask_api import FlaskAPI
from contextlib import closing
import pmdarima as pm
from datetime import timedelta, date
from fbprophet import Prophet
import random
import math

__author__ = "Aditi Venkatesh, Jessica Oh Hui Yu, Zaccary Allen"
__status__ = "Production"
__credits__ = ["Aditi Venkatesh", "Jessica Oh Hui Yu, Zaccary Allen"]

# create app
app = Flask(__name__)

def daterange(start_date, end_date):
    """ Yields a range of date.

    Args:
        start_date (date): start of the date range.
        end_date (date): end of the date range.
    
    Yields:
        Range of dates.
    """
    for n in range(int ((end_date - start_date).days)+1):
        yield start_date + timedelta(n)

def get_dates():
    """ Get a range of dates in a list.

    Returns:
        dates (list): A list of dates
    """
    dates = []
    start_date = date(2020, 1, 1)
    end_date = date(2022, 12, 31)
    for date in daterange(start_date, end_date):
        dates.append(date.strftime("%Y-%m-%d"))
    return dates

# temperature api
@app.route('/temperature/<zone>')
def get_temperature_data(zone):
    """ API to get temperature data. Gets maximum temperatures and dates from database.

    Args:
        zone (string): station number for the zone.
    
    Returns:
        response (json): json object of the temperatures and dates.
    """

    zone = zone[1:len(zone)-1]
    temp_response = {}
    conn = sqlite3.connect(os.path.abspath('database.db'))

    # get temperatures data
    query = "Select temp_date, temp_max From temperature Left join fire_danger_zone on temperature.temp_station=fire_danger_zone.fdz_station Where fire_danger_zone.fdz_station == '" + zone + "' and temperature.temp_date >= date('2010-01-01') Order by temperature.temp_date;"
    dataframe = pd.read_sql_query(query, conn) 
    temperatures = dataframe['temp_max'].values.tolist()

    # get dates
    dates = dataframe['temp_date'].values.tolist()
    
    # add data in dictionary 
    data_name = 'temp_'+zone
    temp_response[data_name] = temperatures
    temp_response['labels'] = dates
    
    # return data
    response = jsonify(temp_response)
    response.headers.add('Access-Control-Allow-Origin', '*')
    
    # close database connection
    conn.close()
    return response

# rainfall api
@app.route('/rainfall/<zone>')
def get_rainfall_data(zone):
    """ API to get rainfall data. Gets rainfall amount and dates from database.

    Args:
        zone (string): station number for the zone.
    
    Returns:
        response (json): json object of the rainfall amount and dates.
    """
    zone = zone[1:len(zone)-1]
    rain_response = {}
    conn = sqlite3.connect(os.path.abspath('database.db'))

    # get rainfall data
    query = "Select rain_date, rain_rainfall From rainfall Left join fire_danger_zone on rainfall.rain_station=fire_danger_zone.fdz_station Where fire_danger_zone.fdz_station == '" + zone + "' and rainfall.rain_date >= date('2010-01-01') Order by rainfall.rain_date;"
    dataframe = pd.read_sql_query(query, conn)   
    rainfall = dataframe['rain_rainfall'].values.tolist()

    # get dates
    dates = dataframe['rain_date'].values.tolist()
    
    # add data in dictionary 
    data_name = 'rain_'+zone
    rain_response[data_name] = rainfall
    rain_response['labels'] = dates
    
    # return data
    response = jsonify(rain_response)
    response.headers.add('Access-Control-Allow-Origin', '*')
    
    # close database connection
    conn.close()
    return response

# humidity api
@app.route('/humidity/<zone>')
def get_humidity_data(zone):
    """ API to get humidity data. Gets humidity and dates from database.

    Args:
        zone (string): station number for the zone.
    
    Returns:
        response (json): json object of the humidity and dates.
    """

    zone = zone[1:len(zone)-1]
    humidity_response = {}
    conn = sqlite3.connect(os.path.abspath('database.db'))

    # get humidity data
    query = "Select humidity_date, humidity_relative From humidity Left join fire_danger_zone on humidity.humidity_station=fire_danger_zone.fdz_station Where fire_danger_zone.fdz_station == '" + zone + "' and humidity.humidity_date >= date('2010-01-01') Order by humidity.humidity_date;"
    dataframe = pd.read_sql_query(query, conn)  
    humidity = dataframe['humidity_relative'].values.tolist()

    # get dates
    dates = dataframe['humidity_date'].values.tolist()
    
    # add data in dictionary 
    data_name = 'humidity_'+zone
    humidity_response[data_name] = humidity
    humidity_response['labels'] = dates
    
    # return data
    response = jsonify(humidity_response)
    response.headers.add('Access-Control-Allow-Origin', '*')
    
    # close database connection
    conn.close()
    return response

# wind api
@app.route('/wind/<zone>')
def get_wind_data(zone):
    """ API to get wind speed data. Gets wind speed and dates from database.

    Args:
        zone (string): station number for the zone.
    
    Returns:
        response (json): json object of the wind speed and dates.
    """

    zone = zone[1:len(zone)-1]
    wind_response = {}
    conn = sqlite3.connect(os.path.abspath('database.db'))

    # get wind data
    query = "Select wind_date, wind_speed From wind_velocity Left join fire_danger_zone on wind_velocity.wind_station=fire_danger_zone.fdz_station Where fire_danger_zone.fdz_station == '" + zone + "' and wind_velocity.wind_date >= date('2010-01-01') Order by wind_velocity.wind_date;"
    dataframe = pd.read_sql_query(query, conn)  
    wind = dataframe['wind_speed'].values.tolist()

    # get dates
    dates = dataframe['wind_date'].values.tolist()
    
    # add data in dictionary 
    data_name = 'wind_'+zone
    wind_response[data_name] = wind
    wind_response['labels'] = dates
    
    # return data
    response = jsonify(wind_response)
    response.headers.add('Access-Control-Allow-Origin', '*')
    
    # close database connection
    conn.close()
    return response

# McAthur's FFFDI 
@app.route('/forestfire/<zone>')
def forest_fire_calculator(zone):
    """ Calculate Forest Fire. Gets FFDI and dates from databse.

    Args:
        zone (string): station number for the zone.
    
    Returns:
        response (json): json object of the FFDI and dates.
    """

    drought_factor = 2
    drought_factor = int(drought_factor)
    ffdi_response = {}
    conn = sqlite3.connect(os.path.abspath('database.db'))

    # get FFDI data
    query = "Select ffdi_date, ffdi_value From forest_fire_danger_index Left join fire_danger_zone on forest_fire_danger_index.ffdi_station=fire_danger_zone.fdz_station Where fire_danger_zone.fdz_station == '" + zone + "' and forest_fire_danger_index.ffdi_date >= date('2010-01-01') Order by forest_fire_danger_index.ffdi_date;"
    dataframe = pd.read_sql_query(query, conn)    
    ffdi = dataframe['ffdi_value'].values.tolist()

    # get dates
    dates = dataframe['ffdi_date'].values.tolist()
    
    # add data in dictionary 
    data_name = 'ffdi_'+zone
    ffdi_response[data_name] = ffdi
    ffdi_response['labels'] = dates
    
    # return data
    response = jsonify(ffdi_response)
    response.headers.add('Access-Control-Allow-Origin', '*')
    
    # close database connection
    conn.close()
    return response

# McAthur's FFFDI 
@app.route('/FFDI/<zone>/<drought_factor>')
def FFDI_calculator(zone, drought_factor):
    """ Calculate for McAthur's FFFDI based on drought factor. Get FFDI and dates 

    Args:
        zone (string): station number for the zone.
        drought_factor (string): drought factor for the formula.
    
    Returns:
        response (json): json object of the FFDI and dates.
    """
    zone = zone[1:len(zone)-1]
    drought_factor = int(drought_factor[1:len(drought_factor)-1])
    ffdi_response = {}
    conn = sqlite3.connect(os.path.abspath('database.db'))

    # get FFDI data
    query = "Select ffdi_date, ffdi_value From forest_fire_danger_index Left join fire_danger_zone on forest_fire_danger_index.ffdi_station=fire_danger_zone.fdz_station Where fire_danger_zone.fdz_station == '" + zone + "' and forest_fire_danger_index.ffdi_date >= date('2010-01-01') Order by forest_fire_danger_index.ffdi_date;"
    dataframe = pd.read_sql_query(query, conn)
    ffdi = dataframe['ffdi_value'].values.tolist()
    for i in range(len(ffdi)):
        ffdi[i] = ffdi[i]*(math.e**(0.987*math.log(drought_factor)))
        if ffdi[i] > 100:
            ffdi[i] = 100

    # get dates
    dates = dataframe['ffdi_date'].values.tolist()
    
    # add data in dictionary 
    data_name = 'ffdi_'+zone
    ffdi_response[data_name] = ffdi
    ffdi_response['labels'] = dates
    
    # return data
    response = jsonify(ffdi_response)
    response.headers.add('Access-Control-Allow-Origin', '*')
    
    # close database connection
    conn.close()
    return response

if __name__ == '__main__':
    app.run(debug=True)
    



