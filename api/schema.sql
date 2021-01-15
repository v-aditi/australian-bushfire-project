-- Schema for the SQLite3 database. 

drop table if exists fire_danger_zone;
drop table if exists wind_velocity;
drop table if exists temperature;
drop table if exists rainfall;
drop table if exists humidity;
drop table if exists drought_factor;
drop table if exists forest_fire_danger_index;

CREATE TABLE fire_danger_zone
(
    fdz_station varchar(10) NOT NULL,
    fdz_name varchar(50) NOT NULL,
    fdz_station_longitude numeric(8,2) NOT NULL,
    fdz_station_latitude numeric(8,2) NOT NULL,
    fdz_state varchar(5) NOT NULL,
    CONSTRAINT fdz_pk PRIMARY KEY (fdz_station)
);

CREATE TABLE temperature
(
    temp_date date NOT NULL,
    temp_station varchar(10) NOT NULL,
    temp_max numeric(8,1) NOT NULL,
    CONSTRAINT temperature_pk PRIMARY KEY (temp_date, temp_station)
    CONSTRAINT temperature_fk FOREIGN KEY (temp_station) REFERENCES 
    fire_danger_zone (fdz_station)
);

CREATE TABLE rainfall
(
    rain_date date NOT NULL,
    rain_station varchar(10) NOT NULL,
    rain_rainfall numeric(8,1) NOT NULL,
    CONSTRAINT rainfall_pk PRIMARY KEY (rain_date, rain_station)
    CONSTRAINT rainfall_fk FOREIGN KEY (rain_station) REFERENCES 
    fire_danger_zone (fdz_station)
);

CREATE TABLE wind_velocity
(
    wind_date date NOT NULL,
    wind_station varchar(10) NOT NULL,
    wind_speed numeric(8,2) NOT NULL,
    CONSTRAINT wind_pk PRIMARY KEY (wind_date, wind_station)
    CONSTRAINT wind_fk FOREIGN KEY (wind_station) REFERENCES fire_danger_zone (fdz_station)
);

CREATE TABLE humidity
(
    humidity_date date NOT NULL,
    humidity_station varchar(10) NOT NULL,
    humidity_relative numeric(8,2) NOT NULL,
    CONSTRAINT humidity_pk PRIMARY KEY (humidity_date, humidity_station)
    CONSTRAINT humidity_fk FOREIGN KEY (humidity_station) REFERENCES fire_danger_zone (fdz_station)
);

CREATE TABLE forest_fire_danger_index
(
    ffdi_date date NOT NULL,
    ffdi_station varchar(10) NOT NULL,
    ffdi_value numeric(8,2) NOT NULL,
    CONSTRAINT ffdi_pk PRIMARY KEY (ffdi_date, ffdi_station)
    CONSTRAINT ffdi_fk FOREIGN KEY (ffdi_station) REFERENCES fire_danger_zone (fdz_station)
);

