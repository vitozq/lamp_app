import { Component } from '@angular/core';
import { App,IonicPage, NavController } from 'ionic-angular';
import {MainPage} from '../';
import { Api } from '../../providers/api/api';
import {CommonService} from "../../service/common.service";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  //默认登录信息
  account: { username: string, password: string } = {
    username: '',
    password: ''
  };

  constructor(public navCtrl: NavController,
              public api: Api,
              public commonService: CommonService,
              private app:App ) {
    var temp=localStorage.getItem("username");
    if(temp!=null&&temp!=""){
      this.account.username=temp;
    }
  }
  /**
   * 登录
   */
  doLogin() {
    // this.navCtrl.push(MainPage);//登录成功页面跳转
    let seq = this.api.post('login', this.account);
    seq.subscribe((res: any) => {
      if(res.success == false || res.status == "error") {
        //弹出提示消息
        this.commonService.showToast('登录失败。请检查账号信息然后重试。');
        /*let toast = this.toastCtrl.create({
          message: '登录失败。请检查账号信息然后重试。',
          duration: 3000,//显示时间
          position: 'middle'//弹出方向
        });
        toast.present();*/
      }else {
        this.commonService.showToast('登录验证成功，自动进入到首页');
        this.app.getRootNav().setRoot(MainPage);

        // this.navCtrl.push(Tab0Root);//登录成功页面跳转
        //存储登录token.....
        localStorage.setItem("username",this.account.username);
        localStorage.setItem('app_token', res.token);
        localStorage.setItem('realName', res.realName);

        console.log(localStorage.getItem('app_token'),"app_token");
      }
    }, err => {
      this.commonService.showToast('登录失败。请检查账号信息然后重试。');
      console.error('ERROR', err);
    });


  }
}
