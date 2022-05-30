import { Component } from "@angular/core";

import { authenticate, getDatabaseInfo, getEnvironments } from "jai-sdk";

/* global console, Excel */

@Component({
  selector: "enviroments",
  templateUrl: "./enviroments.component.html",
})
export default class EnviromentsComponent {
  enviroments = [
    { key: "default", id: "jaidemo/789871514598c39dd346b9c9", name: "Felipe-Esteves" },
    { id: "jaidemo/dev", name: "dev" },
    { id: "jaidemo/prod", name: "prod" },
  ];

  constructor() {
    Office.onReady().then(function () {
      document.getElementById("ok-button").onclick = this.sendStringToParentPage;
    });
  }

  sendStringToParentPage() {
    const userName = document.getElementById("name-box");
    Office.context.ui.messageParent(userName.innerText);
  }
}
