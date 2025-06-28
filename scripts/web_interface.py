import streamlit as st # type: ignore
from college_predictor import CollegePredictionModel

def main():
    st.title("🎓 College Prediction Model")
    st.write("Predict suitable colleges based on your entrance exam scores")
    
    model = CollegePredictionModel()
    
    # Sidebar for exam selection
    st.sidebar.header("Select Exam Type")
    exam_category = st.sidebar.selectbox(
        "Category",
        ["Indian Entrance Exams", "International Programs"]
    )
    
    if exam_category == "Indian Entrance Exams":
        exam_type = st.sidebar.selectbox(
            "Exam Type",
            ["JEE", "NEET", "CAT", "CLAT"]
        )
        
        if exam_type in ["JEE", "CLAT"]:
            score = st.number_input(f"Enter your {exam_type} Rank", min_value=1, value=1000)
            score_type = "rank"
        else:
            score = st.number_input(f"Enter your {exam_type} Percentile", min_value=0.0, max_value=100.0, value=85.0)
            score_type = "percentile"
        
        if st.button("Predict Colleges"):
            report = model.generate_report(exam_type, score)
            
            st.header(f"Predictions for {exam_type}")
            st.write(f"**Your {score_type.title()}:** {score}")
            st.write(f"**Total Suitable Colleges:** {report['total_predictions']}")
            
            if report['colleges']:
                st.subheader("Recommended Colleges")
                for i, college in enumerate(report['colleges'], 1):
                    with st.expander(f"{i}. {college['college']} - {college['probability']} Probability"):
                        st.write(f"**Course:** {college['course']}")
                        st.write(f"**Type:** {college['type']}")
                        st.write(f"**Cutoff:** {college['cutoff']}")
                        st.write(f"**Admission Probability:** {college['probability']}")
            
            st.subheader("Recommendations")
            for rec in report['recommendations']:
                st.write(f"• {rec}")
    
    else:  # International Programs
        program_type = st.sidebar.selectbox(
            "Program Type",
            ["MBA", "MS"]
        )
        
        if program_type == "MBA":
            gmat_score = st.number_input("GMAT Score", min_value=200, max_value=800, value=650)
            work_exp = st.number_input("Work Experience (years)", min_value=0, max_value=20, value=3)
            
            if st.button("Predict Colleges"):
                report = model.generate_report(program_type, gmat_score=gmat_score, work_exp=work_exp)
                
                st.header(f"Predictions for {program_type}")
                st.write(f"**GMAT Score:** {gmat_score}")
                st.write(f"**Work Experience:** {work_exp} years")
                st.write(f"**Total Suitable Colleges:** {report['total_predictions']}")
                
                if report['colleges']:
                    st.subheader("Recommended Universities")
                    for i, college in enumerate(report['colleges'], 1):
                        with st.expander(f"{i}. {college['college']} - {college['probability']} Probability"):
                            st.write(f"**Country:** {college['country']}")
                            st.write(f"**Admission Probability:** {college['probability']}")
                
                st.subheader("Recommendations")
                for rec in report['recommendations']:
                    st.write(f"• {rec}")
        
        else:  # MS
            gre_score = st.number_input("GRE Score", min_value=260, max_value=340, value=310)
            gpa = st.number_input("GPA", min_value=0.0, max_value=4.0, value=3.5)
            
            if st.button("Predict Colleges"):
                report = model.generate_report(program_type, gre_score=gre_score, gpa=gpa)
                
                st.header(f"Predictions for {program_type}")
                st.write(f"**GRE Score:** {gre_score}")
                st.write(f"**GPA:** {gpa}")
                st.write(f"**Total Suitable Colleges:** {report['total_predictions']}")
                
                if report['colleges']:
                    st.subheader("Recommended Universities")
                    for i, college in enumerate(report['colleges'], 1):
                        with st.expander(f"{i}. {college['college']} - {college['probability']} Probability"):
                            st.write(f"**Country:** {college['country']}")
                            st.write(f"**Admission Probability:** {college['probability']}")
                
                st.subheader("Recommendations")
                for rec in report['recommendations']:
                    st.write(f"• {rec}")

if __name__ == "__main__":
    main()
