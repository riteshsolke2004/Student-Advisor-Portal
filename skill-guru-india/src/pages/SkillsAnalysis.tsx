import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Brain,
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  RefreshCw,
  Play,
  ArrowRight,
  ArrowLeft,
  Send,
  AlertCircle,
  Target,
  Zap,
  Award,
  TrendingUp,
  BookOpen,
  BarChart3,
  Lightbulb,
  Star,
  Timer
} from 'lucide-react';
import Header from '@/components/Header';

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
  category?: string;
}

interface QuizConfig {
  topic: string;
  domain: string;
  difficulty: string;
  num_questions: number;
}

interface QuizResult {
  score: number;
  correct: number;
  total: number;
  passed: boolean;
  timeSpent: number;
  answers: Record<number, {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation?: string;
  }>;
}

const QuizComponent = () => {
  const [quizConfig, setQuizConfig] = useState<QuizConfig>({
    topic: '',
    domain: '',
    difficulty: 'intermediate',
    num_questions: 5
  });
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizId, setQuizId] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Timer
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const domains = [
    'Programming', 'Data Science', 'Web Development', 'Machine Learning',
    'Cloud Computing', 'DevOps', 'Databases', 'Cybersecurity'
  ];

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (timerActive && !isSubmitted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  

  const handleAnswerSelect = (answer: string) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleGenerateQuiz = async () => {
  setIsLoading(true);
  setError('');
  
  try {
    // ✅ Call YOUR backend (which calls ML service)
    const response = await fetch('https://student-advisor-portal.onrender.com/api/quiz/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(quizConfig)
    });

    if (!response.ok) {
      throw new Error('Failed to generate quiz');
    }

    const data = await response.json();
    console.log('✅ Quiz generated:', data);
    
    setQuestions(data.questions);
    setQuizId(data.quiz_id);
    setQuizStarted(true);
    setCurrentQuestion(0);
    setUserAnswers({});
    setTimeElapsed(0);
    setTimerActive(true);
    
  } catch (error: any) {
    console.error('❌ Error:', error);
    setError(error.message || 'Failed to generate quiz');
  } finally {
    setIsLoading(false);
  }
};

const handleSubmitQuiz = async () => {
  setTimerActive(false);
  setIsLoading(true);
  
  try {
    const userEmail = localStorage.getItem('userEmail') || 'guest@example.com';
    
    // ✅ Submit to YOUR backend
    const formData = new FormData();
    formData.append('quiz_id', quizId);
    formData.append('user_email', userEmail);
    formData.append('answers', JSON.stringify(userAnswers));
    formData.append('time_spent', timeElapsed.toString());

    const response = await fetch('https://student-advisor-portal.onrender.com/api/quiz/submit', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to submit quiz');
    }

    const data = await response.json();
    console.log('✅ Quiz submitted:', data);
    
    // Format result
    const answerDetails: Record<number, any> = {};
    data.answers.forEach((answer: any, index: number) => {
      answerDetails[index] = {
        question: answer.question,
        userAnswer: answer.user_answer,
        correctAnswer: answer.correct_answer,
        isCorrect: answer.is_correct,
        explanation: answer.explanation
      };
    });
    
    setResult({
      score: data.score,
      correct: data.correct,
      total: data.total,
      passed: data.passed,
      timeSpent: data.time_spent,
      answers: answerDetails
    });
    
    setIsSubmitted(true);
    
  } catch (error: any) {
    console.error('❌ Error submitting:', error);
    setError(error.message || 'Failed to submit quiz');
  } finally {
    setIsLoading(false);
  }
};


  const handleRestart = () => {
    setQuizStarted(false);
    setIsSubmitted(false);
    setShowReview(false);
    setQuestions([]);
    setUserAnswers({});
    setCurrentQuestion(0);
    setResult(null);
    setTimeElapsed(0);
    setTimerActive(false);
    setError('');
  };

  // Quiz Configuration Screen
  if (!quizStarted) {
    return (
      <>
      <Header/>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@300;400;500;700&family=Roboto:wght@300;400;500;700&display=swap" 
          rel="stylesheet" 
        />
        
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
          <Card className="max-w-2xl mx-auto border-0 rounded-3xl shadow-2xl">
            <CardHeader className="text-center p-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-medium mb-4" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                Professional Skills Assessment
              </CardTitle>
              <CardDescription className="text-xl text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Test your knowledge with AI-generated questions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-12 pt-0 space-y-8">
              {error && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
              
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-3" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                  Topic/Skill
                </label>
                <input
                  type="text"
                  value={quizConfig.topic}
                  onChange={(e) => setQuizConfig({...quizConfig, topic: e.target.value})}
                  placeholder="e.g., React, Python, AWS"
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-900 mb-3" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                  Domain
                </label>
                <select
                  value={quizConfig.domain}
                  onChange={(e) => setQuizConfig({...quizConfig, domain: e.target.value})}
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  <option value="">Select Domain</option>
                  {domains.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-900 mb-3" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['beginner', 'intermediate', 'advanced'].map(level => (
                    <Button
                      key={level}
                      type="button"
                      variant={quizConfig.difficulty === level ? "default" : "outline"}
                      onClick={() => setQuizConfig({...quizConfig, difficulty: level})}
                      className={`h-12 capitalize rounded-xl transition-all ${
                        quizConfig.difficulty === level 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                          : 'border-2 hover:border-blue-400'
                      }`}
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-900 mb-3" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                  Number of Questions: <span className="text-blue-600">{quizConfig.num_questions}</span>
                </label>
                <input
                  type="range"
                  min="3"
                  max="15"
                  value={quizConfig.num_questions}
                  onChange={(e) => setQuizConfig({...quizConfig, num_questions: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>3 questions</span>
                  <span>15 questions</span>
                </div>
              </div>

              <Button
                onClick={handleGenerateQuiz}
                disabled={!quizConfig.topic || !quizConfig.domain || isLoading}
                className="w-full h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all text-lg font-medium disabled:opacity-50"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                {isLoading ? (
                  <>
                    <Clock className="w-5 h-5 mr-2 animate-spin" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Quiz
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Results & Review Screen
  if (isSubmitted && result) {
    if (showReview) {
      return (
        <>
        <Header/>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link 
            href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@300;400;500;700&family=Roboto:wght@300;400;500;700&display=swap" 
            rel="stylesheet" 
          />
          
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              <Card className="border-0 rounded-3xl shadow-lg">
                <CardHeader className="p-8">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                      Answer Review
                    </CardTitle>
                    <Button onClick={() => setShowReview(false)} variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Back to Summary
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {Object.entries(result.answers).map(([index, answer]) => (
                <Card key={index} className={`border-0 rounded-3xl shadow-lg ${
                  answer.isCorrect ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <CardHeader className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className={answer.isCorrect ? 'bg-green-600' : 'bg-red-600'}>
                            Question {parseInt(index) + 1}
                          </Badge>
                          {answer.isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <CardTitle className="text-xl mb-4" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                          {answer.question}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-4">
                    <div className="bg-white rounded-2xl p-4 border-2 border-gray-200">
                      <p className="text-sm font-medium text-gray-600 mb-2">Your Answer:</p>
                      <p className={`font-medium ${answer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        {answer.userAnswer || 'No answer selected'}
                      </p>
                    </div>
                    
                    {!answer.isCorrect && (
                      <div className="bg-white rounded-2xl p-4 border-2 border-green-200">
                        <p className="text-sm font-medium text-gray-600 mb-2">Correct Answer:</p>
                        <p className="font-medium text-green-700">{answer.correctAnswer}</p>
                      </div>
                    )}
                    
                    {answer.explanation && (
                      <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-blue-900 mb-1">Explanation:</p>
                            <p className="text-sm text-blue-800">{answer.explanation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              <Card className="border-0 rounded-3xl shadow-lg">
                <CardContent className="p-8">
                  <Button onClick={handleRestart} className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-lg">
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Take Another Quiz
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      );
    }

    // Results Summary
    return (
      
      <>
      <Header/>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@300;400;500;700&family=Roboto:wght@300;400;500;700&display=swap" 
          rel="stylesheet" 
        />
        
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Main Score Card */}
            <Card className="border-0 rounded-3xl shadow-2xl">
              <CardHeader className="text-center p-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-4xl font-medium mb-4" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                  Quiz Complete!
                </CardTitle>
                <div className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                  {result.score}%
                </div>
                <Badge className={`text-lg px-6 py-2 ${
                  result.passed 
                    ? "bg-green-100 text-green-700 border-green-200" 
                    : "bg-orange-100 text-orange-700 border-orange-200"
                }`}>
                  {result.passed ? "✓ Passed" : "Keep Learning"}
                </Badge>
              </CardHeader>
            </Card>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="border-0 rounded-2xl shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-blue-600 mb-1" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    {result.correct}
                  </div>
                  <div className="text-sm text-gray-600">Correct</div>
                </CardContent>
              </Card>

              <Card className="border-0 rounded-2xl shadow-lg bg-gradient-to-br from-red-50 to-red-100">
                <CardContent className="p-6 text-center">
                  <XCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-red-600 mb-1" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    {result.total - result.correct}
                  </div>
                  <div className="text-sm text-gray-600">Incorrect</div>
                </CardContent>
              </Card>

              <Card className="border-0 rounded-2xl shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-purple-600 mb-1" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    {result.total}
                  </div>
                  <div className="text-sm text-gray-600">Total</div>
                </CardContent>
              </Card>

              <Card className="border-0 rounded-2xl shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                <CardContent className="p-6 text-center">
                  <Timer className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-orange-600 mb-1" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    {formatTime(result.timeSpent)}
                  </div>
                  <div className="text-sm text-gray-600">Time</div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                onClick={() => setShowReview(true)}
                className="h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-lg"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Review Answers
              </Button>
              <Button 
                onClick={handleRestart}
                variant="outline"
                className="h-14 border-2 rounded-2xl text-lg"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Take Another Quiz
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Quiz Questions Screen
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <>
    <Header/>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link 
        href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@300;400;500;700&family=Roboto:wght@300;400;500;700&display=swap" 
        rel="stylesheet" 
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <Card className="max-w-4xl mx-auto border-0 rounded-3xl shadow-2xl">
          <CardHeader className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Badge className="text-base px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                  {quizConfig.topic} • {quizConfig.difficulty}
                </Badge>
                <Badge variant="outline" className="text-base px-4 py-2">
                  {answeredCount} / {questions.length} Answered
                </Badge>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="font-mono text-lg font-semibold text-gray-700">
                  {formatTime(timeElapsed)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
            
            <CardTitle className="text-2xl leading-relaxed" style={{ fontFamily: 'Google Sans, sans-serif' }}>
              {currentQ?.question}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8 pt-0 space-y-6">
            {currentQ?.options && currentQ.options.length > 0 ? (
              <RadioGroup
                value={userAnswers[currentQuestion]}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {currentQ.options.map((option, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center space-x-4 p-5 border-2 rounded-2xl transition-all cursor-pointer ${
                      userAnswers[currentQuestion] === option
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    <RadioGroupItem value={option} id={`option-${idx}`} className="flex-shrink-0" />
                    <Label 
                      htmlFor={`option-${idx}`} 
                      className="flex-1 cursor-pointer text-lg leading-relaxed"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {option}
                    </Label>
                    {userAnswers[currentQuestion] === option && (
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Options not available for this question. Skipping...
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="outline"
                className="h-14 border-2 rounded-xl text-lg"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>
              
              {currentQuestion === questions.length - 1 ? (
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={answeredCount !== questions.length || isLoading}
                  className="h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl text-lg"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-lg"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  Next
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>

            {/* Question Navigation */}
            <div className="pt-6 border-t">
              <p className="text-sm font-medium text-gray-600 mb-3">Jump to Question:</p>
              <div className="flex flex-wrap gap-2">
                {questions.map((_, idx) => (
                  <Button
                    key={idx}
                    onClick={() => setCurrentQuestion(idx)}
                    variant={currentQuestion === idx ? "default" : "outline"}
                    className={`w-12 h-12 rounded-xl ${
                      userAnswers[idx] 
                        ? 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200'
                        : currentQuestion === idx
                        ? 'bg-blue-600 text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {idx + 1}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default QuizComponent;
