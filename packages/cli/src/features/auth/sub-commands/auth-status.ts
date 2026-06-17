import memberMe from '../../member/sub-commands/member-me';

const authStatus = {
  ...memberMe,
  meta: { description: 'Print the active profile, environment, and authenticated member', name: 'status' },
};

export default authStatus;
