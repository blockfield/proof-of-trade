import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastr: ToastrService,
  ) { }

  public success(message: string, title: string|null = null): void {
    this.toastr.clear()

    this.toastr.success(message, title, {
      positionClass: 'toast-bottom-right'
    })
  }

  public error(message: string, title: string|null = null): void {
    this.toastr.clear()
    
    this.toastr.error(message, title, {
      positionClass: 'toast-bottom-right'
    })
  }
}
