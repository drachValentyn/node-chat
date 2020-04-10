<template>
  <b-container>
    <b-row align-h='center'>
      <b-col cols='6' class='list-block'>

      <h2>
        Join Room
      </h2>

      <div class='pb-4'>
        <b-button variant='outline-primary' to='/' class='mr-3'>Room List</b-button>
      </div>

      <b-form @submit='onSubmit'>
        <b-row>

          <b-col cols='10'>
            <b-form-group
              id='fieldsetHorizontal'
              horizontal
              :label-cols='4'
              breakpoint='md'
              label='Enter Nickname:'
            >
              <b-form-input id='nickname' v-model.trim='chat.nickname'/>
            </b-form-group>

            <b-form-group
              id='fieldsetHorizontalPh'
              horizontal
              :label-cols='4'
              breakpoint='md'
              label='Add Photo:'
            >
              <b-btn
                size="md"
                color="primary"
                @click="selectImage()"
                class="cursor">
                Select Image
              </b-btn>
            </b-form-group>

            <input
              id="upload"
              ref="uploadInput"
              type="file"
              name="file"
              class="image-input"
              @change="updateUploadButton($event), insertImage()">

            <p class="text-center"
               v-if="loading">
              <strong>Uploading</strong>
              {{ loadingText }}
            </p>

          </b-col>
          <b-col cols='2'>
<!--            :disabled="!chat.nickname"-->
            <b-button type='submit'  variant='outline-success'>Join</b-button>
          </b-col>

        </b-row>

      </b-form>

      <ul v-if="errors && errors.length">
        <li v-for="(error, index) of errors" :key="index">
          {{error.message}}
        </li>
      </ul>
    </b-col>
    </b-row>
  </b-container>

</template>

<script>

// import * as io from 'socket.io-client'
import axios from 'axios'
import { mapMutations } from 'vuex'

export default {
  name: 'JoinRoom',
  data () {
    return {
      chat: {},
      errors: [],
      file: '',
      loadingText: '',
      loading: false,
      photo: ''
    }
  },
  created () {
    axios.defaults.headers.common.Authorization = localStorage.getItem(
      'jwtToken'
    )
  },
  methods: {
    ...mapMutations(['setUser', 'updateUsers']),

    selectImage () {
      this.$refs.uploadInput.click()
    },

    updateUploadButton (e) {
      const fileName = e.target.value.split('\\').pop()
      if (fileName) {
        this.loadingText = fileName
        this.loading = true
      }
    },

    insertImage () {
      axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
      this.file = this.$refs.uploadInput.files[0]
      const formData = new FormData()
      formData.append('file', this.file)
      axios.post('/uploads', formData, {
        params: {
          user: this.chat.nickname
        }
      })
        .then(response => {
          this.photo = response.data
          this.$refs.uploadInput.value = ''
        })
        .catch(e => {
          this.errors.push(e)
        })
    },

    onSubmit (event) {
      event.preventDefault()
      const user = {
        name: this.chat.nickname,
        room: this.$route.params.id,
        photo: this.photo
      }

      this.chat.room = this.$route.params.id
      axios.post('/api/chat', this.chat)
        .then(response => {
          this.$socket.emit('userJoined', user, data => {
            if (typeof data === 'string') {
              console.error(data)
            } else {
              user.id = data.userId
              this.setUser(user)
              this.$router.push({
                name: 'ChatRoom',
                params: {
                  name: this.$route.params.id,
                  nickname: response.data.nickname
                }
              })
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

<style lang='scss'>
  .image-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    overflow: hidden;
    opacity: 0;
  }
</style>
