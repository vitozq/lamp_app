import { Injectable } from '@angular/core';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {Api} from "../api/api";
import {App, NavController, ToastController} from "ionic-angular";

@Injectable()
export class ForwardInstall {
  scanInfo:any;
  street:any;
  installPower:any;
  device:any;
  public navCtrl:NavController;
  constructor(public barcodeScanner:BarcodeScanner,
              public api:Api,
              public toastCtrl:ToastController,
              public app:App
              ) {
    this.navCtrl=app.getActiveNav();
  }
  /**
   * 扫描二维码
   */
  scan(){
    let options = {
      preferFrontCamera: false,//前置摄像头
      showFlipCameraButton: true,//翻转摄像头按钮
      showTorchButton: true,//闪关灯按钮
      formats: 'QR_CODE',//格式
      prompt: '扫描中……',//提示文本(Android )
      orientation: 'portrait',//方向(Android)
      torchOn: false,//启动闪光灯(Android)
      resultDisplayDuration: 500,//扫描结果显示时间，默认为1500ms(Android)
      disableSuccessBeep: true //禁用扫描成功后哔哔声(iOS)
    };
    this.barcodeScanner.scan(options).then(barcodeData => {
      this.scanInfo = barcodeData;
      this.forward(barcodeData.text);
    }).catch(err => {
      console.log('Error', err);
    });
  }

  forward(barcodeData){
    this.getStreetInfo();
    this.getInstallPower();
    let seq =  this.api.post("getDeviceBySnCode",barcodeData);
    seq.subscribe((res: any) => {
      if(res!=null){
        if(res.deviceStatus!=0){
          this.device=res;
          this.prompt("该设备已经被注册过，请勿重新安装!");
        }else{
          // console.log(barcodeData+res.modelNum);
          this.navCtrl.push("InstallDevicePage",{barcodeData:barcodeData,modelNum:res.modelNum,street:this.street,installPower:this.installPower});
          /** 禁止重复安装注册**/
          // if(res.deviceId==null||res.deviceId==''){
          //   this.navCtrl.push("InstallDevicePage",{barcodeData:barcodeData,modelNum:res.modelNum,street:this.result});
          // }
          // else{
          //     this.prompt("该设备已经成功安装，请不要重复安装");
          // }
        }
      }else{
        this.prompt('未在平台找到该设备,请联系项目管理员!');

      }
    },err =>{
      console.error('ERROR', err);
    });
  }


  /**
   * 获取项目所属街道信息
   */
  getStreetInfo(){
    let username= localStorage.getItem("username");
    let seq=this.api.post("getStreetInfo",username);
    seq.subscribe( (res: any) =>{
      // console.log("res"+res);
      this.street=res;
      // console.log("result"+this.result);
    },err =>{
      console.error('ERROR',err);
    });
  }

  /**
   * 获取安装功率
   */
  getInstallPower(){
    let seq=this.api.post("getInstallPower","");
    seq.subscribe( (res: any) =>{
      this.installPower=res;
    },err =>{
      console.error('ERROR',err);
    });
  }

  prompt(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,//显示时间
      position: 'top'//弹出方向
    });
    toast.present();
  }
}
