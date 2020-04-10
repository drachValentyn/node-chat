<template>
  <b-container>
    <b-row>
      <b-col cols="12" class="list-block">
        <UsersList/>

        <h2>
          Room List
        </h2>

        <div class="pb-4">
          <b-button variant="outline-primary" to="/add-room" class="mr-3">Add Room</b-button>
          <b-button variant="outline-warning" @click="logout()">Logout</b-button>
        </div>

        <b-table striped hover :items="rooms" :fields="fields">
          <template v-slot:cell(actions)="row">
            <b-button size="sm" variant="outline-success" @click.stop="join(row.item._id)">Join</b-button>
          </template>
        </b-table>

        <ul v-if="errors && errors.length">
          <li v-for="error of errors" :key="error">
            {{error.message}}
          </li>
        </ul>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

import axios from 'axios'
import UsersList from './UsersList'

export default {
  name: 'BookList',
  data () {
    return {
      fields: [
        {
          key: 'room_name',
          sortable: true,
          class: 'text-center'
        },
        {
          key: 'created_date',
          sortable: true
        },
        {
          key: 'actions',
          class: 'text-center'
        }
      ],
      rooms: [],
      errors: [],
      auth: false,
      currentUser: null
    }
  },
  created () {
    axios.defaults.headers.common.Authorization = localStorage.getItem(
      'jwtToken'
    )
    axios.get('/api/room')
      .then(response => {
        this.rooms = response.data
      })
      .catch(e => {
        this.errors.push(e)
        if (e.response.status === 401) {
          this.auth = true
        }
      })
    this.currentUser = this.$store.state.user
  },
  methods: {
    join (id) {
      this.$router.push({
        name: 'JoinRoom',
        params: { id }
      })
    },
    logout () {
      localStorage.removeItem('jwtToken')
      this.$router.push({
        name: 'Login'
      })
    }
  },
  components: {
    UsersList
  }
}

</script>

<style lang="scss">
  .list-block{
    padding-top: 5%;
    h2{
      padding-bottom: 2%;
    }
  }
</style>
