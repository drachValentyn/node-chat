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
                <b-button pill variant="outline-secondary" @click="goToChat(item._id)">
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
    this.getAllUsers()
    this.currentUser = this.$store.state.user
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getAllUsers () {
      axios.post('/api/users', this.$route.params.id)
        .then(response => {
          this.users = []
          response.data.forEach((item) => {
            if (item._id !== this.currentUser.userId) {
              this.users.push(item)
            }
          })
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    goToChat (id) {
      this.$router.push({ path: `/one-to-one-chat/${id}`, params: { interlocutorId: id } })
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
