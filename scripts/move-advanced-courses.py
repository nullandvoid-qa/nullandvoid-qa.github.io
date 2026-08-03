from pathlib import Path
import re

FILE = Path(__file__).resolve().parent.parent / 'data' / 'tracks.js'
text = FILE.read_text(encoding='utf8')

def find_matching(text, start, open_char, close_char):
    depth = 0
    in_single = in_double = in_backtick = False
    escaped = False
    for i, ch in enumerate(text[start:], start):
        if escaped:
            escaped = False
            continue
        if ch == '\\':
            escaped = True
            continue
        if ch == "'" and not in_double and not in_backtick:
            in_single = not in_single
            continue
        if ch == '"' and not in_single and not in_backtick:
            in_double = not in_double
            continue
        if ch == '`' and not in_single and not in_double:
            in_backtick = not in_backtick
            continue
        if in_single or in_double or in_backtick:
            continue
        if ch == open_char:
            depth += 1
        elif ch == close_char:
            depth -= 1
            if depth == 0:
                return i
    return None


def find_array_bounds(text, marker, start=0):
    idx = text.find(marker, start)
    if idx < 0:
        raise ValueError(f"Marker not found: {marker}")
    idx = text.find('[', idx)
    if idx < 0:
        raise ValueError(f"Array start not found after {marker}")
    end = find_matching(text, idx, '[', ']')
    if end is None:
        raise ValueError('Matching ] not found')
    return idx, end


def find_object_bounds(text, id_token, start=0):
    idx = text.find(id_token, start)
    if idx < 0:
        raise ValueError(f"ID token not found: {id_token}")
    # scan backward to find opening brace at same nesting outside strings
    in_single = in_double = in_backtick = False
    escaped = False
    depth = 0
    obj_start = None
    for i in range(idx - 1, -1, -1):
        ch = text[i]
        if escaped:
            escaped = False
            continue
        if ch == '\\':
            escaped = True
            continue
        if ch == '"' and not in_single and not in_backtick:
            in_double = not in_double
            continue
        if ch == "'" and not in_double and not in_backtick:
            in_single = not in_single
            continue
        if ch == '`' and not in_single and not in_double:
            in_backtick = not in_backtick
            continue
        if in_single or in_double or in_backtick:
            continue
        if ch == '}':
            depth += 1
        elif ch == '{':
            if depth == 0:
                obj_start = i
                break
            depth -= 1
    if obj_start is None:
        raise ValueError('Object start not found')
    obj_end = find_matching(text, obj_start, '{', '}')
    if obj_end is None:
        raise ValueError('Object end not found')
    return obj_start, obj_end

starter_track = 'id: "starter"'
intermediate_track = 'id: "intermediate"'
starter_pos = text.find(starter_track)
if starter_pos < 0:
    raise SystemExit('starter track not found')
intermediate_pos = text.find(intermediate_track)
if intermediate_pos < 0:
    raise SystemExit('intermediate track not found')

starter_courses_start, starter_courses_end = find_array_bounds(text, 'courses:', starter_pos)
intermediate_courses_start, intermediate_courses_end = find_array_bounds(text, 'courses:', intermediate_pos)

course_ids = ['c13', 'c7', 'c8', 'c9']
removed_blocks = []
new_starter = text[starter_courses_start:starter_courses_end+1]
for cid in course_ids:
    token = f'id: "{cid}"'
    obj_start, obj_end = find_object_bounds(new_starter, token)
    # include trailing comma and whitespace
    trail_end = obj_end + 1
    while trail_end < len(new_starter) and new_starter[trail_end] in ' \t\r\n':
        trail_end += 1
    if trail_end < len(new_starter) and new_starter[trail_end] == ',':
        trail_end += 1
    block = new_starter[obj_start:trail_end]
    removed_blocks.append(block.rstrip())
    new_starter = new_starter[:obj_start] + new_starter[trail_end:]
# normalize commas in starter courses list
new_starter = re.sub(r',\s*\n\s*\]', '\n    ]', new_starter)

intermediate_courses = text[intermediate_courses_start:intermediate_courses_end+1]
if any(f'id: "{cid}"' in intermediate_courses for cid in course_ids):
    raise SystemExit('Some courses already in intermediate')
# insert before closing bracket
insert_point = intermediate_courses.rfind(']')
if insert_point < 0:
    raise SystemExit('Intermediate insert point not found')
insert_text = ',\n      '.join(removed_blocks)
if insert_text.strip():
    if intermediate_courses[:insert_point].rstrip().endswith(','):
        insert_full = '\n      ' + insert_text + '\n    '
    else:
        insert_full = ',\n      ' + insert_text + '\n    '
else:
    insert_full = ''
new_intermediate_courses = intermediate_courses[:insert_point] + insert_full + intermediate_courses[insert_point:]

new_text = text[:starter_courses_start] + new_starter + text[starter_courses_end+1:intermediate_courses_start] + new_intermediate_courses + text[intermediate_courses_end+1:]
FILE.write_text(new_text, encoding='utf8')
print('Moved advanced starter courses to intermediate successfully.')
