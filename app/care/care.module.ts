import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { ActivityDetailComponent } from "./care-card/activity-detail/activity-detail.component";
import { ActivityListComponent } from "./care-card/activity/activity-list.component";
import { CareCardComponent } from "./care-card/care-card.component";
import { CareComponent } from "./care.component";
import { ConnectDetailComponent } from "./connect/connect-detail/connect-detail.component";
import { ConnectComponent } from "./connect/connect.component";

import { CareRoutingModule } from "./care-routing.module";
import { CareCoreModule } from "./core/core.module";
import { CareSharedModule } from "./shared/shared.module";

@NgModule({
    imports: [
        CareCoreModule,
        CareSharedModule,
        CareRoutingModule
    ],
    declarations: [
        CareCardComponent,
        ConnectComponent,
        ActivityDetailComponent,
        ActivityListComponent,
        ConnectDetailComponent,
        CareComponent
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class CareModule { }
