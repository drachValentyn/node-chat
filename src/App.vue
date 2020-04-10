<template>
  <div id="app">

    <b-navbar type="dark" variant="dark">
      <b-navbar-nav>
        <b-navbar-brand to="/">Home</b-navbar-brand>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto" v-if="!auth">
        <b-nav-item to="/login">Login</b-nav-item>
        <b-nav-item to="/register">Register</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav v-if="userName" class="ml-auto">
        <b-nav-item right>
            <em>{{userName}}</em>
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>

    <router-view/>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      userName: null
    }
  },
  computed: {
    ...mapGetters({
      user: 'user'
    })
  },
  created () {
    this.auth = localStorage.getItem('jwtToken')
    const getUser = JSON.parse(localStorage.getItem('newUser'))
    if (getUser !== null) {
      this.$store.state.user = getUser
      this.userName = this.$store.state.user.userName
    }
    this.auth = localStorage.getItem('jwtToken')
  }
}

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.bv-ex-row{
  height: 100vh;
}

.list-block{
  padding-top: 5%;
  h2{
    padding-bottom: 2%;
  }
}
</style>
