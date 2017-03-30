export class DashboardDataService{
	private _familyList: any[];
	private _vegasList: any[];

	public getFamilyList():any[]{
		return this._familyList;
	}
	public setFamilyList(list:any[]):void{
		this._familyList = list;
	}

	public getVegasList():any[]{
		return this._vegasList;
	}
	public setVegasList(list:any[]):void{
		this._vegasList = list;
	}
}