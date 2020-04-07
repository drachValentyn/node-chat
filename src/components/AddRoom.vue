<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="6" align-self="center" class="list-block">
        <h2>
          Add Room
        </h2>

        <b-form @submit="onSubmit">
          <b-form-group id="fieldsetHorizontal"
                        horizontal
                        :label-cols="4"
                        breakpoint="md"
                        label="Enter Room Name:">
            <b-form-input id="room_name" v-model.trim="room.room_name"/>
          </b-form-group>
          <b-button type="submit" variant="primary">Save</b-button>
        </b-form>

      </b-col>
    </b-row>
  </b-container>
</template>

<script>

import axios from 'axios'

export default {
  name: 'AddRoom',
  data () {
    return {
      room: {}
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      axios.post('/api/room', this.room)
        .then(response => {
          this.$router.push({
            name: 'RoomList'
          })
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  },
  created () {
    axios.defaults.headers.common.Authorization = localStorage.getItem(
      'jwtToken'
    )
  }
}
</script>
