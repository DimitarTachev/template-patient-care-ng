import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import * as email from "nativescript-email";
import * as phoneModule from "nativescript-phone";
import "rxjs/add/operator/switchMap";

import { ConnectService } from "../shared/connect.service";
import { Contact, ContactInfo } from "../shared/contact.model";

@Component({
    selector: "ConnectDetail",
    moduleId: module.id,
    templateUrl: "./connect-detail.component.html",
    styleUrls: ["../connect.component.css", "../../care-common.css"]
})
export class ConnectDetailComponent implements OnInit {
    isLoading: boolean;

    private _contact: Contact;

    constructor(
        private _connectService: ConnectService,
        private _pageRoute: PageRoute,
        private _routerExtensions: RouterExtensions
    ) { }

    ngOnInit(): void {
        this.isLoading = true;

        this._pageRoute.activatedRoute
            .switchMap((activatedRoute) => activatedRoute.params)
            .forEach((params) => {
                const contactId = params.id;

                this._connectService.getContactById(contactId)
                    .then((contact: Contact) => {
                        this._contact = contact;
                        this.isLoading = false;
                    });
            });
    }

    get contact(): Contact {
        return this._contact;
    }

    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }

    onInfoButtonTap(contactInfo: ContactInfo) {
        const phone = contactInfo.displayString.replace(/\s/g, "");

        if (contactInfo.type === 0) {
            phoneModule.dial(phone, true);
        } else if (contactInfo.type === 1) {
            phoneModule.sms([phone], "");
        } else {
            const composeOptions: email.ComposeOptions = {
                to: [contactInfo.displayString]
            };

            email.available().then((available: boolean) => {
                if (available) {
                    email.compose(composeOptions);
                }
            });
        }
    }
}
