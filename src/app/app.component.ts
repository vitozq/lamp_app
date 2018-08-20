import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform,Keyboard ,IonicApp,ToastController} from 'ionic-angular';
import {FirstPage, MainPage} from '../pages';
import { Settings } from '../providers';
import {LoginPage} from "../pages/login/login";
import {TabsPage} from "../pages/tabs/tabs";
import {WelcomePage} from "../pages/welcome/welcome";

@Component({
  template: `<ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = MainPage;
  backButtonPressed: boolean = false;
  @ViewChild(Nav) nav: Nav;

  constructor(private translate: TranslateService,
              public platform: Platform,
              settings: Settings,
              private config: Config,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              public keyboard:Keyboard,
              public ionicApp:IonicApp,
              public toastCtrl:ToastController) {


    platform.ready().then(() => {
      // 设置状态栏
      this.statusBar.styleDefault();
      this.statusBar.styleLightContent();

      // 隐藏启动页
      setTimeout(()=>{
			  this.splashScreen.hide();
			},1000);

      // 注册返回按键事件
      this.registerBackButtonAction();
    });
    this.initTranslate();
    if(localStorage.getItem("app_token")==null||localStorage.getItem("app_token")==''){
      console.log("登录token"+localStorage.getItem("token"));
          this.rootPage=FirstPage;
    }
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }


//监听返回键事件
  registerBackButtonAction() {
    this.platform.registerBackButtonAction(() => {
      if (this.keyboard.isOpen()) {
        //按下返回键时，先关闭键盘
        this.keyboard.close();
        return;
      };
      //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
      // this.ionicApp._toastPortal.gaetActive() || this.ionicApp._loadingPortal.getActive() || this.ionicApp._overlayPortal.getActive()
      //不写this.ionicApp._toastPortal.getActive()是因为连按2次退出
      let activePortal = this.ionicApp._modalPortal.getActive() ||this.ionicApp._overlayPortal.getActive();
      let loadingPortal = this.ionicApp._loadingPortal.getActive();
      if (activePortal) {
        //其他的关闭
        activePortal.dismiss().catch(() => {
        });
        activePortal.onDidDismiss(() => {
        });
        return;
      }
      if (loadingPortal) {
        //loading的话，返回键无效
        return;
      }
      // 获取已激活页面
      let activeVC = this.nav.getActive();
      console.log('activeVC:' + activeVC);
      let page = activeVC.instance;

      if(page instanceof TabsPage){//tab栏页面
        let tabs = activeVC.instance.tabs;
        let activeNav = tabs.getSelected();
        if (!activeNav.canGoBack()) {
          // 当前页面为tab栏，退出APP
          return this.showExit();
        }
        // 当前页面为tab栏的子页面，正常返回
        return activeNav.pop();
      }else if(page instanceof LoginPage || page instanceof WelcomePage){//登录页面、welcome页面直接退出app
        // 当前页面为tab栏，退出APP
        return this.showExit();
      }else{//其他页面
        if (!this.nav.canGoBack()) {
          // 当前页面为tabs，退出APP
          return this.showExit();
        }
        // 当前页面为tabs的子页面，正常返回
        return this.nav.pop();
      }
      /*
      if (page instanceof LoginPage ) {
        this.platform.exitApp();
        return;
      }
      let tabs = activeVC.instance.tabs;
      let activeNav = tabs.getSelected();
      return activeNav.canGoBack() ? activeNav.pop() : this.showExit();//另外两种方法在这里将this.showExit()改为其他两种的方法的逻辑就好。*/
    }, 101);
  }

  //双击退出提示框
  showExit() {
    if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
      this.platform.exitApp();
    } else {
      this.toastCtrl.create({
        message: '再按一次退出应用',
        duration: 2000,
        position: 'bottom',
        cssClass: 'text-align: center'
      }).present();
      this.backButtonPressed = true;
      setTimeout(() => this.backButtonPressed = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
    }
  }



}
