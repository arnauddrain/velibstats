'use strict';
const axios = require('axios').default;

async function getToken(username, password) {
  let token = null;
  try {
    await axios.post('https://www.velib-metropole.fr/login', {
      "_username": username,
      "_password": password
    }, {
      maxRedirects: 0
    });
  } catch (err) {
    const bearerCookie = err.response.headers['set-cookie'].find(cookie => cookie.includes('BEARER'));
    if (bearerCookie) {
      token = bearerCookie.split(';')[0].split('=')[1];
    }
  }
  return token;
}

async function getCourseList(token) {
  const res = await axios.get('https://www.velib-metropole.fr/webapi/private/getCourseList?limit=1000&offset=0', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  return res.data.walletOperations;
}

module.exports.velibstats = async event => {
  let body = JSON.parse(event.body);
  let token = await getToken(body.username, body.password);
  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: 'Wrong credentials'
      })
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      items: await getCourseList(token),
    }),
  };
};