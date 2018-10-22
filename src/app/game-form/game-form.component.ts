
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFireDatabase } from '@angular/fire/database';

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

  public selectedSensor: object = null;
  public selectedTime: number = null;
  public gameStatus: number = 1;
  public gameStep: number = 0;
  public gameList: Object[] = [];
  public gameScore: number[] = [];
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
        { sensorid: { deviceid: 'horHole', sensornum: 2 }, sensorname: 'Up' },
        { sensorid: { deviceid: 'horHole', sensornum: 1 }, sensorname: 'Down' }
      ]
    }, {
      name: 'Portal',
      id: 'verHole',
      sensors: [
        { sensorid: { deviceid: 'verHole', sensornum: 1 }, sensorname: 'Hole' }
      ]
    },
  ]

  constructor(private db: AngularFireDatabase, public dialog: MatDialog) { }

  ngOnInit() {
  }

  devid2name: object = {
    verHole: 'Portal',
    horHole: 'Lobster',
    coneGame: 'Cone'
  }

  addStep(): void {
    this.selectedSensor["time"] = this.selectedTime;
    this.selectedSensor["deviceid"] = this.devid2name[this.selectedSensor["deviceid"]];
    this.gameList.push(this.selectedSensor);
    console.log(this.selectedSensor);
    this.selectedSensor = null;
    this.selectedTime = null;
  }

  cancelStep(index: number) {
    this.gameList.splice(index, 1);
  }

  printList() {
    console.log(this.gameList);
  }

  /*
  playGam(i: number = 0) {
    let L = this.gameList.length;
    let obj: object = {
      Time: this.gameList[i]['time'],
      Type: this.gameList[i]['sensornum'],
      Status: -1,
    }
    this.db.database.ref(this.gameList[i]['deviceid']).set(obj);
    this.db.database.ref(this.gameList[i]['deviceid']).once('child_changed', snapshot => {
      console.log(snapshot.key);
      console.log(snapshot.val());
      if (snapshot.key == 'Status') {
        if (snapshot.val() == 1) {
          this.gameScore[i] = snapshot.val();
          console.log('Success');
          if (i < L - 1) this.playGame(i + 1);
          else {
            console.log('game ends');
            console.log(this.gameScore);
            this.openDialog();
          }
        }
        else if (snapshot.val() == 0) {
          this.gameScore[i] = snapshot.val();
          console.log('Timeout');
          if (i < L - 1) this.playGame(i + 1);
          else {
            console.log('game ends');
            console.log(this.gameScore);
            this.openDialog();
          }
        }
      }
    });
  }
  */

  playGame() {
    let L = this.gameList.length;
    if (this.gameStep == L) {
      this.gameStep = 0;
      console.log(this.gameScore);
      this.openDialog()
    } else {
      let i = this.gameStep;
      let obj: object = {
        Time: this.gameList[i]['time'],
        Type: this.gameList[i]['sensornum'],
        Status: -1,
      }
      this.db.database.ref(this.gameList[i]['deviceid']).set(obj);
      this.db.database.ref(this.gameList[i]['deviceid']).on('child_changed', snapshot => {
        if (snapshot.key != "Status") { }
        else {
          this.gameScore[i] = snapshot.val();
          this.gameScore[i] ? console.log('success') : console.log('timeout');
          this.db.database.ref(this.gameList[i]['deviceid']).off('child_changed');

          if (this.gameStatus == 1) {
            this.gameStep++;
            this.playGame();
          }
          else if (this.gameStatus[i] == 0) {
          }
          else if (this.gameStatus[i] = -1) {
            this.gameStep = 0;
          }
        }

      });
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ScoreBoardComponent, {
      width: '250px',
      data: { scorelist: this.gameScore }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('closed');
    });
  }

}


@Component({
  selector: 'score-board',
  template: `
  <h1 mat-dialog-title>Well Played!</h1>
  <div mat-dialog-content>
  <p> Successed: {{succesed}}</p>
  <p> Timed Out: {{timedout}}</p>
  </div>
  `,
})
export class ScoreBoardComponent {

  public succesed = this.data["scorelist"].filter(v => v).length;
  public timedout = this.data["scorelist"].filter(v => !v).length;

  constructor(
    public dialogRef: MatDialogRef<ScoreBoardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Object) {
    console.log('popped up');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}