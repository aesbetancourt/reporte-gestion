import Keycloak from 'keycloak-js';
const keycloak= new Keycloak({ url: 'http://security.intelix.biz/auth', realm: 'GestionDeOcupacion', clientId: 'google' });
export default keycloak;