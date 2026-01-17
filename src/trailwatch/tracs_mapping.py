TRACS_CATEGORY_KEYWORDS = {
    "clearing": {"CLR": "Clearing"},
    "drainage": {"DRN": "Drainage"},
    "grading": {"GRD": "Grading"},
    "structures": {"STR": "Structures"},
    "signing": {"SGN": "Signing"},
    "tread": {"TRD": "Tread"},
}

def get_tracs_category(description: str) -> tuple[str, str]:
    description_lower = description.lower()
    for keyword, tracs_map in TRACS_CATEGORY_KEYWORDS.items():
        if keyword in description_lower:
            code = list(tracs_map.keys())[0]
            name = list(tracs_map.values())[0]
            return code, name
    return "OTH", "Other"
