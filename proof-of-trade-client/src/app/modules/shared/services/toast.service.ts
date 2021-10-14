import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastr: ToastrService,
  ) { }

  public success(message: string): void {
    this.toastr.clear()

    this.toastr.success(message, null, {
      positionClass: 'toast-bottom-right'
    })
  }

  public error(message: string): void {
    this.toastr.clear()
    
    this.toastr.error(message, null, {
      positionClass: 'toast-bottom-right'
    })
  }
}
