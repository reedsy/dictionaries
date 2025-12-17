# Reedsy Dictionary Analysis - Word Additions

## Overview
This document explains the analysis and decisions made when evaluating 100 words for potential addition to the English dictionaries for the Reedsy novel writing application.

## Methodology

### Confidence Scoring (0-1 scale)
- **0.0-0.79**: Do not add (below threshold)
- **0.8-0.89**: Add with confidence
- **0.9-1.0**: Definitely add (high confidence)

### Decision Criteria
1. Only words with confidence ≥ 0.8 were added
2. Technical terms (brands, acronyms) go in `technical.dic`
3. Verify word doesn't already exist in base dictionaries
4. Check if derived forms are covered by existing affixes
5. Use lowercase for non-proper nouns
6. Apply appropriate Hunspell affixes where applicable

## Files Created

### technical.dic (4 entries)
Universal technical terms applicable to all English variants:
- **POV** (0.9) - Point of View acronym
- **PTSD** (0.9) - Post-Traumatic Stress Disorder medical term
- **TikTok** (0.85) - Social media platform/brand
- **Uber** (0.85) - Transportation brand

### en_GB_reedsy.dic (29 entries)
### en_US_reedsy.dic (29 entries)
### en_ZA_reedsy.dic (29 entries)

Both British and American English share most additions:
- **Interjections** (0.85): Ahh, Aww, Ew, Haha, Mhm, Mmm, Shhh, Umm, Wha
  - Common in dialogue for novels
- **Names** (0.8-0.85): Amara/M, Asher/M, Luca/M
  - Common names in UK/US/AU regions
  - /M = proper noun marker
- **Contractions** (0.85): C'mon, c'mon, What'd, Where'd, y'know
  - Common informal speech in novels
- **Possessives** (0.85): another's, else's, whatever's
  - Standard possessive forms not in base dictionaries
- **Informal words** (0.85):
  - bestie/S - "best friend" (with plural)
  - comms/! - "communications" (marked as not for suggestion)
  - flowy/T - adjective form of "flow" (with comparative/superlative)
  - meds/! - "medications" (marked as not for suggestion)
  - ol - "old" in informal phrases like "good ol'"
- **Verb forms** (0.85-0.9):
  - kneeled - alternative past tense to "knelt"
  - snuck (0.9) - irregular past tense of "sneak"
- **Compound/derived** (0.85):
  - matter-of-factly - adverb form
  - oversized - over + sized compound

### en_CA_reedsy.dic (28 entries)
### en_AU_reedsy.dic (28 entries)

Same as above BUT excluding **oversized** which already exists in en_CA.dic and en_AU.dic.

## Words Analyzed But NOT Added

### Already in Base Dictionaries (verified)
- grey, colour, colours, amongst, amidst (GB variants)
- favourite, realise, realised, centre, behaviour (GB spellings)
- honour, recognise, learnt, dreamt (GB spellings)
- café, axe, favour, coloured (all regions)
- ok/OK, unmoving, sigil, sigils, pinky, unshed
- duffel, duffle, half-hearted, transformative
- animalistic, vu, undead, unamused, elven, positivity
- teleported (from teleport/D), fisted (from fist/D), shifter (from shift/R)
- dumbass, arse (GB slang, already present)
- Names already present: Liam, Theo, Kai, Aiden, Thorne, Selene, Connor, Rebecca, Elara
- Interjections: hm/Hm, yay, Woah (as "woah")
- Contractions: there'd, anymore (in US/CA)

### Below Confidence Threshold (< 0.8)
- **Nyx/M** (0.7) - Uncommon mythology name
- **fuckin** (0.75) - Very vulgar, below threshold
- **doin**, **goin** (0.8) - At threshold but excluded due to extreme informality
- **fae**, **Fae** (0.7) - Ambiguous (Scottish dialect/fantasy term)
- **de**, **se**, **El** (0.0-0.5) - Too short or already existing for other purposes

### Name Possessives (0.7)
- **Theo's**, **Liam's** - Below threshold for name-specific possessives

## Affix Codes Used

### Common Affixes Applied
- **/S** - Plural/3rd person singular (-s, -es)
- **/M** - Proper noun marker
- **/T** - Comparative/superlative (-er, -est)
- **/D** - Past tense/past participle (-ed)
- **/G** - Present participle (-ing)
- **/R** - Agent noun (-er)
- **/!** - No suggestion flag (for informal abbreviations)

## Verification Process

1. Searched all en_* dictionaries for existing entries
2. Checked base forms for affix coverage (e.g., "realise/Dl" covers "realised")
3. Verified irregular forms not covered by affixes (e.g., "snuck" from "sneak")
4. Confirmed alphabetical ordering in all files
5. Ensured proper nouns use capital letters, others lowercase
6. Applied NOSUGGEST flag (!) to informal abbreviations

## Regional Considerations

### British English (GB, AU, ZA)
- Prefer British spellings already in base dictionaries
- Include British slang where appropriate
- South African (ZA) follows British conventions

### American English (US)
- Uses American spellings in base dictionary
- Shares most informal/dialogue words with other variants

### Canadian English (CA)
- Mix of British and American spellings
- Already had "anymore" and "oversized" in base dictionary

## Novel Writing Context

These additions target common usage in novel writing:
- **Dialogue interjections** - Essential for realistic character speech
- **Informal contractions** - Common in modern fiction dialogue  
- **Common names** - Popular character names in contemporary novels
- **Possessive forms** - Standard grammatical constructions
- **Informal vocabulary** - "bestie", "meds", "comms" appear in modern dialogue
- **Alternative verb forms** - "snuck", "kneeled" used in narrative prose

## Statistics

- **Total words analyzed**: 100
- **Words added**: 29-30 per dictionary (varies by region)
- **Words already covered**: ~60
- **Words below threshold**: ~10
- **Technical terms**: 4

## Quality Assurance

✓ All entries alphabetically sorted
✓ No duplicates with base dictionaries
✓ Proper capitalization applied
✓ Appropriate affixes assigned
✓ Confidence threshold (≥0.8) maintained
✓ Regional variants appropriately handled
✓ BOM removed (using UTF-8 without BOM)
