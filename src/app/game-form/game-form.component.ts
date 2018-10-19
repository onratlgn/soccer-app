
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

export interface Device {
  id: string,
  name: string,
  sensors: Sensor[]
}
export interface Sensor {
  sensorid: object,
  sensorname: string,
}

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.css'],
})
export class GameFormComponent implements OnInit {

  public selectedSensor:object = null;
  public selectedTime:number = null;
  public gameList:Object[] = [];
  public devices: Device[] = [
    {
      name: 'Cone',
      id: 'coneGame',
      sensors: [
        { sensorid: { deviceid: 'coneGame', sensornum: 1 }, sensorname: 'First' },
        { sensorid: { deviceid: 'coneGame', sensornum: 2 }, sensorname: 'Second' },
        { sensorid: { deviceid: 'coneGame', sensornum: 3 }, sensorname: 'Third' }
      ]
    }, {
      name: 'Lobster',
      id: 'horHole',
      sensors: [
        { sensorid: { deviceid: 'horHole', sensornum: 1 }, sensorname: 'Up' },
        { sensorid: { deviceid: 'horHole', sensornum: 2 }, sensorname: 'Down' }
      ]
    }, {
      name: 'Portal',
      id: 'verHole',
      sensors: [
        { sensorid: { deviceid: 'verHole', sensornum: 1 }, sensorname: 'Hole' }
      ]
    },
  ]

  constructor(){}
  ngOnInit() {
  }

  devid2name:object = {
    verHole: 'Portal',
    hoHole: 'Lobster',
    coneGame: 'Cone'
  }

  addStep(): void {
    this.selectedSensor["time"] = this.selectedTime;
    this.selectedSensor["deviceid"]=this.devid2name[this.selectedSensor["deviceid"]];
    this.gameList.push(this.selectedSensor);
    console.log(this.selectedSensor);
    this.selectedSensor = null;
    this.selectedTime = null;
  }

  cancelStep(index:number){
    this.gameList.splice(index,1);
  }

  printList(){
    console.log(this.gameList);
  }

}
