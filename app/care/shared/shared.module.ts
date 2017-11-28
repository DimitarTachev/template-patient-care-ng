import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptUIGaugesModule } from "nativescript-pro-ui/gauges/angular";
import { NativeScriptUIListViewModule } from "nativescript-pro-ui/listview/angular";

import { CareDashboardComponent } from "./care-dashboard/care-dashboard.component";
import { RadialRatingComponent } from "./care-dashboard/radial-rating/radial-rating.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptUIGaugesModule,
        NativeScriptUIListViewModule,
        NativeScriptFormsModule
    ],
    exports: [
        NativeScriptCommonModule,
        NativeScriptUIListViewModule,
        NativeScriptFormsModule,
        CareDashboardComponent
    ],
    declarations: [
        CareDashboardComponent,
        RadialRatingComponent
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class CareSharedModule { }
