// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// http://localhost:8888/rosarial_api/apis/login/
export const environment = {
  // https://galaxyteste.online/apis/apis/clientes/
  // https://dashboard.render.com/web/srv-cpl4rgi0si5c738fu1qg/logs
  // baseUrl: 'https://apirosarial.rmscorretorachat.com.br',
  baseUrl: 'http://https://rosarialapp.online:8000',
  apis: '/api',
  production: false,
  distancePermited: 500, // 1km 1000m
  distanceStoresPermitted: 20000, // 10km 1000mnpm audit

  appInfo: {
    name: 'Prom. Rosarial',
    bundledId: 'app.promotores-rosarial',
    version: '0.0.1',
    buildVersion: '00001'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
