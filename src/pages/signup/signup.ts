import { Component } from '@angular/core';
import {AlertController , App,IonicPage, NavController, ToastController } from 'ionic-angular';
import {Api} from "../../providers";
import { FirstPage } from '../';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  confirm:any;
  oldPassword:any;
  newPassword:any;
  newPassword2:any;
  // account: { name: string, email: string, password: string } = {
  //   name: 'Test Human',
  //   email: 'test@example.com',
  //   password: 'test'
  // };

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
              private api:Api,
              private app:App,
              private alertCtrl:AlertController) {
  }

  /**
   * 修改密码
   */
  submit() {
    this.validate();
    this.confirm = this.alertCtrl.create({
      title: "",
      message: "确定是否修改密码？",
      buttons: [
        {
          text: '取消',
          handler: () => {
          }
        },
        {
          text: '确定',
          handler: () => {
            let seq= this.api.post("chgPass",{
              username:localStorage.getItem("username"),
              oldPassword:this.oldPassword,
              newPassword:this.newPassword
            });

            seq.subscribe((res: any) => {
              if(res.status == "error") {
                //弹出提示消息
                let toast = this.toastCtrl.create({
                  message: res.msg,
                  duration: 3000,//显示时间
                  position: 'top'//弹出方向
                });
                toast.present();
              }else {
                this.showAlert("","密码修改成功!");
                this.app.getRootNav().setRoot(FirstPage);
                //清除登录Token
                localStorage.removeItem('app_token');
              }
            }, err => {
              console.error('ERROR', err);
            });

          }
        }
      ]
    });





  }

  showAlert(title,content) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: content,
      buttons: ['确认']
    });
    alert.present();
  }

  validate(){
    var error ;
    if(this.oldPassword==null||this.oldPassword==''){
      error='请填写原密码后再提交信息';
    } else if(this.newPassword==null||this.newPassword==''){
      error='请填写新密码后再提交信息';
    }else if(this.newPassword2==null||this.newPassword2==''){
      error='请填写确认新密码后再提交信息';
    }else if(this.newPassword2!=this.newPassword){
      error='两次密码输入不一致';
    }else if(this.newPassword.length<6){
      error='新密码必须大于6位';
    }else if(this.oldPassword==this.newPassword){
      error='新密码不能和原密码相同';
    }
    if(error!=null){
      // const alert = this.alertCtrl.create({
      //   title: '提示信息',
      //   subTitle:error,
      //   buttons: ['确定']
      // });
      // alert.present();
      this.showAlert('提示信息',error);
    }
    if(error==null){
      this.confirm.present();
    }
  }


}
