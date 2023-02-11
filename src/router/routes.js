
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'bookRepo', component: () => import('pages/bookRepo.vue') },
      { path: 'TimelinePage', component: () => import('src/pages/TimelinePage.vue') },
      { path: 'register', component: () => import('src/pages/registerPage.vue') },
      { path: 'signIn', component: () => import('src/pages/signInPage.vue') },

    ]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
