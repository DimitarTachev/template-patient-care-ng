import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { CareCardService } from "./care-card.service";
import { ConnectService } from "./connect.service";

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        CareCardService,
        ConnectService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class CareCoreModule { }
