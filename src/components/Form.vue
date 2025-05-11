<template>
  <span class="header">SIGN IN</span>
  <div v-for="(item, index) in form" :key="index" class="input-group">
    <div class="text"> {{ item.name }}</div>
    <div class="input-wrapper">
      <input
        v-model="formData[item.value]"
        :placeholder="item.name"
        :type="item.value === 'password' ? (showPassword ? 'text' : 'password') : item.value"
        :class="{ invalid: item.value === 'email' && !isEmailValid && formData.email }"
      />
      <font-awesome-icon
        v-if="item.value === 'password'"
        :icon="showPassword ? faEye : faEyeSlash"
        @click="passwordVisibility"
        class="eye-icon"
      />
    </div>
    <div v-if="item.value === 'email' && formData.email && !isEmailValid" class="invalid-email">
      Please enter a valid email address.
    </div>
  </div>
  <div v-if="errorMessage" class="error-message">
    {{ errorMessage }}
  </div>
  <button
    class="login-button"
    :disabled="!formData.email || !formData.password || !isEmailValid || isLoading"
    @click="login"
  >
  <font-awesome-icon v-if="isLoading" :icon="faSpinner" class="spinner-icon"/>
    Login
  </button>

</template>

<script lang="ts">
import { ref, reactive, computed } from 'vue';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

interface FormItem {
  name: string;
  value: 'email' | 'password';
}

interface FormData {
  email: string;
  password: string;
}

export default {
  name: 'Form',
  setup() {
    const store = useStore();
    const router = useRouter();

    const form = reactive<FormItem[]>([
      { name: 'Email', value: 'email' }, { name: 'Password', value: 'password'}
    ]);

    const formData = reactive<FormData>({ email: '', password: '' });
    const showPassword = ref<boolean>(false);
    const errorMessage = ref<string>('');
    const isLoading = ref<boolean>(false);

    const passwordVisibility = (): void => {
      showPassword.value = !showPassword.value;
    };

    const isEmailValid = computed((): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(formData.email);
    });

    const login = async (): Promise<void> => {
      errorMessage.value = '';
      isLoading.value = true;
      try {
        await store.dispatch('auth/login', {
          email: formData.email,
          password: formData.password
        });

        const token = store.getters['auth/token'];
        if (token) {
          router.push('/dashboard');
        } else {
          errorMessage.value = 'Invalid email or password!';
        }
      } catch (error) {
        errorMessage.value = 'Login failed. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      form,
      formData,
      showPassword,
      passwordVisibility,
      faEye,
      faEyeSlash,
      faSpinner,
      isEmailValid,
      isLoading,
      errorMessage,
      login
    };
  }
}
</script>

<style scoped lang="scss">

  .header {
    font: normal 500 20px -apple-system, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
    color: white;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;

    .text {
      display: flex;
      justify-content: flex-start;
      width: 90%;
      font: 500 15px "Quicksand", sans-serif;
      color: white;
    }

    .input-wrapper {
      position: relative;
      width: 90%;

      input {
        width: 100%;
        height: 40px;
        background: #f9f9f9;
        color: #31373e;
        border: 1px solid #d8dce3;
        border-radius: 8px;
        box-sizing: border-box;
        font: normal 500 12px / 40px -apple-system, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
        padding: 12px 40px 12px 15px;
      }

      input:focus {
        background: #fff;
        border-color: #8a0990;
        box-shadow: 0 0 0 2px rgba(32, 56, 117, .12), 0 10px 18px -16px rgba(32, 56, 117, .32);
      }

      :focus-visible {
        outline: none;
      }

      input.invalid {
        border-color: red;
      }

      .eye-icon {
        position: absolute;
        top: 14px;
        right: 15px;
        font-size: 12px;
        cursor: pointer;
        color: rgb(138, 9, 144);
      }
    }

    .invalid-email {
      color: #ff5a5a;
      font: normal 500 12px / 10px -apple-system, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
      margin: 2px 0 0 10px;
      text-align: left;
      width: 90%;
    }
  }

  .login-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 91%;
    padding: 15px;
    background-color: #2d1251;
    font: normal 600 14px -apple-system, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
    cursor: pointer;
    color: white;
    border: none;
    border-radius: 8px;
    margin-left: 16px;
  }

  .spinner-icon {
      font-size: 16px;
      margin-right: 6px;
      animation: fa-spin 0.8s infinite linear !important;
    }

  .login-button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  .error-message {
    color: #ff5a5a;
    font: normal 500 12px / 10px -apple-system, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
    margin: -7px 0 0 20px;
    text-align: left;
  }

</style>