import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TodoGroupComponent } from './components/todo-group/todo-group.component';
import { ToDoStatus, TodoGroup, TodoItem } from './models/todo-group';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TodoGroupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public todoGroups: TodoGroup[] = [];

  ngOnInit(): void {
    const storedGroups = localStorage.getItem('todoGroups');
    if (storedGroups) {
      this.todoGroups = JSON.parse(storedGroups);
    }
  }
  saveGroupsToLocalStorage(): void {
    localStorage.setItem('todoGroups', JSON.stringify(this.todoGroups));
  }

  public addGroup():void {
    let tempGroup: TodoGroup = {
      title: '',
      items: []
    }
    this.todoGroups.push(tempGroup)
    this.saveGroupsToLocalStorage();
  }

  public handleChangeTitle(value: {value: string, index: number}) :void {
    this.todoGroups[value.index].title = value.value;
    this.saveGroupsToLocalStorage();
  }

  public handleDeleteGroup(value: number) :void {
    this.todoGroups.splice(value, 1);
    this.saveGroupsToLocalStorage();
  }

  public handleNewItem(value: {item: TodoItem, index: number}) {
    this.todoGroups[value.index].items?.push(value.item)
    this.saveGroupsToLocalStorage();
  }

  public handleChangeDescription(value: {description: string, indexGroup: number, indexItem: number}): void {
    this.todoGroups[value.indexGroup].items[value.indexItem].description = value.description
    this.saveGroupsToLocalStorage();
  }

  public handleChangeStatus(value: {status: ToDoStatus, indexItem: number, groupIndex: number}):void {
    this.todoGroups[value.groupIndex].items[value.indexItem].status = value.status
    this.saveGroupsToLocalStorage();
  }

  public handleDeleteItem(value: {indexItem: number, indexGroup: number}):void {
    this.todoGroups[value.indexGroup].items.splice(value.indexItem, 1)
    this.saveGroupsToLocalStorage();
  }
}
