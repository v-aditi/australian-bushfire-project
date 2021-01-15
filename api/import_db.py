"""
    Script used to import data from a CSV and store it in the database.
"""
import sqlite3
import pandas

__author__ = "Aditi Venkatesh, Jessica Oh Hui Yu, Zaccary Allen"
__status__ = "Production"
__credits__ = ["Aditi Venkatesh", "Jessica Oh Hui Yu, Zaccary Allen"]

conn = sqlite3.connect('database.db')

df_temperature = pandas.read_csv('../data/temperature.csv')
df_rainfall = pandas.read_csv('../data/rainfall.csv')
df_fire_danger_zone = pandas.read_csv('../data/fire_danger_zone.csv')
df_wind = pandas.read_csv('../data/wind_velocity.csv')
df_humidity = pandas.read_csv('../data/humidity.csv')

df_temperature.to_sql('temperature', conn, if_exists='append', index=False)
df_rainfall.to_sql('rainfall', conn, if_exists='append', index=False)
df_fire_danger_zone.to_sql('fire_danger_zone', conn, if_exists='append', index=False)
df_wind.to_sql('wind_velocity', conn, if_exists='append', index=False)
df_humidity.to_sql('humidity', conn, if_exists='append', index=False)

conn.close()