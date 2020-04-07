<template>
  <b-container>
    <b-row class='justify-content-md-center bv-ex-row' align-v='center'>
      <b-col cols='6'>

        <h1 class='text-center'>
          Log in
        </h1>

        <div v-if='errors && errors.length && error'>
          <div v-for='(error, index) of errors' :key='index'>
            <b-alert show variant='danger'>{{error}}</b-alert>
          </div>
        </div>

        <div v-if='error'>
          <b-alert show variant='danger'>{{error}}</b-alert>
        </div>

        <b-form @submit='onSubmit'>

          <b-form-group id="input-group-username"
                        label="Enter Username"
                        breakpoint='md'
                        label-for="input-username">

            <b-form-input
              id="input-username"
              name="input-username"
              required
              v-model="$v.form.username.$model"
              :state="validateState('username')"
              aria-describedby="username-feedback"
            />

            <b-form-invalid-feedback id="username-feedback">Username is a required and must be 3-8 characters long.</b-form-invalid-feedback>
          </b-form-group>

          <b-form-group id="input-group-password"
                        label="Enter Password"
                        breakpoint='md'
                        label-for="input-password">

            <b-form-input
              id="input-password"
              name="input-password"
              required
              type='password'
              v-model="$v.form.password.$model"
              :state="validateState('password')"
              aria-describedby="password-feedback"
            />

            <b-form-invalid-feedback id="password-feedback">Password is a required and must be 3-8 characters long.</b-form-invalid-feedback>
          </b-form-group>

          <b-button type='submit' variant='primary' class='mr-3'>Login</b-button>
          <b-button type='button' variant='success' @click.stop='register()'>Register</b-button>

        </b-form>

      </b-col>
    </b-row>
  </b-container>

</template>

<script>

import axios from 'axios'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'Login',
  mixins: [validationMixin],
  data () {
    return {
      errors: [],
      error: '',
      form: {
        username: null,
        password: null
      }
    }
  },
  validations: {
    form: {
      username: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(10)
      },
      password: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(10)
      }
    }
  },
  methods: {
    validateState (name) {
      const { $dirty, $error } = this.$v.form[name]
      return $dirty ? !$error : null
    },
    onSubmit (event) {
      event.preventDefault()
      if (!this.$v.form.$anyError) {
        axios.post('/api/auth/login/', this.form)
          .then(response => {
            const user = response.data.user
            user.loggedIn = response.data.success
            this.$store.state.user = user
            localStorage.setItem('newUser', JSON.stringify(user))
            localStorage.setItem('jwtToken', response.data.token)
            this.$router.push({
              name: 'RoomList'
            })
          })
          .catch(e => {
            console.log(e)
            if (e.response.status === 404) {
              this.error = 'Authentication failed. User not found.'
            } else if (e.response.status === 401) {
              this.error = 'Authentication failed. Wrong password.'
            } else {
              this.errors.push(e)
            }
          })
      }
    },
    register () {
      this.$router.push({
        name: 'Register'
      })
    }
  }
}
</script>

<style scoped>

</style>
