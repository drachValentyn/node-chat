import Vue from 'vue'
import VueRouter from 'vue-router'
import RoomList from '@/components/RoomList'
import AddRoom from '@/components/AddRoom'
import JoinRoom from '@/components/JoinRoom'
import ChatRoom from '@/components/ChatRoom'
import Login from '@/components/Auth/Login'
import Register from '@/components/Auth/Register'
import OneToOne from '@/components/OneToOne'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'RoomList',
    component: RoomList
  },
  {
    path: '/add-room',
    name: 'AddRoom',
    component: AddRoom
  },
  {
    path: '/join-room/:id',
    name: 'JoinRoom',
    component: JoinRoom
  },
  {
    path: '/chat-room/:id/:nickname',
    name: 'ChatRoom',
    component: ChatRoom
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/one-to-one-chat/:id',
    name: 'OneToOneChat',
    component: OneToOne
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
