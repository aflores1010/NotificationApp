import { Injectable, EventEmitter } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  messages: OSNotificationPayload[] = []

  notificationListener = new EventEmitter<OSNotificationPayload>();

  userId: string;

  constructor(private oneSignal: OneSignal, private storage: Storage) {
    this.loadNotifications();
   }

  startSettings() {
    this.oneSignal.startInit('5aef4ac6-3f7f-4248-b9bb-4f8cba8c06d3', '622305571028');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    
    this.oneSignal.handleNotificationReceived().subscribe((noti) => {
     // do something when notification is received
     this.listenNotification(noti);
     console.log('Notificacion recibida', noti);
    });
    
    this.oneSignal.handleNotificationOpened().subscribe( async (noti) => {
      // do something when a notification is opened
      console.log('Notificacion abierta', noti);
      await this.listenNotification(noti.notification);

    });

    // obteniendo el ID del subscriptor
    this.oneSignal.getIds().then( (info)=> {
      this.userId = info.userId;
      console.log('userID: ', this.userId);
    });
    
    this.oneSignal.endInit();
  }

 async listenNotification(noti: OSNotification) {

    await this.loadNotifications();

    const payload = noti.payload;
    const notificationExist = this.messages.find(message => message.notificationID === payload.notificationID);
    
    if(!notificationExist) {
      this.messages.unshift(payload);
      this.notificationListener.emit(payload);

     await this.storeNotification();
      console.log('Arreglo de notificaciones: ', this.messages);
    }

  }

  storeNotification() {
    this.storage.set('notifications', this.messages);
  }

  async loadNotifications() {
    console.log('loading notifications method');
    this.messages = await this.storage.get('notifications') || [];
    return this.messages;
  }

  async getNotifications() {
    console.log('getNotifications method');
    await this.loadNotifications();
    return [...this.messages];
  }

  clearStorage() {
    this.storage.clear();
    this.messages = [];
    this.storeNotification();
  }
}
