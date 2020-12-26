import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  @Input() isOnOrder: boolean = false;
  public form: FormGroup;
  public hide: boolean;
  public isConnected: boolean;
  public authenticateSucceed: boolean;
  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _router: Router
  ) {}
  ngOnInit(): void {
    this.isConnected = this._userService.isLoggedIn();
    this.hide = true;
    this.form = this._formBuilder.group({
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required, Validators.min(6)],
    });
  }

  public async save(): Promise<any> {
    const user: User = new User({
      email: this.form.get('email').value,
      password: this.form.get('password').value,
    });
    this.authenticateSucceed = await this._userService.registerUser(user);
    if (!this.isOnOrder) {
      return this._router.navigateByUrl('/');
    }
    return;
  }
}