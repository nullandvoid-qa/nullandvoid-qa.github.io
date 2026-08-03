import os
import json

base = os.path.join(os.path.dirname(__file__), '..', 'content', 'lessons')
pt_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'translations-pt.json')
en_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'translations-en.json')
report_path = os.path.join(os.path.dirname(__file__), '..', 'reports', 'lesson-word-counts.json')

lessons = []
for root, dirs, files in os.walk(base):
    for f in sorted(files):
        if f.endswith('.md'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as fh:
                txt = fh.read()
            words = len(txt.split())
            lessons.append({
                'path': os.path.relpath(path, os.path.join(os.path.dirname(__file__), '..')).replace('\\', '/'),
                'words': words,
                'chars': len(txt),
            })

print('LESSON_COUNT', len(lessons))
for lesson in lessons:
    print(lesson['words'], lesson['path'])

with open(pt_path, 'r', encoding='utf-8') as fh:
    pt = json.load(fh)
print('PT_KEYS', len(pt))

missing = None
en = None
try:
    with open(en_path, 'r', encoding='utf-8') as fh:
        en = json.load(fh)
    print('EN_KEYS', len(en))
    missing = [k for k in pt if k not in en]
    print('MISSING_IN_EN', len(missing))
    for k in missing[:20]:
        print(k)
except Exception as e:
    print('EN_LOAD_FAIL', e)

with open(report_path, 'w', encoding='utf-8') as fh:
    json.dump(
        {
            'lessons': lessons,
            'pt_keys': len(pt),
            'en_keys': len(en) if en is not None else None,
            'missing_in_en': len(missing) if missing is not None else None,
        },
        fh,
        indent=2,
        ensure_ascii=False,
    )
print('WROTE', report_path)
