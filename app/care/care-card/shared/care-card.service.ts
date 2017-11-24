import { Injectable } from "@angular/core";
import { Kinvey } from "kinvey-nativescript-sdk";
import { Observable } from "rxjs/Rx";

// tslint:disable-next-line:max-line-length
import { CarePlanActivity, CarePlanActivityType } from "./care-plan-activity.model";
import { CarePlanEvent } from "./care-plan-event.model";

@Injectable()
export class CareCardService {
    private _events: Array<CarePlanEvent>;
    private _activities: Array<CarePlanActivity>;

    private _activityStore = Kinvey.DataStore.collection<any>("Activity");

    constructor() {
        this._events = new Array<CarePlanEvent>();
        this._activities = Array<CarePlanActivity>();
    }

    get events(): Array<CarePlanEvent> {
        return this._events;
    }

    getActivity(title: string): CarePlanActivity {
        const activity = this._activities.find((currentActivity) => {
            return currentActivity.title === title;
        });

        return activity;
    }

    findEvents(title: string, date: Date): Array<CarePlanEvent> {
        const event = this._events.filter((currentEvent) => {
            return currentEvent.date.toDateString() === date.toDateString() && currentEvent.activity.title === title;
        });

        return event;
    }

    getAllActivities(): Promise<any> {
        if (this._activities.length) {
            return Promise.resolve(this._activities);
        } else {

            return this._activityStore.find().toPromise()
                .then((data) => {
                    const activities = [];

                    data.forEach((activityData: any) => {
                        const activity = new CarePlanActivity(activityData);
                        activities.push(activity);
                    });

                    this._activities = activities;

                    return activities;
                })
                .catch((error: Kinvey.BaseError) => {
                    alert({
                        title: "Opps something went wrong.",
                        message: error.message,
                        okButtonText: "Ok"
                    });
                });
        }
    }

    upsertEvent(event: CarePlanEvent, eventsCount: number) {
        const registeredEvents = this.findEvents(event.activity.title, event.date);

        if (registeredEvents.length === eventsCount) {
            let eventToUpdate = registeredEvents.find((currentEvent) => {
                return currentEvent.index === event.index;
            });

            eventToUpdate = event;
        } else {
            this._events.push(event);
        }
    }

    getWeeklyOverview(selectedDate: Date): Array<any> {
        const sunday = this.getLastSunday(selectedDate);
        const monday = new Date(sunday);
        monday.setDate(sunday.getDate() + 1);

        const tuesday = new Date(sunday);
        tuesday.setDate(sunday.getDate() + 2);

        const wednesday = new Date(sunday);
        wednesday.setDate(sunday.getDate() + 3);

        const thursday = new Date(sunday);
        thursday.setDate(sunday.getDate() + 4);

        const friday = new Date(sunday);
        friday.setDate(sunday.getDate() + 5);

        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);

        return [
            {
                date: sunday,
                value: 10
            },
            {
                date: monday,
                value: 20
            },
            {
                date: tuesday,
                value: 70
            },
            {
                date: wednesday,
                value: 100
            },
            {
                date: thursday,
                value: 100
            },
            {
                date: friday,
                value: 0
            },
            {
                date: saturday,
                value: 0
            }
        ];
    }

    private getLastSunday(date: Date): Date {
        const result = new Date(date);
        result.setDate(date.getDate() - date.getDay());

        return result;
    }
}
