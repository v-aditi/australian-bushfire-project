"""
    Script used to clean rain data from the Bureau of Meteorology.
"""
import pandas as pd
import sys

__author__ = "Aditi Venkatesh"
__status__ = "Testing"
__credits__ = ["Aditi Venkatesh"]

pd.set_option('display.max_columns', None)
pd.set_option('display.max_rows', 150)


def clean_data_rainfall(filename, station):
    # read data
    df = pd.read_csv(filename)

    # combine date columns
    df['date'] = pd.to_datetime(df[["Year", "Month", "Day"]])

    # remove dates (constrict data to between 1950 and 2019)
    df = df[(df['date'].dt.year >= 2000)]
    df = df[(df['date'].dt.year <= 2019)]

    # rename rainfall column
    df.rename(columns={'Rainfall amount (millimetres)':'rainfall', 'Period over which rainfall was measured (days)': 'recorded_days'}, inplace=True)

    # add default values using mean to fill empty spaces
    df.rainfall = df.rainfall.fillna(df.rainfall.mean())
    df.recorded_days = df.recorded_days.fillna(0)

    # add station number
    df['station'] = station

    # select required columns
    df = df[['date', 'station', 'rainfall', 'recorded_days']]

    new_filename = "cleaned_" + station + ".csv"

    df.to_csv(new_filename, index=False)


if __name__ == "__main__":

    file_name = sys.argv[1]
    station = sys.argv[2]

    clean_data_rainfall(file_name, station)

