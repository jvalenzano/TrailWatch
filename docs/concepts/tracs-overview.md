# TRACS Overview

TRACS (Trail Assessment and Condition Survey) is the standardized system the US Forest Service uses to inventory, assess, and report trail conditions across the National Forest System. It's the authoritative framework for how USFS categorizes trail infrastructure and maintenance needs.

## What It Does

TRACS provides a common vocabulary and data structure for describing trails: their physical characteristics, current conditions, maintenance history, and required work. Every National Forest uses TRACS to report trail status to the Washington Office, which aggregates data for budget justification and resource allocation.

## Why TrailWatch Needs It

TrailWatch's core value proposition is transforming unstructured citizen reports ("big tree fell across the trail near the waterfall") into structured data that rangers can actually use. That means outputting data in formats that map to TRACS categories.

If we invent our own hazard taxonomy, rangers have to mentally translate our output into their system before taking action. By aligning with TRACS from the start, our Intake Agent produces reports that slot directly into existing workflows.

## Key TRACS Concepts

**Trail Class**: A 1-5 scale describing the trail's development level and intended use. Class 1 is minimally developed (backcountry), Class 5 is fully developed (paved, accessible). This affects maintenance standards and response urgency.

**Managed Use**: What activities are officially allowed on the trail (hiking, biking, equestrian, motorized). Affects which hazards matter and how they're prioritized.

**Designed Use**: The primary use the trail was built for, which may differ from all managed uses. A trail designed for hiking but also allowing bikes has different maintenance considerations.

**Trail Condition Class**: Overall assessment of trail condition relative to its designed standard. Ranges from fully functional to severely degraded.

**Feature Inventory**: Cataloging of trail features like bridges, culverts, retaining walls, signs, and water bars. Each has its own condition assessment.

## TRACS Hazard Categories

These are the primary hazard types we map citizen reports to:

| Category | Examples | Typical Urgency |
|----------|----------|-----------------|
| Tread Damage | Erosion, washouts, rutting | Medium |
| Obstruction | Fallen trees, rockslides, debris | High |
| Drainage Failure | Clogged culverts, failed water bars | Medium |
| Structure Damage | Bridge damage, retaining wall failure | High to Critical |
| Signage Issues | Missing, damaged, or incorrect signs | Low |
| Vegetation Encroachment | Overgrown brush, sight-line blockage | Low |
| Safety Hazard | Cliff exposure, wildlife, unstable ground | Varies |

## How TrailWatch Uses TRACS

The Intake Agent's output schema maps directly to TRACS categories:

1. **Hazard Classification**: Citizen descriptions are classified into TRACS hazard categories
2. **Location Reference**: GPS coordinates are associated with specific trail segments from the USFS trail inventory
3. **Severity Assessment**: AI-assisted triage maps to TRACS condition assessment scales
4. **Feature Association**: When reports mention infrastructure (bridges, signs), we link to TRACS feature inventory

## Limitations

TRACS is designed for professional trail crews, not citizen reporters. Some concepts don't translate cleanly:

- Citizens don't know trail class or designed use
- Condition assessments require trained judgment
- Feature identification requires inventory knowledge

TrailWatch bridges this gap by inferring TRACS attributes from natural language and enriching reports with data from the USFS Geodata Clearinghouse.

## Related Resources

- [USFS Trail Management Handbook (FSH 2309.18)](https://www.fs.usda.gov/cdt/carrying_capacity/fsh2309_18_trail_handbook.pdf)
- [USFS Geodata Clearinghouse](https://data.fs.usda.gov/geodata/)
- GEMINI.md: TRACS Mapping section

## TrailWatch Context

TRACS alignment is a core architectural decision. Every output schema and classification taxonomy should reference TRACS categories. See GEMINI.md for the specific field mappings the Intake Agent uses.
