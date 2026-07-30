JMeter example for the course
=================================

This folder contains a minimal JMeter test plan and instructions to run it using Docker.

Files
- `test-plan.jmx` — minimal non-GUI test plan using variable `BASE_URL`.

Run locally with Docker (recommended):

```bash
# from repository root
docker run --rm -v "$PWD/scripts/jmeter":/test -w /test justb4/jmeter:5.4.1 -n -t test-plan.jmx -l results.jtl -JBASE_URL="https://test-api.example.com"

# generate HTML report
docker run --rm -v "$PWD/scripts/jmeter":/test -w /test justb4/jmeter:5.4.1 -g results.jtl -o report
```

Notes
- Modify the `BASE_URL` variable as needed or pass via `-JBASE_URL`.
- For CI, see `.github/workflows/perf-jmeter.yml`.
 - The included `test-plan.jmx` expects a small `users.csv` file in the same folder with header `username,password` for the CSV Data Set Config.
 - To run with custom base URL and ports split into domain/port/protocol, set properties: `-JBASE_URL_DOMAIN=example.com -JBASE_URL_PORT=443 -JBASE_URL_PROTOCOL=https`.
 - The plan includes a login POST that extracts a bearer token into the `AUTH_TOKEN` variable for subsequent requests. When running in CI, ensure the base URL is reachable from the runner.
