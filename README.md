# College Prediction Model - TalentConnect Assignment

## Overview
This project implements a college prediction model that suggests suitable colleges based on entrance exam scores for both Indian and international education systems.

## Features

### Indian Entrance Exams
- **JEE (Engineering)**: Predicts IITs, NITs, IIITs based on rank
- **NEET (Medical)**: Predicts AIIMS, medical colleges based on percentile
- **CAT (Management)**: Predicts IIMs, business schools based on percentile
- **CLAT (Law)**: Predicts NLUs, law schools based on rank

### International Programs
- **MBA Programs**: Predicts universities based on GMAT score and work experience
- **MS Programs**: Predicts universities based on GRE score and GPA

## Technical Approach

### 1. Data Structure
- **College Database**: Structured data with cutoff scores, college types, and courses
- **Scoring Logic**: Rule-based system comparing user scores with historical cutoffs
- **Probability Calculation**: High/Medium/Low probability based on score margins

### 2. Prediction Algorithm
\`\`\`python
def predict_colleges(exam_type, score, score_type):
    suitable_colleges = []
    for college in college_database[exam_type]:
        if meets_cutoff_criteria(score, college.cutoff):
            probability = calculate_probability(score, college.cutoff)
            suitable_colleges.append({
                'college': college,
                'probability': probability
            })
    return sorted(suitable_colleges, key=lambda x: x['probability'])
