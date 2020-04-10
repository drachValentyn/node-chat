import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    messages: [],
    users: []
  },
  getters: {
    userIn: state => {
      return state.userIn
    }
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },
    clearData (state) {
      state.user = {}
      state.messages = []
      state.users = []
    },
    SOCKET_newMessage (state, message) {
      state.messages.push(message)
    },
    SOCKET_updateUsers (state, users) {
      state.users = users
    }
  }
})
