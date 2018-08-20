import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController, ToastController} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import {Item} from "../../models/item";
import {Api} from '../../providers/api/api';
import {InstallDevicePopover} from "../../components/install-device-popover";
import {Tab0Root} from "../index";



/**
 * Generated class for the InstallDevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-install-device',
  templateUrl: 'install-device.html',
})
export class InstallDevicePage {
  //设备序列号
  imeiCode: any;
  //设备型号
  modelNum: any;
  //灯瓦数
  power: any;
  //灯杆编号
  postNum: any;
  //当前位置信息
  currentPosition: any = {
    latitude: '获取中',//维度
    longitude: '获取中'//经度
  };
  // currentPosition: any = {
  //   latitude: '0',//维度
  //   longitude: '0'//经度
  // };
  //所属街道
  street: Item[];
  //电池选择
  batteryType :Item[];
  selectedBattery:string;
  selected: string;
  //安装功率
  installPower:Item[];

  //替换或者新装的标志
  status:any;
  //需要替换的旧设备
  oldDevice:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              private geolocation: Geolocation,
              private api: Api,
              private alertCtrl:AlertController,
  public popoverCtrl:PopoverController) {
    this.imeiCode = navParams.get("barcodeData");
    this.modelNum = navParams.get("modelNum");
    this.street = navParams.get("street");
    this.installPower=navParams.get("installPower");
    this.status= navParams.get("status");
    this.oldDevice=navParams.get("oldDevice");
    if(this.status=='replace'){
      this.postNum= this.oldDevice.postNum;
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad InstallDevicePage');
  }
  ionViewDidEnter(){

  }

  ngAfterViewInit(){
    console.log("进入页面触发")
    this.getCurrentPosition();
    console.log(this.currentPosition.latitude);
  }


  ionViewLoaded() {
  }

  /**
   * 注册安装设备
   */
  install() {
    // this.validate();
    var error ;
    var  longitude =this.currentPosition.longitude;
    var  latitude = this.currentPosition.latitude;
    if(longitude==null||longitude=='获取中'||latitude==null||latitude=='获取中'){
      error='请经纬度获取成功后再提交信息';
    } else if(this.power==null||this.power==''){
      error='请选择灯瓦数再提交信息';
    } else if(this.selected==null||this.selected==''){
      error='请选择街道后再提交信息';
    }else if(this.selectedBattery==null||this.selectedBattery==''){
      error='请选择电池后后再提交信息';
    }else if(this.postNum==null||this.postNum==''){
      error='请填写灯杆编号后再提交信息';
    }
    if(error!=null){
      const alert = this.alertCtrl.create({
        title: '提示信息',
        subTitle:error,
        buttons: ['确定']
      });
      alert.present();
    }
    if(error==null) {
      const confirm = this.alertCtrl.create({
        title: "",
        message: "确定是否安装设备",
        buttons: [
          {
            text: '取消',
            handler: () => {
            }
          },
          {
            text: '确定',
            handler: () => {
              let seq = this.api.post("install", {
                  imeiCode: this.imeiCode,
                  medelNum: this.modelNum,
                  power: this.power,
                  postNum: this.postNum,
                  username: localStorage.getItem("username"),
                  batteryType: this.selectedBattery,
                  currentPosition: this.currentPosition,
                  street: this.selected,
                  status: this.status,
                oldDevice:this.oldDevice
                }
              );
              seq.subscribe((res: any) => {
                if(res==null){
                  const alert = this.alertCtrl.create({
                    title: '提示信息',
                    subTitle:'设备注册失败，请检查网络是否异常',
                    buttons: ['确定']
                  });
                  alert.present();
                  return;
                }
                if(this.status=='new'){
                this.prompt("设备注册成功");
                }else  if(this.status=='replace'){
                  this.prompt("设备替换成功");
                }
                this.navCtrl.setRoot(Tab0Root);
                this.showPopover({device: res, status: this.status});
              }, err => {
                console.log("失败");
                console.error('ERROR', err);
                const alert = this.alertCtrl.create({
                  title: '提示信息',
                  subTitle:'设备注册失败，请检查网络是否异常',
                  buttons: ['确定']
                });
                alert.present();
              });

            }
          }
        ]
      });
      confirm.present();
    }
  }


  /**
   * 获取当前位置
   */
  getCurrentPosition() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      this.currentPosition.latitude = resp.coords.latitude;
      this.currentPosition.longitude = resp.coords.longitude;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });
    // console.log("获取当前纬度"+this.currentPosition.latitude);
  }

  prompt(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,//显示时间
      position: 'top'//弹出方向
    });
    toast.present();
  }

  validate(){
    var error ;
    var j=this.currentPosition.longitude;
    var w=this.currentPosition.latitude;
    if(j==null||j=='获取中'||w==null||w=='获取中'){
      error='请经纬度获取成功后再提交信息';
    } else if(this.power==null||this.power==''){
          error='请选择灯瓦数再提交信息';
      } else if(this.selected==null||this.selected==''){
        error='请选择街道后再提交信息';
      }else if(this.selectedBattery==null||this.selectedBattery==''){
        error='请选择电池后后再提交信息';
      }else if(this.postNum==null||this.postNum==''){
        error='请填写灯杆编号后再提交信息';
      }
      if(error!=null){
        const alert = this.alertCtrl.create({
          title: '提示信息',
          subTitle:error,
          buttons: ['确定']
        });
        alert.present();
      }
      // if(error==null){
      //   this.confirm.present();
      // }
  }

  showPopover(data){
    let popover = this.popoverCtrl.create(InstallDevicePopover,{device:data.device,status:data.status});
    popover.present({
      // ev: event
    });
  }


}
