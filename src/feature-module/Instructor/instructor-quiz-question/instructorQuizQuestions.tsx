import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import InstructorSidebar from "../common/instructorSidebar";
import ProfileCard from "../common/profileCard";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import CustomSelect from "../../../core/common/commonSelect";
import DashboardHeader from "../instructor-dashboard/DashboardHeader";
import { Question, QuizInfo } from "../../../core/common/data/interface";
import { useQuestionApi } from "../../../core/api/hooks/UseQuestionApi";
import { useCourseApi } from "../../../core/api/hooks/useCourseApi";

const InstructorQuizQuestions = () => {
  const [searchParams] = useSearchParams();
  const options = [
    { label: "Escolha múltipla", value: "1" },
    { label: "Verdadeiro ou Falso", value: "2" },
  ];

  const [items, setItems] = useState<string[]>([]);
  const { getQuestionsByQuiz, createQuestion, deleteQuestion } = useQuestionApi();
  const { getQuizById } = useCourseApi();

  const addNewItem = () => {
    setItems([...items, ""]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  const { quizId } = useParams<{ quizId: string }>();
  const [id, setId] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizInfo, setQuizInfo] = useState<QuizInfo>({
    title: "",
    totalQuestions: 0,
    duration: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; questionId: number | null; questionText: string }>({
    show: false,
    questionId: null,
    questionText: ""
  });

  // Estado do formulário para adicionar nova pergunta
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    questionType: "1", // Escolha múltipla
    options: ["", ""],
    correctOption: 0,
  });

  // Estado para opções dinâmicas
  const [additionalOptions, setAdditionalOptions] = useState<string[]>([]);

  const questionTypeOptions = [
    { label: "Escolha múltipla", value: "1" },
    { label: "Verdadeiro ou Falso", value: "2" },
  ];

  // Carregar perguntas e informações do quiz quando o componente monta
  useEffect(() => {
    loadQuizData();
  }, [quizId]);

  // Limpar mensagens após alguns segundos
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const loadQuizData = async () => {
    const quizIdFromParams = Number(searchParams.get("quizId"));
    setId(quizIdFromParams);

    try {
      setLoading(true);
      
      // Carregar informações do quiz
      if (quizIdFromParams) {
        const quizResponse = await getQuizById(quizIdFromParams);
        if (quizResponse) {
          setQuizInfo({
            title: quizResponse.title || "Questionário sem título",
            totalQuestions: quizResponse.numberOfQuestions || 0,
            duration: quizResponse.duration || 30,
          });
        }
      }

      // Carregar perguntas do quiz
      const questionsResponse = await getQuestionsByQuiz(quizIdFromParams);
      setQuestions(questionsResponse || []);
      
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao carregar os dados");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    try {
      const allOptions = [...newQuestion.options, ...additionalOptions].filter(
        (opt) => opt.trim() !== ""
      );

      if (!newQuestion.questionText.trim() || allOptions.length < 2) {
        alert("Por favor, preencha a pergunta e pelo menos 2 opções");
        return;
      }

      // Verificar se há pelo menos uma opção correta
      if (newQuestion.correctOption < 0 || newQuestion.correctOption >= allOptions.length) {
        alert("Por favor, selecione uma resposta correta");
        return;
      }

      const questionData = {
        quizId: id,
        questionText: newQuestion.questionText,
        options: allOptions,
        correctOption: newQuestion.correctOption,
      };
      
      console.log("Dados da pergunta:", questionData);

      setLoading(true);
      await createQuestion(questionData);

      // Mensagem de sucesso
      setSuccessMessage("Pergunta adicionada com sucesso!");
      setError(null);

      // Reiniciar formulário
      setNewQuestion({
        questionText: "",
        questionType: "1",
        options: ["", ""],
        correctOption: 0,
      });
      setAdditionalOptions([]);

      // Recarregar perguntas
      await loadQuizData();

      // Fechar modal do Bootstrap de forma segura
      closeModalSafely("add_question");
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Falha ao adicionar pergunta";
      setError(errorMessage);
      setSuccessMessage(null);
      console.error("Erro ao adicionar pergunta:", err);
    } finally {
      setLoading(false);
    }
  };

  // Função para fechar modal do Bootstrap de forma segura
  const closeModalSafely = (modalId: string) => {
    try {
      const modalElement = document.getElementById(modalId);
      if (modalElement) {
        // Método 1: Usando Bootstrap JavaScript
        const bootstrap = (window as any).bootstrap;
        if (bootstrap) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
            return;
          }
        }
        
        // Método 2: Usando atributos data-bs-dismiss
        const closeButton = modalElement.querySelector('[data-bs-dismiss="modal"]');
        if (closeButton) {
          (closeButton as HTMLElement).click();
          return;
        }

        // Método 3: Remover classes manualmente como fallback
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';
        document.body.classList.remove('modal-open');
        
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
      }
    } catch (error) {
      console.error("Erro ao fechar modal:", error);
    }
  };

  const showDeleteConfirmation = (questionId: number, questionText: string) => {
    setDeleteModal({
      show: true,
      questionId,
      questionText: questionText.length > 50 ? questionText.substring(0, 50) + "..." : questionText
    });
  };

  const hideDeleteConfirmation = () => {
    setDeleteModal({
      show: false,
      questionId: null,
      questionText: ""
    });
  };

  const handleDeleteQuestion = async () => {
    if (!deleteModal.questionId) return;

    try {
      await deleteQuestion(deleteModal.questionId);
      setSuccessMessage("Pergunta eliminada com sucesso!");
      hideDeleteConfirmation();
      await loadQuizData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao eliminar pergunta");
      hideDeleteConfirmation();
    }
  };

  const addNewOption = () => {
    setAdditionalOptions([...additionalOptions, ""]);
  };

  const removeOption = (index: number) => {
    setAdditionalOptions(additionalOptions.filter((_, i) => i !== index));
    
    // Ajustar o índice da resposta correta se necessário
    if (newQuestion.correctOption >= newQuestion.options.length + index) {
      setNewQuestion(prev => ({
        ...prev,
        correctOption: Math.max(0, prev.correctOption - 1)
      }));
    }
  };

  const updateOption = (index: number, value: string, isAdditional = false) => {
    if (isAdditional) {
      const updated = [...additionalOptions];
      updated[index] = value;
      setAdditionalOptions(updated);
    } else {
      const updated = [...newQuestion.options];
      updated[index] = value;
      setNewQuestion((prev) => ({ ...prev, options: updated }));
    }
  };

  const setCorrectAnswer = (optionIndex: number) => {
    setNewQuestion((prev) => ({ ...prev, correctOption: optionIndex }));
  };

  const resetForm = () => {
    setNewQuestion({
      questionText: "",
      questionType: "1",
      options: ["", ""],
      correctOption: 0,
    });
    setAdditionalOptions([]);
    setError(null);
    setSuccessMessage(null);
  };

  // Função para lidar com o cancelamento do modal
  const handleModalCancel = () => {
    resetForm();
    closeModalSafely("add_question");
  };

  // Função para formatar a duração em minutos para formato legível
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
  };

  if (loading && questions.length === 0) {
    return (
      <div className="layout-container">
        <DashboardHeader onHandleMobileMenu={() => {}} />
        <div className="d-flex layout-body content">
          <InstructorSidebar />
          <div className="dashboard-main p-4 ms-260 w-100">
            <div className="text-center p-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">A carregar...</span>
              </div>
              <p className="mt-2">A carregar perguntas...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="layout-container">
        <DashboardHeader onHandleMobileMenu={() => {}} />

        <div className="d-flex layout-body content">
          <InstructorSidebar />

          <div className="dashboard-main p-4 ms-260 w-100">
            <ProfileCard />
            
            {/* Mensagens de feedback */}
            {successMessage && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <i className="isax isax-tick-circle me-2"></i>
                {successMessage}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSuccessMessage(null)}
                ></button>
              </div>
            )}
            
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="isax isax-close-circle me-2"></i>
                {error}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setError(null)}
                ></button>
              </div>
            )}

            <div className="col-lg-9">
              <div className="card bg-light">
                <div className="card-body">
                  <div className="row align-items-center gy-3">
                    <div className="col-xl-8">
                      <div>
                        <div className="d-sm-flex align-items-center">
                          <div className="quiz-img me-3 mb-2 mb-sm-0">
                            <ImageWithBasePath
                              src="assets/img/students/quiz.jpg"
                              alt=""
                            />
                          </div>
                          <div>
                            <h5 className="mb-2">
                              <Link to="#">
                                {quizInfo.title || "Questionário"}
                              </Link>
                            </h5>
                            <div className="question-info d-flex align-items-center">
                              <p className="d-flex align-items-center fs-14 me-2 pe-2 border-end mb-0">
                                <i className="isax isax-message-question5 text-primary-soft me-2"></i>
                                {questions.length} Pergunta{questions.length !== 1 ? 's' : ''}
                              </p>
                              <p className="d-flex align-items-center fs-14 mb-0">
                                <i className="isax isax-clock5 text-secondary-soft me-2"></i>
                                {formatDuration(quizInfo.duration)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4">
                      <div className="d-flex align-items-center justify-content-sm-end">
                        <Link
                          to={all_routes.instructorQuizResult}
                          className="text-info text-decoration-underline fs-12 fw-medium me-3"
                        >
                          Ver Resultados
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-secondary"
                          data-bs-toggle="modal"
                          data-bs-target="#add_question"
                          onClick={resetForm}
                        >
                          Adicionar Pergunta
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {questions.length === 0 ? (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="isax isax-message-question5 fs-48 text-muted mb-3"></i>
                    <h5 className="text-muted">Ainda não há perguntas</h5>
                    <p className="text-muted">
                      Comece por adicionar a sua primeira pergunta a este questionário.
                    </p>
                    <Link
                      to="#"
                      className="btn btn-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#add_question"
                      onClick={resetForm}
                    >
                      Adicionar Primeira Pergunta
                    </Link>
                  </div>
                </div>
              ) : (
                questions.map((question, index) => (
                  <div key={question.id || index} className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6>{question.questionText}</h6>
                        <div className="d-flex align-items-center justify-content-end">
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 me-2 action-icon"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_question"
                          >
                            <i className="isax isax-edit-2"></i>
                          </Link>
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 action-icon"
                            onClick={() => showDeleteConfirmation(question.id, question.questionText)}
                          >
                            <i className="isax isax-trash"></i>
                          </Link>
                        </div>
                      </div>
                      <div>
                        {question.options && question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name={`question-${question.id}`}
                              id={`radio-${question.id}-${optionIndex}`}
                              checked={optionIndex === question.correctOption}
                              readOnly
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`radio-${question.id}-${optionIndex}`}
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {questions.length > 0 && (
                <div className="text-center">
                  <Link to="#" className="btn btn-secondary">
                    Carregar Mais
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Eliminação */}
      {deleteModal.show && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center custom-modal-body">
                <span className="avatar avatar-lg bg-danger-transparent rounded-circle mb-2">
                  <i className="isax isax-trash fs-24 text-danger" />
                </span>
                <div>
                  <h4 className="mb-2">Eliminar Pergunta</h4>
                  <p className="mb-3">
                    Tem a certeza que pretende eliminar a pergunta "{deleteModal.questionText}"?
                  </p>
                  <div className="d-flex align-items-center justify-content-center">
                    <button
                      className="btn bg-gray-100 rounded-pill me-2"
                      onClick={hideDeleteConfirmation}
                    >
                      Cancelar
                    </button>
                    <button
                      className="btn btn-danger rounded-pill"
                      onClick={handleDeleteQuestion}
                    >
                      Sim, Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Adicionar Pergunta */}
      <div className="modal fade" id="add_question">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="fw-bold">Adicionar Nova Pergunta</h5>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleModalCancel}
              >
                <i className="isax isax-close-circle5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddQuestion();
              }}
            >
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    Pergunta <span className="text-danger"> *</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={newQuestion.questionText}
                    onChange={(e) =>
                      setNewQuestion((prev) => ({
                        ...prev,
                        questionText: e.target.value,
                      }))
                    }
                    placeholder="Introduza a pergunta"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Tipo de Pergunta <span className="text-danger"> *</span>
                  </label>
                  <CustomSelect
                    className="select"
                    options={questionTypeOptions}
                    value={questionTypeOptions.find(
                      (opt) => opt.value === newQuestion.questionType
                    )}
                    onChange={(selected: any) =>
                      setNewQuestion((prev) => ({
                        ...prev,
                        questionType: selected.value,
                      }))
                    }
                  />
                </div>
                <h6 className="mb-3">Opções de Resposta</h6>
                <div className="add-choice-data">
                  {newQuestion.options.map((option, index) => (
                    <div className="mb-3" key={index}>
                      <div className="d-flex align-items-center justify-content-between">
                        <label className="form-label">
                          Opção {index + 1}{" "}
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="form-check form-switch form-switch-end">
                          <label
                            className="form-check-label"
                            htmlFor={`switch-${index}`}
                          >
                            Resposta Correta
                          </label>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id={`switch-${index}`}
                            checked={newQuestion.correctOption === index}
                            onChange={() => setCorrectAnswer(index)}
                          />
                        </div>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Texto da opção ${index + 1}`}
                        required
                      />
                    </div>
                  ))}

                  {additionalOptions.map((option, index) => (
                    <div className="mb-3 extra-choice-row" key={index}>
                      <div className="d-flex align-items-end justify-content-between">
                        <div className="flex-fill">
                          <div className="d-flex align-items-center justify-content-between">
                            <label className="form-label">
                              Opção {newQuestion.options.length + index + 1}{" "}
                              <span className="text-danger"> *</span>
                            </label>
                            <div className="form-check form-switch form-switch-end">
                              <label
                                className="form-check-label"
                                htmlFor={`switch-additional-${index}`}
                              >
                                Resposta Correta
                              </label>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id={`switch-additional-${index}`}
                                checked={
                                  newQuestion.correctOption ===
                                  newQuestion.options.length + index
                                }
                                onChange={() =>
                                  setCorrectAnswer(
                                    newQuestion.options.length + index
                                  )
                                }
                              />
                            </div>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            value={option}
                            onChange={(e) =>
                              updateOption(index, e.target.value, true)
                            }
                            placeholder={`Texto da opção ${newQuestion.options.length + index + 1}`}
                            required
                          />
                        </div>
                        <Link
                          onClick={(e) => {
                            e.preventDefault();
                            removeOption(index);
                          }}
                          to="#"
                          className="delete-item ms-4"
                        >
                          <i className="isax isax-trash" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="#"
                  className="text-secondary d-inline-flex align-items-center fw-medium add-choice"
                  onClick={(e) => {
                    e.preventDefault();
                    addNewOption();
                  }}
                >
                  <i className="isax isax-add me-1" />
                  Adicionar Nova Opção
                </Link>
              </div>
              <div className="modal-footer">
                <button
                  className="btn bg-gray-100 rounded-pill me-2"
                  type="button"
                  onClick={handleModalCancel}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-secondary rounded-pill"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      A adicionar...
                    </>
                  ) : (
                    "Adicionar Pergunta"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Adicionar Pergunta */}
      
      {/* Resto dos modais... */}
    </>
  );
};

export default InstructorQuizQuestions;