import React, { useState, useEffect } from "react";
import { all_routes } from "../../router/all_routes";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ProfileCard from "../common/profileCard";
import StudentSidebar from "../common/studentSidebar";
import { Link, useSearchParams } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import CircleProgress from "../../Instructor/instructor-dashboard/circleProgress";
import { useCourseApi } from "../../../core/api/hooks/useCourseApi";
import { useQuestionApi } from "../../../core/api/hooks/UseQuestionApi";

const StudentQuizQuestion = () => {
  const route = all_routes;
  const [searchParams] = useSearchParams();
  const { getQuizById } = useCourseApi();
  const { getQuestionsByQuiz } = useQuestionApi();

  const [currentStep, setCurrentStep] = useState(1);
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: number}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  const quizId = Number(searchParams.get("quizId"));

  useEffect(() => {
    if (quizId) {
      loadQuizData();
    }
  }, [quizId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && quizStarted) {
      // Tempo esgotado - submeter automaticamente
      handleFinishQuiz();
    }
    return () => clearInterval(timer);
  }, [timeLeft, quizStarted]);

  const loadQuizData = async () => {
    try {
      setLoading(true);
      
      // Carregar informações do quiz
      const quizData = await getQuizById(quizId);
      setQuiz(quizData);
      
      // Iniciar timer se o quiz tiver duração
      if (quizData?.duration) {
        setTimeLeft(quizData.duration * 60); // Converter minutos para segundos
      }

      // Carregar perguntas do quiz
      const questionsData = await getQuestionsByQuiz(quizId);
      setQuestions(questionsData || []);
      
    } catch (err) {
      console.error("Erro ao carregar dados do quiz:", err);
      setError("Erro ao carregar o questionário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentStep(1);
  };

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctOption) {
        correctAnswers++;
      }
    });
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const handleFinishQuiz = () => {
    setQuizStarted(false);
    const score = calculateScore();
    
    // Determinar se passou (assumindo 60% como nota de passagem)
    const passed = score >= 60;
    
    if (passed) {
      setCurrentStep(questions.length + 1); // Tela de sucesso
    } else {
      setCurrentStep(questions.length + 2); // Tela de reprovação
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatProgress = () => {
    return Math.round((currentStep / questions.length) * 100);
  };

  if (loading) {
    return (
      <>
        <Breadcrumb title="Tentativa de Questionário" />
        <div className="content">
          <div className="container">
            <ProfileCard />
            <div className="row">
              <StudentSidebar />
              <div className="col-lg-9">
                <div className="text-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">A carregar...</span>
                  </div>
                  <p className="mt-2">A carregar questionário...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Breadcrumb title="Tentativa de Questionário" />
        <div className="content">
          <div className="container">
            <ProfileCard />
            <div className="row">
              <StudentSidebar />
              <div className="col-lg-9">
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
                <button 
                  className="btn btn-secondary" 
                  onClick={loadQuizData}
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!quizStarted && currentStep === 1) {
    return (
      <>
        <Breadcrumb title="Tentativa de Questionário" />
        <div className="content">
          <div className="container">
            <ProfileCard />
            <div className="row">
              <StudentSidebar />
              <div className="col-lg-9">
                <div className="page-title d-flex align-items-center justify-content-between">
                  <h5>Tentativa de Questionário</h5>
                </div>
                <div className="card">
                  <div className="card-body text-center">
                    <div className="mb-4">
                      <i className="isax isax-message-question5 fs-48 text-primary mb-3"></i>
                      <h4>{quiz?.title || "Questionário"}</h4>
                      <p className="text-muted">
                        Prepare-se para iniciar o questionário
                      </p>
                    </div>
                    
                    <div className="row text-start mb-4">
                      <div className="col-md-6 mb-3">
                        <div className="d-flex align-items-center">
                          <i className="isax isax-message-question5 text-primary me-2"></i>
                          <div>
                            <strong>Número de Questões:</strong>
                            <p className="mb-0">{questions.length}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="d-flex align-items-center">
                          <i className="isax isax-clock text-primary me-2"></i>
                          <div>
                            <strong>Duração:</strong>
                            <p className="mb-0">{quiz?.duration || 30} minutos</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="d-flex align-items-center">
                          <i className="isax isax-tick-circle text-primary me-2"></i>
                          <div>
                            <strong>Nota de Aprovação:</strong>
                            <p className="mb-0">60%</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="alert alert-info">
                      <strong>Instruções:</strong>
                      <ul className="mb-0 mt-2">
                        <li>Responda a todas as questões</li>
                        <li>O tempo será contado a partir do início</li>
                        <li>Não é possível voltar atrás após submeter</li>
                        <li>Necessita de 60% para aprovar</li>
                      </ul>
                    </div>

                    <button
                      className="btn btn-secondary btn-lg rounded-pill"
                      onClick={startQuiz}
                    >
                      Iniciar Questionário
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Renderizar questões do quiz
  if (quizStarted && currentStep <= questions.length) {
    const currentQuestion = questions[currentStep - 1];
    
    return (
      <>
        <Breadcrumb title="Tentativa de Questionário" />
        <div className="content">
          <div className="container">
            <ProfileCard />
            <div className="row">
              <StudentSidebar />
              <div className="col-lg-9">
                <div className="page-title d-flex align-items-center justify-content-between">
                  <h5>Tentativa de Questionário</h5>
                </div>
                <div className="quiz-attempt-card border-0">
                  <div className="quiz-attempt-body p-0">
                    <div className="border p-3 mb-3 rounded-2">
                      <div className="bg-light border p-3 mb-3 rounded-2 flex-wrap">
                        <div className="row align-items-center">
                          <div className="col-md-8">
                            <div className="mb-2 mb-md-0">
                              <div className="d-flex align-items-center">
                                <div className="avatar avatar-lg me-3 flex-shrink-0">
                                  <ImageWithBasePath
                                    className="img-fluid rounded-3"
                                    src="assets/img/students/quiz.jpg"
                                    alt=""
                                  />
                                </div>
                                <h5 className="fs-18">
                                  {quiz?.title || "Questionário"}
                                </h5>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="text-md-end">
                              <p className="d-inline-flex align-items-center mb-0">
                                <i className="isax isax-clock me-1" />
                                {formatTime(timeLeft)}
                                <span className="text-dark ms-1">
                                  {" "}
                                  / {quiz?.duration || 30}:00
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <span className="fw-semibold text-gray-9">
                            Progresso do Questionário
                          </span>
                          <span>Questão {currentStep} de {questions.length}</span>
                        </div>
                        <div className="progress progress-xs flex-grow-1 mb-1">
                          <div
                            className="progress-bar bg-success rounded"
                            role="progressbar"
                            style={{ width: `${formatProgress()}%` }}
                            aria-valuenow={formatProgress()}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                      </div>
                      <div className="mb-0">
                        <h6 className="mb-3">{currentQuestion?.questionText}</h6>
                        {currentQuestion?.options?.map((option: string, optionIndex: number) => (
                          <div className="form-check mb-2" key={optionIndex}>
                            <input
                              className="form-check-input"
                              type="radio"
                              name={`question-${currentStep}`}
                              id={`Radio-sm-${currentStep}-${optionIndex}`}
                              checked={userAnswers[currentStep - 1] === optionIndex}
                              onChange={() => handleAnswerSelect(currentStep - 1, optionIndex)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`Radio-sm-${currentStep}-${optionIndex}`}
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      {currentStep > 1 && (
                        <button
                          className="btn bg-gray-100 d-inline-flex rounded-pill align-items-center prev_btn me-1"
                          onClick={handlePrev}
                        >
                          <i className="isax isax-arrow-left-2 me-1 fs-10" />
                          Anterior
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-secondary rounded-pill next_btn ms-auto"
                        onClick={handleNext}
                      >
                        {currentStep === questions.length ? "Finalizar" : "Próxima"}
                        <i className="isax isax-arrow-right-3 ms-1 fs-10" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Tela de resultados
  const score = calculateScore();
  const passed = score >= 60;

  return (
    <>
      <Breadcrumb title="Resultado do Questionário" />
      <div className="content">
        <div className="container">
          <ProfileCard />
          <div className="row">
            <StudentSidebar />
            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5>Resultado do Questionário</h5>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="quiz-circle-progress m-0 mb-3">
                    <CircleProgress value={score}/>
                    <p className="text-center fs-14">Nota de Aprovação: 60%</p>
                  </div>
                  <div className="text-center mb-3">
                    {passed ? (
                      <>
                        <h6 className="mb-1 text-success">Parabéns! Você Aprovou</h6>
                        <p className="fs-14">
                          Você passou com sucesso no questionário. Continue com o excelente trabalho!
                        </p>
                      </>
                    ) : (
                      <>
                        <h6 className="mb-1 text-danger">Desculpe, Você Não Aprovou Desta Vez</h6>
                        <p className="fs-14">
                          Não se preocupe, aprenda com esta tentativa e volte mais forte na próxima vez!
                        </p>
                      </>
                    )}
                  </div>
                  <div className="row text-center mb-3">
                    <div className="col-md-4">
                      <div className="border rounded p-3">
                        <h5 className="text-primary">{score}%</h5>
                        <p className="mb-0 fs-14">Sua Pontuação</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="border rounded p-3">
                        <h5 className="text-primary">
                          {Object.values(userAnswers).filter((answer, index) => 
                            answer === questions[index]?.correctOption
                          ).length}
                        </h5>
                        <p className="mb-0 fs-14">Respostas Corretas</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="border rounded p-3">
                        <h5 className="text-primary">{questions.length}</h5>
                        <p className="mb-0 fs-14">Total de Questões</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-center">
                    <Link
                      to={route.studentDashboard}
                      className="btn btn-secondary rounded-pill"
                    >
                      <i className="isax isax-arrow-left-2 me-1 fs-10" />
                      Voltar ao Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentQuizQuestion;