#!/usr/bin/env python3
import json
import sys
import argparse
from pathlib import Path

def read_k6(path):
    try:
        data = json.load(open(path))
    except Exception:
        return {}
    metrics = data.get('metrics', {})
    summary = {}
    # common keys
    if 'http_req_duration' in metrics:
        vals = metrics['http_req_duration'].get('values', {})
        summary['p95'] = vals.get('p(95)') or vals.get('p95')
    if 'vus' in metrics:
        summary['vus_max'] = metrics['vus'].get('max')
    return summary

def build_html(k6_summary, jmeter_report_path):
    html = ['<html><head><meta charset="utf-8"><title>Perf Summary</title></head><body>']
    html.append('<h2>Performance Summary</h2>')
    html.append('<h3>k6 summary</h3>')
    if k6_summary:
        html.append('<ul>')
        for k,v in k6_summary.items():
            html.append(f'<li><strong>{k}:</strong> {v}</li>')
        html.append('</ul>')
    else:
        html.append('<p>No k6 summary found.</p>')
    html.append('<h3>JMeter report</h3>')
    if jmeter_report_path and Path(jmeter_report_path).exists():
        html.append(f'<p>JMeter report available: <a href="./{Path(jmeter_report_path).name}/index.html">Open report index</a></p>')
    else:
        html.append('<p>No JMeter report found.</p>')
    html.append('</body></html>')
    return '\n'.join(html)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--k6', required=False)
    parser.add_argument('--jmeter', required=False)
    args = parser.parse_args()
    k6_summary = {}
    if args.k6:
        k6_summary = read_k6(args.k6)
    html = build_html(k6_summary, args.jmeter)
    out = Path('scripts/perf')
    out.mkdir(parents=True, exist_ok=True)
    open(out / 'summary.html','w', encoding='utf-8').write(html)
    print('Wrote', str(out / 'summary.html'))

if __name__ == '__main__':
    main()
