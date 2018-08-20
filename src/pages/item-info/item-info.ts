import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController, ToastController} from 'ionic-angular';
import {Api} from "../../providers";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {InstallDevicePopover} from "../../components/install-device-popover";

/**
 * Generated class for the ItemInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-item-info',
  templateUrl: 'item-info.html',
})
export class ItemInfoPage {
    item:any;
  street:any;
  installPower:any;
  device:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private api:Api,
              private alertCtrl:AlertController,
              private barcodeScanner:BarcodeScanner,
              private toastCtrl:ToastController,
              private popoverCtrl:PopoverController) {
    this.item=this.navParams.get("item");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemInfoPage');
  }

  /**
   * 完成即消除故障
   */
  done(){
    const confirm = this.alertCtrl.create({
      title: "",
      message: "设备故障是否已经消除？",
      buttons: [
        {
          text: '取消',
          handler: () => {
          }
        },
        {
          text: '确定',
          handler: () => {
            let seq=  this.api.post("updateStatus",{frId:this.item.frId});
            seq.subscribe((res:any) =>{
                //成功解除故障后将button框失效
                this.item.currentStatus=0;
                this.isDone();
                const alert = this.alertCtrl.create({
                  title: '故障消除',
                  subTitle: '故障已消除成功，任务已完成！',
                  buttons: ['确定']
                });
                alert.present();
            },err=>{
              console.error('ERROR',err);
            });
          }
        }
      ]
    });
    confirm.present();
  }

  isDone(){
    if(this.item.currentStatus==0){
     return  true;
   }else{
     return false;
   }
  }


  replace(){
    const confirm = this.alertCtrl.create({
      title: "",
      message: "确认是否替换并扫描新设备",
      buttons: [
        {
          text: '取消',
          handler: () => {
          }
        },
        {
          text: '确定',
          handler: () => {
            this.scan();
          }
        }
      ]
    });
    confirm.present();

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
          this.showPopover({device:res,status:'old'});
        }else{
          // console.log(barcodeData+res.modelNum);
          this.navCtrl.push("InstallDevicePage",{barcodeData:barcodeData,modelNum:res.modelNum,street:this.street,installPower:this.installPower,status:'replace',oldDevice:this.item.device,frId:this.item.frId});
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
      position: 'middle'//弹出方向
    });
    toast.present();
  }

  showPopover(data){
    let popover = this.popoverCtrl.create(InstallDevicePopover,{data});
    popover.present({
      // ev: event
    });
  }


}
