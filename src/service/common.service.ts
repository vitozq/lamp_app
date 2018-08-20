import { Injectable } from '@angular/core';
import {LoadingController, AlertController, ToastController} from 'ionic-angular';

@Injectable()
export class CommonService {

  constructor(public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public  toastCtrl: ToastController) {
  }
  public loader;

  showLoading(content){
    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content:content?content:'出错了哟',
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();//显示多久消失
    }, 2000);
  }

  /**
   * 弹出消息
   * @param content 弹出内容
   * @param timeout 显示时间
   * @param position 弹出方向
   */
  showToast(content?,timeout?,position?){
    const toast = this.toastCtrl.create({
      message: content?content:'出错了哟',    //弹出内容
      cssClass:'',                            //自定义样式
      duration:  typeof timeout === "number" ? timeout : 3000,//显示时间
      position: position?position:'middle'    //弹出方向
    });
    toast.onDidDismiss(() => {
      console.log('toast被关闭之后执行');
    });
    toast.present();
  }

  showAlert(content) {
    const alert = this.alertCtrl.create({
      title:content?content:'出错了哟',
      buttons: ['OK']
    });
    alert.present();
  }

}
