import authLogin from '../../auth/sub-commands/auth-login';

const profileAdd = {
  ...authLogin,
  meta: { description: 'Register a new profile (alias for `auth login`)', name: 'add' },
};

export default profileAdd;
