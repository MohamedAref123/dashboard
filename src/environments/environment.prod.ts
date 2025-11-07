import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  baseurl: 'http://admindoctormanagement.hgtechnologygroup.net/api',
  baseAttatchementUrl: 'http://attachments.hgtechnologygroup.net/',
  apiVersion: 'v1',
  attachmentURL: 'http://attachments.hgtechnologygroup.net/api/v1/'
};
