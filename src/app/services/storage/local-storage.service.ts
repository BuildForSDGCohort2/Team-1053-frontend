import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  public static readonly ORDER_ITEMS = 'orderItems';
  private behaviorSubjects: Map<string, BehaviorSubject<any>>;

  constructor() {
    console.warn('create storage service');
    this.behaviorSubjects = new Map<string, BehaviorSubject<any>>();
  }

  /*
  * Returns the behaviorSubject by identifier. If it's not handled a new one is created but not pre-filled with any value.
	* @param identifier The localStorage identifier
  */
  private getBehaviorSubject(identifier: string) {
    let behaviorSubject: BehaviorSubject<any> = this.behaviorSubjects.get(identifier);
    if (!behaviorSubject) {
      behaviorSubject = new BehaviorSubject<any>(null);
      this.behaviorSubjects.set(identifier, behaviorSubject);
    }
    return behaviorSubject;
  }

  /*
  * Gets an item from localStorage
	* @param identifier Identifier of the storage object. Can be anything but for common used objects have a look at TYPE-Identifiers
  */
  public getItem(identifier: string): BehaviorSubject<any> {
    const behaviorSubject = this.getBehaviorSubject(identifier);
    const item = localStorage.getItem(identifier);
    behaviorSubject.next(item);
    return behaviorSubject;
  }

  /*
  * Stores an item and emits the new value to all its subscribers
	* @param identifier LocalStorage identifier
	* @param object the object that should be stored. Please JSON.stringify if it's not a string
   */
  public setItem(identifier: string, object: string): void {
    localStorage.setItem(identifier, object);
    this.getBehaviorSubject(identifier).next(object);
  }

  /* Removes an item fro the local storage */
  public removeItem(identifier: string): void {
    localStorage.removeItem(identifier);
    this.getBehaviorSubject(identifier).next(null);
  }

  /* Clears the localStorage and tell all the subscribers
  that the values are now null*/
  public clear() {
    localStorage.clear();
    this.behaviorSubjects.forEach(
      (behaviorSubject: BehaviorSubject<any>) => {
        behaviorSubject.next(null);
      }
    );
    console.log('local storage cleared');
  }

}
