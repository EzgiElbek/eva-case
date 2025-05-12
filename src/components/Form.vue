<template>
  <span class="header">SIGN IN</span>
  <div v-for="(item, index) in form" :key="index" class="input-container">
    <div class="text">{{ item.name }}</div>
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
  <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  <button class="login-button" :disabled="!formData.email || !formData.password || !isEmailValid || isLoading" @click="login">
    <font-awesome-icon v-if="isLoading" :icon="faSpinner" class="spinner-icon" />
    Login
  </button>
</template>

<script lang="ts">
import { ref, reactive, computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface FormItem {
  name: string;
  value: 'email' | 'password';
}

interface FormData {
  email: string;
  password: string;
}

export default defineComponent({
  name: 'Form',
  setup() {
    const store = useStore();
    const router = useRouter();

    const form = reactive<FormItem[]>([
      { name: 'Email', value: 'email' },
      { name: 'Password', value: 'password' }
    ]);

    const formData = reactive<FormData>({ email: '', password: '' });
    const showPassword = ref(false);
    const errorMessage = ref('');
    const isLoading = ref(false);

    const isEmailValid = computed(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(formData.email);
    });

    const passwordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const login = async () => {
      errorMessage.value = ''; isLoading.value = true;
      try {
        await store.dispatch('auth/login', { email: formData.email, password: formData.password });
        const token = store.getters['auth/token'];
        if (token) {
          router.push('/dashboard');
        } else {
          errorMessage.value = 'Invalid email or password!';
        }
      } catch {
        errorMessage.value = 'Login failed.';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      form,
      formData,
      isEmailValid,
      showPassword,
      passwordVisibility,
      faEye,
      faEyeSlash,
      faSpinner,
      isLoading,
      errorMessage,
      login
    };
  }
});
</script>

<style scoped lang="scss">
.header {
  font: 500 20px -apple-system, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
  color: white;
}

.input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  .text {
    width: 90%;
    text-align: left;
    font: 500 15px "Quicksand", sans-serif;
    color: white;
  }

  .input-wrapper {
    position: relative;
    width: 90%;

    input {
      width: 100%;
      height: 40px;
      padding: 12px 40px 12px 15px;
      background: #f9f9f9;
      color: #31373e;
      border: 1px solid #d8dce3;
      border-radius: 8px;
      font: 500 12px -apple-system, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
      box-sizing: border-box;

      &.invalid {
        border-color: red;
      }

      &:focus {
        background: #fff;
        border-color: #8a0990;
        box-shadow: 0 0 0 2px rgba(32, 56, 117, 0.12), 0 10px 18px -16px rgba(32, 56, 117, 0.32);
      }

      :focus-visible {
        outline: none;
      }
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
    width: 90%;
    margin: 2px 0 0 10px;
    font: 500 12px -apple-system, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
    color: #ff5a5a;
    text-align: left;
  }
}

.error-message {
  margin: -7px 0 0 20px;
  font: 500 12px -apple-system, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
  color: #ff5a5a;
  text-align: left;
}

.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 91%;
  padding: 15px;
  margin-left: 16px;
  border: none;
  border-radius: 8px;
  background-color: #2d1251;
  font: 600 14px -apple-system, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
  color: white;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.spinner-icon {
  font-size: 16px;
  margin-right: 6px;
  animation: fa-spin 0.8s infinite linear !important;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>