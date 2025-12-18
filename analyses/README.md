# Word Analysis for Spellchecking Dictionaries

## Overview

This analysis evaluates 96 words from the provided list for inclusion in five English dictionaries (en_AU, en_CA, en_GB, en_US, en_ZA) for use in a novel writing application. Of these, 94 words were analyzed for the English dictionaries, and 2 brand names (TikTok, Uber) were moved to a separate technical dictionary per rule 5.

## Files

- **word_analysis_20251218_112123.json**: Complete analysis of all words with acceptance decisions and confidence scores for each dictionary
- **technical_brands.json**: Brand names that should go in a separate "technical" dictionary rather than individual language dictionaries

## Analysis Methodology

### Acceptance Rules Applied

1. **Scoring System**: Each word/dictionary combination scored 0-1 (0 = definitely exclude, 1 = definitely include)
2. **Context**: Novel writing spellchecker
3. **Independence**: Each dictionary evaluated independently
4. **Names**: Common names accepted only if recognized in the specific country
5. **Brand Names**: Technical brands (TikTok, Uber) placed in separate "technical" dictionary
6. **Case Transformation**: Proper nouns kept as-is; common nouns normalized to lowercase
7. **JSON Output**: Structured format with confidence scores

### Key Decision Patterns

#### Regional Spelling Variations

**British/Commonwealth vs American spelling:**
- Words like "colour", "favourite", "honour", "behaviour" → accepted in AU/CA/GB/ZA, rejected in US
- Words like "grey", "centre", "realise", "learnt" → accepted in AU/CA/GB/ZA, rejected/lower score in US
- Words like "axe", "arse" → accepted in AU/GB/ZA, rejected/lower score in US

**US-preferred forms:**
- "snuck" → higher confidence in US (0.95) than GB (0.7)
- "kneeled" → higher confidence in US (0.9) than GB/AU (0.7)
- "duffel" → higher confidence in US (0.95) than duffle

#### Names (Transformed to Lowercase per Rule 6)

**Note**: Names were provided with initial capitals but transformed to lowercase per rule 6. In actual spellchecker usage, these would typically be stored in lowercase but should accept both capitalized and lowercase forms during spellchecking.

**Commonly recognized internationally:**
- liam, theo, rebecca, connor, aiden → accepted across all dictionaries (0.8-0.95)

**Less universally common:**
- elara, nyx, thorne, amara, selene → accepted but lower confidence (0.65-0.75)
- asher, luca, kai → moderate confidence (0.7-0.85)

#### Interjections and Informal Speech

**Universal acceptance:**
- hm, mhm, mmm, ahh, aww, ew, yay, woah, umm, haha, shhh → accepted across all (0.75-0.85)

**Contractions and informal forms:**
- c'mon, y'know, where'd, what'd, there'd, ok → accepted universally (0.85-0.9)
- doin, goin, ol, fuckin → accepted but lower confidence (0.7-0.75)

#### Fantasy/Genre-specific Terms

**Fantasy literature terms:**
- fae, elven, sigil, sigils, undead, shifter → accepted across all dictionaries (0.85-0.9)
- These are common in modern fantasy novels

#### Modern Slang/Colloquialisms

- bestie, dumbass, meds, comms, pov → accepted universally (0.7-0.85)
- These reflect contemporary novel dialogue

#### Technical/Brand Names (Separate Dictionary)

- TikTok, Uber → moved to technical dictionary
- These are global brands not specific to any English variant

#### Rejected/Low Confidence

- "se" → rejected across all dictionaries (0.4) - too ambiguous on its own, possibly fragment or abbreviation

### Confidence Score Reasoning

- **1.0**: Standard dictionary words with clear regional preference (e.g., "colour" in GB)
- **0.9-0.95**: Very common words/names, standard vocabulary
- **0.8-0.85**: Common informal terms, recognized names, genre-appropriate words
- **0.7-0.75**: Less common but acceptable terms, regional variations
- **0.6-0.65**: Borderline terms, less common names
- **0.3-0.4**: Generally not accepted, wrong regional spelling, or too ambiguous

## Notes on Specific Decisions

1. **Possessive forms** (else's, Liam's, Theo's, etc.) → accepted with same confidence as base name
2. **Compound words** (half-hearted, matter-of-factly) → universally accepted
3. **"axe" vs "ax"**: British spelling preferred in GB/AU/ZA
4. **"duffel" vs "duffle"**: Both accepted, but duffel slightly preferred in US
5. **Genre vocabulary**: Fantasy terms accepted across all dictionaries as they're common in modern fiction
6. **Acronyms**: PTSD, POV → accepted universally as standard abbreviations

## Usage

These analyses can inform dictionary updates for the spellchecker, with accepted words (accepted: true) being added to their respective dictionaries based on the confidence scores.
