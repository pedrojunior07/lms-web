import { all_routes } from "../../../../feature-module/router/all_routes";

export const instructorSidebarData = [
  {
    title: "Painel",
    icon: "isax isax-grid-35",
    route: all_routes.instructorDashboard,
  },
  {
    title: "Meu Perfil",
    icon: "fa-solid fa-user",
    route: all_routes.instructorProfile,
  },
  {
    title: "Cursos",
    icon: "isax isax-teacher5",
    route: all_routes.instructorCourse,
  },
  {
    title: "Anúncios",
    icon: "isax isax-volume-high5",
    route: all_routes.instructorAnnouncements,
  },
  /** {
    title: "Tarefas",
    icon: "isax isax-clipboard-text5",
    route: all_routes.instructorAssignment,
  }, */
  {
    title: "Alunos",
    icon: "isax isax-profile-2user5",
    route: all_routes.studentsList,
  },
  {
    title: "Quiz",
    icon: "isax isax-award5",
    route: all_routes.instructorQuiz,
    subRoute: all_routes.instructorQA,
  },
  /*  {
    title: "Resultados do Quiz",
    icon: "isax isax-medal-star5",
    route: all_routes.instructorQuizResult,
  },*/
  /* {
    title: "Certificados",
    icon: "isax isax-note-215",
    route: all_routes.instructorCertificate,
  },*/
  /* {
    title: "Ganhos",
    icon: "isax isax-wallet-add5",
    route: all_routes.instructorEarning,
  },*/
  {
    title: "Pagamentos",
    icon: "isax isax-coin-15",
    route: all_routes.instructorPayout,
  },
  /**{
    title: "Extratos",
    icon: "isax isax-shopping-cart5",
    route: all_routes.instructorStatements,
  }, */
  /* {
    title: "Mensagens",
    icon: "isax isax-messages-35",
    route: all_routes.instructorMessage,
  },*/
  /* {
    title: "Chamados de Suporte",
    icon: "isax isax-ticket5",
    route: all_routes.instructorTickets,
  },*/
];
