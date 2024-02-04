import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToDoStatus, TodoItem } from '../../../models/todo-group';

@Directive({})

export class TodoItemBaseComponent implements OnInit{
  ngOnInit(): void {
    this.description = this.todoItem.description;
  }

  @Input() todoItem!: TodoItem;
  @Input() index!: number;

  @Output() eventChangeDescription = new EventEmitter<{description: string, index: number}>();

  @Output() changeStatus = new EventEmitter<{ status: ToDoStatus, index: number }>();

  @Output() deleteItem = new EventEmitter<number>();

  public TodoStatus = ToDoStatus

  public isShowDescription = true;

  public description?: string;

  public emitChangeDescriptin(value:string) : void {
    this.eventChangeDescription.emit({description: value, index: this.index})
  }

  public emitChangeStatus(value: ToDoStatus) {
    this.changeStatus.emit({status: value, index: this.index})
  }

  public emitDeleteItem() : void {
    this.deleteItem.emit(this.index)
  }
}
