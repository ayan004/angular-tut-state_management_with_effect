import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import * as ToDoActions from 'src/app/todo.action';
import ToDo from 'src/app/todo.model';
import ToDoState from 'src/app/todo.state';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css']
})

export class ToDoComponent implements OnInit {

  todo$: Observable<ToDoState>;
  ToDoSubscription: Subscription;
  todoError: Error = null;
  ToDoList: ToDo[] = [];
  Title: string = '';
  IsCompleted: boolean = false;
  id: number;

  constructor(private store: Store<{ todos: ToDoState }>) {
    this.todo$ = store.pipe(select('todos'));
  }

  ngOnInit() {
    this.ToDoSubscription = this.todo$.pipe(
      map(x => {
        this.ToDoList = x.ToDos;
        this.todoError = x.ToDoError;
      })
    ).subscribe();

    this.store.dispatch(ToDoActions.BeginGetToDoAction());
  }

  createToDo() {
    const todo: ToDo = { Title: this.Title, IsCompleted: this.IsCompleted, id: this.id };
    this.store.dispatch(ToDoActions.BeginCreateToDoAction({ payload: todo }));
    this.Title = '';
    this.IsCompleted = false;
  }

  deleteWish(id: number) {
    console.log("delete wish function is clicked " + id);
    this.store.dispatch(ToDoActions.BeginDeleteToDoAction({ payload: id }));
  }

  ngOnDestroy() {
    if (this.ToDoSubscription) {
      this.ToDoSubscription.unsubscribe();
    }
  }

}
