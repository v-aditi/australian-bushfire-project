"""
    This script is used to fit a model using FBProphet and then forecast future data.
    The forecasted data is stored in the SQLite3 database so it can be used
    for data visualisations.
"""

import time
import os
import sqlite3
import json
import pandas as pd
from contextlib import closing
from datetime import timedelta, date
from fbprophet import Prophet
from pandas.core.tools.datetimes import to_datetime

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
        This function gets a list of dates for the forecasting funtion
        start_dt: start date
        end_dt: end date
        return: list of dates
    """
    dates = []
    for dt in get_date_range(start_dt, end_dt):
        dates.append(dt.strftime("%Y-%m-%d"))
    return dates

def get_model(df):
    """
        This function fits the model using FBProphet for the given dataframe
        df: dataframe using which the model is being fit
        return: the final fitted model is returned
    """
    # fit the model
    model = Prophet(interval_width=0.95, weekly_seasonality=False)
    model.add_seasonality(name='monthly', period=30.5, fourier_order=5)
    model = model.fit(df)
    return model

def get_future_dates(df, kaggle):
    """
        This function gets future dates for forecasting
        df: dataframe used to get future dates
        kaggle: boolean to check datasource 
        return: dataframe that contains future dates for forecasting
    """
    # get future dates
    dates = df['ds'].values.tolist()
    if not kaggle:
        future_dates = pd.DataFrame(get_dates(date(2020, 1, 1), date(2022, 12, 31)))
    else:
        future_dates = pd.DataFrame(get_dates(date(2017, 6, 1), date(2022, 12, 31)))
    future_dates.columns = ['ds']
    future_dates['ds']= to_datetime(future_dates['ds'])
    future_dates['ds'] = future_dates['ds'].dt.strftime('%Y-%m-%d')
    return future_dates

def forecast(table, prefix, value_col, kaggle):
    """
        This function uses fbprophet to forecast values of the table provided.
        table: name of table in SQLite3 database
        prefix: prefix of station and date attribute names within table
        value_col: name of column in table that is being forecasted
        kaggle: data from kaggle is only available until 2017-05-31
    """
    date_col = prefix + '_date'
    station_col = prefix + '_station'

    # connect to database
    conn = sqlite3.connect('database.db')

    # get data from frame and forecast new values
    for zone in FIRE_DANGER_ZONES:
        if not kaggle:
            query = "Select " + date_col + ", " + value_col + " From " + table + " Left join fire_danger_zone on "+table+"."+station_col+"=fire_danger_zone.fdz_station Where fire_danger_zone.fdz_station == '" + zone + "' and "+ table +"."+date_col+" >= date('2010-01-01') Order by "+ table +"."+date_col+";"
        else:
            query = "Select " + date_col + ", " + value_col + " From " + table + " Left join fire_danger_zone on "+table+"."+station_col+"=fire_danger_zone.fdz_station Where fire_danger_zone.fdz_station == '" + zone + "' and "+ table +"."+date_col+" >= date('2010-01-01') and "+ table +"."+date_col+" <= date('2017-05-31') Order by "+ table +"."+date_col+";"
        df = pd.read_sql_query(query, conn).rename(columns={date_col: 'ds', value_col: 'y'})

        model = get_model(df)

        future_dates = get_future_dates(df, kaggle)

        # forecast the model
        forecast = model.predict(future_dates)
        future_data = forecast['yhat'].values.tolist()
        
        # create new dataframe
        df_future = pd.DataFrame()
        future_data_df = pd.DataFrame()
        future_data_df['future_data'] = future_data
        df_future = pd.concat([future_dates, future_data_df], axis=1)
        df_future = df_future.rename(columns={'future_data':value_col, 'ds':date_col})
        df_future[station_col] = zone

        # store forecasted data in database
        df_future.to_sql(table, conn, if_exists='append', index=False)

    # disconnect from database
    conn.close()

if __name__ == "__main__":
    # Note: since FFDI is derived from the values below, there is no need to forecast it
    forecast('temperature', 'temp', 'temp_max', False) # forecast temperature values
    forecast('rainfall', 'rain', 'rain_rainfall', False) # forecast rainfall values
    forecast('wind_velocity', 'wind', 'wind_speed', True) # forecast wind speed values
    forecast('humidity', 'humidity', 'humidity_relative', True) # forecast humidity values
    