"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Globe, TrendingUp, Users } from "lucide-react"

interface College {
  college: string
  course?: string
  type: string
  cutoff?: number
  probability: string
  country?: string
}

interface PredictionResult {
  exam_type?: string
  program_type?: string
  score?: number
  score_type?: string
  total_predictions: number
  colleges: College[]
  recommendations: string[]
}

export default function CollegePredictionApp() {
  const [examCategory, setExamCategory] = useState<"indian" | "international">("indian")
  const [examType, setExamType] = useState("")
  const [score, setScore] = useState("")
  const [workExp, setWorkExp] = useState("")
  const [gpa, setGpa] = useState("")
  const [predictions, setPredictions] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)

  // Mock prediction function (in real app, this would call your Python backend)
  const mockPredict = (type: string, scoreValue: number, additionalParams?: any): PredictionResult => {
    // Simulate the actual Python model logic
    const getIndianColleges = (examType: string, score: number) => {
      const collegeData: { [key: string]: any[] } = {
        JEE: [
          { name: "IIT Delhi", cutoff: 63, course: "Computer Science", type: "IIT" },
          { name: "IIT Bombay", cutoff: 67, course: "Computer Science", type: "IIT" },
          { name: "IIT Kanpur", cutoff: 89, course: "Computer Science", type: "IIT" },
          { name: "IIT Kharagpur", cutoff: 120, course: "Computer Science", type: "IIT" },
          { name: "NIT Trichy", cutoff: 800, course: "Computer Science", type: "NIT" },
          { name: "NIT Warangal", cutoff: 1200, course: "Computer Science", type: "NIT" },
          { name: "IIIT Hyderabad", cutoff: 400, course: "Computer Science", type: "IIIT" },
          { name: "DTU Delhi", cutoff: 3000, course: "Computer Science", type: "State" },
          { name: "NSUT Delhi", cutoff: 4000, course: "Computer Science", type: "State" },
          { name: "BITS Pilani", cutoff: 5000, course: "Computer Science", type: "Private" },
        ],
        NEET: [
          { name: "AIIMS Delhi", cutoff: 99.99, course: "MBBS", type: "AIIMS" },
          { name: "AIIMS Jodhpur", cutoff: 99.95, course: "MBBS", type: "AIIMS" },
          { name: "JIPMER Puducherry", cutoff: 99.8, course: "MBBS", type: "Central" },
          { name: "KGMU Lucknow", cutoff: 98.5, course: "MBBS", type: "State" },
          { name: "GMC Mumbai", cutoff: 97.0, course: "MBBS", type: "State" },
          { name: "CMC Vellore", cutoff: 94.0, course: "MBBS", type: "Private" },
          { name: "GMC Nagpur", cutoff: 92.0, course: "MBBS", type: "State" },
          { name: "Manipal University", cutoff: 85.0, course: "MBBS", type: "Private" },
        ],
        CAT: [
          { name: "IIM Ahmedabad", cutoff: 99.5, course: "MBA", type: "IIM" },
          { name: "IIM Bangalore", cutoff: 99.0, course: "MBA", type: "IIM" },
          { name: "IIM Calcutta", cutoff: 98.5, course: "MBA", type: "IIM" },
          { name: "FMS Delhi", cutoff: 98.0, course: "MBA", type: "University" },
          { name: "IIM Lucknow", cutoff: 97.0, course: "MBA", type: "IIM" },
          { name: "XLRI Jamshedpur", cutoff: 95.0, course: "MBA", type: "Private" },
          { name: "MDI Gurgaon", cutoff: 94.0, course: "MBA", type: "Private" },
          { name: "IIFT Delhi", cutoff: 90.0, course: "MBA", type: "Central" },
        ],
        CLAT: [
          { name: "NLSIU Bangalore", cutoff: 25, course: "LLB", type: "NLU" },
          { name: "NALSAR Hyderabad", cutoff: 50, course: "LLB", type: "NLU" },
          { name: "WBNUJS Kolkata", cutoff: 100, course: "LLB", type: "NLU" },
          { name: "GNLU Gandhinagar", cutoff: 150, course: "LLB", type: "NLU" },
          { name: "HNLU Raipur", cutoff: 200, course: "LLB", type: "NLU" },
          { name: "CNLU Patna", cutoff: 400, course: "LLB", type: "NLU" },
          { name: "Jamia Millia Islamia", cutoff: 600, course: "LLB", type: "Central" },
        ],
      }

      const colleges = collegeData[examType] || []
      const suitable: College[] = []

      for (const college of colleges) {
        let isEligible = false
        let probability = "Low"

        if (examType === "JEE" || examType === "CLAT") {
          // Rank-based (lower is better)
          if (score <= college.cutoff) {
            isEligible = true
            if (score <= college.cutoff * 0.7) probability = "High"
            else if (score <= college.cutoff * 0.9) probability = "Medium"
            else probability = "Low"
          }
        } else {
          // Percentile-based (higher is better)
          if (score >= college.cutoff) {
            isEligible = true
            if (score >= college.cutoff + 2) probability = "High"
            else if (score >= college.cutoff + 0.5) probability = "Medium"
            else probability = "Low"
          }
        }

        if (isEligible) {
          suitable.push({
            college: college.name,
            course: college.course,
            type: college.type,
            cutoff: college.cutoff,
            probability,
          })
        }
      }

      // Sort by probability
      const priorityOrder = { High: 3, Medium: 2, Low: 1 }
      suitable.sort(
        (a, b) =>
          priorityOrder[b.probability as keyof typeof priorityOrder] -
          priorityOrder[a.probability as keyof typeof priorityOrder],
      )

      return suitable.slice(0, 10)
    }

    const getInternationalColleges = (programType: string, params: any) => {
      const collegeData: { [key: string]: any[] } = {
        MBA: [
          { name: "Harvard Business School", gmat: 730, exp: 4, country: "USA" },
          { name: "Stanford GSB", gmat: 740, exp: 4, country: "USA" },
          { name: "Wharton", gmat: 720, exp: 5, country: "USA" },
          { name: "Columbia Business School", gmat: 710, exp: 5, country: "USA" },
          { name: "INSEAD", gmat: 700, exp: 5, country: "France" },
          { name: "LBS", gmat: 690, exp: 5, country: "UK" },
          { name: "UCLA Anderson", gmat: 690, exp: 4, country: "USA" },
          { name: "Rotman Toronto", gmat: 660, exp: 4, country: "Canada" },
        ],
        MS: [
          { name: "MIT", gre: 330, gpa: 3.8, country: "USA" },
          { name: "Stanford", gre: 325, gpa: 3.7, country: "USA" },
          { name: "CMU", gre: 320, gpa: 3.6, country: "USA" },
          { name: "UC Berkeley", gre: 315, gpa: 3.5, country: "USA" },
          { name: "Georgia Tech", gre: 310, gpa: 3.4, country: "USA" },
          { name: "University of Toronto", gre: 310, gpa: 3.4, country: "Canada" },
          { name: "UT Austin", gre: 305, gpa: 3.3, country: "USA" },
          { name: "UBC Vancouver", gre: 300, gpa: 3.2, country: "Canada" },
        ],
      }

      const colleges = collegeData[programType] || []
      const suitable: College[] = []

      for (const college of colleges) {
        let isEligible = false
        let probability = "Low"

        if (programType === "MBA") {
          const gmatScore = params.gmatScore || 0
          const workExp = params.workExp || 0

          if (gmatScore >= college.gmat * 0.9 && workExp >= college.exp * 0.8) {
            isEligible = true
            if (gmatScore >= college.gmat + 20 && workExp >= college.exp + 1) probability = "High"
            else if (gmatScore >= college.gmat && workExp >= college.exp) probability = "Medium"
            else probability = "Low"
          }
        } else {
          const greScore = params.greScore || 0
          const gpa = params.gpa || 0

          if (greScore >= college.gre * 0.95 && gpa >= college.gpa * 0.9) {
            isEligible = true
            if (greScore >= college.gre + 10 && gpa >= college.gpa + 0.2) probability = "High"
            else if (greScore >= college.gre && gpa >= college.gpa) probability = "Medium"
            else probability = "Low"
          }
        }

        if (isEligible) {
          suitable.push({
            college: college.name,
            country: college.country,
            type: "University",
            probability,
          })
        }
      }

      // Sort by probability
      const priorityOrder = { High: 3, Medium: 2, Low: 1 }
      suitable.sort(
        (a, b) =>
          priorityOrder[b.probability as keyof typeof priorityOrder] -
          priorityOrder[a.probability as keyof typeof priorityOrder],
      )

      return suitable
    }

    let colleges: College[] = []

    if (["JEE", "NEET", "CAT", "CLAT"].includes(type)) {
      colleges = getIndianColleges(type, scoreValue)
    } else {
      colleges = getInternationalColleges(type, additionalParams)
    }

    const recommendations =
      colleges.length > 0
        ? [
            "Apply to a mix of reach, target, and safety colleges",
            "Consider location and specialization preferences",
            "Prepare strong application materials",
          ]
        : [
            `Consider improving your ${type} score for better college options`,
            "Look into alternative colleges and programs",
            "Consult with education counselors for guidance",
          ]

    return {
      exam_type: ["JEE", "NEET", "CAT", "CLAT"].includes(type) ? type : undefined,
      program_type: ["MBA", "MS"].includes(type) ? type : undefined,
      score: scoreValue,
      total_predictions: colleges.length,
      colleges,
      recommendations,
    }
  }

  const handlePredict = async () => {
    if (!examType || !score) return

    setLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const scoreValue = Number.parseFloat(score)
    const additionalParams =
      examCategory === "international"
        ? {
            workExp: Number.parseFloat(workExp || "0"),
            gpa: Number.parseFloat(gpa || "0"),
            gmatScore: examType === "MBA" ? Number.parseFloat(score) : undefined,
            greScore: examType === "MS" ? Number.parseFloat(score) : undefined,
          }
        : {}

    const result = mockPredict(examType, scoreValue, additionalParams)
    setPredictions(result)
    setLoading(false)
  }

  const getProbabilityColor = (probability: string) => {
    switch (probability.toLowerCase()) {
      case "high":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">College Prediction Model</h1>
          </div>
          <p className="text-lg text-gray-600">Predict suitable colleges based on your entrance exam scores</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Prediction Input
                </CardTitle>
                <CardDescription>Enter your exam details to get college predictions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Exam Category</Label>
                  <Select
                    value={examCategory}
                    onValueChange={(value: "indian" | "international") => {
                      setExamCategory(value)
                      setExamType("")
                      setPredictions(null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indian">Indian Entrance Exams</SelectItem>
                      <SelectItem value="international">International Programs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="examType">{examCategory === "indian" ? "Exam Type" : "Program Type"}</Label>
                  <Select value={examType} onValueChange={setExamType}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${examCategory === "indian" ? "exam" : "program"}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {examCategory === "indian" ? (
                        <>
                          <SelectItem value="JEE">JEE (Engineering)</SelectItem>
                          <SelectItem value="NEET">NEET (Medical)</SelectItem>
                          <SelectItem value="CAT">CAT (Management)</SelectItem>
                          <SelectItem value="CLAT">CLAT (Law)</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="MBA">MBA Programs</SelectItem>
                          <SelectItem value="MS">MS Programs</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="score">
                    {examType === "JEE" || examType === "CLAT"
                      ? "Rank"
                      : examType === "NEET" || examType === "CAT"
                        ? "Percentile"
                        : examType === "MBA"
                          ? "GMAT Score"
                          : "GRE Score"}
                  </Label>
                  <Input
                    id="score"
                    type="number"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder={`Enter your ${examType === "JEE" || examType === "CLAT" ? "rank" : "score"}`}
                  />
                </div>

                {examCategory === "international" && examType === "MBA" && (
                  <div>
                    <Label htmlFor="workExp">Work Experience (years)</Label>
                    <Input
                      id="workExp"
                      type="number"
                      value={workExp}
                      onChange={(e) => setWorkExp(e.target.value)}
                      placeholder="Enter work experience"
                    />
                  </div>
                )}

                {examCategory === "international" && examType === "MS" && (
                  <div>
                    <Label htmlFor="gpa">GPA (out of 4.0)</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.1"
                      value={gpa}
                      onChange={(e) => setGpa(e.target.value)}
                      placeholder="Enter your GPA"
                    />
                  </div>
                )}

                <Button onClick={handlePredict} className="w-full" disabled={!examType || !score || loading}>
                  {loading ? "Predicting..." : "Predict Colleges"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {predictions ? (
              <div className="space-y-6">
                {/* Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Prediction Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{predictions.total_predictions}</div>
                        <div className="text-sm text-gray-600">Suitable Colleges</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {predictions.colleges.filter((c) => c.probability === "High").length}
                        </div>
                        <div className="text-sm text-gray-600">High Probability</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {predictions.colleges.filter((c) => c.probability === "Medium").length}
                        </div>
                        <div className="text-sm text-gray-600">Medium Probability</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{predictions.score}</div>
                        <div className="text-sm text-gray-600">Your Score</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* College List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Recommended Colleges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {predictions.colleges.map((college, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{college.college}</h3>
                              {college.course && <p className="text-gray-600">{college.course}</p>}
                              {college.country && <p className="text-gray-600">{college.country}</p>}
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline">{college.type}</Badge>
                                <Badge className={getProbabilityColor(college.probability)}>
                                  {college.probability} Probability
                                </Badge>
                              </div>
                            </div>
                            {college.cutoff && (
                              <div className="text-right">
                                <div className="text-sm text-gray-500">Cutoff</div>
                                <div className="font-semibold">{college.cutoff}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {predictions.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Ready to Predict Your Colleges?</h3>
                  <p className="text-gray-500">
                    Fill in your exam details on the left to get personalized college predictions
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
