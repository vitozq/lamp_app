/**
 * Created by hurong on 2018/7/9.
 * 拜访计划详情-项目信息-填写完成情况弹框
 */
import {Component, EventEmitter} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'install-device-popover',
  template: `    
    <div>
      <ion-row class="device-title" text-center>
        <ion-col>
          <img src="assets/imgs/popover/background@2x.png" class="img-background">
          <img *ngIf="status=='look'" src="assets/imgs/popover/success@2x.png" class="main-img">
          <img *ngIf="status=='new'" src="assets/imgs/popover/success@2x.png" class="main-img">
          <img *ngIf="status=='old'" src="assets/imgs/popover/warn@2x.png" class="main-img">
          <img *ngIf="status=='replace'" src="assets/imgs/popover/newSuccess@2x.png" class="main-img">
          <div *ngIf="status=='new'" class="color-new">设备注册成功</div>
          <div *ngIf="status=='old'" class="color-old">设备已被注册</div>
          <div *ngIf="status=='replace'" class="color-replace">设备替换成功</div>
          <div *ngIf="status=='look'" class="color-replace">查看设备信息</div>
        </ion-col>
      </ion-row>
      <div class="device-info">
        <ion-row>
          <ion-col text-left darkgray>
            设备序列号
          </ion-col>
          <ion-col text-right darkgray style="white-space: nowrap">
            {{device.imeiCode}}
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col text-left>
            设备激活状态
          </ion-col>
          <ion-col *ngIf="deviceStatus=='0'" text-right>
            未激活
          </ion-col>
          <ion-col *ngIf="deviceStatus=='1'" text-right>
            已激活
          </ion-col>
          <ion-col *ngIf="deviceStatus=='2'" text-right>
            待维修
          </ion-col>
          <ion-col *ngIf="deviceStatus=='3'" text-right>
            已欠费
          </ion-col>
          <ion-col *ngIf="deviceStatus=='4'" text-right>
             已废弃
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col text-left>
            灯杆编号
          </ion-col>
          <ion-col text-right>
            {{device.postNum}}
          </ion-col>
        </ion-row> 
        <ion-row>
          <ion-col text-left>
            经度
          </ion-col>
          <ion-col text-right>
            <!--{{device.longitudeLatitude}}-->
            {{strs[0]}}
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col text-left>
            纬度
          </ion-col>
          <ion-col text-right>
            <!--{{device.longitudeLatitude}}-->
            {{strs[1]}}
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col text-left>
            所属街道
          </ion-col>
          <ion-col text-right>
            {{device.street}}
          </ion-col>
        </ion-row>
      </div>
      <ion-row>
         <ion-col  text-center>
           <button ion-button (click)="confirm()"  class="device-btn"
                   [ngClass]="{'btn-color-new': status=='new',
                   'btn-color-old': status=='old',
                   'btn-color-replace': status=='replace'}"
                  >确认 </button>
        </ion-col>
      </ion-row>
  </div>`,
  inputs:['planId']
})
export class InstallDevicePopover {

  public device;
  public status;
  public strs  =new Array() ;
  public outputValue = new EventEmitter();
  public deviceStatus;
  public project={
      id:3,
      name:'',
      content:''
  }

  constructor(public navCtrl:NavController ,public viewCtrl:ViewController,public navParams: NavParams) {
    this.device = navParams.get('device');
    var str =this.device.longitudeLatitude;
    this.strs=str.split(",");
    this.status=navParams.get("status");
    this.deviceStatus=this.device.deviceStatus;
    console.log("转台"+this.deviceStatus);
    //util.hideLoading();
  }

  //选择项目
  choseProject(){
  }

  closePopover(){
    this.viewCtrl.dismiss();
  }

  //添加项目
  confirm(){
    this.viewCtrl.dismiss(this.project);
  }
}


