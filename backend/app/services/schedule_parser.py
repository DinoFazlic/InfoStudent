import pdfplumber
from typing import List, Dict

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

TIME_SLOTS = [
    ("08:15", "09:00"),
    ("09:15", "10:00"),
    ("10:15", "11:00"),
    ("11:15", "12:00"),
    ("12:15", "13:00"),
    ("13:15", "14:00"),
    ("14:15", "15:00"),
    ("15:15", "16:00"),
    ("16:15", "17:00"),
    ("17:15", "18:00"),
]


def parse_pdf_schedule_matrix(pdf_path: str) -> List[Dict]:
    result = []

    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[0]
        table = page.extract_table()

        if not table or len(table) < 2:
            raise Exception("Table not found or incomplete in PDF.")

        for row_index, row in enumerate(table[1:], start=0):
            for day_index in range(1, 6):  
                cell = row[day_index]
                if cell and cell.strip():
                    start_time, end_time = TIME_SLOTS[row_index]
                    result.append({
                        "day": DAYS[day_index - 1],
                        "start_time": start_time,
                        "end_time": end_time
                    })

    return result

"""
def parse_pdf_schedule_matrix(pdf_path: str) -> List[Dict]:
    result = []

    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[0]
        table = page.extract_table()

        if not table or len(table) < 2:
            raise Exception("Table not found or incomplete in PDF.")

        for row_index, row in enumerate(table[1:], start=0):
            for day_index in range(1, 6):  
                cell = row[day_index]
                if cell and cell.strip():
                    start_time, end_time = TIME_SLOTS[row_index]
                    result.append({
                        "day": DAYS[day_index - 1],
                        "start_time": start_time,
                        "end_time": end_time
                    })

    return result
"""

""" 
def parse_pdf_schedule_matrix(pdf_path: str) -> List[Dict]:
    result = []

    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[0]
        table = page.extract_table()

        if not table or len(table) < 2:
            raise Exception("Table not found or incomplete in PDF.")

        rows = table[1:]
        current_subject = [None] * 5
        start_index = [None] * 5

        for row_index, row in enumerate(rows):
            for day_index in range(5):
                cell = row[day_index + 1]
                cell = cell.strip() if cell else ""
                is_last_row = row_index == len(rows) - 1

                if cell:
                    # Ako postoji aktivan termin → zatvori ga do prethodnog slota
                    if current_subject[day_index] is not None:
                        result.append({
                            "day": DAYS[day_index],
                            "start_time": TIME_SLOTS[start_index[day_index]][0],
                            "end_time": TIME_SLOTS[row_index - 1][1] if row_index > 0 else TIME_SLOTS[0][1],
                        })

                    # Pokreni novi termin
                    current_subject[day_index] = cell
                    start_index[day_index] = row_index

                else:
                    if current_subject[day_index] is None:
                        continue  # prazna ćelija bez aktivnog termina = pauza → preskoči

                    # imamo aktivan termin ali praznu ćeliju: provjeri šta slijedi
                    lookahead_filled = False
                    for future_row in rows[row_index + 1:]:
                        future_cell = future_row[day_index + 1]
                        if future_cell and future_cell.strip():
                            lookahead_filled = True
                            break

                    if not lookahead_filled:
                        # ništa više ne dolazi → zatvori odmah
                        result.append({
                            "day": DAYS[day_index],
                            "start_time": TIME_SLOTS[start_index[day_index]][0],
                            "end_time": TIME_SLOTS[row_index][1],
                        })
                        current_subject[day_index] = None
                        start_index[day_index] = None

        return result
"""