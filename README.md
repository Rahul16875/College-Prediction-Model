# College Prediction Model - TalentConnect Assignment

A comprehensive college prediction system that suggests suitable colleges based on entrance exam scores for both Indian and international education systems.

![Screenshot 2025-06-28 124314](https://github.com/user-attachments/assets/d6c87c9a-7b17-4381-97fe-796e9b358398)

![Screenshot 2025-06-28 124328](https://github.com/user-attachments/assets/7b2c5f1f-662e-4c0a-845b-7b7ccc2ab8f0)

![Screenshot 2025-06-28 124435](https://github.com/user-attachments/assets/8b13aa66-84bf-44a9-8102-9efae6f6d52b)



## 🎯 Project Overview

This project implements an intelligent college prediction model designed to help students make informed decisions about their higher education choices. The system analyzes entrance exam scores and provides personalized college recommendations with admission probability assessments.

### 🌟 Key Features

- **Multi-Exam Support**: JEE, NEET, CAT, CLAT for Indian students
- **International Programs**: MBA and MS program predictions
- **Dynamic Scoring**: Real-time probability calculations based on actual scores
- **Interactive Web Interface**: User-friendly React-based application
- **Comprehensive Reports**: Detailed predictions with actionable recommendations

## 🏗️ System Architecture

\`\`\`
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Input    │───▶│  Prediction      │───▶│   Results &     │
│   (Scores)      │    │  Engine          │    │ Recommendations │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  College         │
                       │  Database        │
                       └──────────────────┘
\`\`\`

## 🧠 Technical Approach

### 1. **Rule-Based Prediction Algorithm**

The core prediction engine uses a sophisticated rule-based approach:

```python
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


