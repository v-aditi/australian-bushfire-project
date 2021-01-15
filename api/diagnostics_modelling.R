# This file contians an R Script used to evaluate the forecasting model.

library(DBI)
library(RSQLite)
library(prophet)
library(tidyverse)
library(fpp3)

# list of fire danger zones
zones <- c('86068', '88043', '90194', '79028', '77094', '88051', '82138', '84143', 
           '85072', '66194', '59140', '61250', '52088', '67113', '69022', '72150',
           '65068', '2032', '12038', '9215', '27073', '29127', '36031', '44026', 
           '40913', '40764', '40043', '70339', '94212', '91107', '91237', '11019', 
           '26021', '22018', '22841', '23122', '24024', '24521', '23343', '23013', 
           '14272', '14401', '15135', '15602', '15590')

# connecting to database
myDB <- "Desktop/Code/bushfire-dashboard/api/database.db"
conn <- dbConnect(drv = SQLite(), dbname= myDB)

# get model using FBProphet
get_model <- function(data_frame) {
  m <- prophet(weekly.seasonality=FALSE)
  m <- add_seasonality(m, name='monthly', period=30.5, fourier.order=5)
  m <- fit.prophet(m,data_frame)
  return (m)
}

# Function to obtain the performance measures of the model
get_performance_metrics <- function(model) {
  df_cv <- cross_validation(m, initial = 2555, period = 365, horizon = 730, units = 'days')
  performance <- performance_metrics(df_cv)
  return (performance)
}

# gets average of each column in the dataframe
get_average <- function(data_frame) {
  df_avg <- sapply(data_frame,FUN=mean)
  return (df_avg)
}

# obtain diagnostic measures of performance for temperature model
diagnostics_temperature <- function(zone,conn) {
  temp_query = paste("Select temp_date, temp_max FROM temperature Left join 
                     fire_danger_zone on temperature.temp_station=fire_danger_zone.fdz_station 
                     Where fire_danger_zone.fdz_station == '",zone,"' and temperature.temp_date 
                     >= date('2010-01-01') Order by temperature.temp_date;", sep="")
  # need to rename columns to meet requirements of FBProphet
  data_frame <- dbGetQuery(conn,temp_query) %>% 
        rename(
          ds = temp_date,
          y = temp_max
        )
  model <- get_model(data_frame)
  performance <- get_performance_metrics(model)
  return (get_average(performance))
}

# obtain diagnostic measures of performance for rainfall model
diagnostics_rainfall <- function(zone,conn) {
  temp_query = paste("Select rain_date, rain_rainfall FROM rainfall Left join 
                     fire_danger_zone on rainfall.rain_station=fire_danger_zone.fdz_station 
                     Where fire_danger_zone.fdz_station == '",zone,"' and rainfall.rain_date 
                     >= date('2010-01-01') Order by rainfall.rain_date;", sep="")
  # need to rename columns to meet requirements of FBProphet
  data_frame <- dbGetQuery(conn,temp_query) %>% 
    rename(
      ds = rain_date,
      y = rain_rainfall
    )
  model <- get_model(data_frame)
  performance <- get_performance_metrics(model)
  return (get_average(performance))
}

# obtain diagnostic measures of performance for humidity model
diagnostics_humidity <- function(zone,conn) {
  temp_query = paste("Select humidity_date, humidity_relative FROM humidity Left join 
                     fire_danger_zone on humidity.humidity_station=fire_danger_zone.fdz_station 
                     Where fire_danger_zone.fdz_station == '",zone,"' and humidity.humidity_date 
                     >= date('2010-01-01') Order by humidity.humidity_date;", sep="")
  # need to rename columns to meet requirements of FBProphet
  data_frame <- dbGetQuery(conn,temp_query) %>% 
    rename(
      ds = humidity_date,
      y = humidity_relative
    )
  # get model and evaluate its performance
  model <- get_model(data_frame)
  performance <- get_performance_metrics(model)
  return (get_average(performance))
}

# obtain diagnostic measures of performance for wind speed model
diagnostics_wind <- function(zone,conn) {
  temp_query = paste("Select wind_date, wind_speed FROM wind_velocity Left join 
                     fire_danger_zone on wind_velocity.wind_station=fire_danger_zone.fdz_station 
                     Where fire_danger_zone.fdz_station == '",zone,"' and wind_velocity.wind_date 
                     >= date('2010-01-01') Order by wind_velocity.wind_date;", sep="")
  # need to rename columns to meet requirements of FBProphet
  data_frame <- dbGetQuery(conn,temp_query) %>% 
    rename(
      ds = wind_date,
      y = wind_speed
    )
  # get model and evaluate its performance
  model <- get_model(data_frame)
  performance <- get_performance_metrics(model)
  return (get_average(performance))
}

# main function that combines all performance metrics
get_average_performance <- function(zones,conn) {
  
  # initialise empty dataframe
  results_temperature <- data.frame(matrix(ncol = 6, nrow = 0))
  results_rainfall <- data.frame(matrix(ncol = 6, nrow = 0))
  results_humidity <- data.frame(matrix(ncol = 6, nrow = 0))
  results_wind <- data.frame(matrix(ncol = 6, nrow = 0))
  results_final <- data.frame(matrix(ncol = 7, nrow = 0))
  
  # update column names for readability
  x <- c("horizon", "mse", "rmse", "mae", "mape", "coverage")
  colnames(results_temperature) <- x
  colnames(results_rainfall) <- x
  colnames(results_humidity) <- x
  colnames(results_wind) <- x
  
  y <- c("variable", "horizon", "mse", "rmse", "mae", "mape", "coverage")
  colnames(results_final) <- y
  
  # evaluate temperature, rainfall, humidity and wind model for each zone
  for (i in 1:length(zones)) {
    zone <- zones[i]
    print(zone)
    performance_tempertature <- diagnostics_temperature(zone,conn)
    results_temperature <- rbind(results_temperature,performance_tempertature)
    
    performance_rainfall <- diagnostics_rainfall(zone,conn)
    results_rainfall <- rbind(results_rainfall,performance_rainfall)
    
    performance_humidity <- diagnostics_humidity(zone,conn)
    results_humidity <- rbind(results_humidity,performance_humidity)
    
    performance_wind <- diagnostics_wind(zone,conn)
    results_wind <- rbind(results_wind,performance_wind)
  }
  
  # average of each datframe
  avg_temp <- get_average(results_temperature)
  avg_rain <- get_average(results_rainfall)
  avg_humidity <- get_average(results_humidity)
  avg_wind <- get_average(results_wind)
  
  # add results into one data frame which is to be returned
  results_final <- rbind(results_final, avg_temp)
  results_final <- rbind(results_final, avg_rain)
  results_final <- rbind(results_final, avg_humidity)
  results_final <- rbind(results_final, avg_wind)
  
  return (results_final)
}

print(get_average_performance(zones,conn))
