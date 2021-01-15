import json
import pytest
from app import app as flask_app


FIRE_DANGER_ZONES = ['86068', '88043', '90194', '79028', '77094', '88051', '82138', '84143', '85072', '66194', '59140', '61250', '52088', '67113', '69022', '72150',
'65068', '2032', '12038', '9215', '27073', '29127', '36031', '44026', '40913', '40764', '40043', '70339', '94212', '91107', '91237', '11019', '26021', '22018', '22841', '23122',
'24024', '24521', '23343', '23013', '14272', '14401', '15135', '15602', '15590']


@pytest.fixture
def app():
    yield flask_app

@pytest.fixture
def client(app):
    return app.test_client()

def test_temperature(app, client):
    """ Temperature API fetches data for each zone """
    for zone in FIRE_DANGER_ZONES:
        res = client.get('/temperature/<'+zone+'>')
        json_data = json.loads(res.data)
        dataset = 'temp_' + zone
        assert dataset in json_data
    assert 'labels' in json_data
    assert res.status_code == 200   # check api is succesfull with no errors
    
def test_rainfall(app, client):
    """ Rainfall API fetches data for each zone """
    for zone in FIRE_DANGER_ZONES:
        res = client.get('/rainfall/<'+zone+'>')
        json_data = json.loads(res.data)
        dataset = 'rain_' + zone
        assert dataset in json_data
    assert 'labels' in json_data
    assert res.status_code == 200   # check api is succesfull with no errors

def test_wind(app, client):
    """ Wind API fetches data for each zone """
    for zone in FIRE_DANGER_ZONES:
        res = client.get('/wind/<'+zone+'>')
        json_data = json.loads(res.data)
        dataset = 'wind_' + zone
        assert dataset in json_data
    assert 'labels' in json_data
    assert res.status_code == 200   # check api is succesfull with no errors

def test_humidity(app, client):
    """ Humidity API fetches data for each zone """
    for zone in FIRE_DANGER_ZONES:
        res = client.get('/humidity/<'+zone+'>')
        json_data = json.loads(res.data)
        dataset = 'humidity_' + zone
        assert dataset in json_data
    assert 'labels' in json_data
    assert res.status_code == 200   # check api is succesfull with no errors

def test_forrest_fire_danger_index(app, client):
    """ FFDI API fetches data for each zone """
    for zone in FIRE_DANGER_ZONES:
        res = client.get('/FFDI/<'+zone+'>/<1>')
        json_data = json.loads(res.data)
        dataset = 'ffdi_' + zone
        assert dataset in json_data
    assert 'labels' in json_data
    assert res.status_code == 200   # check api is succesfull with no errors