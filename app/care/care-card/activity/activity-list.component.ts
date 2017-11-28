import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Subscription } from "rxjs/Subscription";

import { CareCardService } from "../../core/care-card.service";
import { CarePlanActivity } from "../../core/care-plan-activity.model";
import { CarePlanEvent } from "../../core/care-plan-event.model";

@Component({
    selector: "ActivityList",
    moduleId: module.id,
    templateUrl: "./activity-list.component.html",
    styleUrls: ["../../care-common.css"]
})
export class ActivityListComponent implements OnInit, OnDestroy {
    @Input() kRow: number;
    isLoading: boolean;

    private _selectedDate: Date;
    private _dateSubscription: Subscription;

    private _physicalActivities: Array<CarePlanActivity>;
    private _assessmentActivities: Array<CarePlanActivity>;
    private _otherActivities: Array<CarePlanActivity>;
    private _medicationActivities: Array<CarePlanActivity>;

    constructor(
        private _routerExtensions: RouterExtensions,
        private _careCardService: CareCardService) { }

    ngOnInit(): void {
        this._physicalActivities = new Array<CarePlanActivity>();
        this._assessmentActivities = new Array<CarePlanActivity>();
        this._otherActivities = new Array<CarePlanActivity>();
        this._medicationActivities = new Array<CarePlanActivity>();

        this._dateSubscription = this._careCardService.selectedDate$.subscribe((date: Date) => {
            this._selectedDate = date;
            this.isLoading = true;

            this._careCardService.createActivitiesWithEvents(date)
                .then(({
                    physicalActivities,
                    assessmentActivities,
                    otherActivities,
                    medicationActivities
                }) => {
                    this.isLoading = false;

                    this._physicalActivities = physicalActivities;
                    this._assessmentActivities = assessmentActivities;
                    this._otherActivities = otherActivities;
                    this._medicationActivities = medicationActivities;
                });
        });
    }

    ngOnDestroy(): void {
        this._dateSubscription.unsubscribe();
    }

    get physicalActivities(): Array<CarePlanActivity> {
        return this._physicalActivities;
    }

    get assessmentActivities(): Array<CarePlanActivity> {
        return this._assessmentActivities;
    }

    get otherActivities(): Array<CarePlanActivity> {
        return this._otherActivities;
    }

    get medicationActivities(): Array<CarePlanActivity> {
        return this._medicationActivities;
    }

    onActivityEventTap(activity: CarePlanActivity, event: CarePlanEvent) {
        event.value = event.value === 0 ? 1 : 0;
        this._careCardService.upsertEvent(event, activity.events.length);
    }

    onActivityTap(activity: CarePlanActivity) {
        this._routerExtensions.navigate([
            "care/activity-detail",
            activity.title,
            this._selectedDate.toISOString()],
            {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 200,
                    curve: "ease"
                }
            });
    }
}
