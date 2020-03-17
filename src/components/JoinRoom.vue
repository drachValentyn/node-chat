<template>
  <b-row>
    <b-col cols="6">
      <h2>
        Join Room
        <b-link href="/">(Room List)</b-link>
      </h2>
      <b-form @submit="onSubmit">
        <b-form-group
          id="fieldsetHorizontal"
          horizontal
          :label-cols="4"
          breakpoint="md"
          label="Enter Nickname"
        >
          <b-form-input id="nickname" v-model.trim="chat.nickname"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Join</b-button>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>

import * as io from 'socket.io-client'
import axios from 'axios'

export default {
  name: 'JoinRoom',
  data () {
    return {
      chat: {},
      socket: io('http://localhost:5000')
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
