<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="6" class="list-block">

      <h2>
        Join Room
      </h2>

      <div class="pb-4">
        <b-button variant="outline-primary" to="/" class="mr-3">Room List</b-button>
      </div>

      <b-form @submit="onSubmit">
        <b-row>

          <b-col cols="10">
            <b-form-group
              id="fieldsetHorizontal"
              horizontal
              :label-cols="4"
              breakpoint="md"
              label="Enter Nickname:"
            >
              <b-form-input id="nickname" v-model.trim="chat.nickname"/>
            </b-form-group>
          </b-col>
          <b-col cols="2">
            <b-button type="submit" variant="outline-success">Join</b-button>

          </b-col>

        </b-row>

      </b-form>
    </b-col>
    </b-row>
  </b-container>

</template>

<script>

import * as io from 'socket.io-client'
import axios from 'axios'

export default {
  name: 'JoinRoom',
  data () {
    return {
      chat: {},
      socket: io('http://localhost:5005')
    }
  },
  methods: {
    onSubmit (event) {
      event.preventDefault()
      this.chat.room = this.$route.params.id
      this.chat.message = this.chat.nickname + ' join the room'
      axios.post('/api/chat', this.chat)
        .then(response => {
          this.socket.emit('save message',
            {
              room: this.chat.room,
              nickname: this.chat.nickname,
              message: 'Join this room',
              created_date: new Date()
            })
          this.$router.push({
            name: 'ChatRoom',
            params: {
              id: this.$route.params.id,
              nickname: response.data.nickname
            }
          })
        })
        .catch(e => {
          console.log(e)
          this.errors.push(e)
        })
    }
  }
}
</script>

<style lang="scss">

</style>
