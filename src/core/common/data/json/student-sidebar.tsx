import { all_routes } from "../../../../feature-module/router/all_routes";

export const studentSidebarData = [
    {
        title: 'Painel',
        icon: 'isax isax-grid-35',
        route: all_routes.studentDashboard
    },
    {
        title: 'Meu Perfil',
        icon: 'fa-solid fa-user',
        route: all_routes.studentProfile
    },
    {
        title: 'Cursos Inscritos',
        icon: 'isax isax-teacher5',
        route: all_routes.studentCourses
    },
    {
        title: 'Certificados',
        icon: 'isax isax-note-215',
        route: all_routes.studentCertificates
    },
    {
        title: 'Lista de Desejos',
        icon: 'isax isax-heart5',
        route: all_routes.studentWishlist
    },
    {
        title: 'Avaliações',
        icon: 'isax isax-star5',
        route: all_routes.studentReviews
    },
    {
        title: 'Minhas Tentativas de Quiz',
        icon: 'isax isax-award5',
        route: all_routes.studentQuiz,
        subRoute: all_routes.studentQuizQuestion
    },
    {
        title: 'Histórico de Pedidos',
        icon: 'isax isax-shopping-cart5',
        route: all_routes.studentOrderHistory
    },
    {
        title: 'Indicações',
        icon: 'isax isax-tag-user5',
        route: all_routes.studentReferral
    },
    {
        title: 'Mensagens',
        icon: 'isax isax-messages-35',
        route: all_routes.studentMessage
    },
    {
        title: 'Tickets de Suporte',
        icon: 'isax isax-ticket5',
        route: all_routes.studentTickets
    },
]