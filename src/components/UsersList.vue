<template>
  <b-container>
    <b-row class="users-list">
      <b-col cols="12">
        <h6 align-self="start" class="small-title">
         All Users
        </h6>

        <div>
            <b-list-group horizontal>
              <b-list-group-item  v-for="item in users" v-bind:key="item.name" class="mb-4">
                <b-button pill variant="outline-secondary" @click="goToChat(item._id, item.username)">
                {{item.username}}
                </b-button>
              </b-list-group-item>
            </b-list-group>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'UsersList',
  data () {
    return {
      users: null,
      currentUser: null
    }
  },
  created () {
    this.currentUser = this.$store.state.user
    this.getAllUsers()
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getAllUsers () {
      axios.post('/api/users', { username: this.currentUser.username })
        .then(response => {
          this.users = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    createRoom (id, userName) {
      axios.post('/api/room', {
        id: id,
        room_name: userName,
        current_user_id: this.currentUser.username,
        another_user_id: userName,
        room_type: 'private'
      })
        .then(response => {
          this.$router.push({
            path: `/one-to-one-chat/${response.name}`,
            params: { interlocutorId: id }
          })
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    goToChat (id, userName) {
      const user = {
        name: userName,
        room: id
      }
      axios.get('/api/room', {
        id: id
      })
        .then(response => {
          this.$socket.emit('userJoined', user, data => {
            if (typeof data === 'string') {
              console.error(data)
            } else {
              this.$router.push({
                path: `/one-to-one-chat/${userName}`
                // id:
              })
            }
          })
        })
        .catch(e => {
          this.createRoom(id, userName)
          this.errors.push(e)
        })
    }
  }
}
</script>

<style scoped>
  .small-title {
    display: flex;
    opacity: 0.5;
  }
  .users-list {
    overflow: auto;
  }
</style>
