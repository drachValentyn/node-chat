<template>
  <b-container>
    <b-row class="justify-content-md-center bv-ex-row" align-v='center'>
      <b-col cols="6">

        <h2>Please Register</h2>

        <div v-if="errors && errors.length">
          <div v-for="(error, index) of errors" :key="index">
            <b-alert show>{{error.message}}</b-alert>
          </div>
        </div>

        <b-alert variant="success" v-model="showAlertOnSuccess">Success Alert</b-alert>

        <b-form @submit="onSubmit">

          <b-form-group id="input-group-username"
                        label="Enter Username"
                        breakpoint='md'
                        label-for="input-username">

            <b-form-input
              id="input-username"
              name="input-username"
              required
              v-model="$v.register.username.$model"
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
              v-model="$v.register.password.$model"
              :state="validateState('password')"
              aria-describedby="password-feedback"
            />

            <b-form-invalid-feedback id="password-feedback">Password is a required and must be 3-8 characters long.</b-form-invalid-feedback>
          </b-form-group>

          <b-button type="submit" variant="primary" class='mr-3'>Register</b-button>
          <b-button type="button" variant="success" @click="$router.go(-1)">Cancel</b-button>

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
  name: 'Register',
  mixins: [validationMixin],
  data () {
    return {
      register: {
        username: null,
        password: null
      },
      errors: [],
      showAlertOnSuccess: false
    }
  },
  validations: {
    register: {
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
      const { $dirty, $error } = this.$v.register[name]
      return $dirty ? !$error : null
    },
    onSubmit (event) {
      event.preventDefault()
      if (!this.$v.register.$anyError) {
        axios.post('/api/auth/register/', this.register)
          .then(response => {
            console.log(response)
            this.showAlertOnSuccess = true
            this.$router.push({
              name: 'Login'
            })
          })
          .catch(e => {
            console.log(e)
            this.errors.push(e)
          })
      }
    }
  }
}
</script>

<style scoped>

</style>
