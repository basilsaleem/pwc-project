import {User} from './user';
import {ComplaintStatus} from './complaint.status';

export interface Complaint{
  id: number;
  subject: string;
  message: string;
  user: User;
  complaintStatus: ComplaintStatus;
}
