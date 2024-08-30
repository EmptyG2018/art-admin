declare namespace API {
  type Response = {
    code: number;
    msg: string;
  };

  /** Result POSt /captchaImage */
  type CaptchaImageResult = Response & {
    uuid: string;
    img: string;
  };

  /** Params POST /login */
  type LoginAccountParams = {
    uuid: string;
    username: string;
    password: string;
    code: string;
  };

  /** Result POST /login */
  type LoginAccountResult = Response & {
    token: string;
  };

  /** Result POST /login */
  type UserInfoResult = Response & User.UserInfo;
}
