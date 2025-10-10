import { Routes } from '@angular/router';
import { roleGuard } from '../../../iam/application/auth.guard';

const conversationsList = () => import('../views/conversations-list/conversations-list').then(m => m.ConversationsList);
const chatView = () => import('../views/chat-view/chat-view').then(m => m.ChatView);

export const messagingRoutes: Routes = [
  {
    path: 'conversations',
    loadComponent: conversationsList,
    canActivate: [roleGuard],
    data: { roles: ['Patient', 'Family', 'Doctor', 'Admin'] },
    title: 'CareLink - Messages'
  },

  {
    path: 'chat/:id',
    loadComponent: chatView,
    canActivate: [roleGuard],
    data: { roles: ['Patient', 'Family', 'Doctor', 'Admin'] },
    title: 'CareLink - Chat'
  },

  {
    path: '',
    redirectTo: 'conversations',
    pathMatch: 'full'
  }
];
