import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoGroup } from '../../models/todo-group';
import { ItemDoneComponent } from '../todo-item/item-done/item-done.component';
import { ItemInProgressComponent } from '../todo-item/item-in-progress/item-in-progress.component';
import { ItemNotStartedComponent } from '../todo-item/item-not-started/item-not-started.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-group',
  standalone: true,
  imports: [CommonModule, ItemDoneComponent, ItemInProgressComponent, ItemNotStartedComponent, FormsModule],
  templateUrl: './todo-group.component.html',
  styleUrl: './todo-group.component.css'
})
export class TodoGroupComponent implements OnInit{
  public isShowTitle = true;
  public groupTitle?:string;

  @Input() todoGroup!: TodoGroup;
  @Input() index!: number;

  @Output() changeTitleEvent: EventEmitter<{value: string, index: number}> = new EventEmitter<{value: string, index: number}>()
  ngOnInit(): void {
    this.groupTitle = this.todoGroup.title;

    if (this.todoGroup.title ==='') {
      this.isShowTitle = false;
    }
  }

  public onEnterValue():void {
    this.isShowTitle = true;

    this.changeTitleEvent.emit({
      value: this.groupTitle!,
      index: this.index
    })
  }

}
