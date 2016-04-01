import sys
import requests

PROD_ID_SERVICE_URL = 'https://id.spsc.io'
STAGE_ID_SERVICE_URL = 'https://stage.id.spsc.io'
DEV_ID_SERVICE_URL = 'https://dev.id.spsc.io'

def get_token(username, password, id_service_url=DEV_ID_SERVICE_URL):
    return requests.post('/'.join([id_service_url, 'identity', 'token/']),
                         json={'grant_type': 'password',
                               'username': username,
                               'password': password,
                               'client_id': '595'}).json()['access_token']


if __name__ == '__main__':
    print(get_token(sys.argv[1], sys.argv[2]))
