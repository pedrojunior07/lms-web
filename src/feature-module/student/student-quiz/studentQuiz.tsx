import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import StudentSidebar from "../common/studentSidebar";
import ProfileCard from "../common/profileCard";
import { useCourseApi } from "../../../core/api/hooks/useCourseApi";

const StudentQuiz = () => {
  const route = all_routes;
  const { listQuizzes } = useCourseApi();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const quizzesData = await listQuizzes();
      setQuizzes(quizzesData || []);
    } catch (err) {
      console.error("Erro ao carregar questionários:", err);
      setError("Erro ao carregar questionários. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Calcular quizzes para a página atual
  const indexOfLastQuiz = currentPage * itemsPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - itemsPerPage;
  const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);
  const totalPages = Math.ceil(quizzes.length / itemsPerPage);

  // Função para mudar de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Função para ir para a página anterior
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Função para ir para a próxima página
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Função para formatar o número de questões
  const formatQuestionCount = (count: number) => {
    return `${count} Quest${count !== 1 ? 'ões' : 'ão'}`;
  };

  if (loading) {
    return (
      <>
        <Breadcrumb title="As Minhas Tentativas de Questionário" />
        <div className="content">
          <div className="container">
            <ProfileCard />
            <div className="row">
              <StudentSidebar />
              <div className="col-lg-9">
                <div className="page-title d-flex align-items-center justify-content-between">
                  <h5>As Minhas Tentativas de Questionário</h5>
                </div>
                <div className="text-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">A carregar...</span>
                  </div>
                  <p className="mt-2">A carregar questionários...</p>
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
        <Breadcrumb title="As Minhas Tentativas de Questionário" />
        <div className="content">
          <div className="container">
            <ProfileCard />
            <div className="row">
              <StudentSidebar />
              <div className="col-lg-9">
                <div className="page-title d-flex align-items-center justify-content-between">
                  <h5>As Minhas Tentativas de Questionário</h5>
                </div>
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
                <button 
                  className="btn btn-secondary" 
                  onClick={loadQuizzes}
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

  return (
    <>
      <Breadcrumb title="As Minhas Tentativas de Questionário" />

      <div className="content">
        <div className="container">
          {/* profile box */}
          <ProfileCard />
          {/* profile box */}
          <div className="row">
            {/* sidebar */}
            <StudentSidebar />
            {/* sidebar */}
            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5>As Minhas Tentativas de Questionário</h5>
                <div className="text-muted fs-14">
                  Total: {quizzes.length} questionário{quizzes.length !== 1 ? 's' : ''}
                </div>
              </div>

              {currentQuizzes.length === 0 ? (
                <div className="text-center py-5">
                  <i className="isax isax-message-question5 fs-48 text-muted mb-3"></i>
                  <h5 className="text-muted">Nenhum questionário disponível</h5>
                  <p className="text-muted">
                    Ainda não há questionários disponíveis para tentar.
                  </p>
                </div>
              ) : (
                <>
                  {currentQuizzes.map((quiz, index) => (
                    <div 
                      key={quiz.id || index} 
                      className="d-flex align-items-center justify-content-between border p-3 mb-3 rounded-2"
                    >
                      <div className="flex-grow-1">
                        <h6 className="mb-1">
                          <Link 
                            to={{
                              pathname: route.studentQuizQuestion,
                              search: `?quizId=${quiz.id}`
                            }}
                            className="text-decoration-none"
                          >
                            {quiz.title || "Questionário sem título"}
                          </Link>
                        </h6>
                        <p className="fs-14 mb-1">
                          Número de Questões: {formatQuestionCount(quiz.numberOfQuestions || 0)}
                        </p>
                        {quiz.duration && (
                          <p className="fs-14 text-muted mb-0">
                            Duração: {quiz.duration} minuto{quiz.duration !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      <div>
                        <Link 
                          to={{
                            pathname: route.studentQuizQuestion,
                            search: `?quizId=${quiz.id}`
                          }} 
                          className="arrow-next"
                        >
                          <i className="isax isax-arrow-right-1" />
                        </Link>
                      </div>
                    </div>
                  ))}

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div className="row align-items-center mt-3">
                      <div className="col-md-4">
                        <p className="pagination-text">
                          Página {currentPage} de {totalPages}
                        </p>
                      </div>
                      <div className="col-md-8">
                        <ul className="pagination lms-page justify-content-center justify-content-md-end mt-2 mt-md-0">
                          <li className={`page-item prev ${currentPage === 1 ? 'disabled' : ''}`}>
                            <Link 
                              className="page-link" 
                              to="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                goToPreviousPage();
                              }}
                            >
                              <i className="fas fa-angle-left" />
                            </Link>
                          </li>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <li 
                              key={page} 
                              className={`page-item ${currentPage === page ? 'active' : ''}`}
                            >
                              <Link 
                                className="page-link" 
                                to="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  paginate(page);
                                }}
                              >
                                {page}
                              </Link>
                            </li>
                          ))}
                          
                          <li className={`page-item next ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <Link 
                              className="page-link" 
                              to="#"
                              onClick={(e) => {
                                e.preventDefault();
                                goToNextPage();
                              }}
                            >
                              <i className="fas fa-angle-right" />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentQuiz;