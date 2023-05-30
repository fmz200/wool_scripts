const number = '';  //填入邀请码或者通过$argumeent传人


const http = (request, method = "post") => {
  return new Promise((resolve, reject) => {
    $httpClient[method](request, (err, resp, data) => {
      if (resp?.status === 200) {
        resolve(JSON.parse(data));
      } else {
        const error = data.match(/[\u4e00-\u9fff]+/g)?.join(" ") + "\n" + request.url;
        reject(`err: ${err || error}`);
      }
    });
  });
};

class Pikpak {
  constructor(pikpak_id, invitation_Code) {
    this.invitation_Code = invitation_Code;
    this.captcha_token = $persistentStore.read("pikpak_captcha_token") || pikpak_id[2];
    this.body = {
      client_id: pikpak_id[0],
      device_id: pikpak_id[1],
    };
    this.headers = {
      "x-client-id": pikpak_id[0],
      "x-device-id": pikpak_id[1],
    };
    this.email = "";
  }

  async getEmailCode() {
    const captchaToken = await this.getCaptchaToken(); //获取安全认证token
    const verificationId = await this.sendVerificationRequest(captchaToken); //发送验证码
    const verificationCode = await this.getVerificationCode(); //获取验证码
    const verificationToken = await this.getVerificationToken(verificationId, verificationCode); //获取注册token
    const accessToken = await this.getAccessToken(verificationToken, verificationCode, captchaToken); //模拟注册，模拟登录获取账号token
    const addDays = await this.getActivationCode(accessToken); //获取奖励
    console.log(`成功添加${addDays}天` + $script.startTime);
    $notification.post(`成功添加${addDays}天`, "", $script.startTime);
  }

  async getCaptchaToken() {
    const newMail = {
      url: "https://api.internal.temp-mail.io/api/v3/email/new",
      body: `{"min_name_length":10,"max_name_length":10}`,
    };
    const json = await http(newMail);
    this.email = json.email;
    const init = {
      url: "https://user.mypikpak.com/v1/shield/captcha/init",
      headers: this.headers,
      body: JSON.stringify({
        ...this.body,
        captcha_token: this.captcha_token,
        meta: {email: this.email},
        action: "POST:/v1/auth/verification",
      }),
    };
    const {captcha_token} = await http(init);
    $persistentStore.write(captcha_token, "pikpak_captcha_token");
    return captcha_token;
  }

  async sendVerificationRequest(token) {
    const verifcation = {
      url: "https://user.mypikpak.com/v1/auth/verification",
      headers: {...this.headers, "x-captcha-token": token},
      body: JSON.stringify({
        client_id: this.body.client_id,
        email: this.email,
        usage: "REGISTER",
        selected_channel: "VERIFICATION_EMAIL",
        target: "ANY",
      }),
    };
    const {verification_id} = await http(verifcation);
    return verification_id;
  }

  async getVerificationCode() {
    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const json = (await http(`https://api.internal.temp-mail.io/api/v3/email/${this.email}/messages`, "get"))?.[0]
        ?.body_text;

      if (json) {
        const code = json.match(/(\d{6})/)[0];
        console.log(`获取到验证码: ${code}`);
        return code;
      }
    }
  }

  async getVerificationToken(id, code) {
    const verify = {
      url: "https://user.mypikpak.com/v1/auth/verification/verify",
      headers: this.headers,
      body: JSON.stringify({
        verification_id: id,
        verification_code: code,
        client_id: this.body.client_id,
      }),
    };
    const {verification_token} = await http(verify);
    return verification_token;
  }

  async getAccessToken(vtoken, code, ctoken) {
    const signup = {
      url: "https://user.mypikpak.com/v1/auth/signup",
      headers: {
        referer: "https://mypikpak.com/",
        ...this.headers,
      },
      body: JSON.stringify({
        email: this.email,
        password: "Aa147258",
        client_id: this.body.client_id,
        verification_token: vtoken,
        verification_code: code,
      }),
    };
    await http(signup);

    const signin = {
      url: "https://user.mypikpak.com/v1/auth/signin",
      headers: {
        ...this.headers,
        ["x-captcha-token"]: ctoken,
      },
      body: JSON.stringify({
        client_id: this.body.client_id,
        username: this.email,
        password: "Aa147258",
        client_secret: "A3zfcmfNEeyTH0pX2k4GNg",
      }),
    };
    const {access_token} = await http(signin);
    return access_token;
  }

  async getActivationCode(token) {
    const invitation = {
      url: "https://api-drive.mypikpak.com/vip/v1/order/activation-code",
      headers: {
        "x-device-id": this.body.device_id,
        authorization: `Bearer ${token}`,
      },
      body: `{"activation_code":"${this.invitation_Code}","page":"invite"}`,
    };
    const {add_days} = await http(invitation);
    return add_days;
  }
}

(async () => {
  if (typeof $request === "object") {
    if ($request.method === "OPTIONS") return;

    const header = $request.headers;
    const device_id = header["x-device-id"];
    const client_id = header["x-client-id"];
    const captcha_token = header["x-captcha-token"];
    client_id &&
    device_id &&
    captcha_token &&
    $persistentStore.write(`${client_id},${device_id},${captcha_token}`, "pikpak_id") &&
    $notification.post("id获取成功", "建议注释掉id模块,白嫖起来吧", "");
    return;
  }
  const invitation_Code = (typeof $argument === "string" && Number($argument)) || Number(number) || 0;
  const pikpak_id = $persistentStore.read("pikpak_id")?.split(",");
  if (!(pikpak_id && invitation_Code)) throw "id或邀请码未获取";
  await new Pikpak(pikpak_id, invitation_Code).getEmailCode();
})()
  .catch((err) => {
    $notification.post("", "", err);
    console.log(err);
  })
  .finally(() => $done({}));
