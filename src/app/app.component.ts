import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TodoGroupComponent } from './components/todo-group/todo-group.component';
import { ToDoStatus, TodoGroup } from './models/todo-group';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TodoGroupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public todoGroups: TodoGroup[];

  constructor() {
    this.todoGroups = [{
      title: 'Todo Group',
      items: [{
        title: 'В Процессе разработки TODO',
        description: 'Делаем ToDo',
        status: ToDoStatus.IN_PROGRESS
      },
      {
        title: 'Ещё не делаем ToDO',
        description: 'Делаем ToDo',
        status: ToDoStatus.NOT_STARTED
      },
      {
        title: 'Сделали TODO',
        description: 'Делаем ToDo',
        status: ToDoStatus.DONE
      },
    ]
    },
  ]
  }

  public addGroup():void {
    let tempGroup: TodoGroup = {
      title: '',
      items: []
    }

    this.todoGroups.push(tempGroup)
  }
}