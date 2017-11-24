import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ListViewEventData } from "nativescript-pro-ui/listview";
import { Observable } from "rxjs/Rx";

import { CareCardService } from "./shared/care-card.service";
import { CarePlanActivity, CarePlanActivityType } from "./shared/care-plan-activity.model";
import { CarePlanEvent } from "./shared/care-plan-event.model";

@Component({
    selector: "CareCard",
    moduleId: module.id,
    templateUrl: "./care-card.component.html"
})
export class CareCardComponent implements OnInit {
    isLoading: boolean;

    private _physicalActivities: Array<CarePlanActivity>;
    private _assessmentActivities: Array<CarePlanActivity>;
    private _otherActivities: Array<CarePlanActivity>;
    private _medicationActivities: Array<CarePlanActivity>;

    private _allActivities: Array<CarePlanActivity>;
    private _selectedDate: Date;

    constructor(
        private _routerExtensions: RouterExtensions,
        private _careCardService: CareCardService
    ) {
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

    ngOnInit(): void {
        this.isLoading = true;

        this._physicalActivities = new Array<CarePlanActivity>();
        this._assessmentActivities = new Array<CarePlanActivity>();
        this._otherActivities = new Array<CarePlanActivity>();
        this._medicationActivities = new Array<CarePlanActivity>();

        this._careCardService.getAllActivities()
            .then((activities: Array<CarePlanActivity>) => {
                this.isLoading = false;
                this._allActivities = activities;

                console.dir(this._careCardService.events);
                this.createActivitiesWithEvents(this._allActivities, this._selectedDate);
            });
    }

    onSelectedDateChanged(date: Date) {
        this._selectedDate = date;

        if (this._allActivities) {
            this.createActivitiesWithEvents(this._allActivities, this._selectedDate);
        }
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

    private createActivitiesWithEvents(activities: Array<CarePlanActivity>, selectedDate: Date) {
        this._physicalActivities = new Array<CarePlanActivity>();
        this._assessmentActivities = new Array<CarePlanActivity>();
        this._otherActivities = new Array<CarePlanActivity>();
        this._medicationActivities = new Array<CarePlanActivity>();

        for (const activity of activities) {
            const day: number = selectedDate.getDay();
            const occurrencesForDay: number = activity.schedule[day - 1] || 0;

            activity.events = new Array<CarePlanEvent>();

            for (let index = 0; index < occurrencesForDay; index++) {
                const event = new CarePlanEvent(activity, selectedDate, index);
                activity.events.push(event);
            }

            if (activity.groupIdentifier === CarePlanActivityType.physical) {
                this._physicalActivities.push(activity);
            } else if (activity.groupIdentifier === CarePlanActivityType.assessment) {
                this._assessmentActivities.push(activity);
            } else if (activity.groupIdentifier === CarePlanActivityType.medication) {
                this._medicationActivities.push(activity);
            } else if (activity.groupIdentifier === CarePlanActivityType.other) {
                this._otherActivities.push(activity);
            }
        }

        this.mapEvents(this._physicalActivities, selectedDate);
        this.mapEvents(this._assessmentActivities, selectedDate);
        this.mapEvents(this._otherActivities, selectedDate);
        this.mapEvents(this._medicationActivities, selectedDate);
    }

    private mapEvents(activityCollection: Array<CarePlanActivity>, selectedDate: Date) {
        activityCollection.forEach((activity) => {
            const savedEvents = this._careCardService.findEvents(activity.title, selectedDate);

            if (savedEvents.length) {
                for (const event of savedEvents) {
                    activity.events[event.index] = event;
                }
            }
        });
    }
}
