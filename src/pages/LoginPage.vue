<template>
  <div class="form-container">
    <div class="form-box">
      <LoginForm></LoginForm>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoginForm from '@/components/LoginForm.vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    LoginForm
  }
});
</script>

<style scoped lang="scss"> 
.form-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 20px;
  background: url('@/assets/background.jpg') no-repeat center center / cover;
  padding: 1rem;

  .form-box {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 400px;
    height: 400px;
    max-width: 400px;
    backdrop-filter: blur(10px);
    background-color: rgb(228 200 255 / 25%);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
    animation: fadeIn 1s ease-in-out forwards;
  }
}
</style>
