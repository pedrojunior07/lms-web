import { all_routes } from "../../../../feature-module/router/all_routes";

export const studentSidebarData = [
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
   
]