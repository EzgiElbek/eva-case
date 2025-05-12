<template>
  <div class="form-container">
    <div class="form-box">
      <Form></Form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Form from '@/components/Form.vue';

export default defineComponent({
  name: 'HomeView',
  components: { Form }
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
  padding: 1rem;
  background: url('@/assets/login.jpg') no-repeat center center / cover;

  .form-box {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 100%;
    max-width: 400px;
    height: 400px;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    backdrop-filter: blur(10px);
    background-color: rgba(228, 200, 255, 0.25);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    animation: fadeIn 1s ease-in-out forwards;
  }
}
</style>