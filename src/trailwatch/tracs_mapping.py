import re

TRACS_MAPPING = {
    "CLR": {
        "name": "Clearing",
        "keywords": [r"tree.*down", r"log.*trail", r"fallen.*tree", "blowdown", "overgrown", 
                     r"brush.*block", r"branch.*down", r"tree.*block", r"log.*block"]
    },
    "DRN": {
        "name": "Drainage",
        "keywords": ["muddy", "flooded", r"standing.*water", "puddles", "washout", 
                     r"water.*trail", r"creek.*overflow", r"drainage.*block"]
    },
    "GRD": {
        "name": "Grading",
        "keywords": ["erosion", "ruts", r"uneven.*surface", r"trail.*washed", "gullies", 
                     r"loose.*rocks", r"trail.*degraded"]
    },
    "STR": {
        "name": "Structures",
        "keywords": [r"bridge.*(damaged|out|broken|collapsed)", r"boardwalk.*broken", 
                     r"steps.*collapsed", r"handrail.*(missing|broken)", r"puncheon.*rotted", 
                     r"bridge.*down"]
    },
    "SGN": {
        "name": "Signing",
        "keywords": [r"sign.*(missing|damaged|vandalized)", r"trail.*unmarked", 
                     r"confusing.*junction", r"wrong.*direction", r"junction.*confusing"]
    },
    "TRD": {
        "name": "Tread",
        "keywords": [r"trail.surface.*damaged", r"roots.*exposed", r"rocks.*loose", 
                     r"trail.*widening", r"multiple.*paths", r"exposed.*roots", 
                     r"tread.*widening"]
    },
}

def get_tracs_category(description: str) -> tuple[str, str]:
    description_lower = description.lower()
    for code, category_info in TRACS_MAPPING.items():
        for keyword in category_info["keywords"]:
            if re.search(keyword, description_lower, re.IGNORECASE):
                return code, category_info["name"]
    return "OTH", "Other"
