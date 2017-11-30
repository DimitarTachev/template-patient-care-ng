import { Injectable } from "@angular/core";
import { Kinvey } from "kinvey-nativescript-sdk";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Rx";

import { CarePlanEvent } from "./care-plan-event.model";

@Injectable()
export class CareCardEventService {
    events$: Observable<CarePlanEvent>;

    private _events: Array<CarePlanEvent>;
    private _eventsItemSource: BehaviorSubject<CarePlanEvent>;

    constructor() {
        this._events = new Array<CarePlanEvent>();

        // Observable events source
        this._eventsItemSource = new BehaviorSubject<CarePlanEvent>(null);

        // Observable events stream
        this.events$ = this._eventsItemSource.asObservable();
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
            this.saveEvent(event);
        }

        this._eventsItemSource.next(event);
    }

    findEvents(title: string, date: Date): Array<CarePlanEvent> {
        const event = this._events.filter((currentEvent) => {
            return currentEvent.date.toDateString() === date.toDateString() && currentEvent.activity.title === title;
        });

        return event;
    }

    private saveEvent(event: CarePlanEvent): Promise<any> {
        const eventsDataStore = Kinvey.DataStore.collection("Event");

        return eventsDataStore.save({
            activity: event.activity.getJson(),
            date: event.date,
            numberOfDaysSinceStart: event.activity.getNumberOfDaysSinceStart(),
            occurrenceIndexOfDay: event.index
        });
    }
}