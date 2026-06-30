import authLogin from '../../auth/subcommands/auth-login';

const profileAdd = {
  ...authLogin,
  meta: { description: 'Register a new profile (alias for `auth login`)', name: 'add' },
};

export default profileAdd;
