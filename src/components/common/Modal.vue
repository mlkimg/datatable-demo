<template>
  <transition name="modal">
    <div class="mask" v-if="isVisible" @click="isVisible = false">
      <div class="container" :style="dialogStyle" @click.stop>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      show: {
        type: Boolean,
        default: false
      },
      dialogStyle: {
        default () { return {} }
      }
    },
    data () {
      return {
        isVisible: false
      }
    },
    watch: {
      show () {
        this.isVisible = this.show
      },
      isVisible () {
        this.$emit(this.isVisible ? 'show' : 'hide')
      },
      onEscapeKeyDown (event) {
        if (this.isVisible && event.keyCode === 27) {
          this.isVisible = false
        }
      }
    },
    mounted () {
      document.addEventListener('keydown', this.onEscapeKeyDown)
    },
    created () {
      this.isVisible = this.show
    },
    destroyed () {
      document.removeEventListener('keydown', this.onEscapeKeyDown)
    }
  }
</script>

<style scoped>
  .mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s ease;
  }
  .container {
    width: 300px;
    margin: 40px auto 0;
    padding: 20px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }
  .modal-enter, .modal-leave-active {
    opacity: 0;
  }
  .modal-enter-active .container,
  .modal-leave-active .container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>