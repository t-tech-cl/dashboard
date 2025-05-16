export const ACCOUNT_ENDPOINTS = {
  LOGIN: '/api/account/login',
  REGISTER: '/api/account/register',
  REGISTER_ADMIN: '/api/account/register-admin',
  GET_USERS: '/api/account/get-users',
  PENDING_ADMINS: '/api/account/pending-admins',
  PENDING_USERS: '/api/account/pending-users',
  UPDATE_USER_ROLE: '/api/account/update-role',
  APPROVE_ADMIN: '/api/account/approve-admin',
  APPROVE_USER: '/api/account/approve-user',
  DELETE_USER: '/api/account/delete-user'
};

export const REQUESTS_ENDPOINTS = {
  LAST_REQUEST: '/api/requests/get-last',
  REQUEST_LIST: '/api/requests/get-all-requests',
  ALL_REQUESTS: '/api/requests/get-all',
  EXTERNAL_REPORTS: '/api/requests/get-all-external-reports',
  CREATE_REQUEST: '/api/requests/create',
  GET_REQUEST: '/api/requests/get-request'
};
