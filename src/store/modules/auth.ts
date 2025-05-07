import axios from 'axios';
import { ActionContext } from 'vuex';

interface AuthState {
  accessToken: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

const state: AuthState = {
  accessToken: ''
};

const mutations = {
  setToken(state: AuthState, token: string): void {
    state.accessToken = token;
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
    } catch (error) {
      console.error('Login failed', error);
    }
  }
};

const getters = {
  token(state: AuthState): string {
    return state.accessToken;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};