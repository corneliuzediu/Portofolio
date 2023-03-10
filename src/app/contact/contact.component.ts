import { ViewportScroller } from '@angular/common';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']

})
export class ContactComponent implements OnInit {
  @ViewChild('myForm') myForm!: ElementRef;
  @ViewChild('nameContact') nameContact!: ElementRef;
  @ViewChild('emailContact') emailContact!: ElementRef;
  @ViewChild('messageContact') messageContact!: ElementRef;
  @ViewChild('sentButton') sentButton!: ElementRef;
  @ViewChild('sendingAnimation') sendingAnimation!: ElementRef;
  @ViewChild('succesfullySubmited') succesfullySubmited!: ElementRef;
  @ViewChild('flyIcon') flyIcon!: ElementRef;


  color: ThemePalette = 'accent';
  mode: ProgressSpinnerMode = 'indeterminate';
  responseBackend: any;
  public initTime: Date = new Date;
  waitedTime: any;

  constructor(private scroller: ViewportScroller, private router: Router) { }

  ngOnInit(): void {

  }


  async sendMail() {
    this.getTimeClick();
    let nameContact = this.nameContact.nativeElement
    let emailContact = this.emailContact.nativeElement
    let messageContact = this.messageContact.nativeElement
    let sentButton = this.sentButton.nativeElement
    this.disableContactFields(nameContact, emailContact, messageContact, sentButton);
    await this.sendToBackend(nameContact, emailContact, messageContact)
    this.showSendingAnimation();
    this.clearContactFields(nameContact, emailContact, messageContact, sentButton);
    this.enableContactFields(nameContact, emailContact, messageContact, sentButton)
  }


  disableContactFields(nameContact, emailContact, messageContact, sentButton) {
    nameContact.disabled = true;
    emailContact.disabled = true;
    messageContact.disabled = true;
    sentButton.disabled = true;
  }


  async sendToBackend(nameContact, emailContact, messageContact) {
    let fd = new FormData();
    fd.append('name', nameContact.value);
    fd.append('email', emailContact.value);
    fd.append('message', messageContact.value)
    this.responseBackend = await fetch('https://corneliu-zediu.developerakademie.net/Contact%20form/send_mail/send_mail.php',
      {
        method: 'POST',
        body: fd,
      }
    );
  }


  enableContactFields(nameContact, emailContact, messageContact, sentButton) {
    nameContact.disabled = false;
    emailContact.disabled = false;
    messageContact.disabled = false;
    sentButton.disabled = false;
  }


  clearContactFields(nameContact, emailContact, messageContact, sentButton) {
    nameContact.value = '';
    emailContact.value = '';
    messageContact.value = '';
    sentButton.value = '';
  }


  showSendingAnimation() {
    this.sendingAnimation.nativeElement.classList.remove('d-none')
    let interval = setInterval(() => {
      this.waitingTime(interval);
    }, 100);
  }


  getTimeClick() {
    this.initTime = new Date;
  }


  waitingTime(interval) {
    let sinceClicked = new Date;
    this.waitedTime = this.initTime.getTime() - sinceClicked.getTime();
    if (this.waitedTime < -1000 && this.responseBackend.status == 302) {
      clearInterval(interval)
      this.sendingAnimation.nativeElement.classList.add('d-none')
      this.succesfullySubmited.nativeElement.classList.remove('d-none')
      this.provideAnimation();
      setTimeout(() => this.removeAnimation(), 1000)

    }
  }


  goToTheTop() {
    this.scroller.scrollToAnchor("top");
  }


  provideAnimation() {
    this.flyIcon.nativeElement.classList.add('flying-animation')
  }


  removeAnimation() {
    this.flyIcon.nativeElement.classList.remove('flying-animation')
    this.succesfullySubmited.nativeElement.classList.add('d-none')
  }
}