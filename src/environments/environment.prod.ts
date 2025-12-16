import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  baseurl: 'http://be.doctor-hero.com/api',
  baseAttatchementUrl: 'http://attachments.doctor-hero.com/',
  apiVersion: 'v1',
  attachmentURL: 'http://attachments.doctor-hero.com/api/v1/'
};
