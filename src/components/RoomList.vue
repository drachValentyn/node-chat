<template>
  <b-row>
    <b-col cols="12">

      <h2>
        Room List
        <b-link href="/add-room">(Add Room)</b-link>
      </h2>

      <b-table striped hover :items="rooms" :fields="fields">
        <template v-slot:cell(actions)="row">
          <b-button size="sm" @click.stop="join(row.item._id)">Join</b-button>
        </template>
      </b-table>

      <ul v-if="errors && errors.length">
        <li v-for="error of errors" :key="error">
          {{error.message}}
        </li>
      </ul>
    </b-col>
  </b-row>
</template>

<script>

import axios from 'axios'

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
      errors: []
    }
  },
  created () {
    axios.get('/api/room')
      .then(response => {
        this.rooms = response.data
      })
      .catch(e => {
        this.errors.push(e)
      })
  },
  methods: {
    join (id) {
      console.log(id)
      this.$router.push({
        name: 'JoinRoom',
        params: { id }
      })
    }
  }
}

</script>
