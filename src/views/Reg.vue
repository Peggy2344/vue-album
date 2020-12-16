<template lang="pug">
  #reg
    b-container
      b-row
        b-col(cols-12)
          b-form(@submit='onSubmit' @reset='onReset')
            b-form-group#input-group-1(
              label='帳號'
              label-for='input-1'
              :state="accountState"
              description="帳號長度為 4 ~ 20 個字"
              invalid-feedback="帳號格式不符"
              )
              b-form-input#input-1(
                v-model='account'
                type='text'
                :state="accountState"
                required
                placeholder='請輸入帳號...')
            b-form-group#input-group-1(
              label='密碼'
              label-for='input-2'
              :state="passwordState"
              description="密碼長度為 4 ~ 20 個字"
              invalid-feedback="密碼格式不符"
              )
              b-form-input#input-2(
                v-model='password'
                type='password'
                required
                :state="passwordState"
                description="密碼長度為 4 ~ 20 個字"
                invalid-feedback="密碼格式不符"
                placeholder='請輸入密碼...')
            div.text-center
              b-button.mx-1(variant="success" type="submit") 註冊
              b-button.mx-1(variant="danger" type="reset") 重置
</template>

<script>
export default {
  name: 'Reg',
  data () {
    return {
      account: '',
      password: ''
    }
  },
  computed: {
    accountState () {
      if (this.account.length === 0) {
        return null
      } else if (this.account.length >= 4 && this.account.length <= 20) {
        return true
      } else {
        return false
      }
    },
    passwordState () {
      if (this.password.length === 0) {
        return null
      } else if (this.password.length >= 4 && this.password.length <= 20) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    onSubmit () {
      if (this.accountState && this.passwordState) {
        this.axios.post(process.env.VUE_APP_API + '/users/', this.$data)
          .then(res => {
            if (res.data.success) {
              this.$swal({
                icon: 'success',
                title: '註冊成功',
                text: '歡迎加入線上相簿'
              })
            } else {
              this.$swal({
                icon: 'error',
                title: res.data.message
              })
            }
          })
          .catch(err => {
            this.$swal({
              icon: 'error',
              title: err.response.data.message
            })
          })
      }
    },
    onReset () {
      this.account = ''
      this.password = ''
    }
  }
}
</script>
