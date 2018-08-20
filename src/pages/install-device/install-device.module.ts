import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InstallDevicePage } from './install-device';

@NgModule({
  declarations: [
    InstallDevicePage,
  ],
  imports: [
    IonicPageModule.forChild(InstallDevicePage),
  ],
})
export class InstallDevicePageModule {}
