<template lang="pug">
  #album
    b-container
      b-row
        b-col(cols="12")
          h1.text-center 我的相簿
          b-form(@submit.prevent="onSubmit")
            b-form-group#input-group-1(
              label="圖片說明"
              label-for="input-1"
              :state="descState"
              description="最多200個字"
              invalid-feedback="格式不符"
            )
              b-form-textarea#input-1(
                v-model="description"
                type="text"
                required
                placeholder="請輸入相片說明..."
                :state="descState"
              )
            img-inputer.mx-auto(
              v-model="image"
              placeholder="請選擇圖片"
              bottom-text="點擊或拖曳更換圖片" :max-size="1024"
              exceedSizeText="檔案大小不能超過"
              accept="image/*"
              )
            br
            br
            b-btn(type="submit" variant="success") 送出
      hr
      Photoswipe
        b-row
          b-col(cols="12" md="60" lg="3" v-for="(image,index) in images" :key="image._id")
            b-card
              b-card-img(:src="image.src" v-pswp="image")
              b-card-body
                b-btn(v-if="image.edit" variant="danger" @click="cancel(image)") 取消
                b-btn(v-if="image.edit" variant="success" @click="save(image)") 保存
                b-btn(v-if="!image.edit" variant="success" @click="edit(image)") 編輯
                b-btn(v-if="!image.edit" variant="danger" @click="del(image, index)") 刪除
                hr
                b-form-textarea(v-if="image.edit" v-model="image.model")
                b-card-text(style="white-space: pre-wrap") {{ image.title }}
</template>

<script>
export default {
  name: 'Album',
  data () {
    return {
      image: null,
      description: '',
      images: []
    }
  },
  computed: {
    descState () {
      if (this.description.length === 0) {
        return null
      } else if (this.description.length > 200) {
        return false
      } else {
        return true
      }
    },
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    onSubmit () {
      if (this.image.size > 1024 * 1024) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '圖片太大'
        })
      } else if (!this.image.type.includes('image')) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '檔案格式錯誤'
        })
      } else {
        const fd = new FormData()
        fd.append('image', this.image)
        fd.append('description', this.description)
        this.axios.post(process.env.VUE_APP_API + '/albums/', fd)
          .then(res => {
            if (res.data.success) {
              // 將新增的圖片塞進相簿陣列
              res.data.result.src = process.env.VUE_APP_API + '/albums/file/' + res.data.result.file
              res.data.result.title = res.data.result.description
              res.data.result.edit = false
              res.data.result.model = res.data.result.description
              delete res.data.result.file
              delete res.data.result.description
              this.images.push(res.data.result)
              // 送出後清空表單
              this.image = null
              this.description = ''
            } else {
              this.$swal({
                icon: 'error',
                title: '錯誤',
                text: res.data.message
              })
            }
          })
          .catch(err => {
            this.$swal({
              icon: 'error',
              title: '錯誤',
              text: err.response.data.message
            })
          })
      }
    },
    cancel (image) {
      image.edit = false
      image.model = image.title
    },
    save (image) {
      this.axios.patch(process.env.VUE_APP_API + '/albums/' + image._id, { description: image.model })
        .then(res => {
          if (res.data.success) {
            image.edit = false
            image.title = image.model
          } else {
            this.$swal({
              icon: 'error',
              title: '錯誤',
              text: res.data.message
            })
          }
        })
        .catch(err => {
          this.$swal({
            icon: 'error',
            title: '錯誤',
            text: err.response.data.message
          })
        })
    },
    edit (image) {
      image.edit = true
      image.model = image.title
    },
    del (image, index) {
      this.axios.delete(process.env.VUE_APP_API + '/albums/' + image._id)
        .then(res => {
          if (res.data.success) {
            this.images.splice(index, 1)
          } else {
            this.$swal({
              icon: 'error',
              title: '錯誤',
              text: res.data.message
            })
          }
        })
        .catch(err => {
          this.$swal({
            icon: 'error',
            title: '錯誤',
            text: err.response.data.message
          })
        })
    }
  },
  mounted () {
    this.axios.get(process.env.VUE_APP_API + '/albums/user/' + this.user.id)
      .then(res => {
        if (res.data.success) {
          this.images = res.data.result.map(image => {
            image.src = process.env.VUE_APP_API + '/albums/file/' + image.file
            image.title = image.description
            image.edit = false
            image.model = image.description
            delete image.file
            delete image.description
            return image
          })
        } else {
          this.$swal({
            icon: 'error',
            title: '錯誤',
            text: res.data.message
          })
        }
      })
      .catch(err => {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: err.response.data.message
        })
      })
  }
}
</script>
