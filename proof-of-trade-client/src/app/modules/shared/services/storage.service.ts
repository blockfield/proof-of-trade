import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: StorageMap,
  ) { }

  set(index: string, value: any): Observable<undefined> {
    return this.storage.set(index, value)
  }

  delete(index: string): Observable<undefined> {
    return this.storage.delete(index)
  }

  get<T>(index: string): Observable<T> {
    return this.storage.get(index).pipe(
      map((jsonValue: T) => jsonValue)
    )
  }
}
