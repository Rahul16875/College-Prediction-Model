import pandas as pd
import numpy as np
from typing import List, Dict, Any

class CollegePredictionModel:
    def __init__(self):
        # Sample data for different exams and international programs
        self.college_data = {
            'JEE': [
                {'name': 'IIT Delhi', 'cutoff_rank': 63, 'branch': 'Computer Science', 'type': 'IIT'},
                {'name': 'IIT Bombay', 'cutoff_rank': 67, 'branch': 'Computer Science', 'type': 'IIT'},
                {'name': 'IIT Kanpur', 'cutoff_rank': 89, 'branch': 'Computer Science', 'type': 'IIT'},
                {'name': 'IIT Kharagpur', 'cutoff_rank': 120, 'branch': 'Computer Science', 'type': 'IIT'},
                {'name': 'IIT Roorkee', 'cutoff_rank': 150, 'branch': 'Computer Science', 'type': 'IIT'},
                {'name': 'IIT Delhi', 'cutoff_rank': 500, 'branch': 'Mechanical Engineering', 'type': 'IIT'},
                {'name': 'IIT Bombay', 'cutoff_rank': 600, 'branch': 'Electrical Engineering', 'type': 'IIT'},
                {'name': 'NIT Trichy', 'cutoff_rank': 800, 'branch': 'Computer Science', 'type': 'NIT'},
                {'name': 'NIT Warangal', 'cutoff_rank': 1200, 'branch': 'Computer Science', 'type': 'NIT'},
                {'name': 'NIT Surathkal', 'cutoff_rank': 1500, 'branch': 'Computer Science', 'type': 'NIT'},
                {'name': 'NIT Calicut', 'cutoff_rank': 2000, 'branch': 'Computer Science', 'type': 'NIT'},
                {'name': 'NIT Delhi', 'cutoff_rank': 2500, 'branch': 'Computer Science', 'type': 'NIT'},
                {'name': 'IIIT Hyderabad', 'cutoff_rank': 400, 'branch': 'Computer Science', 'type': 'IIIT'},
                {'name': 'IIIT Bangalore', 'cutoff_rank': 1000, 'branch': 'Computer Science', 'type': 'IIIT'},
                {'name': 'IIIT Delhi', 'cutoff_rank': 1800, 'branch': 'Computer Science', 'type': 'IIIT'},
                {'name': 'DTU Delhi', 'cutoff_rank': 3000, 'branch': 'Computer Science', 'type': 'State'},
                {'name': 'NSUT Delhi', 'cutoff_rank': 4000, 'branch': 'Computer Science', 'type': 'State'},
                {'name': 'BITS Pilani', 'cutoff_rank': 5000, 'branch': 'Computer Science', 'type': 'Private'},
            ],
            'NEET': [
                {'name': 'AIIMS Delhi', 'cutoff_percentile': 99.99, 'course': 'MBBS', 'type': 'AIIMS'},
                {'name': 'AIIMS Jodhpur', 'cutoff_percentile': 99.95, 'course': 'MBBS', 'type': 'AIIMS'},
                {'name': 'AIIMS Bhopal', 'cutoff_percentile': 99.90, 'course': 'MBBS', 'type': 'AIIMS'},
                {'name': 'AIIMS Patna', 'cutoff_percentile': 99.85, 'course': 'MBBS', 'type': 'AIIMS'},
                {'name': 'JIPMER Puducherry', 'cutoff_percentile': 99.8, 'course': 'MBBS', 'type': 'Central'},
                {'name': 'AFMC Pune', 'cutoff_percentile': 99.5, 'course': 'MBBS', 'type': 'Central'},
                {'name': 'KGMU Lucknow', 'cutoff_percentile': 98.5, 'course': 'MBBS', 'type': 'State'},
                {'name': 'GMC Mumbai', 'cutoff_percentile': 97.0, 'course': 'MBBS', 'type': 'State'},
                {'name': 'MAMC Delhi', 'cutoff_percentile': 96.5, 'course': 'MBBS', 'type': 'State'},
                {'name': 'LHMC Delhi', 'cutoff_percentile': 95.0, 'course': 'MBBS', 'type': 'State'},
                {'name': 'GMC Nagpur', 'cutoff_percentile': 92.0, 'course': 'MBBS', 'type': 'State'},
                {'name': 'SMC Jaipur', 'cutoff_percentile': 90.0, 'course': 'MBBS', 'type': 'State'},
                {'name': 'CMC Vellore', 'cutoff_percentile': 94.0, 'course': 'MBBS', 'type': 'Private'},
                {'name': 'Manipal University', 'cutoff_percentile': 85.0, 'course': 'MBBS', 'type': 'Private'},
            ],
        }

        self.international_data = {
            'MBA': [
                {'name': 'Harvard Business School', 'gmat_score': 730, 'work_exp': 4, 'country': 'USA'},
                {'name': 'Stanford GSB', 'gmat_score': 740, 'work_exp': 4, 'country': 'USA'},
                {'name': 'Wharton', 'gmat_score': 720, 'work_exp': 5, 'country': 'USA'},
                {'name': 'Columbia Business School', 'gmat_score': 710, 'work_exp': 5, 'country': 'USA'},
                {'name': 'INSEAD', 'gmat_score': 700, 'work_exp': 5, 'country': 'France'},
            ],
            'MS': [
                {'name': 'MIT', 'gre_score': 330, 'gpa': 3.8, 'country': 'USA'},
                {'name': 'Stanford', 'gre_score': 325, 'gpa': 3.7, 'country': 'USA'},
                {'name': 'ETH Zurich', 'gre_score': 315, 'gpa': 3.5, 'country': 'Switzerland'},
            ]
        }

    def _calculate_score_difference(self, score, college, score_type):
        if score_type == 'rank':
            return max(0, college['cutoff_rank'] - score)
        else:
            return max(0, score - college['cutoff_percentile'])

    def predict_indian_colleges(self, exam_type: str, score: float, score_type: str = 'rank') -> List[Dict]:
        if exam_type not in self.college_data:
            return []

        colleges = self.college_data[exam_type]
        suitable_colleges = []

        for college in colleges:
            is_eligible = False
            probability = 'Low'

            if score_type == 'rank' and 'cutoff_rank' in college:
                cutoff = college['cutoff_rank']
                if score <= cutoff:
                    is_eligible = True
                    if score <= cutoff * 0.7:
                        probability = 'High'
                    elif score <= cutoff * 0.9:
                        probability = 'Medium'
            elif score_type == 'percentile' and 'cutoff_percentile' in college:
                cutoff = college['cutoff_percentile']
                if score >= cutoff:
                    is_eligible = True
                    if score >= cutoff + 2:
                        probability = 'High'
                    elif score >= cutoff + 0.5:
                        probability = 'Medium'

            if is_eligible:
                suitable_colleges.append({
                    'college': college['name'],
                    'course': college.get('branch', college.get('course')),
                    'type': college['type'],
                    'cutoff': college.get('cutoff_rank', college.get('cutoff_percentile')),
                    'probability': probability,
                    'score_difference': self._calculate_score_difference(score, college, score_type)
                })

        priority_order = {'High': 3, 'Medium': 2, 'Low': 1}
        suitable_colleges.sort(key=lambda x: (priority_order[x['probability']], x['score_difference']), reverse=True)

        return suitable_colleges[:10]

    def predict_international_colleges(self, program_type: str, **kwargs) -> List[Dict]:
        if program_type not in self.international_data:
            return []

        colleges = self.international_data[program_type]
        suitable_colleges = []

        for college in colleges:
            is_suitable = False
            probability = 'Low'
            score_strength = 0

            if program_type == 'MBA':
                gmat_score = kwargs.get('gmat_score', 0)
                work_exp = kwargs.get('work_exp', 0)
                required_gmat = college['gmat_score']
                required_exp = college['work_exp']

                if gmat_score >= required_gmat * 0.9 and work_exp >= required_exp * 0.8:
                    is_suitable = True
                    gmat_strength = (gmat_score - required_gmat) / required_gmat * 100
                    exp_strength = (work_exp - required_exp) / required_exp * 100
                    score_strength = (gmat_strength + exp_strength) / 2

                    if gmat_score >= required_gmat + 20 and work_exp >= required_exp + 1:
                        probability = 'High'
                    elif gmat_score >= required_gmat and work_exp >= required_exp:
                        probability = 'Medium'

            elif program_type == 'MS':
                gre_score = kwargs.get('gre_score', 0)
                gpa = kwargs.get('gpa', 0)
                required_gre = college['gre_score']
                required_gpa = college['gpa']

                if gre_score >= required_gre * 0.95 and gpa >= required_gpa * 0.9:
                    is_suitable = True
                    gre_strength = (gre_score - required_gre) / required_gre * 100
                    gpa_strength = (gpa - required_gpa) / required_gpa * 100
                    score_strength = (gre_strength + gpa_strength) / 2

                    if gre_score >= required_gre + 10 and gpa >= required_gpa + 0.2:
                        probability = 'High'
                    elif gre_score >= required_gre and gpa >= required_gpa:
                        probability = 'Medium'

            if is_suitable:
                suitable_colleges.append({
                    'college': college['name'],
                    'country': college['country'],
                    'requirements': college,
                    'probability': probability,
                    'score_strength': score_strength
                })

        priority_order = {'High': 3, 'Medium': 2, 'Low': 1}
        suitable_colleges.sort(key=lambda x: (priority_order[x['probability']], x['score_strength']), reverse=True)

        return suitable_colleges

    def generate_report(self, exam_type: str, score: float, **kwargs) -> Dict[str, Any]:
        if exam_type in ['JEE', 'NEET', 'CAT', 'CLAT']:
            score_type = 'percentile' if exam_type in ['NEET', 'CAT'] else 'rank'
            predictions = self.predict_indian_colleges(exam_type, score, score_type)
        elif exam_type in ['MBA', 'MS']:
            predictions = self.predict_international_colleges(exam_type, **kwargs)
        else:
            predictions = []

        return {
            'exam_type': exam_type,
            'score': score,
            'predictions': predictions
        }
