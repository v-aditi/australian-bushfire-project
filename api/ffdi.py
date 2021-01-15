"""
    This file is a script used to calculate the FFDI (exluding drought factor)
    and store it in the database.
"""
import time
import os
import sqlite3
import pandas as pd
from contextlib import closing
import pmdarima as pm
from datetime import timedelta, date
import math

__author__ = "Aditi Venkatesh, Jessica Oh Hui Yu, Zaccary Allen"
__status__ = "Production"
__credits__ = ["Aditi Venkatesh", "Jessica Oh Hui Yu, Zaccary Allen"]

# constant list of fire danger zones in database - used for filtering to forecast more accurately
FIRE_DANGER_ZONES = ['86068', '88043', '90194', '79028', '77094', '88051', '82138', '84143', '85072', '66194', '59140', '61250', '52088', '67113', '69022', '72150',
'65068', '2032', '12038', '9215', '27073', '29127', '36031', '44026', '40913', '40764', '40043', '70339', '94212', '91107', '91237', '11019', '26021', '22018', '22841', '23122',
'24024', '24521', '23343', '23013', '14272', '14401', '15135', '15602', '15590']

def get_date_range(date1, date2):
    """
        This function calculates the required date range. Helper function for get_dates().
        date1: start date
        date2: end date
        return: iterable date range between start and end date
    """
    for n in range(int ((date2 - date1).days)+1):
        yield date1 + timedelta(n)

def get_dates(start_dt, end_dt):
    """
        This function gets a list of dates for the forecasting funtion. 
        return: list of dates
    """
    dates = []
    for dt in get_date_range(start_dt, end_dt):
        dates.append(dt.strftime("%Y-%m-%d"))
    return dates

def calculate_ffdi():
    """
        This function calculates McAthur's Forest Fire Danger Index (FFDI) and then stores it in the database
    """
    conn = sqlite3.connect('database.db')

    for zone in FIRE_DANGER_ZONES:
        # create empty data frame
        ffdi_df = pd.DataFrame()

        # read data from database
        temp_df = pd.read_sql_query("Select temp_date,temp_max From temperature Left join fire_danger_zone on temperature.temp_station=fire_danger_zone.fdz_station Where fire_danger_zone.fdz_station == '" + zone + "' and temperature.temp_date >= date('2010-01-01') Order by temperature.temp_date;",conn)
        humidity_df = pd.read_sql_query("Select humidity_date, humidity_relative From humidity Left join fire_danger_zone on humidity.humidity_station=fire_danger_zone.fdz_station Where fire_danger_zone.fdz_station == '" + zone + "' and humidity.humidity_date >= date('2010-01-01') Order by humidity.humidity_date;",conn)
        wind_speed_df = pd.read_sql_query("Select wind_date, wind_speed From wind_velocity Left join fire_danger_zone on wind_velocity.wind_station=fire_danger_zone.fdz_station Where fire_danger_zone.fdz_station == '" + zone + "' and wind_velocity.wind_date >= date('2010-01-01') Order by wind_velocity.wind_date;",conn)

        # get dates
        ffdi_df['ffdi_date'] = get_dates(date(2010, 1, 1), date(2022, 12, 31))

        # calculate FFDI
        ffdi_df['ffdi_value'] = 2 * (math.e**(-0.45 - 0.0345*humidity_df['humidity_relative'] + 0.0338*temp_df['temp_max'] + 0.0234*wind_speed_df['wind_speed']))
        
        # add zone to data frame
        ffdi_df['ffdi_station'] = zone

        # store FFDI in database
        ffdi_df.to_sql('forest_fire_danger_index', conn, if_exists='append', index=False)
    
    # close database connection
    conn.close()

if __name__ == "__main__":
    calculate_ffdi()