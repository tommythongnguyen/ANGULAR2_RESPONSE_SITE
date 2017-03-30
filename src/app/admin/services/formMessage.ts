import { FormGroup } from '@angular/forms';
export class FormMessageService {
	private _validationMessages: any;
	public formErrors = {};
	constructor(formMessage) {
		this._validationMessages = formMessage;
	}
	public getFormError(form: FormGroup) {
		for (const field in form.controls) {
			//clear previouse error message (if any)
			this.formErrors[field] = '';
			const control = form.get(field);
			if (control && control.dirty && !control.valid) {
				const messages = this._validationMessages[field];
				for (const key in control.errors) {
					if (control.value) {
						this.formErrors[field] += messages ? messages[key] + ' ' : '';
					} else {
						if (key === "required") {
							this.formErrors[field] += messages ? messages[key] + ' ' : '';
							break;
						}
					}
				}
			}
		}
		return this.formErrors;
	}
}