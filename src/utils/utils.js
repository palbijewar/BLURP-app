const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient({
  host: 'redis-10185.c212.ap-south-1-1.ec2.cloud.redislabs.com',
  port: 10185,
  password: '0k7FkMp8Gxe3YcIEUVryWTwkhXqY4LJ3',
});

client.on('connect', () => {
  console.log('Connected to Redis!');
});

client.on('error', (err) => {
  console.error('Redis connection error:', err);
});

const SET_ASYNC = promisify(client.set).bind(client);
const GET_ASYNC = promisify(client.get).bind(client);

module.exports = { SET_ASYNC, GET_ASYNC };
