<template>
  <b-container>
    <b-row>
      <b-col cols="12">
        <h2>
          One to One chat Room
        </h2>

        <div class="pb-4">
          <b-button variant="outline-dark" @click="goBack()">Back to list</b-button>
        </div>

        <b-list-group class="panel-body" v-chat-scroll>
          <b-list-group-item v-for="(item, index) in chats" :key="index" class="chat">

            <!--Your message-->

            <div class="left clearfix" v-if="item.nickname === currentUserName">
              <b-img left src="http://placehold.it/50/55C1E7/fff&text=ME" rounded="circle" width="55" height="55" alt="img" class="m-1" />
              <div class="chat-body clearfix">
                <div class="header">
                  <strong class="primary-font">{{ item.nickname }}</strong> <small class="pull-right text-muted">
                  <span class="glyphicon glyphicon-time"/>{{ item.created_date | moment }}</small>
                </div>
                <p>{{ item.message }}</p>
              </div>
            </div>

            <!--Other message-->

            <div class="right clearfix" v-else>
              <b-img right src="http://placehold.it/50/55C1E7/fff&text=U" rounded="circle" width="55" height="55" alt="img" class="m-1" />
              <div class="chat-body clearfix">
                <div class="header">
                  <strong class="primary-font">{{ item.nickname }}</strong>
                  <small class="pull-right text-muted">
                    <span class="glyphicon glyphicon-time"/>
                    {{ item.created_date | moment }}
                  </small>
                </div>
                <p>{{ item.message }}</p>
              </div>
            </div>

          </b-list-group-item>

        </b-list-group>

        <small v-if="typing" class="typing">{{typing}} is typing</small>

        <ul v-if="errors && errors.length">
          <li v-for="(error, index) of errors" :key="index">
            {{error.message}}
          </li>
        </ul>

        <b-form @submit="onSubmit" class="chat-form mt-4">
          <b-input-group prepend="Message">
            <b-form-input id="message" v-model.trim="chat.message"/>
            <b-input-group-append>
              <b-btn type="submit" variant="outline-success">Send</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form>

      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Vue from 'vue' // eslint-disable-line no-unused-vars
import * as io from 'socket.io-client'
import VueChatScroll from 'vue-chat-scroll' // eslint-disable-line no-unused-vars
import axios from 'axios'
import moment from 'moment'
import { mapState, mapMutations } from 'vuex'

Vue.use(VueChatScroll)

export default {
  name: 'PrivateChat',
  data () {
    return {
      currentUser: null,
      currentUserName: null,
      chats: [],
      errors: [],
      chat: {},
      typing: false,
      socket: io('http://localhost:5005/private-chats')
    }
  },
  created () {
    axios.defaults.headers.common.Authorization = localStorage.getItem(
      'jwtToken'
    )
    this.getChatData()
    this.$socket.on('typing', function (data) {
      this.typing = data
    }.bind(this))

    this.$socket.on('stopTyping', function () {
      console.log('stop')
      this.typing = false
    }.bind(this))
    this.currentUser = this.$store.state.user
    this.currentUserName = this.$store.state.user.username
  },
  computed: mapState(['user', 'users', 'messages']),
  methods: {
    ...mapMutations(['clearData', 'newMessage', 'updateUsers']),
    goBack () {
      console.log('router')
      console.log(this.$router)
      this.$router.go(-1)
    },
    getChatData () {
      axios.get('/api/private-chat/', this.$route.params.name)
        .then(response => {
          console.log('success')
          this.chats = response.data
        })
        .catch(e => {
          console.log('error')
          this.errors.push(e)
        })
    },
    onSubmit (event) {
      event.preventDefault()
      this.chat.room = this.$route.params.id
      this.chat.nickname = this.currentUserName
      axios.post('/api/private-chat/', this.chat)
        .then(response => {
          console.log(response.data)
          this.chats.push(response.data)
          this.$socket.emit('createMessage',
            {
              text: this.chat.message,
              id: this.$store.state.user.id
            },
            data => {
              if (typeof data === 'string') {
                console.error(data)
              } else {
                this.text = ''
                this.chat.message = ''
              }
            })
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  },
  filters: {
    moment (value) {
      if (value) {
        return moment(String(value)).format('MM/DD/YYYY hh:mm')
      }
    }
  }
}
</script>

<style scoped>

</style>
