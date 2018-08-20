import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InstallTabPage } from './install-tab';
@NgModule({
  declarations: [
    InstallTabPage,
  ],
  imports: [
    IonicPageModule.forChild(InstallTabPage),
  ],
})
export class InstallTabPageModule {}
