import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Quiz } from './quiz/quiz';
import { Study } from './study/study';

export const routes: Routes = [
  { path: '', component: Home, title: 'Who Composed It?' },
  { path: 'quiz', component: Quiz, title: 'Quiz · Who Composed It?' },
  { path: 'study', component: Study, title: 'Study · Who Composed It?' },
  { path: '**', redirectTo: '' },
];
