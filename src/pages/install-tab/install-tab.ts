import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController, ToastController} from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Api} from '../../providers/api/api';
import {InstallDevicePopover} from "../../components/install-device-popover";

/**
 * Generated class for the InstallTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-install-tab',
  templateUrl: 'install-tab.html',
})

export class InstallTabPage {
  //二维码信息
  scanInfo : any;
  street:any;
  installPower:any;
  device:any;
  alreadyInstallList:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private barcodeScanner:BarcodeScanner,
              private api:Api,
              public  toastCtrl :ToastController,
              public popoverCtrl:PopoverController,
              public alertCtrl:AlertController) {

    this.device=this.navParams.get("device");
  }

  ionViewDidLoad() {
    // this.device=this.forwardInstall.device;
    this.getInstallRecord(localStorage.getItem("username"));
    console.log('ionViewDidLoad InstallTabPage');
  }
  // scan(){
  //     this.forwardInstall.scan();
  // }
  //
  //
  test1(){
    this.forward("868744034082721");
    // this.navCtrl.push("InstallDevicePage",{barcodeData:123,modelNum:123,street:this.street,installPower:this.installPower});
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
      if(barcodeData!=null) {
        this.forward(barcodeData.text);
        this.scanInfo = barcodeData;
      }
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
        if(res.deviceId!=null&&res.deviceId!=''){
          this.device=res;
          this.prompt("该设备已经被注册过，请勿重新安装!");
          this.showPopover({device:res,status:'old'});
        }else{
          this.navCtrl.push("InstallDevicePage",{barcodeData:barcodeData,modelNum:res.modelNum,street:this.street,installPower:this.installPower,status:'new'});
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
  /**
   * 获取已安装设备
   */
  getInstallRecord(username){
    let seq=this.api.post("getInstallRecord",username);
    seq.subscribe( (res: any) =>{
      this.alreadyInstallList=res;
      // console.log("已安装设备"+JSON.stringify(this.alreadyInstallList));
    },err =>{
      console.error('ERROR',err);
    });
  }
  //弹出提示框
  prompt(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,//显示时间
      position: 'top'//弹出方向
    });
    toast.present();
  }
  //弹出模态框
  showPopover(data){
    let popover = this.popoverCtrl.create(InstallDevicePopover,{device:data.device,status:data.status});
    popover.present({
      // ev: event
    });
  }


  //查看已安装设备信息
  openItem(item,status){
    let popover = this.popoverCtrl.create(InstallDevicePopover,{device:item,status:status});
    popover.present({
      // ev: event
    });
  }

  //调试设备
  debugDevice(item){
     const confirm =this.alertCtrl.create({
       title: "",
       message: "是否进行调试(调试亮灯时长为1分钟)开灯?" ,
       buttons: [
         {
           text: '取消',
           handler: () => {
           }
         },
         {
           text: '确定',
           handler: () => {
             let seq=  this.api.post("debugDevice",{deviceId:item.deviceId,command:'0100',time:'1',watt:'50'});
             seq.subscribe((res:any) =>{
               console.log(JSON.stringify(res));
             },err=>{
               console.error('ERROR',err);
             });
           }
         }
       ]
     });
    confirm.present();
  }
}
