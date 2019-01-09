import { Component, OnInit } from '@angular/core';
import { ModelsService } from '../../../shared/models/models.service';
import { Model } from '../../../models/model/model.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-models',
    templateUrl: './models.component.html',
    styleUrls: ['./models.component.css']
})
export class ModelsComponent implements OnInit {

    models: Model[];
    constructor(private modelsService: ModelsService, private router: Router) { }

    ngOnInit() {

        this.modelsService.listModels().subscribe(
            (ms: Model[]) => {
                this.models = ms;
            }
        );
    }

    editModel(model: Model) {

        this.modelsService.selectedModel = model;
        this.router.navigate(['/editModel']);


    }

}
