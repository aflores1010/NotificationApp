import { Component, ApplicationRef } from '@angular/core';
import { NotificationsService } from '../services/notifications.service';
import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  messages: OSNotificationPayload[] = []


  constructor(public notificationService: NotificationsService,
              private applicationRef: ApplicationRef) {

    this.notificationService.notificationListener.subscribe( noti =>{
      this.messages.unshift(noti);
      this.applicationRef.tick();
    });

  }

  async ionViewWillEnter() {
    console.log('Cargando mensajes');
   this.messages = await this.notificationService.getNotifications();

  }

  async deleteNotifications() {
    await this.notificationService.clearStorage();
    this.messages = [];
  }

}
