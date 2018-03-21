import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {TodoProvider} from '../../providers/todo/todo';
import {LoadingController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import PouchDB from 'pouchdb';
import {AddTodoPage} from '../../pages/add-todo/add-todo';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  data: Data[];
  // remote:any;
  datafromlocal: Data[];
  todoData: any;
  todoHeading: any;

  constructor(public navCtrl: NavController,
              public storage: Storage,
              public todoServices: TodoProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
    storage.get('dataloaded').then((response) => {
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      this.todoServices.getAllTodos().then((result) => {
        this.data = [];
        this.data = result;
        loading.dismiss();
      });
    });
  }

  showModal(item) {
    this.presentPrompt(item);
  }

  presentPrompt(item) {
    const alert = this.alertCtrl.create({
      title: 'Update Todo',
      inputs: [
        {
          name: 'Title',
          placeholder: item.todoHeading
        },
        {
          name: 'Info',
          placeholder: item.todoData

        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'update',
          handler: data => {
            if (data.Title || data.Info) {
              if (data.Title) {
                item.todoHeading = data.Title;
              }
              if (data.Info) {
                item.todoData = data.Info;
              }
              this.todoServices.updateTodo(item);
            } else {
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  delete(item) {
    this.todoServices.deleteTodo(item);
  }

  moveToAddTodoPage() {
    this.navCtrl.push(AddTodoPage);
  }

}

export interface Data {
  todoData: String;
  todoHeader: String;
}
