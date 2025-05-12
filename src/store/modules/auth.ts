import axios from 'axios';
import { ActionContext } from 'vuex';

interface AuthState {
  accessToken: string;
  email: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

const state = (): AuthState => ({
  accessToken: '',
  email: ''
});

const mutations = {
  setToken(state: AuthState, token: string) {
    state.accessToken = token;
    localStorage.setItem('token', token);
  },
  setEmail(state: AuthState, email: string) {
    state.email = email;
    localStorage.setItem('email', email);
  }
};

const actions = {
  async login(
    { commit }: ActionContext<AuthState, unknown>,
    { email, password }: LoginPayload
  ): Promise<void> {
    try {
      const response = await axios.post('https://iapitest.eva.guru/oauth/token', {
        Email: email,
        Password: password,
        GrantType: 'password',
        Scope: 'amazon_data',
        ClientId: 'C0001',
        ClientSecret: 'SECRET0001',
        RedirectUri: 'https://api.eva.guru'
      });
      
      const token = response.data.Data.AccessToken;
      commit('setToken', token);
      commit('setEmail', email);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }
};

const getters = {
  token: (state: AuthState): string => state.accessToken,
  email: (state: AuthState): string => state.email
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};