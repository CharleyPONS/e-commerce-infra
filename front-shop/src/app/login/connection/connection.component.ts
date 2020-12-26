import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
})
export class ConnectionComponent implements OnInit {
  @Input() isOnOrder: boolean = false;
  public form: FormGroup;
  public hide: boolean;
  public authenticateSucceed: boolean;
  public isConnected: boolean;
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
    this.authenticateSucceed = await this._userService.connectUser(user);
    if (!this.isOnOrder) {
      return this._router.navigateByUrl('/');
    }
    return;
  }
}