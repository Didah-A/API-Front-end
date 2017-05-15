import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from '../services/alert.service';
import { dataService } from '../services/data.service';

declare var $: any;

@Component({
    selector: 'bucket-app',
    templateUrl: './bucket.component.html',
    styleUrls:['./scripts/styles/css/bootstrap.min.css','./scripts/styles/font-awesome/css/font-awesome.min.css','./bucket.component.css']
})
export class BucketComponent implements OnInit{
    bucketlists:any  = [];
    model: any = {};
    loading = false;
    bucketname:string;
    bucketid: any;
    updatedname: any;
    itemname: any;
    url:any;

    constructor( private _dataservice: dataService,
                 private alertservice: AlertService,
                 private router: Router){}
    ngOnInit(){
        this.getBucketlists();
    }

    getBucketlists(){
        this._dataservice.get('/bucketlists/')
            .subscribe(bucketlists => { this.bucketlists = bucketlists.bucketlists;
            console.log(bucketlists) });
            
            
    }

    updateBucketlist(bucketlist:any ){
        this.model = {
            "name":this.updatedname
        }
        this.loading = true;
        console.log(this.model)
        this._dataservice.put('/bucketlists/'+ bucketlist.id + '/', this.model)
            .subscribe(
                data => {
                    this.alertservice.success('Bucketlist Updated successfully', true);
                    this.getBucketlists();
                },
                error => {
                    this.alertservice.error(error._body);
                    this.loading = false;
                });
    }

    deleteBucketlist(bucketlist:any){
        this._dataservice.delete('/bucketlists/' + bucketlist.id + '/')
            .subscribe(
                    data => {
                        this.alertservice.success('Bucketlist successfully Deleted', true);
                        this.getBucketlists();
                    },
                    error => {
                        this.alertservice.error(error._body);
                        this.loading = false;
                    });

    }
    addItem(bucketlist:any){
        this.model = {
            "name":this.itemname,
            "done":"False"
        }
        console.log(this.model) 
        this.loading = true;
        this.url = '/bucketlists/' + bucketlist.id + '/items/';
        this._dataservice.post(this.url,this.model)
            .subscribe(
                data => {
                    this.alertservice.success('Item Successfully created', true);
                    this.router.navigate(['/items', bucketlist.id]);
                },
                error => {
                    this.alertservice.error(error._body);
                    this.loading = false;
                });
    }
    }


}