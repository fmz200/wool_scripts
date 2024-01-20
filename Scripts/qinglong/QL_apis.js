'use strict';

const got = require('got');
require('dotenv').config();
const {readFile} = require('fs/promises');
const path = require('path');

const qlDir = '/ql';
const fs = require('fs');
let Fileexists = fs.existsSync('/ql/data/config/auth.json');
let authFile = "";
if (Fileexists)
  authFile = "/ql/data/config/auth.json"
else
  authFile = "/ql/config/auth.json"
//const authFile = path.join(qlDir, 'config/auth.json');

const api = got.extend({
  prefixUrl: 'http://127.0.0.1:5600',
  retry: {limit: 0},
});

async function getToken() {
  const authConfig = JSON.parse(await readFile(authFile));
  return authConfig.token;
}

module.exports.getEnvsByName = async (searchValue) => {
  const token = await getToken();
  const body = await api({
    url: 'api/envs',
    searchParams: {
      searchValue: searchValue,
      t: Date.now(),
    },
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
    },
  }).json();
  return body.data;
};

module.exports.getEnvsCount = async () => {
  const data = await this.getEnvs();
  return data.length;
};

module.exports.addEnv = async (cookie, remarks) => {
  const token = await getToken();
  return await api({
    method: 'post',
    url: 'api/envs',
    params: {t: Date.now()},
    json: [{
      name: 'JD_COOKIE',
      value: cookie,
      remarks,
    }],
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
};

module.exports.updateEnv = async (value, eid, remarks) => {
  const token = await getToken();
  const body = await api({
    method: 'put',
    url: 'api/envs',
    params: {t: Date.now()},
    json: {
      name: 'JD_COOKIE',
      value: value,
      _id: eid,
      remarks,
    },
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};

module.exports.updateEnvById = async (name, value, eid, remarks) => {
  const token = await getToken();
  const body = await api({
    method: 'put',
    url: 'api/envs',
    params: {t: Date.now()},
    json: {
      name: name,
      value: value,
      id: eid,
      remarks,
    },
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};

module.exports.updateEnvByName = async (name, value, remarks) => {
  const token = await getToken();
  return await api({
    method: 'put',
    url: 'api/envs',
    params: {t: Date.now()},
    json: {
      name: name,
      value: value,
      remarks,
    },
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
};

module.exports.DisableCk = async (eid) => {
  const token = await getToken();
  const body = await api({
    method: 'put',
    url: 'api/envs/disable',
    params: {t: Date.now()},
    body: JSON.stringify([eid]),
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};

module.exports.EnableCk = async (eid) => {
  const token = await getToken();
  const body = await api({
    method: 'put',
    url: 'api/envs/enable',
    params: {t: Date.now()},
    body: JSON.stringify([eid]),
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};

module.exports.getStatus = async (eid) => {
  const envs = await this.getEnvs();
  var tempid = 0;
  for (let i = 0; i < envs.length; i++) {
    tempid = 0;
    if (envs[i]._id) {
      tempid = envs[i]._id;
    }
    if (envs[i].id) {
      tempid = envs[i].id;
    }
    if (tempid == eid) {
      return envs[i].status;
    }
  }
  return 99;
};

module.exports.getEnvById = async (eid) => {
  const envs = await this.getEnvs();
  var tempid = 0;
  for (let i = 0; i < envs.length; i++) {
    tempid = 0;
    if (envs[i]._id) {
      tempid = envs[i]._id;
    }
    if (envs[i].id) {
      tempid = envs[i].id;
    }
    if (tempid == eid) {
      return envs[i].value;
    }
  }
  return "";
};

module.exports.getEnvByPtPin = async (Ptpin) => {
  const envs = await this.getEnvs();
  for (let i = 0; i < envs.length; i++) {
    var tempptpin = decodeURIComponent(envs[i].value.match(/pt_pin=([^; ]+)(?=;?)/) && envs[i].value.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
    if (tempptpin == Ptpin) {
      return envs[i];
    }
  }
  return "";
};

module.exports.delEnv = async (eid) => {
  const token = await getToken();
  const body = await api({
    method: 'delete',
    url: 'api/envs',
    params: {t: Date.now()},
    body: JSON.stringify([eid]),
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};
