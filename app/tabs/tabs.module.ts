import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIGaugesModule } from "nativescript-pro-ui/gauges/angular";
import { NativeScriptUIListViewModule } from "nativescript-pro-ui/listview/angular";

import { CareCardComponent } from "./care-card/care-card.component";
import { CareDashboardComponent } from "./care-card/care-dashboard/care-dashboard.component";
import { CircularStatusComponent } from "./care-card/care-dashboard/circular-status/circular-status.component";
import { ConnectDetailComponent } from "./connect/connect-detail/connect-detail.component";
import { ConnectComponent } from "./connect/connect.component";
import { ConnectService } from "./connect/shared/connect.service";
import { TabsRoutingModule } from "./tabs-routing.module";
import { TabsComponent } from "./tabs.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptUIGaugesModule,
        NativeScriptUIListViewModule,
        TabsRoutingModule
    ],
    declarations: [
        CareCardComponent,
        CareDashboardComponent,
        CircularStatusComponent,
        ConnectComponent,
        ConnectDetailComponent,
        TabsComponent
    ],
    providers: [
        ConnectService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class TabsModule { }
