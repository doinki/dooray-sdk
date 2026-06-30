import memberMe from '../../member/subcommands/member-me';

const authStatus = {
  ...memberMe,
  meta: { description: 'Show the active profile, environment, and authenticated member', name: 'status' },
};

export default authStatus;
