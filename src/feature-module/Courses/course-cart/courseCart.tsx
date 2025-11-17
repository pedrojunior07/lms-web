import React, { useState } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { useCart } from "../../../core/common/context/cartContext";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap"; // importar modal

const CourseCart = () => {
  const route = all_routes;
  const { cartItems, removeFromCart, clearCart, totalPrice } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  // Função para abrir o modal
  const handleCheckoutClick = () => {
    const isLoggedIn = !!localStorage.getItem("token"); // ou usar contexto de autenticação
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      navigate(route.courseCheckout);
    }
  };

  const handleRemoveItem = (courseId: number) => {
    removeFromCart(courseId);
    toast.success("Course removed from cart");
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Carrinho esvaziado com sucesso");
  };

  return (
    <>
      <Breadcrumb title="Carrinho" />
      <div className="content">
        <div className="container">
          <div className="cart-cover">
            <div className="cart-items">
              <div>
                {/* Cabeçalho do Carrinho */}
                <div className="cart-head border-bottom d-flex justify-content-between align-items-center pb-4">
                  <h5 className="mb-0">
                    {cartItems.length} Curso{cartItems.length !== 1 ? "s" : ""}
                  </h5>
                  {cartItems.length > 0 && (
                    <button
                      className="btn btn-sm btn-danger-ghost mb-0"
                      onClick={handleClearCart}
                    >
                      <i className="isax isax-close-circle me-1" />
                      Limpar carrinho
                    </button>
                  )}
                </div>

                {/* Lista de Cursos */}
                {cartItems.length === 0 ? (
                  <div className="text-center py-5">
                    <h5>Seu carrinho está vazio</h5>
                    <Link
                      to={route.courseGrid}
                      className="btn btn-primary mt-3"
                    >
                      Procurar Cursos
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="row row-gap-3 pb-3 mb-3 border-bottom">
                      {cartItems.map((course) => (
                        <div className="col-md-12" key={course.id}>
                          <div className="cart-item mb-0">
                            <div className="row align-items-center row-gap-3">
                              <div className="col-md-3">
                                <div className="cart-img">
                                  <Link
                                    to={`${route.courseDetails}/${course.id}`}
                                  >
                                    <ImageWithBasePath
                                      src={
                                        course.thumbnailPath ||
                                        "assets/img/course/course-01.jpg"
                                      }
                                      alt={course.title}
                                      className="img-fluid w-100"
                                    />
                                  </Link>
                                </div>
                              </div>
                              <div className="col-md-9">
                                <div className="row align-items-center justify-content-between">
                                  <div className="col-md-9">
                                    <div className="d-flex align-items-center mb-2">
                                      <Link
                                        to={`${route.instructorProfile}/${
                                          course.instructorId || "1"
                                        }`}
                                        className="avatar avatar-sm rounded-circle me-2"
                                      >
                                        <ImageWithBasePath
                                          src={
                                            course.instructorImage ||
                                            "assets/img/user/user-01.jpg"
                                          }
                                          alt={
                                            course.instructorName || "Instrutor"
                                          }
                                          className="img-fluid rounded-circle"
                                        />
                                      </Link>
                                      <p className="mb-0">
                                        <Link
                                          to={`${route.instructorProfile}/${
                                            course.instructorId || "1"
                                          }`}
                                        >
                                          {course.instructorName ||
                                            "Nome do Instrutor"}
                                        </Link>
                                      </p>
                                    </div>
                                    <div className="mb-2">
                                      <h6 className="fs-18 mb-0">
                                        <Link
                                          to={`${route.courseDetails}/${course.id}`}
                                        >
                                          {course.title}
                                        </Link>
                                      </h6>
                                    </div>
                                    <div className="d-flex align-items-center">
                                      <span className="star me-2">
                                        <i className="fa-solid fa-star" />
                                      </span>
                                      <p className="mb-0">
                                        {course.rating || "4.5"} (
                                        {course.reviewCount || "0"} Avaliações)
                                      </p>
                                      <span className="mx-2 bg-secondary rounded-circle dot" />
                                      <p className="mb-0">
                                        {course.level || "Intermediário"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="d-flex align-items-center justify-content-end gap-4 cart-trash">
                                      <h5 className="text-secondary">
                                        MZN {course.price?.toFixed(2) || "0,00"}
                                      </h5>
                                      <button
                                        onClick={() =>
                                          handleRemoveItem(course.id)
                                        }
                                        className="trash-btn border-0 bg-transparent"
                                      >
                                        <i className="isax isax-trash4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Resumo do Pedido */}
                    <div className="bg-light border rounded-2 p-3 mb-4">
                      <div className="row align-items-center justify-content-between row-gap-3">
                        <div className="col-md-6">
                          <h6 className="mb-1">Resumo do Pedido</h6>
                          <p className="mb-0">
                            Aproveite todos os cursos com acesso completo e
                            suporte dedicado.
                            <span className="text-gray-9 fw-medium mx-1">
                              Aprenda no seu ritmo e explore novos
                              conhecimentos.
                            </span>
                          </p>
                        </div>
                        <div className="col-md-6 text-end">
                          <h5>MZN {totalPrice.toFixed(2)}</h5>
                        </div>
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="d-flex align-items-center justify-content-end flex-wrap">
                      <Link
                        to={route.courseGrid}
                        className="btn continue-shopping-btn rounded-pill me-2"
                      >
                        Continuar Comprando
                      </Link>
                      <button
                        onClick={handleCheckoutClick}
                        className="btn checkout-btn rounded-pill"
                      >
                        Finalizar Compra
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login Necessário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Você precisa fazer login para prosseguir para o checkout.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Fechar
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              navigate(route.login, { state: { from: route.courseCheckout } })
            }
          >
            Fazer Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CourseCart;
