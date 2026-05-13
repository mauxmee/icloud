import requests
import time
import hashlib

class ISolarCloudClient:
    def __init__(self, email, password, region_url="https://api.isolarcloud.com.hk"):
        self.base_url = region_url
        self.email = email
        self.password = password
        self.token = None
        self.user_id = None
        self.app_key = "7726477123A6487A9E58516597B0687E" # Standard community app key

    def login(self):
        url = f"{self.base_url}/iam/v1/login"
        payload = {
            "user_account": self.email,
            "user_password": self.password,
            "appkey": self.app_key,
            "terminal_type": "2"
        }
        response = requests.post(url, json=payload).json()
        if response.get("result_code") == "1":
            self.token = response["result_data"]["token"]
            self.user_id = response["result_data"]["user_id"]
            return True
        return False

    def get_stations(self):
        url = f"{self.base_url}/v1/app/getStationList"
        headers = {"token": self.token}
        params = {"user_id": self.user_id, "curr_page": 1, "page_size": 10}
        res = requests.post(url, headers=headers, json=params).json()
        return res["result_data"]["page_data"]

    def get_history_data(self, station_id):
        # Fetches power generation data for analysis
        url = f"{self.base_url}/v1/app/getStationDetail"
        headers = {"token": self.token}
        params = {"station_id": station_id}
        res = requests.post(url, headers=headers, json=params).json()
        return res["result_data"]