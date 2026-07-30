import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: __ENV.K6_VUS ? parseInt(__ENV.K6_VUS) : 50,
  duration: __ENV.K6_DURATION || '30s',
  thresholds: {
    'http_req_duration': ['p(95)<500']
  }
};

const BASE = __ENV.BASE_URL || 'https://test-api.example.com';

export default function () {
  const res = http.get(`${BASE}/`);
  check(res, { 'status was 200': (r) => r.status === 200 });
  sleep(1);
}
