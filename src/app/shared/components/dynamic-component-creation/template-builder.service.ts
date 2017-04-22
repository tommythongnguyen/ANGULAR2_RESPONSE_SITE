export class TemplateBuilderService{
	public buildTemplate(entity:any, useTextArea:boolean){
		let inputType = useTextArea ? "text-editor" : "string-editor";
		let template: string = `<form><${inputType} [entity]="entity" `;

		let keys = Object.keys(entity); //return ["code", "description"]

		keys.forEach(propName => {
			template += `[propName]=" '${propName}' " `
		});

		template += `></${inputType}></form>`

		return template;
	}
}