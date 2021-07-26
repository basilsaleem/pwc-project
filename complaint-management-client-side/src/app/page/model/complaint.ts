import {User} from './user';
import {ComplaintStatus} from './complaint.status';

export interface Complaint{
  id: number;
  subject: string;
  issueDate: Date;
  message: string;
  user: User;
  complaintStatus: ComplaintStatus;
}
