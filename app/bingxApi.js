// bingxApi.js
import axios from 'axios';
import crypto from 'crypto';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();

class BingxApiError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BingxApiError';
  }
}

class BingxApi {
  constructor(api_key, api_secret) {
    this.api_key = api_key;
    this.api_secret = api_secret;
    this.APIURL = 'https://open-api.bingx.com';
  }

  parseParams(paramsMap) {
    const sortedKeys = Object.keys(paramsMap).sort();
    const paramsStr = sortedKeys.map(key => `${key}=${paramsMap[key]}`).join('&');
    return paramsStr;
  }

  getSignature(queryString) {
    return crypto.createHmac('sha256', this.api_secret).update(queryString).digest('hex');
  }

  async sendRequest(method, path, paramsMap, payload = {}) {
    try {
      const timestamp = Date.now();
      paramsMap.timestamp = timestamp;
      const queryString = this.parseParams(paramsMap);
      const signature = this.getSignature(queryString);
      const url = `${this.APIURL}${path}?${queryString}&signature=${signature}`;

      const headers = {
        'X-BX-APIKEY': this.api_key,
      };

      const response = await axios({
        method,
        url,
        headers,
        data: payload,
        timeout: 5000,
      });

      return response.data;
    } catch (error) {
      console.error('Error in sendRequest:', error.message);
      throw new BingxApiError(error.message);
    }
  }

  // Example method: Get trade history
  async history() {
    const form = 'YYYY-MM-DD';
    const today = moment().format(form);
    const conversion = moment(today, form).subtract(15, 'days');
    const milliSec = conversion.valueOf();

    const path = '/openApi/swap/v2/user/income';
    const method = 'GET';
    const paramsMap = {
      startTime: milliSec,
      endTime: Date.now(),
      limit: '1000',
    };

    return await this.sendRequest(method, path, paramsMap);
  }

  // Implement other methods similarly...
}

export default BingxApi;
