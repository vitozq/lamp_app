import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemInfoPage } from './item-info';

@NgModule({
  declarations: [
    ItemInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemInfoPage),
  ],
})
export class ItemInfoPageModule {}
