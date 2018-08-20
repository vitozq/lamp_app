/**
 * Created by 64609 on 2018/7/7.
 */
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {MyApp} from "../app/app.component";
import {InstallDevicePopover} from "./install-device-popover";


@NgModule({
  declarations: [
    InstallDevicePopover,
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  entryComponents: [
    InstallDevicePopover,
  ],
  providers: []
})
export class ComponentsModule {}
