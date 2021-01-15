"""
    Script used to clean temperature data from the Bureau of Meteorology.
"""

import pandas as pd
import sys

__author__ = "Aditi Venkatesh"
__status__ = "Testing"
__credits__ = ["Aditi Venkatesh"]

pd.set_option('display.max_columns', None)
pd.set_option('display.max_rows', 150)


def clean_data_temp(filename_max, station):
    # read data
    df = pd.read_csv(filename_max)

    # combine date columns
    df['date'] = pd.to_datetime(df[["Year", "Month", "Day"]])

    # remove dates (constrict data to between 2010 and 2019)
    df = df[(df['date'].dt.year >= 2010)]
    df = df[(df['date'].dt.year <= 2019)]

    # rename maximum daily temperature column
    df.rename(columns={'Maximum temperature (Degree C)':'max_temperature'}, inplace=True)

    # add default values using mean to fill empty spaces
    df.max_temperature = df.max_temperature.fillna(df.max_temperature.mean())

    # add station number
    df['station'] = station

    # select required columns
    df = df[['date', 'station', 'max_temperature']]

    new_filename = "cleaned_" + station + ".csv"

    df.to_csv(new_filename, index=False)


if __name__ == "__main__":

    filename_max = sys.argv[1]
    station = sys.argv[2]

    clean_data_temp(filename_max, station)

