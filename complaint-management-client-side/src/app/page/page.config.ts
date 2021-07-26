const pageConfig = {
  APP_ENDPOINT: 'http://localhost:8080/',
  complaint: {
    API: {
      VERSION: 'api/v1',
      CREATE_COMPLAINT:  '/complaint/create',
      UPDATE_COMPLAINT: '/complaint/update',
      FIND_COMPLAINTS_BY_USER_ID: '/complaints/user/',
      REMOVE_COMPLAINT_BY_ID: '/complaints/remove/{id}',
      FIND_ALL: '/complaints',
      FIND_ALL_COMPLAINT_STATUES : '/complaint/statues',
      UPDATE_COMPLAINT_STATUS: '/complaint/status-update'
    }},
    role: {
      API: {
        VERSION: 'api/v1',
        FIND_ALL: '/roles'
      }
    }
};
export { pageConfig };

