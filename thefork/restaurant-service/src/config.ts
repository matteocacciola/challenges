const envVar = process.env.COUNTRIES_REVIEW

export const configuration = {
  env: process.env.APP_ENV || 'dev',
  images: {
    source: process.env.IMAGE_SOURCE || 'remote',
    origin: process.env.IMAGE_URL || 'http://image-service:3010/images/',
  },
  countries: {
    review: envVar ? envVar.split(',') : ['FR'],
  },
};
