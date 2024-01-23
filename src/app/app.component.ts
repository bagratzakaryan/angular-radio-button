import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  options = ['X', 'Y', 'Z'];

  form = new FormGroup({
    control: new FormControl('Y', Validators.required),
  });

  ngOnInit() {
    this.control.valueChanges.subscribe((x) => {
      console.log(x);
    });

    setTimeout(() => {
      this.control.setValue('Z');
    }, 5000);
  }

  get control(): FormControl {
    return this.form.get('control') as FormControl;
  }
}
